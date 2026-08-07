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
} from '@nestjs/common';
import { GuardsService } from '@/modules/guards/services/guards.service';
import { CreateGuardDto } from '@/modules/guards/dto/create-guard.dto';
import { UpdateGuardDto } from '@/modules/guards/dto/update-guard.dto';
import { QueryGuardDto } from '@/modules/guards/dto/query-guard.dto';

@Controller('guards')
export class GuardsController {
  constructor(private readonly guardsService: GuardsService) {}

  @Get()
  findAll(@Query() query: QueryGuardDto) {
    return this.guardsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.guardsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGuardDto) {
    return this.guardsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGuardDto) {
    return this.guardsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.guardsService.remove(id);
  }
}
