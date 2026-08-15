import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { PermissionsService } from '@/modules/permissions/services/permissions.service';
import { CreatePermissionDto } from '@/modules/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@/modules/permissions/dto/update-permission.dto';
import { QueryPermissionDto } from '@/modules/permissions/dto/query-permission.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('Permission Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findAll(@Query() query: QueryPermissionDto) {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  @Permissions('Permission Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @Permissions('Permission Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  create(@Body() dto: CreatePermissionDto, @Request() req) {
    return this.permissionsService.create(dto, req);
  }

  @Put(':id')
  @Permissions('Permission Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionDto,
    @Request() req,
  ) {
    return this.permissionsService.update(id, dto, req);
  }

  @Delete(':id')
  @Permissions('Permission Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.permissionsService.remove(id, req);
  }
}
