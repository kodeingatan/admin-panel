# NestJS Dynamic Modules

## Overview

Dynamic modules allow creating modules that can be configured at runtime.

## Basic Dynamic Module

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
```

## Usage

```typescript
@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

## Global Dynamic Module

```typescript
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```

## Re-export Dynamic Module

```typescript
@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```

## ConfigurableModuleBuilder

```typescript
// config.module-definition.ts
import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConfigModuleOptions } from './interfaces/config-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
```

### Module Class

```typescript
// config.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigurableModuleClass } from './config.module-definition';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}
```

### Custom Method Name

```typescript
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
```

### Custom Factory Method Name

```typescript
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>()
    .setFactoryMethodName('createConfigOptions')
    .build();
```

### Extra Options

```typescript
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>()
    .setExtras(
      { isGlobal: true },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();
```

### Extending Auto-generated Methods

```typescript
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      ...super.register(options),
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.registerAsync(options),
    };
  }
}
```

## Guidelines

| Method | Use Case |
|--------|----------|
| `register` | Specific configuration for single module |
| `forRoot` | Global configuration, reused across app |
| `forFeature` | Use `forRoot` config with module-specific overrides |

All have async counterparts: `registerAsync`, `forRootAsync`, `forFeatureAsync`.

## registerAsync Options

```typescript
{
  useClass?: Type<OptionsFactory>;       // Class with create() method
  useFactory?: (...args) => Promise<Options> | Options;  // Factory function
  inject?: FactoryProvider['inject'];    // Dependencies for factory
  useExisting?: Type<OptionsFactory>;    // Existing provider
}
```
