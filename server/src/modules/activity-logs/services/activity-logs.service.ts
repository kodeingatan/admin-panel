import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike } from 'typeorm';
import { ActivityLog } from '@/modules/activity-logs/entities/activity-log.entity';
import { QueryActivityLogDto } from '@/modules/activity-logs/dto/query-activity-log.dto';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogsRepo: Repository<ActivityLog>,
  ) {}

  async log(data: {
    userId?: number;
    action: string;
    entity: string;
    entityId?: number;
    description?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    level?: string;
  }): Promise<ActivityLog> {
    const entry = this.activityLogsRepo.create({
      userId: data.userId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      description: data.description,
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      level: data.level || 'INFO',
    });
    return this.activityLogsRepo.save(entry);
  }

  async findAll(query: QueryActivityLogDto) {
    const {
      page = 1,
      limit = 20,
      search,
      action,
      entity,
      userId,
      level,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.activityLogsRepo
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    if (search) {
      qb.andWhere(
        '(log.description LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search OR user.username LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (action) {
      qb.andWhere('log.action = :action', { action });
    }

    if (entity) {
      qb.andWhere('log.entity = :entity', { entity });
    }

    if (userId) {
      qb.andWhere('log.userId = :userId', { userId });
    }

    if (level) {
      qb.andWhere('log.level = :level', { level });
    }

    if (startDate && endDate) {
      qb.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const total = await qb.getCount();
    const data = await qb
      .orderBy(`log.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<ActivityLog> {
    const log = await this.activityLogsRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!log) {
      throw new Error(`Activity log #${id} not found`);
    }
    return log;
  }

  async getStats() {
    const total = await this.activityLogsRepo.count();

    const byAction = await this.activityLogsRepo
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.action')
      .getRawMany();

    const byEntity = await this.activityLogsRepo
      .createQueryBuilder('log')
      .select('log.entity', 'entity')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.entity')
      .getRawMany();

    const byLevel = await this.activityLogsRepo
      .createQueryBuilder('log')
      .select('log.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.level')
      .getRawMany();

    return {
      total,
      byAction: byAction.reduce(
        (acc, row) => ({ ...acc, [row.action]: parseInt(row.count) }),
        {},
      ),
      byEntity: byEntity.reduce(
        (acc, row) => ({ ...acc, [row.entity]: parseInt(row.count) }),
        {},
      ),
      byLevel: byLevel.reduce(
        (acc, row) => ({ ...acc, [row.level]: parseInt(row.count) }),
        {},
      ),
    };
  }
}
