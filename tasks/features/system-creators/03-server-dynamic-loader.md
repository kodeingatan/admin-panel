# 03 — Server: Dynamic Module Loader

## Goal

Buat loader yang membaca registry → load generated modules saat startup → register ke NestJS + TypeORM.

## Files to Create

### 1. Dynamic Loader

**File**: `server/src/modules/generated/_dynamic-loader.ts`

Responsibilities:
- Read `sc_modules` table (or JSON fallback) at startup
- Require compiled .js files from `sc_{name}/` directories
- Return array of NestJS modules to import into AppModule
- Return array of entities to register with TypeORM

```typescript
import * as fs from 'fs';
import * as path from 'path';

const GENERATED_DIR = path.join(__dirname);

export function loadGeneratedModules(): { modules: any[]; entities: Function[] } {
  const modules: any[] = [];
  const entities: Function[] = [];

  // Read registry from JSON fallback (DB not available yet at this point)
  const registryPath = path.join(GENERATED_DIR, 'sc-modules-registry.json');
  if (!fs.existsSync(registryPath)) {
    return { modules: [], entities: [] };
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

  for (const mod of registry) {
    if (!mod.isActive) continue;

    try {
      const modulePath = path.join(GENERATED_DIR, `sc_${mod.name}`, `${mod.name}.module`);
      const entityPath = path.join(GENERATED_DIR, `sc_${mod.name}`, 'entities', `${mod.name}.entity`);

      const modModule = require(modulePath);
      const modEntity = require(entityPath);

      // NestJS module class is the named export ending with 'Module'
      const moduleClass = Object.values(modModule).find(
        (v: any) => typeof v === 'function' && v.name.endsWith('Module')
      );
      const entityClass = Object.values(modEntity).find(
        (v: any) => typeof v === 'function' && v.name.endsWith('Entity') || v.prototype?.constructor?.name?.endsWith('') 
      );

      if (moduleClass) modules.push(moduleClass);
      if (entityClass) entities.push(entityClass);
    } catch (error) {
      console.error(`Failed to load generated module "${mod.name}":`, error.message);
    }
  }

  return { modules, entities };
}
```

### 2. Barrel Export

**File**: `server/src/modules/generated/index.ts`

```typescript
export { loadGeneratedModules } from './_dynamic-loader';
```

### 3. GeneratedModulesModule

**File**: `server/src/modules/generated/generated-modules.module.ts`

```typescript
import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class GeneratedModulesModule {
  static forRoot(modules: any[]): DynamicModule {
    return {
      module: GeneratedModulesModule,
      imports: modules,
      exports: modules,
    };
  }
}
```

## Files to Modify

### 4. `server/src/main.ts`

Add dynamic module loading before NestFactory.create():

```typescript
import { loadGeneratedModules } from '@/modules/generated';

async function bootstrap() {
  // Load generated modules
  const { modules: generatedModules, entities: generatedEntities } = loadGeneratedModules();

  // Pass to AppModule via environment or dynamic import
  // Option: Use a module registry singleton
  process.env.SC_GENERATED_MODULES = JSON.stringify(
    generatedModules.map(m => m.name)
  );

  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  // ...
}
```

### 5. `server/src/app.module.ts`

```typescript
import { loadGeneratedModules } from '@/modules/generated';
import { GeneratedModulesModule } from '@/modules/generated/generated-modules.module';

const { modules: generatedModules, entities: generatedEntities } = loadGeneratedModules();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [...builtinEntities, ...generatedEntities],
      // ...
    }),
    GeneratedModulesModule.forRoot(generatedModules),
    // ... other modules
  ],
})
export class AppModule {}
```

## Loading Flow

```
1. main.ts starts
2. loadGeneratedModules() reads sc-modules-registry.json
3. For each active module:
   a. require('sc_{name}/{name}.module') → get module class
   b. require('sc_{name}/entities/{name}.entity') → get entity class
   c. Add to modules[] and entities[] arrays
4. AppModule receives:
   a. TypeOrmModule.forRoot({ entities: [...builtin, ...generated] })
   b. GeneratedModulesModule.forRoot(generatedModules)
5. TypeORM synchronize: true creates tables from entity metadata
6. NestJS registers generated controllers + services
7. API endpoints available at /api/generated/{name}/...
```

## Verification

- [ ] Loader reads JSON registry correctly
- [ ] Loader skips inactive modules
- [ ] Loader handles missing .js files gracefully (logs error, continues)
- [ ] Generated entities added to TypeORM entity list
- [ ] Generated modules imported into NestJS app
- [ ] TypeORM creates tables for generated entities
- [ ] Generated CRUD endpoints accessible at `/api/generated/{name}/`
- [ ] Server starts without errors when no modules generated yet
- [ ] Server starts without errors with multiple generated modules
