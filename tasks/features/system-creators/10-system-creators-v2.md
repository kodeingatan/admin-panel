# System Creators v2 — Implementation Plan

## Ringkasan Perubahan

### Perbaikan (Bug Fixes)
1. Menu item generated SC modules tampil putih → tampilkan tabel browse
2. Generated SC modules tidak bisa CRUD → pastikan CRUD berfungsi
3. Sidebar "Admin" > "System Creators" tidak ada icon → tambahkan icon

### Pembaruan (Features)
1. SC modules tidak disimpan di database → hanya JSON
2. Menu item generated modules di luar group (top-level)
3. Menu label format menentukan grouping (`{group}_{name}`)
4. Rename `generated` → `managements`
5. Field type baru: `select-relation`, `multiple-select-relation`
6. Step baru: Layout Configuration (browse, create, update)

---

## Phase 1: Server — Remove Database Storage

### 1.1 Hapus Tabel sc_modules
**File**: `server/src/modules/system-creators/entities/sc-module.entity.ts`
- Hapus entity `ScModule` (atau keep sebagai interface saja)
- Hapus TypeORM configuration untuk `sc_modules`

**File**: `server/src/modules/system-creators/system-creators.module.ts`
- Hapus `TypeOrmModule.forFeature([ScModule])`
- Hapus import entity

**File**: `server/src/app.module.ts`
- Hapus `ScModule` dari TypeORM entities array

### 1.2 Update ScRegistryService
**File**: `server/src/modules/system-creators/services/sc-registry.service.ts`
- Hapus dependency `@InjectRepository(ScModule)`
- Hapus semua query database (createQueryBuilder, find, save, remove)
- Ganti dengan baca/tulis JSON file langsung
- `findAll()` → baca JSON, filter, paginate di memori
- `findByName()` → baca JSON, find by name
- `create()` → baca JSON, tambah entry, tulis JSON
- `update()` → baca JSON, update entry, tulis JSON
- `remove()` → baca JSON, set isActive=false, tulis JSON
- `toggleActive()` → baca JSON, toggle isActive, tulis JSON
- Hapus `syncJsonBackup()` (JSON jadi primary)
- Hapus `loadFromJsonBackup()` (tidak perlu lagi)

### 1.3 Update ScGeneratorService
**File**: `server/src/modules/system-creators/services/sc-generator.service.ts`
- Hapus dependency `@InjectRepository(ScModule)`
- Update `GENERATED_DIR` path ke `managements`
- Tambahkan generate untuk field type `select-relation` dan `multiple-select-relation`
- Tambahkan generate untuk `layoutConfig`

### 1.4 Update Controller
**File**: `server/src/modules/system-creators/controllers/system-creators.controller.ts`
- `GET /api/system-creators/registry/by-name/:name` → ubah dari `@Roles('Super Admin')` ke hanya `@Public()` atau tanpa role check (butuh autentikasi saja)
- Endpoint lain tetap `@Roles('Super Admin')`

### 1.5 Rename Folder
- Rename `server/src/modules/generated/` → `server/src/modules/managements/`
- Update semua import path yang merujuk ke `generated`

### 1.6 Update Dynamic Loader
**File**: `server/src/modules/managements/_dynamic-loader.ts`
- Update `SRC_GENERATED_DIR` path ke `managements`

---

## Phase 2: Server — New Field Types

### 2.1 Update COLUMN_MAP
**File**: `server/src/modules/system-creators/services/sc-generator.service.ts`

```typescript
// Tambahkan:
'select-relation': () => `type: 'integer', nullable: true`,
'multiple-select-relation': () => `type: 'text'`,
```

### 2.2 Update TS_TYPE_MAP
```typescript
'select-relation': 'number',
'multiple-select-relation': 'number[]',
```

### 2.3 Update VALIDATOR_MAP
```typescript
'select-relation': () => ['@IsOptional()', '@IsNumber()'],
'multiple-select-relation': () => ['@IsOptional()', '@IsArray()'],
```

### 2.4 Update Entity Generator
- `select-relation`: Generate `@Column({ type: 'integer', nullable: true })` + `@ManyToOne` relation
- `multiple-select-relation`: Generate `@Column({ type: 'text', nullable: true })` + custom getter/setter untuk JSON array

### 2.5 Update Service Generator
- `select-relation`: Handle relation loading in `findAll()` with `leftJoinAndSelect`
- `multiple-select-relation`: Parse JSON storage, batch load related entities

---

## Phase 3: Server — Layout Configuration

### 3.1 Update CreateScModuleDto
**File**: `server/src/modules/system-creators/dto/create-sc-module.dto.ts`

Tambahkan field:
```typescript
@IsOptional()
@IsObject()
layoutConfig?: ScLayoutConfig;
```

### 3.2 Update Registry Service
- Simpan `layoutConfig` ke JSON
- Return `layoutConfig` di response

---

## Phase 4: Client — Fix White Screen Bug

