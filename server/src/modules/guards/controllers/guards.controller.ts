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
import { GuardsService } from '@/modules/guards/services/guards.service';
import { CreateGuardDto } from '@/modules/guards/dto/create-guard.dto';
import { UpdateGuardDto } from '@/modules/guards/dto/update-guard.dto';
import { QueryGuardDto } from '@/modules/guards/dto/query-guard.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('guards')
export class GuardsController {
  constructor(private readonly guardsService: GuardsService) {}

  @Get()
  @Permissions('Guard Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findAll(@Query() query: QueryGuardDto) {
    return this.guardsService.findAll(query);
  }

  @Get(':id')
  @Permissions('Guard Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.guardsService.findOne(id);
  }

  @Post()
  @Permissions('Guard Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  create(@Body() dto: CreateGuardDto, @Request() req) {
    return this.guardsService.create(dto, req);
  }

  @Put(':id')
  @Permissions('Guard Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGuardDto,
    @Request() req,
  ) {
    return this.guardsService.update(id, dto, req);
  }

  @Delete(':id')
  @Permissions('Guard Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.guardsService.remove(id, req);
  }
}
