# 01 — Server: Registry Module

## Goal

Buat module `system-creators` di server yang berfungsi sebagai registry untuk semua module yang dibuat oleh CRUD Generator.

## Files to Create

### 1. Entity: `sc-modules`

**File**: `server/src/modules/system-creators/entities/sc-module.entity.ts`

```typescript
@Entity('sc_modules')
export class ScModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;                    // snake_case, e.g. "product"

  @Column()
  label: string;                   // Display name, e.g. "Product"

  @Column()
  routePath: string;               // e.g. "/dashboard/products"

  @Column()
  menuLabel: string;               // e.g. "Products"

  @Column({ default: 'admin' })
  accessLevel: string;             // 'public' | 'admin' | 'granular'

  @Column({ type: 'text', nullable: true })
  accessRoles: string;             // JSON array of role names

  @Column({ type: 'text', nullable: true })
  accessPermissions: string;       // JSON array of permission names

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text' })
  fieldsConfig: string;            // JSON — full field definitions

  @Column({ type: 'text', nullable: true })
  relationsConfig: string;         // JSON — relation definitions

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Registry Service

**File**: `server/src/modules/system-creators/services/sc-registry.service.ts`

Responsibilities:
- CRUD operations on `sc_modules` table
- Sync with JSON backup file (`server/src/modules/generated/sc-modules-registry.json`)
- Find by name, find by ID, find all active
- Toggle active status
- Delete (soft — mark inactive)
- Load all active modules for dynamic loader

Key methods:
```typescript
findAll(): Promise<ScModule[]>
findAllActive(): Promise<ScModule[]>
findOne(id: number): Promise<ScModule>
findByName(name: string): Promise<ScModule>
create(data: CreateScModuleDto): Promise<ScModule>
update(id: number, data: UpdateScModuleDto): Promise<ScModule>
remove(id: number): Promise<void>  // soft delete
toggleActive(id: number): Promise<ScModule>
syncJsonBackup(): Promise<void>    // write JSON backup
loadFromJsonBackup(): Promise<ScModule[]>  // fallback if DB corrupt
```

### 3. Controller

**File**: `server/src/modules/system-creators/controllers/system-creators.controller.ts`

```
GET    /api/system-creators/registry              → List all modules
GET    /api/system-creators/registry/:id          → Get by ID
GET    /api/system-creators/registry/by-name/:name → Get by name
POST   /api/system-creators/generate              → Generate new module
PUT    /api/system-creators/:id                   → Update module config
DELETE /api/system-creators/:id                   → Delete module
POST   /api/system-creators/:id/toggle            → Toggle active/inactive
```

All endpoints:
- `@Permissions('System Creators', 'Full Access')`
- `@Roles('Super Admin')`

### 4. DTOs

**File**: `server/src/modules/system-creators/dto/create-sc-module.dto.ts`

```typescript
export class CreateScModuleDto {
  @IsString() @Matches(/^[a-z][a-z0-9_]*$/)
  name: string;

  @IsString()
  label: string;

  @IsString()
  menuLabel: string;

  @IsString() @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScFieldConfigDto)
  fields: ScFieldConfigDto[];

  @IsArray() @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ScRelationConfigDto)
  relations?: ScRelationConfigDto[];

  @IsIn(['public', 'admin', 'granular'])
  accessLevel: string;

  @IsArray() @IsOptional()
  accessRoles?: string[];

  @IsArray() @IsOptional()
  accessPermissions?: string[];
}
```

**File**: `server/src/modules/system-creators/dto/update-sc-module.dto.ts`
- PartialType of CreateScModuleDto

**File**: `server/src/modules/system-creators/dto/query-sc-module.dto.ts`
- Extends QueryDto (page, limit, search, sortBy, sortOrder)

### 5. Module

**File**: `server/src/modules/system-creators/system-creators.module.ts`

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([ScModule]),
    ActivityLogsModule,
  ],
  controllers: [SystemCreatorsController],
  providers: [ScRegistryService, ScGeneratorService],
  exports: [ScRegistryService, ScGeneratorService],
})
export class SystemCreatorsModule {}
```

## Files to Modify

### 6. `server/src/app.module.ts`

- Import `SystemCreatorsModule`
- Add `ScModule` to TypeORM entities array

## Verification

- [ ] `npm run build` succeeds
- [ ] `npm run start:dev` starts without errors
- [ ] `sc_modules` table created in SQLite
- [ ] GET `/api/system-creators/registry` returns `[]`
- [ ] POST `/api/system-creators/generate` with test data returns created module
- [ ] JSON backup file created at `server/src/modules/generated/sc-modules-registry.json`
- [ ] Only Super Admin can access endpoints (test with non-admin user → 403)
