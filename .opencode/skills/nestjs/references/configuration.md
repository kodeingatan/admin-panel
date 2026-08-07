# NestJS Configuration

## @nestjs/config

```bash
npm i @nestjs/config
```

### Setup

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,          // Available globally
      envFilePath: '.env',     // Custom env path
      load: [databaseConfig],  // Custom config files
    }),
  ],
})
export class AppModule {}
```

### Usage

```typescript
@Injectable()
export class CatsService {
  constructor(private configService: ConfigService) {}

  findAll() {
    const dbHost = this.configService.get<string>('DATABASE_HOST');
    const port = this.configService.get<number>('DATABASE_PORT', 5432);
    const dbConfig = this.configService.get('database');
  }
}
```

## Custom Config Files

```typescript
// config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
}));
```

## Validation

```typescript
import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;
}

// In ConfigModule
ConfigModule.forRoot({
  validate: (config) => {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  },
});
```

## Namespace Config

```typescript
// config/app.config.ts
export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'My App',
  port: parseInt(process.env.PORT, 10) || 3000,
}));
```

```typescript
// Usage
@Injectable()
export class CatsService {
  constructor(private configService: ConfigService) {}

  getPort() {
    return this.configService.get('app.port');
  }
}
```

## Environment-specific Config

```typescript
// .env.development
DATABASE_HOST=localhost
DATABASE_PORT=5432

// .env.production
DATABASE_HOST=prod-db.example.com
DATABASE_PORT=5432

// ConfigModule
ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV}`,
});
```

## Dynamic Config (Async)

```typescript
@Module({
  imports: [
    ConfigModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        load: [databaseConfig],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Testing with Config

```typescript
// In tests
process.env.DATABASE_HOST = 'test-host';
process.env.DATABASE_PORT = '5432';

const module = await Test.createTestingModule({
  imports: [ConfigModule.forRoot()],
}).compile();
```
