# NestJS Custom Decorators

## Overview

Nest is built around decorators. You can create custom param decorators and composition decorators.

## Param Decorators

### Basic Custom Decorator

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Usage
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

### With Data Parameter

```typescript
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// Usage
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

### Working with Pipes

```typescript
@Get()
async findOne(
  @User(new ValidationPipe({ validateCustomDecorators: true }))
  user: UserEntity,
) {
  console.log(user);
}
```

## Decorator Composition

### Using applyDecorators

```typescript
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

// Usage
@Get('users')
@Auth('admin')
findAllUsers() {}
```

### Multiple Decorators

```typescript
export function ApiPaginated() {
  return applyDecorators(
    ApiOkResponse({ type: PaginatedResponse }),
    ApiQuery({ name: 'page', required: false }),
    ApiQuery({ name: 'limit', required: false }),
  );
}
```

## SetMetadata

```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// Usage
@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {}
```

## Reflector

```typescript
// Access metadata in guards/interceptors
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    // Check user roles
  }
}
```

## Common Patterns

### Route Metadata

```typescript
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// In guard
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    // Validate JWT
  }
}

// Usage
@Public()
@Get()
findAll() {}
```

### Cache Decorator

```typescript
export const CacheKey = (key: string) => SetMetadata('cacheKey', key);
export const CacheTTL = (ttl: number) => SetMetadata('cacheTTL', ttl);

// Usage
@CacheKey('cats')
@CacheTTL(60)
@Get()
findAll() {}
```
