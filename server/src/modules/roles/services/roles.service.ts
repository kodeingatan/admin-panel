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

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Guard)
    private guardsRepository: Repository<Guard>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async findAll(query: QueryRoleDto) {
    const { page = 1, limit = 20, search } = query;
    const qb = this.rolesRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.guards', 'guard')
      .leftJoinAndSelect('role.permissions', 'permission');

    if (search) {
      qb.where(
        'role.roleName LIKE :search OR role.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const [roles, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('role.id', 'DESC')
      .getManyAndCount();

    return {
      data: roles,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
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

  async create(dto: CreateRoleDto) {
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

    return this.rolesRepository.save(role);
  }

  async update(id: number, dto: UpdateRoleDto) {
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

    return this.rolesRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    await this.rolesRepository.remove(role);
    return { message: 'Role deleted successfully' };
  }
}
