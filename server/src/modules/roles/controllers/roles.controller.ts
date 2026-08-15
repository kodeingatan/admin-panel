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
import { RolesService } from '@/modules/roles/services/roles.service';
import { CreateRoleDto } from '@/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@/modules/roles/dto/update-role.dto';
import { QueryRoleDto } from '@/modules/roles/dto/query-role.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('Role Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findAll(@Query() query: QueryRoleDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @Permissions('Role Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Permissions('Role Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  create(@Body() dto: CreateRoleDto, @Request() req) {
    return this.rolesService.create(dto, req);
  }

  @Put(':id')
  @Permissions('Role Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto, @Request() req) {
    return this.rolesService.update(id, dto, req);
  }

  @Delete(':id')
  @Permissions('Role Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.rolesService.remove(id, req);
  }
}
