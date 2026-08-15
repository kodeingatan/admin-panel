import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '@/modules/permissions/entities/permission.entity';
import { PermissionMethod } from '@/modules/permissions/entities/permission-method.entity';
import { PermissionUrl } from '@/modules/permissions/entities/permission-url.entity';
import { CreatePermissionDto } from '@/modules/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@/modules/permissions/dto/update-permission.dto';
import { QueryPermissionDto } from '@/modules/permissions/dto/query-permission.dto';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(PermissionMethod)
    private permissionMethodsRepository: Repository<PermissionMethod>,
    @InjectRepository(PermissionUrl)
    private permissionUrlsRepository: Repository<PermissionUrl>,
    private activityLogsService: ActivityLogsService,
  ) {}

  async findAll(query: QueryPermissionDto) {
    const {
      page = 1,
      limit = 20,
      search,
      searchField,
      sortBy,
      sortOrder,
    } = query;
    const qb = this.permissionsRepository
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.methods', 'method')
      .leftJoinAndSelect('permission.urls', 'url');

    if (search && searchField) {
      const allowed = QueryPermissionDto.searchFields;
      if (allowed.includes(searchField)) {
        qb.where(`permission.${searchField} LIKE :search`, {
          search: `%${search}%`,
        });
      }
    } else if (search) {
      const conditions = QueryPermissionDto.searchFields.map(
        (f) => `permission.${f} LIKE :search`,
      );
      qb.where(`(${conditions.join(' OR ')})`, { search: `%${search}%` });
    }

    const sortable = QueryPermissionDto.sortableFields;
    const field =
      sortBy && sortable.includes(sortBy)
        ? `permission.${sortBy}`
        : 'permission.id';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [permissions, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(field, order)
      .getManyAndCount();

    return {
      data: permissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
      relations: { methods: true, urls: true },
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async create(dto: CreatePermissionDto, req?: any) {
    const existing = await this.permissionsRepository.findOne({
      where: { permissionName: dto.permissionName },
    });
    if (existing) {
      throw new ConflictException('Permission name already exists');
    }

    const permission = this.permissionsRepository.create({
      permissionName: dto.permissionName,
      description: dto.description,
    });
    await this.permissionsRepository.save(permission);

    if (dto.methods?.length) {
      const methods = dto.methods.map((method) =>
        this.permissionMethodsRepository.create({ method, permission }),
      );
      await this.permissionMethodsRepository.save(methods);
    }

    if (dto.urls?.length) {
      const urls = dto.urls.map((url) =>
        this.permissionUrlsRepository.create({ url, permission }),
      );
      await this.permissionUrlsRepository.save(urls);
    }

    const result = await this.findOne(permission.id);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'CREATE',
      entity: 'Permission',
      entityId: permission.id,
      description: `Created permission ${permission.permissionName}`,
      metadata: { permissionName: permission.permissionName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return result;
  }

  async update(id: number, dto: UpdatePermissionDto, req?: any) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
      relations: { methods: true, urls: true },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    if (
      dto.permissionName &&
      dto.permissionName !== permission.permissionName
    ) {
      const existing = await this.permissionsRepository.findOne({
        where: { permissionName: dto.permissionName },
      });
      if (existing)
        throw new ConflictException('Permission name already exists');
    }

    if (dto.permissionName) permission.permissionName = dto.permissionName;
    if (dto.description !== undefined) permission.description = dto.description;
    await this.permissionsRepository.save(permission);

    if (dto.methods) {
      await this.permissionMethodsRepository.delete({ permission: { id } });
      const methods = dto.methods.map((method) =>
        this.permissionMethodsRepository.create({ method, permission }),
      );
      await this.permissionMethodsRepository.save(methods);
    }

    if (dto.urls) {
      await this.permissionUrlsRepository.delete({ permission: { id } });
      const urls = dto.urls.map((url) =>
        this.permissionUrlsRepository.create({ url, permission }),
      );
      await this.permissionUrlsRepository.save(urls);
    }

    const result = await this.findOne(id);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: 'Permission',
      entityId: permission.id,
      description: `Updated permission ${permission.permissionName}`,
      metadata: { permissionName: permission.permissionName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return result;
  }

  async remove(id: number, req?: any) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    const permissionName = permission.permissionName;
    await this.permissionsRepository.remove(permission);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'DELETE',
      entity: 'Permission',
      entityId: id,
      description: `Deleted permission ${permissionName}`,
      metadata: { permissionName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return { message: 'Permission deleted successfully' };
  }
}
