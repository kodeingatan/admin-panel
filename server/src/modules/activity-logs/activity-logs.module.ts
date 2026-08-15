import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from '@/modules/activity-logs/entities/activity-log.entity';
import { ActivityLogsController } from '@/modules/activity-logs/controllers/activity-logs.controller';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
