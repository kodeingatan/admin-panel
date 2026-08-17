import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '@/modules/settings/entities/setting.entity';
import { SettingsController } from '@/modules/settings/controllers/settings.controller';
import { SettingsService } from '@/modules/settings/services/settings.service';
import { StorageModule } from '@/modules/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Setting]), StorageModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
