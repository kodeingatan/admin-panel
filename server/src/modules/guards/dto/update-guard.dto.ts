import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
} from 'class-validator';

export class UpdateGuardDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  guardName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  denyUrls?: string[];
}
