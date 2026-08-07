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

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(PermissionMethod)
    private permissionMethodsRepository: Repository<PermissionMethod>,
    @InjectRepository(PermissionUrl)
    private permissionUrlsRepository: Repository<PermissionUrl>,
  ) {}

  async findAll(query: QueryPermissionDto) {
    const { page = 1, limit = 20, search } = query;
    const qb = this.permissionsRepository
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.methods', 'method')
      .leftJoinAndSelect('permission.urls', 'url');

    if (search) {
      qb.where(
        'permission.permissionName LIKE :search OR permission.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const [permissions, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('permission.id', 'DESC')
      .getManyAndCount();

    return {
      data: permissions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
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

  async create(dto: CreatePermissionDto) {
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

    return this.findOne(permission.id);
  }

  async update(id: number, dto: UpdatePermissionDto) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
      relations: { methods: true, urls: true },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    if (dto.permissionName && dto.permissionName !== permission.permissionName) {
      const existing = await this.permissionsRepository.findOne({
        where: { permissionName: dto.permissionName },
      });
      if (existing) throw new ConflictException('Permission name already exists');
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

    return this.findOne(id);
  }

  async remove(id: number) {
    const permission = await this.permissionsRepository.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Permission not found');
    await this.permissionsRepository.remove(permission);
    return { message: 'Permission deleted successfully' };
  }
}
