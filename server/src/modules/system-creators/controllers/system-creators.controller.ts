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
import { ScRegistryService } from '@/modules/system-creators/services/sc-registry.service';
import { ScGeneratorService } from '@/modules/system-creators/services/sc-generator.service';
import { CreateScModuleDto } from '@/modules/system-creators/dto/create-sc-module.dto';
import { UpdateScModuleDto } from '@/modules/system-creators/dto/update-sc-module.dto';
import { QueryScModuleDto } from '@/modules/system-creators/dto/query-sc-module.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('system-creators')
export class SystemCreatorsController {
  constructor(
    private readonly registryService: ScRegistryService,
    private readonly generatorService: ScGeneratorService,
  ) {}

  @Get('registry')
  @Permissions('System Creators', 'Full Access')
  @Roles('Super Admin')
  findAll(@Query() query: QueryScModuleDto) {
    return this.registryService.findAll(query);
  }

  @Get('registry/by-name/:name')
  @Permissions('System Creators', 'Full Access')
  @Roles('Super Admin')
  findByName(@Param('name') name: string) {
    return this.registryService.findByName(name);
  }

  @Get('registry/:id')
  @Permissions('System Creators', 'Full Access')
  @Roles('Super Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registryService.findOne(id);
  }

  @Post('generate')
  @Permissions('System Creators', 'Full Access')
  @Roles('Super Admin')
  async generate(@Body() dto: CreateScModuleDto, @Request() req) {
    const saved = await this.registryService.create(dto, req);
    return this.generatorService.generate({ ...dto, id: saved.id });
  }

  @Put(':id')
  @Permissions('System Creators', 'Full Access')
  @Roles('Super Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScModuleDto,
    @Request() req,
  ) {
    return this.registryService.update(id, dto, req);
  }

  @Delete(':id')
  @Permissions('System Creators', 'Full Access')
  @Roles('Super Admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.registryService.remove(id, req);
  }

  @Post(':id/toggle')
  @Permissions('System Creators', 'Full Access')
  @Roles('Super Admin')
  toggleActive(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.registryService.toggleActive(id, req);
  }
}
