import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScModule } from '@/modules/system-creators/entities/sc-module.entity';
import { SystemCreatorsController } from '@/modules/system-creators/controllers/system-creators.controller';
import { ScRegistryService } from '@/modules/system-creators/services/sc-registry.service';
import { ScGeneratorService } from '@/modules/system-creators/services/sc-generator.service';
import { ActivityLogsModule } from '@/modules/activity-logs/activity-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([ScModule]), ActivityLogsModule],
  controllers: [SystemCreatorsController],
  providers: [ScRegistryService, ScGeneratorService],
  exports: [ScRegistryService, ScGeneratorService],
})
export class SystemCreatorsModule {}
