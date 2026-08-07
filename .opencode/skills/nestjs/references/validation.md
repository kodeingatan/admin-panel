# NestJS Validation & DTOs

## Overview

Validation ensures incoming data meets expected formats. Use DTOs (Data Transfer Objects) with class-validator.

## Setup

```bash
npm i class-validator class-transformer
```

### Global Validation Pipe

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,            // Strip non-decorated properties
  forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
  transform: true,            // Transform payloads to DTO instances
}));
```

## DTO with class-validator

```typescript
import { IsString, IsInt, IsOptional, Min, Max, IsEmail, IsEnum, IsDateString, ValidateNested, IsArray, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCatDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsEmail()
  email: string;

  @IsEnum(CatStatus)
  status: CatStatus;

  @IsDateString()
  birthDate: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags: TagDto[];
}
```

## Validation Decorators

### String

| Decorator | Description |
|-----------|-------------|
| `@IsString()` | Must be string |
| `@MinLength(min)` | Minimum length |
| `@MaxLength(max)` | Maximum length |
| `@Matches(regex)` | Match regex pattern |
| `@IsEmail()` | Valid email |
| `@IsUrl()` | Valid URL |
| `@IsUUID()` | Valid UUID |
| `@Contains(value)` | Contains value |
| `@IsAlpha()` | Only letters |
| `@IsAlphanumeric()` | Only letters and numbers |

### Number

| Decorator | Description |
|-----------|-------------|
| `@IsInt()` | Must be integer |
| `@IsNumber()` | Must be number |
| `@Min(value)` | Minimum value |
| `@Max(value)` | Maximum value |
| `@IsPositive()` | Must be positive |
| `@IsNegative()` | Must be negative |

### Boolean

| Decorator | Description |
|-----------|-------------|
| `@IsBoolean()` | Must be boolean |
| `@IsNotEmpty()` | Cannot be empty |

### Date

| Decorator | Description |
|-----------|-------------|
| `@IsDateString()` | Valid ISO date string |
| `@IsDate()` | Must be Date object |
| `@MinDate(date)` | Minimum date |
| `@MaxDate(date)` | Maximum date |

### Array

| Decorator | Description |
|-----------|-------------|
| `@IsArray()` | Must be array |
| `@ArrayMinSize(min)` | Minimum array size |
| `@ArrayMaxSize(max)` | Maximum array size |
| `@Contains(value)` | Array contains value |
| `@IsIn(values)` | Value must be in array |

### Object

| Decorator | Description |
|-----------|-------------|
| `@ValidateNested()` | Validate nested object |
| `@IsObject()` | Must be object |
| `@IsNotEmpty()` | Cannot be empty |

### Generic

| Decorator | Description |
|-----------|-------------|
| `@IsOptional()` | Field is optional |
| `@IsDefined()` | Field must be defined |
| `@IsIn(values)` | Value must be in array |
| `@IsEnum(Enum)` | Must be valid enum value |
| `@Equals(value)` | Must equal value |
| `@NotEquals(value)` | Must not equal value |

## Nested Validation

```typescript
export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  zipCode: string;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

## Array Validation

```typescript
export class CreatePostDto {
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  comments: CommentDto[];
}
```

## Custom Validation

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordStrong', async: false })
export class IsPasswordStrong implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 8 characters with uppercase and number';
  }
}

// Usage
export class CreateUserDto {
  @IsPasswordStrong()
  password: string;
}
```

## Transform

```typescript
import { Transform, Type } from 'class-transformer';

export class CreateCatDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  name: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  age: number;

  @Type(() => Number)
  @IsNumber()
  weight: number;

  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  breed: string;
}
```

## Swagger Integration

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty({ example: 'Kitty', description: 'Cat name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 2, minimum: 0, maximum: 30 })
  @IsInt()
  @IsOptional()
  age?: number;
}
```
