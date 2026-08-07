---
name: nestjs
description: Build scalable server-side applications with NestJS. Covers core concepts, controllers, services, providers, modules, dependency injection, pipes, guards, interceptors, exception filters, dynamic modules, validation, configuration, and database integration with best practices.
license: MIT
metadata:
  author: openai-codex
  version: "1.0.0"
---

# NestJS Skill

Build efficient, scalable Node.js server-side applications with NestJS.

## When to Use

- Building REST or GraphQL APIs with NestJS
- Creating modular, maintainable backend architectures
- Implementing authentication, authorization, and validation
- Integrating databases (TypeORM, Prisma, Mongoose)
- Building microservices and message-driven architectures
- Configuring dynamic and reusable modules

## Quick Start

### Installation

```bash
npm i -g @nestjs/cli
nest new project-name
nest new project-name --strict  # With strict TypeScript
```

### Project Structure

```
src/
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

### Bootstrap

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## References

| Topic | File |
|-------|------|
| Core Concepts & First Steps | `references/core.md` |
| Controllers & Routing | `references/controllers.md` |
| Providers & Services | `references/providers.md` |
| Modules & Dependency Injection | `references/modules.md` |
| Pipes, Guards, Interceptors | `references/pipes-guards-interceptors.md` |
| Exception Filters | `references/exception-filters.md` |
| Dynamic Modules | `references/dynamic-modules.md` |
| Custom Decorators | `references/custom-decorators.md` |
| Validation & DTOs | `references/validation.md` |
| Configuration | `references/configuration.md` |
| Database (TypeORM/Prisma) | `references/database.md` |
| Authentication & Security | `references/authentication.md` |
| Microservices | `references/microservices.md` |
| Testing | `references/testing.md` |
| Best Practices | `references/best-practices.md` |

## Architecture

### NestJS Request Lifecycle

```
Request → Middleware → Guards → Interceptors (before) → Pipes → Controller → Interceptors (after) → Exception Filters → Response
```

### Core Building Blocks

| Building Block | Decorator | Interface | Purpose |
|---------------|-----------|-----------|---------|
| **Controller** | `@Controller()` | — | Handle HTTP requests |
| **Provider/Service** | `@Injectable()` | — | Business logic, data access |
| **Module** | `@Module()` | — | Organize code boundaries |
| **Pipe** | `@Injectable()` | `PipeTransform` | Transform/validate input |
| **Guard** | `@Injectable()` | `CanActivate` | Authorization |
| **Interceptor** | `@Injectable()` | `NestInterceptor` | AOP, response mapping |
| **Filter** | `@Catch()` | `ExceptionFilter` | Exception handling |
| **Decorator** | `@SetMetadata()` | — | Attach custom metadata |

### Provider Types

| Type | Use Case | Example |
|------|----------|---------|
| `useClass` | Standard DI | `{ provide: Service, useClass: Service }` |
| `useValue` | Constants, mocks | `{ provide: 'CONFIG', useValue: config }` |
| `useFactory` | Dynamic creation | `{ provide: 'DB', useFactory: (opts) => createConnection(opts), inject: [...] }` |
| `useExisting` | Aliases | `{ provide: 'Alias', useExisting: Service }` |

### Global Registration Tokens

| Token | Purpose |
|-------|---------|
| `APP_GUARD` | Global guard |
| `APP_PIPE` | Global pipe |
| `APP_INTERCEPTOR` | Global interceptor |
| `APP_FILTER` | Global exception filter |

## Core Concepts

### Dependency Injection

```typescript
@Injectable()
export class CatsService {
  private cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }
}

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll(): Cat[] {
    return this.catsService.findAll();
  }
}
```

### Controller Patterns

```typescript
@Controller('cats')
export class CatsController {
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Get()
  findAll(@Query() query: ListAllDto) {
    return this.catsService.findAll(query);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCatDto) {
    return this.catsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.remove(id);
  }
}
```

### Module Structure

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

### Custom Providers

```typescript
// Value provider
{ provide: 'CONFIG', useValue: appConfig }

// Factory provider
{
  provide: 'DATABASE',
  useFactory: (configService: ConfigService) => {
    return createDatabaseConnection(configService.get('DB_HOST'));
  },
  inject: [ConfigService],
}

// Class provider
{ provide: LoggerService, useClass: PinoLoggerService }

// Alias provider
{ provide: 'AppLogger', useExisting: LoggerService }
```

### Pipes

```typescript
// Built-in pipes
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}

