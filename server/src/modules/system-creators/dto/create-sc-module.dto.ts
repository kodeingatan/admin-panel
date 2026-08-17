import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  ValidateNested,
  Matches,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScFieldOptionDto {
  @IsString()
  label: string;

  @IsOptional()
  value: string | number;
}

export class ScFieldConfigDto {
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*$/)
  name: string;

  @IsString()
  label: string;

  @IsString()
  @IsIn([
    'text', 'textarea', 'rich-text', 'number', 'boolean',
    'date', 'datetime', 'email', 'phone', 'url',
    'password', 'color', 'select', 'json', 'file', 'image',
  ])
  type: string;

  @IsBoolean()
  required: boolean;

  @IsBoolean()
  unique: boolean;

  @IsBoolean()
  searchable: boolean;

  @IsBoolean()
  sortable: boolean;

  @IsBoolean()
  visible: boolean;

  @IsOptional()
  defaultValue?: any;

  @IsOptional()
  @IsString()
  maxLength?: string;

  @IsOptional()
  @IsString()
  minLength?: string;

  @IsOptional()
  @IsString()
  min?: string;

  @IsOptional()
  @IsString()
  max?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScFieldOptionDto)
  options?: ScFieldOptionDto[];

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  helpText?: string;
}

export class ScRelationConfigDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(['many-to-one', 'many-to-many', 'one-to-many'])
  type: string;

  @IsString()
  targetModule: string;

  @IsOptional()
  @IsString()
  joinTable?: string;
}

export class CreateScModuleDto {
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*$/)
  name: string;

  @IsString()
  label: string;

  @IsString()
  menuLabel: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScFieldConfigDto)
  fields: ScFieldConfigDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScRelationConfigDto)
  relations?: ScRelationConfigDto[];

  @IsString()
  @IsIn(['public', 'admin', 'granular'])
  accessLevel: string;

  @IsOptional()
  @IsArray()
  accessRoles?: string[];

  @IsOptional()
  @IsArray()
  accessPermissions?: string[];
}
