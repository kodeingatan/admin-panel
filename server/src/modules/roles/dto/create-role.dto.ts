import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  roleName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  guardIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];
}