@Get()
findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {}

// Validation pipe (global)
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));

// Custom pipe
@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid MongoID`);
    }
    return value;
  }
}
```

### Guards

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some(role => user.roles?.includes(role));
  }
}

// Usage
@Post()
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
create() {}
```

### Interceptors

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`Execution time: ${Date.now() - now}ms`)),
    );
  }
}

// Response mapping
@Injectable()
export class TransformInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<{ data: T }> {
    return next.handle().pipe(map(data => ({ data })));
  }
}
```

### Exception Filters

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
```

### Dynamic Modules

```typescript
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        { provide: 'DB_OPTIONS', useValue: options },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}

// Usage
@Module({
  imports: [DatabaseModule.forRoot({ host: 'localhost', port: 5432 })],
})
export class AppModule {}
```

### Custom Decorators

```typescript
// Param decorator
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// Usage
@Get()
findOne(@User() user: UserEntity) {}
@Get()
findEmail(@User('email') email: string) {}

// Composition decorator
export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}

@Get('admin')
@Auth('admin')
adminRoute() {}
```

### Validation with class-validator

```typescript
// DTO
export class CreateCatDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  @IsOptional()
  breed?: string;
}

// Global setup
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

## Best Practices

### Project Structure

```
src/
├── cats/
│   ├── dto/
│   │   ├── create-cat.dto.ts
│   │   └── update-cat.dto.ts
│   ├── entities/
│   │   └── cat.entity.ts
│   ├── cats.controller.ts
│   ├── cats.module.ts
│   ├── cats.service.ts
│   └── cats.controller.spec.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
├── app.module.ts
└── main.ts
```

### 10 Best Practices

1. **One module per feature** — Group related controllers, services, and entities
2. **Use DTOs for validation** — Never accept raw request objects directly
3. **Enable global ValidationPipe** — Whitelist and transform options
4. **Prefer constructor injection** — Avoid `@Inject()` when possible
5. **Use `APP_*` tokens for globals** — Register pipes, guards, interceptors, filters in modules
6. **Keep controllers thin** — Delegate business logic to services
7. **Use custom decorators** — Extract repeated logic from handlers
8. **Handle errors with filters** — Don't throw raw errors, use NestJS exceptions
9. **Test with unit tests** — Controller and service tests with Jest
10. **Use ConfigModule** — Externalize configuration with `@nestjs/config`

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Module | `*.module.ts` | `cats.module.ts` |
| Controller | `*.controller.ts` | `cats.controller.ts` |
| Service | `*.service.ts` | `cats.service.ts` |
| DTO | `*.dto.ts` | `create-cat.dto.ts` |
| Entity | `*.entity.ts` | `cat.entity.ts` |
| Guard | `*.guard.ts` | `roles.guard.ts` |
| Pipe | `*.pipe.ts` | `parse-int.pipe.ts` |
| Interceptor | `*.interceptor.ts` | `logging.interceptor.ts` |
| Filter | `*.filter.ts` | `http-exception.filter.ts` |
| Decorator | `*.decorator.ts` | `user.decorator.ts` |

### Performance Tips

```typescript
// Enable CORS
app.enableCors({ origin: 'http://localhost:3000' });

// Use fastify for better performance
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);

// Enable compression
import compression from 'compression';
app.use(compression());

// Use SWC for faster builds
// npm run start -- -b swc
```

## Dependencies

**Required:**
- `@nestjs/common` — Core decorators and utilities
- `@nestjs/core` — Core framework
- `@nestjs/platform-express` — Express adapter (default)

**Common:**
- `@nestjs/config` — Configuration management
- `@nestjs/typeorm` — TypeORM integration
- `@nestjs/mongoose` — Mongoose/MongoDB integration
- `@nestjs/swagger` — OpenAPI/Swagger documentation
- `@nestjs/jwt` — JWT authentication
- `@nestjs/passport` — Passport.js integration
- `class-validator` — DTO validation
- `class-transformer` — Object transformation

## CLI Commands

```bash
nest new <name>              # Create new project
nest g module <name>         # Generate module
nest g controller <name>     # Generate controller
nest g service <name>        # Generate service
nest g resource <name>       # Generate full CRUD resource
nest g filter <name>         # Generate exception filter
nest g guard <name>          # Generate guard
nest g interceptor <name>    # Generate interceptor
nest g pipe <name>           # Generate pipe
nest g decorator <name>      # Generate custom decorator
```
