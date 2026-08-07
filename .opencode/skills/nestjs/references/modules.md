# NestJS Modules & Dependency Injection

## Modules

A module is a class annotated with `@Module()` decorator. Every Nest application has at least one module — the **root module**.

### @Module Decorator

```typescript
@Module({
  providers: [],    // Providers instantiated by Nest injector
  controllers: [], // Controllers to instantiate
  imports: [],      // Modules that export required providers
  exports: [],      // Providers available to other modules
})
export class AppModule {}
```

### Feature Module

```typescript
// cats/cats.module.ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

// app.module.ts
@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

### Shared Modules

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // Export to make available to other modules
})
export class CatsModule {}
```

### Module Re-exporting

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

### Dependency Injection in Modules

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

### Global Modules

```typescript
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

### Dynamic Modules

```typescript
@Module({})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

// Import dynamic module
@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

### Global Dynamic Module

```typescript
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```

### Re-export Dynamic Module

```typescript
@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```

## Dependency Injection

### Constructor Injection

```typescript
@Injectable()
export class CatsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}
}
```

### Custom Providers in DI

```typescript
// String token
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}

// Symbol token
@Injectable()
export class CatsService {
  constructor(@Inject(LOGGER_SERVICE) private readonly logger: LoggerService) {}
}
```

### Injection Scopes

```typescript
// Default: SINGLETON
@Injectable()
export class CatsService {}

// REQUEST scope (new instance per request)
@Injectable()
export class CatsService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
}

// TRANSIENT scope (new instance per consumer)
@Transient()
@Injectable()
export class CatsService {}
```

### Circular Dependencies

```typescript
// Forward reference
@Module({
  imports: [forwardRef(() => CommonModule)],
})
export class CoreModule {}

// Or use @Inject forwardRef
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => DogsService))
    private dogsService: DogsService,
  ) {}
}
```
