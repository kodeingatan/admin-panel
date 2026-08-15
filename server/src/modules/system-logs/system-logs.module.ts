import { Module } from '@nestjs/common';
import { SystemLogsController } from '@/modules/system-logs/controllers/system-logs.controller';
import { SystemLogsService } from '@/modules/system-logs/services/system-logs.service';

@Module({
  controllers: [SystemLogsController],
  providers: [SystemLogsService],
  exports: [SystemLogsService],
})
export class SystemLogsModule {}
