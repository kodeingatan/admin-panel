# NestJS Providers & Services

## Providers

Providers are a fundamental concept in Nest. Many basic Nest classes may be treated as providers — services, repositories, factories, helpers, etc.

### Injectable

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }
}
```

### Standard Providers

```typescript
// Short-hand
providers: [CatsService]

// Full syntax
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
]
```

### Custom Providers

#### Value Providers: `useValue`

```typescript
const mockCatsService = {
  /* mock implementation */
};

providers: [
  {
    provide: CatsService,
    useValue: mockCatsService,
  },
]
```

#### Non-class-based Provider Tokens

```typescript
providers: [
  {
    provide: 'CONNECTION',
    useValue: connection,
  },
]

// Inject with @Inject()
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

#### Class Providers: `useClass`

```typescript
const configServiceProvider = {
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === 'development'
      ? DevelopmentConfigService
      : ProductionConfigService,
};
```

#### Factory Providers: `useFactory`

```typescript
const connectionProvider = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: MyOptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [MyOptionsProvider],
};
```

#### Alias Providers: `useExisting`

```typescript
const loggerAliasProvider = {
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};
```

### Export Custom Provider

```typescript
// Using token
@Module({
  providers: [connectionFactory],
  exports: ['CONNECTION'],
})
export class AppModule {}

// Using full provider object
@Module({
  providers: [connectionFactory],
  exports: [connectionFactory],
})
export class AppModule {}
```

### Interfaces and Abstract Classes

```typescript
// Symbol token for interface
export const LOGGER_SERVICE = Symbol('LOGGER_SERVICE');

@Module({
  providers: [
    {
      provide: LOGGER_SERVICE,
      useClass: PinoLoggerService,
    },
  ],
})
export class AppModule {}

// Abstract class as both contract and token
export abstract class LoggerService {
  abstract log(message: string): void;
}

@Module({
  providers: [
    {
      provide: LoggerService,
      useClass: PinoLoggerService,
    },
  ],
})
export class AppModule {}
```

### Non-Service Based Providers

```typescript
const configFactory = {
  provide: 'CONFIG',
  useFactory: () => {
    return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
  },
};
```

### Dependency Injection

```typescript
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }
}

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

### Register Provider in Module

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
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
