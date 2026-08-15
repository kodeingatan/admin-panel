import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/users/entities/user.entity';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private activityLogsService: ActivityLogsService,
  ) {}

  async register(dto: RegisterDto, req?: any) {
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

    const user = this.usersRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    await this.activityLogsService.log({
      action: 'CREATE',
      entity: 'Auth',
      entityId: user.id,
      description: `User registered: ${user.username}`,
      metadata: { username: user.username, email: user.email },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return this.login({ email: dto.email, password: dto.password }, req);
  }

  async login(dto: LoginDto, req?: any) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      relations: {
        roles: {
          guards: { urls: true },
          permissions: { methods: true, urls: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    await this.activityLogsService.log({
      userId: user.id,
      action: 'LOGIN',
      entity: 'Auth',
      description: `User logged in: ${user.username}`,
      metadata: { username: user.username, email: user.email },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    const { password, ...result } = user as any;
    return {
      accessToken,
      user: result,
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        roles: {
          guards: { urls: true },
          permissions: { methods: true, urls: true },
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user as any;
    return result;
  }
}
