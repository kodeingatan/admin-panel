# System Creators — Architecture

## Overview

System Creators adalah fitur CRUD Generator yang memungkinkan Super Admin membuat module CRUD baru secara dinamis melalui UI wizard. Module yang di-generate akan membuat REST API endpoints, TypeORM entities, dan dynamic CRUD pages.

---

## Architecture Flow

```
[Client Wizard] → [POST /api/system-creators/generate] → [Server writes .ts files]
     ↓                                                         ↓
[Server compiles TS→JS] → [Updates JSON registry] → [Auto-restart server]
     ↓
[Client re-fetches registry] → [Dynamic route + menu] → [CRUD rendered]
```

---

## Server Structure

### Module: `server/src/modules/system-creators/`

```
system-creators/
├── controllers/
│   └── system-creators.controller.ts    # REST API endpoints
├── services/
│   ├── sc-registry.service.ts           # Registry management (JSON-only)
│   └── sc-generator.service.ts          # Code generator (TS → JS)
├── dto/
│   ├── create-sc-module.dto.ts          # Create DTO with ScFieldConfigDto
│   ├── update-sc-module.dto.ts          # Update DTO (PartialType)
│   └── query-sc-module.dto.ts           # Query DTO for list
├── entities/
│   └── sc-module.entity.ts              # TypeORM entity (NOT used for DB storage)
└── system-creators.module.ts            # NestJS module
```

### Generated Modules: `server/src/modules/managements/`

```
managements/
├── index.ts                             # Barrel + dynamic loader
├── _dynamic-loader.ts                   # Reads JSON registry, loads compiled modules
├── sc-modules-registry.json             # Primary registry (JSON file)
└── sc_{name}/                           # Per-module generated files
    ├── {name}.module.ts
    ├── entities/{name}.entity.ts
    ├── controllers/{name}.controller.ts
    ├── services/{name}.service.ts
    └── dto/
        ├── create-{name}.dto.ts
        ├── update-{name}.dto.ts
        └── query-{name}.dto.ts
```

**Note**: Folder renamed from `generated` → `managements`.

### Dynamic Loading (Server Startup)

1. `_dynamic-loader.ts` reads `sc-modules-registry.json`
2. For each active module, `require()` the compiled `.js` files
3. Returns `{ modules: Function[], entities: Function[] }`
4. `app.module.ts` spreads entities into TypeORM config and imports modules

### Registry (JSON-only, no database)

Module metadata stored ONLY in `managements/sc-modules-registry.json`:

```json
[
  {
    "id": 1,
    "name": "product",
    "label": "Product",
    "routePath": "/dashboard/products",
    "menuLabel": "Products",
    "accessLevel": "admin",
    "isActive": true,
    "fieldsConfig": [...],
    "relationsConfig": [...],
    "layoutConfig": {...},
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/system-creators/registry` | List all modules (from JSON) | Bearer (Super Admin) |
| GET | `/api/system-creators/registry/:id` | Get module by ID | Bearer (Super Admin) |
| GET | `/api/system-creators/registry/by-name/:name` | Get module by name | Bearer (authenticated) |
| POST | `/api/system-creators/generate` | Generate new module | Bearer (Super Admin) |
| PUT | `/api/system-creators/:id` | Update module config | Bearer (Super Admin) |
| DELETE | `/api/system-creators/:id` | Deactivate module | Bearer (Super Admin) |
| POST | `/api/system-creators/:id/toggle` | Toggle active/inactive | Bearer (Super Admin) |

**Note**: `GET /api/system-creators/registry/by-name/:name` is accessible to all authenticated users (needed by DynamicCrudPage).

### Generated Module Endpoints (Dynamic)

Per generated module, REST endpoints are auto-created:

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/generated/{name}` | List records (paginated) | Bearer + RBAC |
| GET | `/api/generated/{name}/:id` | Get record detail | Bearer + RBAC |
| POST | `/api/generated/{name}` | Create record | Bearer + RBAC |
| PUT | `/api/generated/{name}/:id` | Update record | Bearer + RBAC |
| DELETE | `/api/generated/{name}/:id` | Delete record | Bearer + RBAC |
| POST | `/api/generated/{name}/upload` | File upload | Bearer + RBAC |

---

## Client Structure

### Files

| File | Purpose |
|------|---------|
| `src/types/system-creator.ts` | TypeScript types for SC modules |
| `src/services/system-creators.service.ts` | API service layer |
| `src/stores/system-creators.store.ts` | Pinia state management |
| `src/composables/useDynamicModules.ts` | Shared composable for dynamic modules |
| `src/views/SystemCreatorsPage.vue` | List all modules (scan from generated folder) |
| `src/views/SystemCreatorWizardPage.vue` | 6-step creation wizard |
| `src/views/DynamicCrudPage.vue` | Dynamic CRUD renderer |
| `src/components/common/DynamicFormRenderer.vue` | Dynamic form from config |
| `src/components/common/DynamicTableRenderer.vue` | Dynamic table from config |
| `src/features/system-creators/components/` | Wizard step components |

### Routing

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/dashboard/system-creators` | SystemCreatorsPage | Super Admin | List modules |
| `/dashboard/system-creators/create` | SystemCreatorWizardPage | Super Admin | Create wizard |
| `/dashboard/sc/:moduleName` | DynamicCrudPage | Authenticated | Dynamic CRUD |

### Sidebar Menu Structure

