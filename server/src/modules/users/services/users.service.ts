import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/users/entities/user.entity';
import { Role } from '@/modules/roles/entities/role.entity';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { QueryUserDto } from '@/modules/users/dto/query-user.dto';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private activityLogsService: ActivityLogsService,
  ) {}

  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 20, search, searchField, sortBy, sortOrder } = query;
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role');

    if (search && searchField) {
      const allowed = QueryUserDto.searchFields;
      if (allowed.includes(searchField)) {
        qb.where(`user.${searchField} LIKE :search`, { search: `%${search}%` });
      }
    } else if (search) {
      const conditions = QueryUserDto.searchFields.map((f) => `user.${f} LIKE :search`);
      qb.where(`(${conditions.join(' OR ')})`, { search: `%${search}%` });
    }

    const sortable = QueryUserDto.sortableFields;
    const field = sortBy && sortable.includes(sortBy) ? `user.${sortBy}` : 'user.id';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [users, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(field, order)
      .getManyAndCount();

    return {
      data: users.map((u) => this.toResponse(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.toResponse(user);
  }

  async create(dto: CreateUserDto, req?: any) {
    if (dto.password !== dto.confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    const existingEmail = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    const existingUsername = await this.usersRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let roles: Role[] = [];
    if (dto.roleIds?.length) {
      roles = await this.rolesRepository.findBy({ id: In(dto.roleIds) });
    }

    const user = this.usersRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      roles,
    });

    await this.usersRepository.save(user);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      description: `Created user ${user.username}`,
      metadata: { username: user.username, email: user.email },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.toResponse(user);
  }

  async update(id: number, dto: UpdateUserDto, req?: any) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException('Email already registered');
    }

    if (dto.username && dto.username !== user.username) {
      const existing = await this.usersRepository.findOne({
        where: { username: dto.username },
      });
      if (existing) throw new ConflictException('Username already taken');
    }

    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.username) user.username = dto.username;
    if (dto.email) user.email = dto.email;
    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);

    if (dto.roleIds) {
      user.roles = await this.rolesRepository.findBy({ id: In(dto.roleIds) });
    }

    await this.usersRepository.save(user);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: 'User',
      entityId: user.id,
      description: `Updated user ${user.username}`,
      metadata: { username: user.username, email: user.email },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.toResponse(user);
  }

  async findOneWithRoles(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        roles: {
          guards: { urls: true },
          permissions: { methods: true, urls: true },
        },
      },
    });
    return user;
  }

  async remove(id: number, req?: any) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const username = user.username;
    await this.usersRepository.remove(user);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      description: `Deleted user ${username}`,
      metadata: { username },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return { message: 'User deleted successfully' };
  }

  private toResponse(user: User) {
    const { password, ...result } = user as any;
    return result;
  }
}
