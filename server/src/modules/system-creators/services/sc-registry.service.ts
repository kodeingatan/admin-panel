import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { CreateScModuleDto } from '@/modules/system-creators/dto/create-sc-module.dto';
import { UpdateScModuleDto } from '@/modules/system-creators/dto/update-sc-module.dto';
import { QueryScModuleDto } from '@/modules/system-creators/dto/query-sc-module.dto';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

const REGISTRY_DIR = path.join(process.cwd(), 'src', 'modules', 'managements');
const REGISTRY_JSON_PATH = path.join(REGISTRY_DIR, 'sc-modules-registry.json');

@Injectable()
export class ScRegistryService {
  private readonly logger = new Logger(ScRegistryService.name);

  constructor(
    private readonly activityLogsService: ActivityLogsService,
    private readonly dataSource: DataSource,
  ) {}

  private readRegistry(): any[] {
    try {
      if (!fs.existsSync(REGISTRY_JSON_PATH)) return [];
      const raw = fs.readFileSync(REGISTRY_JSON_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private writeRegistry(data: any[]): void {
    const dir = path.dirname(REGISTRY_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(REGISTRY_JSON_PATH, JSON.stringify(data, null, 2));

    const distDir = path.join(process.cwd(), 'dist', 'modules', 'managements');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(distDir, 'sc-modules-registry.json'),
      JSON.stringify(data, null, 2),
    );
  }

  private toResponse(mod: any) {
    return {
      ...mod,
      accessRoles:
        typeof mod.accessRoles === 'string'
          ? JSON.parse(mod.accessRoles)
          : mod.accessRoles,
      accessPermissions:
        typeof mod.accessPermissions === 'string'
          ? JSON.parse(mod.accessPermissions)
          : mod.accessPermissions,
      fieldsConfig:
        typeof mod.fieldsConfig === 'string'
          ? JSON.parse(mod.fieldsConfig)
          : mod.fieldsConfig,
      relationsConfig: mod.relationsConfig
        ? typeof mod.relationsConfig === 'string'
          ? JSON.parse(mod.relationsConfig)
          : mod.relationsConfig
        : null,
      layoutConfig: mod.layoutConfig
        ? typeof mod.layoutConfig === 'string'
          ? JSON.parse(mod.layoutConfig)
          : mod.layoutConfig
        : null,
    };
  }

  async findAll(query: QueryScModuleDto) {
    const {
      page = 1,
      limit = 20,
      search,
      searchField,
      sortBy,
      sortOrder,
    } = query;
    let modules = this.readRegistry();

    if (search && searchField) {
      const allowed = QueryScModuleDto.searchableFields;
      if (allowed.includes(searchField)) {
        modules = modules.filter((m) =>
          String(m[searchField] || '')
            .toLowerCase()
            .includes(search.toLowerCase()),
        );
      }
    } else if (search) {
      const fields = QueryScModuleDto.searchableFields;
      modules = modules.filter((m) =>
        fields.some((f) =>
          String(m[f] || '')
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
      );
    }

    const sortable = QueryScModuleDto.sortableFields;
    const field = sortBy && sortable.includes(sortBy) ? sortBy : 'id';
    const order = sortOrder === 'ASC' ? 1 : -1;
    modules.sort((a, b) => {
      const aVal = a[field] ?? '';
      const bVal = b[field] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return (aVal - bVal) * order;
      return String(aVal).localeCompare(String(bVal)) * order;
    });

    const total = modules.length;
    const start = (page - 1) * limit;
    const paged = modules.slice(start, start + limit);

    return {
      data: paged.map((m) => this.toResponse(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllActive() {
    return this.readRegistry().filter((m) => m.isActive);
  }

  async findOne(id: number) {
    const mod = this.readRegistry().find((m) => m.id === id);
    if (!mod) throw new NotFoundException('Module not found');
    return this.toResponse(mod);
  }

  async findByName(name: string) {
    const mod = this.readRegistry().find((m) => m.name === name);
    if (!mod) throw new NotFoundException(`Module "${name}" not found`);
    return this.toResponse(mod);
  }

  async create(dto: CreateScModuleDto, req?: any) {
    const modules = this.readRegistry();
    const existing = modules.find((m) => m.name === dto.name);
    if (existing) {
      throw new ConflictException(`Module "${dto.name}" already exists`);
    }

    const maxId = modules.reduce((max, m) => Math.max(max, m.id || 0), 0);
    const now = new Date().toISOString();
    const routePath = `/dashboard/sc/${dto.name}`;

    const mod = {
      id: maxId + 1,
      name: dto.name,
      label: dto.label,
      routePath,
      menuLabel: dto.menuLabel,
      accessLevel: dto.accessLevel,
      accessRoles: dto.accessRoles
        ? JSON.stringify(dto.accessRoles)
        : undefined,
      accessPermissions: dto.accessPermissions
        ? JSON.stringify(dto.accessPermissions)
        : undefined,
      isActive: true,
      fieldsConfig: JSON.stringify(dto.fields),
      relationsConfig: dto.relations
        ? JSON.stringify(dto.relations)
        : undefined,
      layoutConfig: dto.layoutConfig
        ? JSON.stringify(dto.layoutConfig)
        : undefined,
      createdAt: now,
      updatedAt: now,
    };

    modules.push(mod);
    this.writeRegistry(modules);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'CREATE',
      entity: 'ScModule',
      entityId: mod.id,
      description: `Created system creator module "${dto.name}"`,
      metadata: { name: dto.name, label: dto.label },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.toResponse(mod);
  }

  async update(id: number, dto: UpdateScModuleDto, req?: any) {
    const modules = this.readRegistry();
    const index = modules.findIndex((m) => m.id === id);
    if (index === -1) throw new NotFoundException('Module not found');

    const mod = { ...modules[index] };
    if (dto.label) mod.label = dto.label;
    if (dto.menuLabel) mod.menuLabel = dto.menuLabel;
    if (dto.accessLevel) mod.accessLevel = dto.accessLevel;
    if (dto.accessRoles !== undefined) {
      mod.accessRoles = dto.accessRoles
        ? JSON.stringify(dto.accessRoles)
        : undefined;
    }
    if (dto.accessPermissions !== undefined) {
      mod.accessPermissions = dto.accessPermissions
        ? JSON.stringify(dto.accessPermissions)
        : undefined;
    }
    if (dto.fields) {
      mod.fieldsConfig = JSON.stringify(dto.fields);
    }
    if (dto.relations !== undefined) {
      mod.relationsConfig = dto.relations
        ? JSON.stringify(dto.relations)
        : undefined;
    }
    if (dto.layoutConfig !== undefined) {
      mod.layoutConfig = dto.layoutConfig
        ? JSON.stringify(dto.layoutConfig)
        : undefined;
    }
    mod.updatedAt = new Date().toISOString();

    modules[index] = mod;
    this.writeRegistry(modules);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: 'ScModule',
      entityId: mod.id,
      description: `Updated system creator module "${mod.name}"`,
      metadata: { name: mod.name },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.toResponse(mod);
  }

  async remove(id: number, req?: any) {
    const modules = this.readRegistry();
    const index = modules.findIndex((m) => m.id === id);
    if (index === -1) throw new NotFoundException('Module not found');

    const mod = modules[index];
    const moduleName = mod.name;

    // 1. Hapus folder generated module (sc_{name}/)
    const moduleDir = path.join(REGISTRY_DIR, `sc_${moduleName}`);
    if (fs.existsSync(moduleDir)) {
      fs.rmSync(moduleDir, { recursive: true, force: true });
      this.logger.log(`Deleted module folder: sc_${moduleName}`);
    }

    // 2. Hapus folder compiled dist (jika ada)
    const distModuleDir = path.join(
      process.cwd(),
      'dist',
      'modules',
      'managements',
      `sc_${moduleName}`,
    );
    if (fs.existsSync(distModuleDir)) {
      fs.rmSync(distModuleDir, { recursive: true, force: true });
      this.logger.log(`Deleted dist folder: sc_${moduleName}`);
    }

    // 3. Hapus entry dari registry
    modules.splice(index, 1);
    this.writeRegistry(modules);
    this.logger.log(`Removed module "${moduleName}" from registry`);

    // 4. Drop database table
    try {
      await this.dataSource.query(`DROP TABLE IF EXISTS "${moduleName}"`);
      this.logger.log(`Dropped table: ${moduleName}`);
    } catch (e: any) {
      this.logger.warn(
        `Failed to drop table "${moduleName}": ${e.message}`,
      );
    }

    // 5. Log activity
    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'DELETE',
      entity: 'ScModule',
      entityId: id,
      description: `Deleted system creator module "${moduleName}" (hard delete)`,
      metadata: { name: moduleName, label: mod.label },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return { success: true, message: `Module "${moduleName}" deleted permanently` };
  }

  async toggleActive(id: number, req?: any) {
    const modules = this.readRegistry();
    const index = modules.findIndex((m) => m.id === id);
    if (index === -1) throw new NotFoundException('Module not found');

    const mod = {
      ...modules[index],
      isActive: !modules[index].isActive,
      updatedAt: new Date().toISOString(),
    };
    modules[index] = mod;
    this.writeRegistry(modules);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: 'ScModule',
      entityId: mod.id,
      description: `${mod.isActive ? 'Activated' : 'Deactivated'} system creator module "${mod.name}"`,
      metadata: { name: mod.name, isActive: mod.isActive },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.toResponse(mod);
  }
}
