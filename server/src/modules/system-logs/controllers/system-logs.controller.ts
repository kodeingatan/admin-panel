import { Controller, Get, Param, Query } from '@nestjs/common';
import { SystemLogsService } from '@/modules/system-logs/services/system-logs.service';
import { QuerySystemLogDto } from '@/modules/system-logs/dto/query-system-log.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('system-logs')
export class SystemLogsController {
  constructor(private readonly systemLogsService: SystemLogsService) {}

  @Get('files')
  @Permissions('System Logs', 'Full Access')
  @Roles('Admin', 'Super Admin')
  getLogFiles() {
    return this.systemLogsService.getLogFiles();
  }

  @Get('files/:filename')
  @Permissions('System Logs', 'Full Access')
  @Roles('Admin', 'Super Admin')
  getLogContent(
    @Param('filename') filename: string,
    @Query() query: QuerySystemLogDto,
  ) {
    return this.systemLogsService.getLogContent(filename, query);
  }

  @Get('stats/:filename')
  @Permissions('System Logs', 'Full Access')
  @Roles('Admin', 'Super Admin')
  getLogStats(@Param('filename') filename: string) {
    return this.systemLogsService.getLogStats(filename);
  }
}
