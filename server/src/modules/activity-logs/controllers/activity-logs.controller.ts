import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';
import { QueryActivityLogDto } from '@/modules/activity-logs/dto/query-activity-log.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @Permissions('Activity Logs', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findAll(@Query() query: QueryActivityLogDto) {
    return this.activityLogsService.findAll(query);
  }

  @Get('stats')
  @Permissions('Activity Logs', 'Full Access')
  @Roles('Admin', 'Super Admin')
  getStats() {
    return this.activityLogsService.getStats();
  }

  @Get(':id')
  @Permissions('Activity Logs', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activityLogsService.findOne(id);
  }
}