### 4.1 Update DynamicCrudPage
**File**: `client/src/views/DynamicCrudPage.vue`

**Masalah**: Halaman fetch config dari `systemCreatorsService.getByName()` yang butuh Super Admin role. Non-Super Admin users dapat 403 → white screen.

**Solusi**: 
- Gunakan `useDynamicModules()` composable untuk ambil config dari cache yang sudah di-load di AppLayout
- Jika config tidak ada di cache, baru fetch dari API (fallback)

```typescript
import { useDynamicModules } from '@/composables/useDynamicModules'

const { getModuleByName } = useDynamicModules()

async function fetchConfig() {
  // Coba dari cache dulu
  const cached = getModuleByName(moduleName.value)
  if (cached) {
    moduleConfig.value = cached
    return
  }
  // Fallback ke API
  try {
    const { data } = await systemCreatorsService.getByName(moduleName.value)
    moduleConfig.value = data
  } catch {
    error.value = 'Module not found'
  }
}
```

---

## Phase 5: Client — Sidebar Menu Update

### 5.1 Update AppLayout
**File**: `client/src/components/layout/AppLayout/AppLayout.vue`

**Perubahan**:
1. Hapus "Generated Modules" group
2. Parse `menuLabel` untuk tentukan grouping
3. Support multi-level nested groups

```typescript
function parseMenuLabel(menuLabel: string): { groups: string[]; label: string } {
  const parts = menuLabel.split('_')
  if (parts.length === 1) {
    return { groups: [], label: parts[0] }
  }
  // Last part is label, rest are groups
  return {
    groups: parts.slice(0, -1),
    label: parts[parts.length - 1]
  }
}

// Build menu dynamically
function buildDynamicMenu(modules: ScModule[]): MenuOption[] {
  const topLevel: MenuOption[] = []
  const groupMap: Record<string, MenuOption> = {}

  for (const m of modules) {
    const { groups, label } = parseMenuLabel(m.menuLabel)

    if (groups.length === 0) {
      // Top-level menu item
      topLevel.push({
        label: renderMenuLabel(label, m.routePath),
        key: `sc-${m.name}`,
      })
    } else {
      // Grouped menu item
      let currentLevel = topLevel
      for (const group of groups) {
        if (!groupMap[group]) {
          const groupOption: MenuOption = {
            label: group,
            key: `group-${group}`,
            children: [],
          }
          groupMap[group] = groupOption
          currentLevel.push(groupOption)
        }
        currentLevel = groupMap[group].children!
      }
      currentLevel.push({
        label: renderMenuLabel(label, m.routePath),
        key: `sc-${m.name}`,
      })
    }
  }

  return topLevel
}
```

### 5.2 Add Icon to System Creators
**File**: `client/src/components/layout/AppLayout/AppLayout.vue`

```typescript
import { Add } from '@vicons/carbon'

// Di menuOptions, tambahkan icon:
{
  label: renderMenuLabel('System Creators', '/dashboard/system-creators'),
  key: 'system-creators',
  icon: renderIcon(Add),
}
```

---

## Phase 6: Client — Types Update

### 6.1 Update ScFieldType
**File**: `client/src/types/system-creator.ts`

```typescript
export type ScFieldType =
  | 'text' | 'textarea' | 'rich-text' | 'number' | 'boolean'
  | 'date' | 'datetime' | 'email' | 'phone' | 'url'
  | 'password' | 'color' | 'select' | 'json' | 'file' | 'image'
  | 'select-relation' | 'multiple-select-relation'
```

### 6.2 Add LayoutConfig Types
```typescript
export interface ScLayoutConfig {
  browse: BrowseLayoutConfig
  create: FormLayoutConfig
  update: FormLayoutConfig
}

export interface BrowseLayoutConfig {
  columnOrder: string[]
  columnWidths: Record<string, string>
}

export interface FormLayoutConfig {
  layout: 'flex' | 'grid'
  columns?: number
  sections: FormSectionConfig[]
}

export interface FormSectionConfig {
  label: string
  fields: FormFieldLayout[]
}

export interface FormFieldLayout {
  name: string
  width: 'full' | 'half' | 'third' | 'quarter' | string
  placeholder?: string
}
```

### 6.3 Update ScModule & CreateScModule
```typescript
export interface ScModule {
  // ... existing fields
  layoutConfig?: ScLayoutConfig
}

export interface CreateScModule {
  // ... existing fields
  layoutConfig?: ScLayoutConfig
}
```

---

## Phase 7: Client — Wizard Step Layout

### 7.1 Create ScWizardStep6Layout.vue
**File**: `client/src/features/system-creators/components/ScWizardStep6Layout.vue`

**Isi step**:
1. **Browse Layout**
   - Drag list untuk column order
   - Input per field untuk column width
2. **Create Form Layout**
   - Select layout type (flex/grid)
   - Input columns (if grid)
   - Dynamic sections builder:
     - Add section
     - Section label
     - Select fields for section
     - Per-field width selector
     - Per-field placeholder input
