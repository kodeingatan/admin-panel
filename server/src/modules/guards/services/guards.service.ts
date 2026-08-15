import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guard } from '@/modules/guards/entities/guard.entity';
import { GuardUrl } from '@/modules/guards/entities/guard-url.entity';
import { CreateGuardDto } from '@/modules/guards/dto/create-guard.dto';
import { UpdateGuardDto } from '@/modules/guards/dto/update-guard.dto';
import { QueryGuardDto } from '@/modules/guards/dto/query-guard.dto';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

@Injectable()
export class GuardsService {
  constructor(
    @InjectRepository(Guard)
    private guardsRepository: Repository<Guard>,
    @InjectRepository(GuardUrl)
    private guardUrlsRepository: Repository<GuardUrl>,
    private activityLogsService: ActivityLogsService,
  ) {}

  async findAll(query: QueryGuardDto) {
    const { page = 1, limit = 20, search, searchField, sortBy, sortOrder } = query;
    const qb = this.guardsRepository
      .createQueryBuilder('guard')
      .leftJoinAndSelect('guard.urls', 'url');

    if (search && searchField) {
      const allowed = QueryGuardDto.searchFields;
      if (allowed.includes(searchField)) {
        qb.where(`guard.${searchField} LIKE :search`, { search: `%${search}%` });
      }
    } else if (search) {
      const conditions = QueryGuardDto.searchFields.map((f) => `guard.${f} LIKE :search`);
      qb.where(`(${conditions.join(' OR ')})`, { search: `%${search}%` });
    }

    const sortable = QueryGuardDto.sortableFields;
    const field = sortBy && sortable.includes(sortBy) ? `guard.${sortBy}` : 'guard.id';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [guards, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(field, order)
      .getManyAndCount();

    return {
      data: guards,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const guard = await this.guardsRepository.findOne({
      where: { id },
      relations: { urls: true },
    });
    if (!guard) throw new NotFoundException('Guard not found');
    return guard;
  }

  async create(dto: CreateGuardDto, req?: any) {
    const existing = await this.guardsRepository.findOne({
      where: { guardName: dto.guardName },
    });
    if (existing) {
      throw new ConflictException('Guard name already exists');
    }

    const guard = this.guardsRepository.create({
      guardName: dto.guardName,
      description: dto.description,
    });
    await this.guardsRepository.save(guard);

    if (dto.allowUrls?.length) {
      const urls = dto.allowUrls.map((url) =>
        this.guardUrlsRepository.create({ url, type: 'allow', guard }),
      );
      await this.guardUrlsRepository.save(urls);
    }

    if (dto.denyUrls?.length) {
      const urls = dto.denyUrls.map((url) =>
        this.guardUrlsRepository.create({ url, type: 'deny', guard }),
      );
      await this.guardUrlsRepository.save(urls);
    }

    const result = await this.findOne(guard.id);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'CREATE',
      entity: 'Guard',
      entityId: guard.id,
      description: `Created guard ${guard.guardName}`,
      metadata: { guardName: guard.guardName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return result;
  }

  async update(id: number, dto: UpdateGuardDto, req?: any) {
    const guard = await this.guardsRepository.findOne({
      where: { id },
      relations: { urls: true },
    });
    if (!guard) throw new NotFoundException('Guard not found');

    if (dto.guardName && dto.guardName !== guard.guardName) {
      const existing = await this.guardsRepository.findOne({
        where: { guardName: dto.guardName },
      });
      if (existing) throw new ConflictException('Guard name already exists');
    }

    if (dto.guardName) guard.guardName = dto.guardName;
    if (dto.description !== undefined) guard.description = dto.description;
    await this.guardsRepository.save(guard);

    if (dto.allowUrls || dto.denyUrls) {
      await this.guardUrlsRepository.delete({ guard: { id } });

      if (dto.allowUrls?.length) {
        const urls = dto.allowUrls.map((url) =>
          this.guardUrlsRepository.create({ url, type: 'allow', guard }),
        );
        await this.guardUrlsRepository.save(urls);
      }

      if (dto.denyUrls?.length) {
        const urls = dto.denyUrls.map((url) =>
          this.guardUrlsRepository.create({ url, type: 'deny', guard }),
        );
        await this.guardUrlsRepository.save(urls);
      }
    }

    const result = await this.findOne(id);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: 'Guard',
      entityId: guard.id,
      description: `Updated guard ${guard.guardName}`,
      metadata: { guardName: guard.guardName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return result;
  }

  async remove(id: number, req?: any) {
    const guard = await this.guardsRepository.findOne({ where: { id } });
    if (!guard) throw new NotFoundException('Guard not found');

    const guardName = guard.guardName;
    await this.guardsRepository.remove(guard);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'DELETE',
      entity: 'Guard',
      entityId: id,
      description: `Deleted guard ${guardName}`,
      metadata: { guardName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return { message: 'Guard deleted successfully' };
  }
}
