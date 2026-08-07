# NestJS Best Practices

## 1. Project Structure

```
src/
├── cats/
│   ├── dto/
│   │   ├── create-cat.dto.ts
│   │   ├── update-cat.dto.ts
│   │   └── query-cat.dto.ts
│   ├── entities/
│   │   └── cat.entity.ts
│   ├── cats.controller.ts
│   ├── cats.module.ts
│   ├── cats.service.ts
│   └── cats.controller.spec.ts
├── common/
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── pipes/
│       └── parse-mongo-id.pipe.ts
├── config/
│   ├── app.config.ts
│   └── database.config.ts
├── app.module.ts
└── main.ts
```

## 2. Naming Conventions

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

## 3. Keep Controllers Thin

```typescript
// BAD - Business logic in controller
@Controller('cats')
export class CatsController {
  @Post()
  async create(@Body() dto: CreateCatDto) {
    if (dto.age < 0) throw new BadRequestException('Age must be positive');
    const cat = await this.catsRepository.create(dto);
    await this.catsRepository.save(cat);
    await this.emailService.sendWelcome(cat);
    return cat;
  }
}

// GOOD - Controller delegates to service
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }
}
```

## 4. Use DTOs for Validation

```typescript
// Always validate input
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));

// Use DTOs, not raw objects
@Post()
create(@Body() dto: CreateCatDto) {}  // Validated automatically
```

## 5. Prefer Constructor Injection

```typescript
// GOOD
@Injectable()
export class CatsService {
  constructor(
    private readonly repository: CatsRepository,
    private readonly config: ConfigService,
  ) {}
}

// AVOID
@Injectable()
export class CatsService {
  @InjectRepository(Cat)
  private repository: CatsRepository;

  @Inject(ConfigService)
  private config: ConfigService;
}
```

## 6. Use APP_* Tokens for Globals

```typescript
// In module, not main.ts
@Module({
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
```

## 7. Use Custom Decorators

```typescript
// Extract repeated logic
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);

// Usage
@Get()
findOne(@User('id') userId: string) {}
```

## 8. Handle Errors with Filters

```typescript
// Throw NestJS exceptions
throw new NotFoundException('Cat not found');
throw new BadRequestException('Invalid data');
throw new ForbiddenException();

// Custom filters for logging
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    // Log error
    this.logger.error(`${exception.message}`, exception.stack);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## 9. Test with Unit Tests

```typescript
// Test each layer independently
// Service test - no HTTP
describe('CatsService', () => {
  it('should create a cat', async () => {
    const result = await service.create(dto);
    expect(result).toBeDefined();
  });
});

// Controller test - mock service
describe('CatsController', () => {
  it('should call service.create', async () => {
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
```

## 10. Externalize Configuration

```typescript
// Use @nestjs/config
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
  ],
})
export class AppModule {}

// Access config
@Injectable()
export class CatsService {
  constructor(private config: ConfigService) {}
}
```

## Performance Tips

### Enable CORS

```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

### Use Fastify

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
```

### Enable Compression

```typescript
import compression from 'compression';
app.use(compression());
```

### SWC Builder

```bash
npm run start -- -b swc
```

## Security

### Rate Limiting

```bash
npm i @nestjs/throttler
```

```typescript
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
})
export class AppModule {}

// Global guard
providers: [
  { provide: APP_GUARD, useClass: ThrottlerGuard },
]
```

### Helmet

```bash
npm i helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

### CSRF Protection

```bash
npm i csurf
```

### Input Sanitization

```typescript
// Use class-validator with whitelist
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
}));
```

## Logging

```typescript
// Use built-in Logger
import { Logger } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly logger = new Logger(CatsService.name);

  findAll() {
    this.logger.log('Finding all cats');
    this.logger.warn('Low memory');
    this.logger.error('Database error', error.stack);
  }
}
```

## Documentation

```bash
npm i @nestjs/swagger
```

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Cats API')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```