3. **Update Form Layout**
   - Clone from create or independent config

### 7.2 Update Wizard
**File**: `client/src/views/SystemCreatorWizardPage.vue`
- Tambahkan step 6 (Layout) setelah step 5 (Fields/Relations)
- Update step count dari 5 ke 6
- Update review step ke step 7

---

## Phase 8: Client — DynamicFormRenderer Update

### 8.1 Add Support for New Field Types
**File**: `client/src/components/common/DynamicFormRenderer.vue`

Tambahkan render untuk:
- `select-relation`: NSelect dengan async options dari API
- `multiple-select-relation`: NSelect multiple dengan async options

```typescript
// Di renderField():
case 'select-relation':
  return h(NSelect, {
    value: formData[field.name],
    'onUpdate:value': (v) => { formData[field.name] = v },
    options: relationOptions.value[field.name] || [],
    loading: relationLoading.value[field.name],
    filterable: true,
    clearable: true,
    placeholder: field.placeholder || `Select ${field.label}`,
  })

case 'multiple-select-relation':
  return h(NSelect, {
    value: formData[field.name],
    'onUpdate:value': (v) => { formData[field.name] = v },
    options: relationOptions.value[field.name] || [],
    loading: relationLoading.value[field.name],
    multiple: true,
    filterable: true,
    clearable: true,
    placeholder: field.placeholder || `Select ${field.label}`,
  })
```

### 8.2 Add Layout Support
- Terapkan `layoutConfig.create` untuk render form
- Group fields berdasarkan sections
- Terapkan field width

---

## Phase 9: Client — DynamicTableRenderer Update

### 9.1 Add Layout Support
**File**: `client/src/components/common/DynamicTableRenderer.vue`

- Terapkan `layoutConfig.browse` untuk:
  - Column order
  - Column width

### 9.2 Add Support for New Field Types
- `select-relation`: Tampilkan label dari related entity
- `multiple-select-relation`: Tampilkan tags dari related entities

---

## Phase 10: Client — SystemCreatorsPage Update

### 10.1 Update Data Source
**File**: `client/src/views/SystemCreatorsPage.vue`

- Data diambil dari scan folder `managements/sc_*` (via API baru)
- Atau tetap dari registry JSON (via endpoint yang ada)

### 10.2 Update Actions
- Delete: Hapus file generated + update registry JSON
- Toggle: Update isActive di registry JSON

---

## File Changes Summary

### Server Files
| File | Action | Description |
|------|--------|-------------|
| `modules/system-creators/entities/sc-module.entity.ts` | Modify | Keep as interface, remove TypeORM entity |
| `modules/system-creators/system-creators.module.ts` | Modify | Remove TypeORM import |
| `modules/system-creators/services/sc-registry.service.ts` | Rewrite | JSON-only registry |
| `modules/system-creators/services/sc-generator.service.ts` | Modify | Add new field types, update paths |
| `modules/system-creators/dto/create-sc-module.dto.ts` | Modify | Add layoutConfig |
| `modules/system-creators/controllers/system-creators.controller.ts` | Modify | Update auth on getByName |
| `modules/managements/_dynamic-loader.ts` | Modify | Update path |
| `app.module.ts` | Modify | Remove ScModule from entities |

### Client Files
| File | Action | Description |
|------|--------|-------------|
| `types/system-creator.ts` | Modify | Add new types |
| `views/DynamicCrudPage.vue` | Modify | Fix white screen bug |
| `views/SystemCreatorWizardPage.vue` | Modify | Add step 6 |
| `views/SystemCreatorsPage.vue` | Modify | Update data source |
| `components/layout/AppLayout/AppLayout.vue` | Modify | Dynamic menu, add icon |
| `components/common/DynamicFormRenderer.vue` | Modify | New field types, layout |
| `components/common/DynamicTableRenderer.vue` | Modify | Layout support |
| `features/system-creators/components/ScWizardStep6Layout.vue` | Create | New wizard step |
| `composables/useDynamicModules.ts` | Modify | Update for new structure |

### Rename
| From | To |
|------|-----|
| `server/src/modules/generated/` | `server/src/modules/managements/` |
| `client/src/stores/system-creators.store.ts` | Update imports if needed |

---

## Execution Order

1. **Phase 1**: Server — Remove database storage (core change)
2. **Phase 2**: Server — New field types (additive)
3. **Phase 3**: Server — Layout config (additive)
4. **Phase 4**: Client — Fix white screen bug (critical fix)
5. **Phase 5**: Client — Sidebar menu update (UI change)
6. **Phase 6**: Client — Types update (foundation)
7. **Phase 7**: Client — Wizard step layout (new feature)
8. **Phase 8**: Client — DynamicFormRenderer update
9. **Phase 9**: Client — DynamicTableRenderer update
10. **Phase 10**: Client — SystemCreatorsPage update

**Note**: Phase 1-3 (server) harus selesai dulu karena Phase 4-10 (client) bergantung pada perubahan server.
