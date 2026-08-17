import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '@/modules/settings/entities/setting.entity';
import { SettingsController } from '@/modules/settings/controllers/settings.controller';
import { SettingsService } from '@/modules/settings/services/settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
