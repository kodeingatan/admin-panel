import { PartialType } from '@nestjs/mapped-types';
import { CreateScModuleDto } from './create-sc-module.dto';

export class UpdateScModuleDto extends PartialType(CreateScModuleDto) {}
