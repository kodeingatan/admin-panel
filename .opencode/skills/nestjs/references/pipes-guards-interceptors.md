# NestJS Pipes, Guards & Interceptors

## Pipes

Pipes transform input data or validate it before reaching the route handler.

### Built-in Pipes

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`
- `ParseDatePipe`

### Binding Pipes

```typescript
// Parameter-level
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}

// Query parameter
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}

// With options
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {}

// Method-level
@Post()
@UsePipes(new ValidationPipe())
async create(@Body() createCatDto: CreateCatDto) {}
```

### Custom Pipe

```typescript
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

### Global Pipe

```typescript
// In main.ts
app.useGlobalPipes(new ValidationPipe());

// In module (recommended for DI)
@Module({
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
```

### Zod Validation Pipe

```typescript
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}

// Usage
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {}
```

### DefaultValuePipe

```typescript
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {}
```

## Guards

Guards determine whether a request will be handled by the route handler (authorization).

### Basic Guard

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

### Binding Guards

```typescript
// Controller-level
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}

// Method-level
@Get()
@UseGuards(RolesGuard)
findAll() {}

// Global
app.useGlobalGuards(new RolesGuard());

// In module
@Module({
  providers: [
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
```

### Role-based Guard

```typescript
// roles.decorator.ts
export const Roles = Reflector.createDecorator<string[]>();

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}

// Usage
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {}
```

## Interceptors

Interceptors implement AOP — bind logic before/after method execution, transform results/exceptions.

### Basic Interceptor

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
    );
  }
}
```

### Binding Interceptors

```typescript
// Controller-level
@UseInterceptors(LoggingInterceptor)
export class CatsController {}

// Method-level
@Get()
@UseInterceptors(LoggingInterceptor)
findAll() {}

// Global
app.useGlobalInterceptors(new LoggingInterceptor());

// In module
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
```

### Response Mapping

```typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}

// Response: { data: originalData }
```

### Exception Mapping

```typescript
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => throwError(() => new BadGatewayException())),
    );
  }
}
```

### Cache Interceptor

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) return of([]);
    return next.handle();
  }
}
```

### Timeout Interceptor

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
```
