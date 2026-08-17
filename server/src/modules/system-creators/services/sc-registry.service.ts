import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ScModule } from '@/modules/system-creators/entities/sc-module.entity';
import { CreateScModuleDto } from '@/modules/system-creators/dto/create-sc-module.dto';
import { UpdateScModuleDto } from '@/modules/system-creators/dto/update-sc-module.dto';
import { QueryScModuleDto } from '@/modules/system-creators/dto/query-sc-module.dto';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

const GENERATED_DIR = path.join(process.cwd(), 'src', 'modules', 'generated');
const REGISTRY_JSON_PATH = path.join(GENERATED_DIR, 'sc-modules-registry.json');

@Injectable()
export class ScRegistryService {
  constructor(
    @InjectRepository(ScModule)
    private readonly scModuleRepository: Repository<ScModule>,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async findAll(query: QueryScModuleDto) {
    const { page = 1, limit = 20, search, searchField, sortBy, sortOrder } = query;
    const qb = this.scModuleRepository.createQueryBuilder('sc');

    if (search && searchField) {
      const allowed = QueryScModuleDto.searchableFields;
      if (allowed.includes(searchField)) {
        qb.where(`sc.${searchField} LIKE :search`, { search: `%${search}%` });
      }
    } else if (search) {
      const conditions = QueryScModuleDto.searchableFields.map(
        (f) => `sc.${f} LIKE :search`,
      );
      qb.where(`(${conditions.join(' OR ')})`, { search: `%${search}%` });
    }

    const sortable = QueryScModuleDto.sortableFields;
    const field = sortBy && sortable.includes(sortBy) ? `sc.${sortBy}` : 'sc.id';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [modules, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(field, order)
      .getManyAndCount();

    return {
      data: modules.map((m) => this.toResponse(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllActive(): Promise<ScModule[]> {
    return this.scModuleRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<ScModule> {
    const mod = await this.scModuleRepository.findOne({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');
    return this.toResponse(mod);
  }

  async findByName(name: string): Promise<ScModule> {
    const mod = await this.scModuleRepository.findOne({ where: { name } });
    if (!mod) throw new NotFoundException(`Module "${name}" not found`);
    return this.toResponse(mod);
  }

  async create(dto: CreateScModuleDto, req?: any): Promise<ScModule> {
    const existing = await this.scModuleRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Module "${dto.name}" already exists`);
    }

    const routePath = `/dashboard/${dto.name}s`;

    const mod: ScModule = this.scModuleRepository.create({
      name: dto.name,
      label: dto.label,
      routePath,
      menuLabel: dto.menuLabel,
      accessLevel: dto.accessLevel,
      accessRoles: dto.accessRoles ? JSON.stringify(dto.accessRoles) : undefined,
      accessPermissions: dto.accessPermissions ? JSON.stringify(dto.accessPermissions) : undefined,
      isActive: true,
      fieldsConfig: JSON.stringify(dto.fields),
      relationsConfig: dto.relations ? JSON.stringify(dto.relations) : undefined,
    }) as ScModule;

    const saved = await this.scModuleRepository.save(mod);

    await this.syncJsonBackup();

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'CREATE',
      entity: 'ScModule',
      entityId: saved.id,
      description: `Created system creator module "${dto.name}"`,
      metadata: { name: dto.name, label: dto.label },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateScModuleDto, req?: any): Promise<ScModule> {
    const mod = await this.scModuleRepository.findOne({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');

    if (dto.label) mod.label = dto.label;
    if (dto.menuLabel) mod.menuLabel = dto.menuLabel;
    if (dto.accessLevel) mod.accessLevel = dto.accessLevel;
    if (dto.accessRoles !== undefined) {
      mod.accessRoles = dto.accessRoles ? JSON.stringify(dto.accessRoles) : undefined;
    }
    if (dto.accessPermissions !== undefined) {
      mod.accessPermissions = dto.accessPermissions ? JSON.stringify(dto.accessPermissions) : undefined;
    }
    if (dto.fields) {
      mod.fieldsConfig = JSON.stringify(dto.fields);
    }
    if (dto.relations !== undefined) {
      mod.relationsConfig = dto.relations ? JSON.stringify(dto.relations) : undefined;
    }

    const saved = await this.scModuleRepository.save(mod);
    await this.syncJsonBackup();

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: 'ScModule',
      entityId: saved.id,
      description: `Updated system creator module "${mod.name}"`,
      metadata: { name: mod.name },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.toResponse(saved);
  }

  async remove(id: number, req?: any): Promise<void> {
    const mod = await this.scModuleRepository.findOne({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');

    mod.isActive = false;
    await this.scModuleRepository.save(mod);
    await this.syncJsonBackup();

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'DELETE',
      entity: 'ScModule',
      entityId: id,
      description: `Deactivated system creator module "${mod.name}"`,
      metadata: { name: mod.name },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
  }

  async toggleActive(id: number, req?: any): Promise<ScModule> {
    const mod = await this.scModuleRepository.findOne({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');

    mod.isActive = !mod.isActive;
    const saved = await this.scModuleRepository.save(mod);
    await this.syncJsonBackup();

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: 'ScModule',
      entityId: saved.id,
      description: `${mod.isActive ? 'Activated' : 'Deactivated'} system creator module "${mod.name}"`,
      metadata: { name: mod.name, isActive: mod.isActive },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.toResponse(saved);
  }

  async syncJsonBackup(): Promise<void> {
    try {
      const modules = await this.scModuleRepository.find();
      const dir = path.dirname(REGISTRY_JSON_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(REGISTRY_JSON_PATH, JSON.stringify(modules, null, 2));
    } catch {
      // Silent fail — JSON backup is non-critical
    }
  }

  async loadFromJsonBackup(): Promise<ScModule[]> {
    try {
      if (!fs.existsSync(REGISTRY_JSON_PATH)) return [];
      const raw = fs.readFileSync(REGISTRY_JSON_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private toResponse(mod: ScModule) {
    return {
      ...mod,
      accessRoles: mod.accessRoles ? JSON.parse(mod.accessRoles) : null,
      accessPermissions: mod.accessPermissions ? JSON.parse(mod.accessPermissions) : null,
      fieldsConfig: JSON.parse(mod.fieldsConfig),
      relationsConfig: mod.relationsConfig ? JSON.parse(mod.relationsConfig) : null,
    };
  }
}
