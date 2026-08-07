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

@Injectable()
export class GuardsService {
  constructor(
    @InjectRepository(Guard)
    private guardsRepository: Repository<Guard>,
    @InjectRepository(GuardUrl)
    private guardUrlsRepository: Repository<GuardUrl>,
  ) {}

  async findAll(query: QueryGuardDto) {
    const { page = 1, limit = 20, search } = query;
    const qb = this.guardsRepository
      .createQueryBuilder('guard')
      .leftJoinAndSelect('guard.urls', 'url');

    if (search) {
      qb.where(
        'guard.guardName LIKE :search OR guard.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const [guards, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('guard.id', 'DESC')
      .getManyAndCount();

    return {
      data: guards,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
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

  async create(dto: CreateGuardDto) {
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

    return this.findOne(guard.id);
  }

  async update(id: number, dto: UpdateGuardDto) {
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

    return this.findOne(id);
  }

  async remove(id: number) {
    const guard = await this.guardsRepository.findOne({ where: { id } });
    if (!guard) throw new NotFoundException('Guard not found');
    await this.guardsRepository.remove(guard);
    return { message: 'Guard deleted successfully' };
  }
}
