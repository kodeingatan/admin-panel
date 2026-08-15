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
import { UsersService } from '@/modules/users/services/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { QueryUserDto } from '@/modules/users/dto/query-user.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('User Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Permissions('User Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Permissions('User Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  create(@Body() dto: CreateUserDto, @Request() req) {
    return this.usersService.create(dto, req);
  }

  @Put(':id')
  @Permissions('User Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, dto, req);
  }

  @Delete(':id')
  @Permissions('User Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.remove(id, req);
  }
}