```
Dashboard                         → /dashboard
User Management (group)           → Admin/Super Admin
    ├── User                      → /dashboard/users
    ├── Guard                     → /dashboard/guards
    ├── Role                      → /dashboard/roles
    └── Permissions               → /dashboard/permissions
Sistem (group)                    → Admin/Super Admin
    ├── Activity Logs             → /dashboard/activity-logs
    ├── System Logs               → /dashboard/system-logs
    └── Settings                  → /dashboard/settings
Admin (group)                     → Super Admin only
    └── System Creators           → /dashboard/system-creators
{Dynamic generated modules}       → Based on menuLabel
    ├── {Module without group}    → /dashboard/sc/{name}
    └── {Group} (group)           → Nested group from menuLabel
        └── {Module in group}     → /dashboard/sc/{name}
```

### Menu Label Format

Menu label determines sidebar placement:

- `{name}` → Top-level menu item (no group)
- `{group}_{name}` → Menu item inside group `{group}`
- `{group1}_{group2}_{name}` → Nested groups (multi-level supported)

**Examples**:
| Menu Label | Result |
|-----------|--------|
| `Products` | Top-level: Products |
| `inventory_Products` | Group "inventory" > Products |
| `inventory_Electronics_Laptops` | Group "inventory" > Group "Electronics" > Laptops |

---

## Code Generation

### Field Types

| Type | DB Column | Form Component | Table Display |
|------|-----------|----------------|---------------|
| `text` | VARCHAR(255) | NInput | Plain text |
| `textarea` | TEXT | NInput textarea | Truncated text |
| `rich-text` | TEXT | Tiptap/NInput | Stripped HTML |
| `number` | INTEGER | NInputNumber | Formatted number |
| `boolean` | INTEGER (0/1) | NSwitch | NTag Yes/No |
| `date` | DATE | NDatePicker | Formatted date |
| `datetime` | DATETIME | NDatePicker datetime | Formatted datetime |
| `email` | VARCHAR(255) | NInput email | Plain text |
| `phone` | VARCHAR(50) | NInput | Plain text |
| `url` | VARCHAR(500) | NInput | Clickable link |
| `password` | VARCHAR(255) | NInput password | `****` masked |
| `color` | VARCHAR(7) | NColorPicker | Color swatch |
| `select` | VARCHAR(255) | NSelect | NTag with color |
| `select-relation` | INTEGER (FK) | NSelect (async) | Related entity label |
| `multiple-select-relation` | TEXT (JSON) | NSelect multiple | Tags of related labels |
| `json` | TEXT | NInput textarea | Truncated preview |
| `file` | VARCHAR(500) | NUpload | File link |
| `image` | VARCHAR(500) | NUpload image | Thumbnail |

### New Field Types (v2)

#### Select with Relation
- User picks ONE record from a related module
- Stored as FK (integer) on the entity
- Form: `NSelect` with async options fetched from related module's API
- Table: Shows the related entity's label field

#### Multiple Select with Relation
- User picks MULTIPLE records from a related module
- Stored as JSON array of IDs (text column)
- Form: `NSelect` with `multiple` prop, async options
- Table: Shows tags of related entity labels

### Relation Types

| Type | TypeORM | Description |
|------|---------|-------------|
| `many-to-one` | `@ManyToOne` + `@JoinColumn` | FK on this entity |
| `many-to-many` | `@ManyToMany` + `@JoinTable` | Junction table auto-created |
| `one-to-many` | `@OneToMany` | FK on referenced entity |

---

## Layout Configuration (v2)

New step in wizard for configuring layout of browse, create, and update forms.

### Browse Layout
- Column width (pixel or percentage)
- Column order (array of field names)
- Column visibility override

### Create/Update Form Layout
- Form layout: `flex` or `grid` with configurable columns
- Field width: `full`, `half`, `third`, `quarter` or custom pixel
- Field placeholder: Custom placeholder text
- Form sections/groups: Group fields under section labels

### Layout Config Schema

```typescript
interface ScLayoutConfig {
  browse: {
    columnOrder: string[]
    columnWidths: Record<string, string>  // field name → width
  }
  create: {
    layout: 'flex' | 'grid'
    columns?: number  // for grid layout
    sections: ScFormSection[]
  }
  update: {
    layout: 'flex' | 'grid'
    columns?: number
    sections: ScFormSection[]
  }
}

interface ScFormSection {
  label: string
  fields: string[]  // field names in order
}
```

---

## RBAC for Generated Modules

Generated modules support 3 access levels:

| Level | Behavior |
|-------|----------|
| `public` | `@Public()` — no auth required |
| `admin` | `@Roles('Admin', 'Super Admin')` — admin-only |
| `granular` | Auto-create permission + guard + assign to selected roles |

### Auto-created Permission
- Name: `{Label} Management`
- Methods: `GET, POST, PUT, DELETE`
- URLs: `/api/generated/{name}/*`

### Auto-created Guard
- Name: `{Label} Access`
- URLs: `/api/generated/{name}/*` (allow)

---

## File Upload

Generated modules with `file` or `image` fields get an upload endpoint:
- `POST /api/generated/{name}/upload`
- Files saved to `server/storage/generated/{name}/`
- Served via `GET /api/storage/generated/{name}/{filename}`

---

## Server Restart

After code generation:
1. TypeScript files compiled to JavaScript via `ts.transpileModule()`
2. Server restarts via `process.exit(0)` after 500ms
3. On restart, dynamic loader reads registry and loads compiled modules
4. TypeORM `synchronize: true` auto-creates new tables

**Downtime**: ~2-3 seconds during restart.
