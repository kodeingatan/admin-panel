import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '@/modules/settings/entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepo: Repository<Setting>,
  ) {}

  async findAll(): Promise<Setting[]> {
    return this.settingsRepo.find();
  }

  async findByKey(key: string): Promise<Setting | null> {
    return this.settingsRepo.findOne({ where: { key } });
  }

  async get(key: string): Promise<string | null> {
    const setting = await this.findByKey(key);
    return setting?.value ?? null;
  }

  async set(key: string, value: string): Promise<Setting> {
    let setting = await this.findByKey(key);
    if (setting) {
      setting.value = value;
    } else {
      setting = this.settingsRepo.create({ key, value });
    }
    return this.settingsRepo.save(setting);
  }

  async bulkUpdate(
    settings: { key: string; value: string }[],
  ): Promise<Setting[]> {
    const results: Setting[] = [];
    for (const { key, value } of settings) {
      results.push(await this.set(key, value));
    }
    return results;
  }
}
