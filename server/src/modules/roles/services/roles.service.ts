import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '@/modules/roles/entities/role.entity';
import { Guard } from '@/modules/guards/entities/guard.entity';
import { Permission } from '@/modules/permissions/entities/permission.entity';
import { CreateRoleDto } from '@/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@/modules/roles/dto/update-role.dto';
import { QueryRoleDto } from '@/modules/roles/dto/query-role.dto';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Guard)
    private guardsRepository: Repository<Guard>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    private activityLogsService: ActivityLogsService,
  ) {}

  async findAll(query: QueryRoleDto) {
    const { page = 1, limit = 20, search, searchField, sortBy, sortOrder } = query;
    const qb = this.rolesRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.guards', 'guard')
      .leftJoinAndSelect('role.permissions', 'permission');

    if (search && searchField) {
      const allowed = QueryRoleDto.searchFields;
      if (allowed.includes(searchField)) {
        qb.where(`role.${searchField} LIKE :search`, { search: `%${search}%` });
      }
    } else if (search) {
      const conditions = QueryRoleDto.searchFields.map((f) => `role.${f} LIKE :search`);
      qb.where(`(${conditions.join(' OR ')})`, { search: `%${search}%` });
    }

    const sortable = QueryRoleDto.sortableFields;
    const field = sortBy && sortable.includes(sortBy) ? `role.${sortBy}` : 'role.id';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [roles, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(field, order)
      .getManyAndCount();

    return {
      data: roles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: { guards: true, permissions: true },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(dto: CreateRoleDto, req?: any) {
    const existing = await this.rolesRepository.findOne({
      where: { roleName: dto.roleName },
    });
    if (existing) {
      throw new ConflictException('Role name already exists');
    }

    let guards: Guard[] = [];
    if (dto.guardIds?.length) {
      guards = await this.guardsRepository.findBy({ id: In(dto.guardIds) });
    }

    let permissions: Permission[] = [];
    if (dto.permissionIds?.length) {
      permissions = await this.permissionsRepository.findBy({
        id: In(dto.permissionIds),
      });
    }

    const role = this.rolesRepository.create({
      roleName: dto.roleName,
      description: dto.description,
      guards,
      permissions,
    });

    const saved = await this.rolesRepository.save(role);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'CREATE',
      entity: 'Role',
      entityId: saved.id,
      description: `Created role ${saved.roleName}`,
      metadata: { roleName: saved.roleName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return saved;
  }

  async update(id: number, dto: UpdateRoleDto, req?: any) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: { guards: true, permissions: true },
    });
    if (!role) throw new NotFoundException('Role not found');

    if (dto.roleName && dto.roleName !== role.roleName) {
      const existing = await this.rolesRepository.findOne({
        where: { roleName: dto.roleName },
      });
      if (existing) throw new ConflictException('Role name already exists');
    }

    if (dto.roleName) role.roleName = dto.roleName;
    if (dto.description !== undefined) role.description = dto.description;

    if (dto.guardIds) {
      role.guards = await this.guardsRepository.findBy({ id: In(dto.guardIds) });
    }
    if (dto.permissionIds) {
      role.permissions = await this.permissionsRepository.findBy({
        id: In(dto.permissionIds),
      });
    }

    const saved = await this.rolesRepository.save(role);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: 'Role',
      entityId: role.id,
      description: `Updated role ${role.roleName}`,
      metadata: { roleName: role.roleName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return saved;
  }

  async remove(id: number, req?: any) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');

    const roleName = role.roleName;
    await this.rolesRepository.remove(role);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'DELETE',
      entity: 'Role',
      entityId: id,
      description: `Deleted role ${roleName}`,
      metadata: { roleName },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return { message: 'Role deleted successfully' };
  }
}
