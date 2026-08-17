# Architecture

## Overview

Two independent packages:
- `client/` — Vue 3 + TypeScript + Vite + Storybook
- `server/` — NestJS + TypeORM + SQLite

---

## Client (Vue 3) — Best Practices Structure

```
client/
├── .storybook/                 # Konfigurasi Storybook
│   ├── main.ts                 # Stories glob: ../stories/**/*.mdx, ../stories/**/*.stories.*
│   ├── preview.ts
│   ├── manager.ts
│   └── theme.ts
│
├── public/                     # Static assets
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── main.css         # Global styles (Tailwind + base)
│   │
│   ├── components/
│   │   ├── base/               # Base components (Button)
│   │   ├── common/             # Common components (AuthForm, FormField, DataTable)
│   │   │   ├── DataTable/      # Reusable table browse component
│   │   │   ├── DynamicFormRenderer.vue  # Renders form fields from config
│   │   │   └── DynamicTableRenderer.vue # Renders table columns from config
│   │   └── layout/             # Layout components (AppLayout)
│   │
│   ├── composables/            # Vue composables (useAuth, useApi, useDynamicModules)
│   │
│   ├── constants/              # Constants & enums
│   │
│   ├── directives/             # Custom Vue directives
│   │
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Auth feature (login, register)
│   │   ├── dashboard/          # Dashboard feature
│   │   ├── users/              # User management feature
│   │   │   ├── components/     # Feature-specific components
│   │   │   │   ├── UserTable.vue
│   │   │   │   ├── UserFormModal.vue
│   │   │   │   └── UserDetailDrawer.vue
│   │   │   ├── composables/    # Feature composables
│   │   │   │   └── useUsers.ts
│   │   │   └── index.ts        # Barrel exports
│   │   └── system-creators/    # System Creators feature (CRUD generator)
│   │       ├── components/
│   │       │   ├── ScTable.vue
│   │       │   ├── ScWizardStep1Basic.vue
│   │       │   ├── ScWizardStep2Fields.vue
│   │       │   ├── ScWizardStep3Relations.vue
│   │       │   ├── ScWizardStep4Access.vue
│   │       │   └── ScWizardStep5Review.vue
│   │       └── index.ts
│   │
│   ├── layouts/                # Layout components
│   │
│   ├── plugins/                # Vue plugins
│   │
│   ├── router/                 # Vue Router configuration
│   │
│   ├── services/               # API services
│   │   ├── api.ts              # Axios instance with interceptors
│   │   ├── users.service.ts    # Users CRUD API
│   │   ├── roles.service.ts    # Roles CRUD API
│   │   ├── permissions.service.ts # Permissions CRUD API
│   │   ├── guards.service.ts   # Guards CRUD API
│   │   └── system-creators.service.ts # System Creators API
│   │
│   ├── stores/                 # State management (Pinia)
│   │   ├── auth.store.ts       # Auth state (token, user)
│   │   ├── users.store.ts      # Users list & CRUD state
│   │   ├── roles.store.ts      # Roles list & CRUD state
│   │   ├── permissions.store.ts # Permissions list & CRUD state
│   │   ├── guards.store.ts     # Guards list & CRUD state
│   │   └── system-creators.store.ts # System Creators state
│   │
│   ├── types/                  # TypeScript types & interfaces
│   │   ├── user.ts             # User, CreateUser, UpdateUser, QueryUser
│   │   ├── role.ts             # Role, CreateRole, UpdateRole, QueryRole
│   │   ├── permission.ts       # Permission, CreatePermission, UpdatePermission
│   │   ├── guard.ts            # Guard, CreateGuard, UpdateGuard
│   │   ├── api.ts              # PaginatedResponse, ApiResponse
│   │   ├── system-creator.ts   # ScModule, ScField, ScRelation, etc.
│   │   └── index.ts            # Barrel exports
│   │
│   ├── utils/                  # Utility functions
│   │
│   ├── views/                  # Page-level components
│   │   ├── LoginPage.vue
│   │   ├── RegisterPage.vue
│   │   ├── DashboardPage.vue
│   │   ├── ProfilePage.vue
│   │   ├── UsersPage.vue
│   │   ├── RolesPage.vue
│   │   ├── PermissionsPage.vue
│   │   ├── GuardsPage.vue
│   │   ├── ActivityLogsPage.vue
│   │   ├── SystemLogsPage.vue
│   │   ├── SettingsPage.vue
│   │   ├── SystemCreatorsPage.vue      # List all generated modules
│   │   ├── SystemCreatorWizardPage.vue  # Multi-step creation wizard
│   │   └── DynamicCrudPage.vue          # Dynamic CRUD renderer
│   │
│   ├── App.vue
│   └── main.ts
│
├── stories/                    # Storybook documentation
│   ├── introduction/
│   │   └── GettingStarted.mdx
│   │
│   ├── foundations/
│   │   ├── Colors.mdx
│   │   ├── Typography.mdx
│   │   ├── Icons.mdx
│   │   └── Spacing.mdx
│   │
│   ├── components/
│   │   ├── base/
│   │   ├── common/
│   │   └── layout/
│   │
│   ├── patterns/
│   │   ├── Forms.mdx
│   │   ├── Tables.mdx
│   │   └── Dashboard.mdx
│   │
│   ├── examples/
│   │   └── LoginPage.stories.ts
│   │
│   └── assets/
│
├── tests/                      # Unit & integration tests
│
├── .env
├── .env.development
├── .env.production
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Server (NestJS) — Best Practices Structure

```
server/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── common/                     # Shared modules
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── exceptions/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   ├── serializers/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── config/                     # Application configuration
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── validation.ts
│   │
│   ├── modules/                    # Feature modules
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   ├── entities/
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── repositories/
│   │   │   └── users.module.ts
│   │   │
│   │   ├── roles/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   │   ├── role.entity.ts
│   │   │   │   ├── user-role.entity.ts
│   │   │   │   ├── role-guard.entity.ts
│   │   │   │   └── role-permission.entity.ts
│   │   │   ├── repositories/
│   │   │   └── roles.module.ts
│   │   │
│   │   ├── permissions/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   │   ├── permission.entity.ts
│   │   │   │   ├── permission-method.entity.ts
│   │   │   │   └── permission-url.entity.ts
│   │   │   ├── repositories/
│   │   │   └── permissions.module.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   │   ├── guard.entity.ts
│   │   │   │   └── guard-url.entity.ts
│   │   │   ├── repositories/
│   │   │   └── guards.module.ts
│   │   │
│   │   ├── activity-logs/
│   │   │   ├── controllers/
│   │   │   │   └── activity-logs.controller.ts
│   │   │   ├── services/
│   │   │   │   └── activity-logs.service.ts
│   │   │   ├── dto/
│   │   │   │   └── query-activity-log.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── activity-log.entity.ts
│   │   │   └── activity-logs.module.ts
│   │   │
│   │   ├── system-logs/
│   │   │   ├── controllers/
│   │   │   │   └── system-logs.controller.ts
│   │   │   ├── services/
│   │   │   │   └── system-logs.service.ts
│   │   │   ├── dto/
│   │   │   │   └── query-system-log.dto.ts
│   │   │   └── system-logs.module.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── controllers/
│   │   │   │   └── settings.controller.ts
│   │   │   ├── services/
│   │   │   │   └── settings.service.ts
│   │   │   ├── dto/
│   │   │   │   └── update-setting.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── setting.entity.ts
│   │   │   └── settings.module.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── controllers/
│   │   │   │   └── storage.controller.ts
│   │   │   ├── services/
│   │   │   │   └── storage.service.ts
│   │   │   └── storage.module.ts
│   │   │
│   │   ├── system-creators/         # System Creators module (CRUD generator)
│   │   │   ├── controllers/
│   │   │   │   └── system-creators.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── sc-registry.service.ts
│   │   │   │   ├── sc-generator.service.ts
│   │   │   │   └── sc-loader.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-sc-module.dto.ts
│   │   │   │   ├── update-sc-module.dto.ts
│   │   │   │   └── query-sc-module.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── sc-module.entity.ts
│   │   │   └── system-creators.module.ts
│   │   │
│   │   └── generated/               # Auto-generated modules (created by System Creators)
│   │       ├── index.ts             # Barrel + dynamic loader
│   │       ├── _dynamic-loader.ts   # Reads registry, loads compiled modules
│   │       └── sc_{name}/           # Per-module (e.g., sc_product, sc_category)
│   │           ├── {name}.module.ts
│   │           ├── entities/
│   │           │   └── {name}.entity.ts
│   │           ├── controllers/
│   │           │   └── {name}.controller.ts
│   │           ├── services/
│   │           │   └── {name}.service.ts
│   │           └── dto/
│   │               ├── create-{name}.dto.ts
│   │               ├── update-{name}.dto.ts
│   │               └── query-{name}.dto.ts
│   │
│   └── shared/                     # Shared business logic
│       ├── cache/
│       ├── mail/
│       └── logger/
│           └── custom.logger.ts    # Custom logger with file transport
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── storage/                        # Uploaded files (gitignored)
│   ├── settings/                   # Settings uploads (favicon, bg image)
│   ├── avatars/                    # User avatar uploads
│   ├── general/                    # General file uploads
│   └── generated/                  # Generated module file uploads (per-module subfolders)
│       └── {module_name}/          # e.g., product/, category/
│
├── scripts/
│
├── .env
├── .env.development
├── .env.production
├── .env.test
│
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

---

## Conventions

### Client
- Vue 3 `<script setup>` SFCs with TypeScript
- UI: **Naive UI** (priority) + **Tailwind CSS v4** (utility classes)
- Tailwind CSS v4 without preflight (to avoid Naive UI conflicts)
- Import alias: `@/` → `src/` (e.g., `import Button from '@/components/base/Button.vue'`)
- Components: `src/components/{base,common,layout}/`
- Views: `src/views/`
- Composables: `src/composables/`
- Features: `src/features/{feature}/`
- Services: `src/services/` (API service layer)
- Stores: `src/stores/` (Pinia state management)
- Types: `src/types/` (TypeScript interfaces)
- Storybook: `stories/`
- Dynamic modules: Generated CRUD pages rendered via `DynamicCrudPage.vue`

### Server
- TypeORM with `better-sqlite3` driver
- Global prefix: `/api`
- Validation: whitelist + transform enabled
- CORS origin: `http://localhost:5173`
- Import alias: `@/` → `src/` (e.g., `import { AuthService } from '@/modules/auth/services/auth.service'`)
- Modules: `src/modules/{feature}/`
- Shared: `src/common/`
- RBAC: Use `@Roles()` and `@Permissions()` decorators on controller methods
- Generated modules: `src/modules/generated/sc_{name}/` — prefix `sc_` for System Creator modules
- Generated modules compiled from .ts → .js at generation time, loaded via `require()` at startup

---

## Routing

### Static Routes

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/login` | LoginPage | Guest only | Login form |
| `/register` | RegisterPage | Guest only | Registration form |
| `/dashboard` | DashboardPage | Required | Dashboard with sidebar |
| `/dashboard/users` | UsersPage | Required | User management |
| `/dashboard/roles` | RolesPage | Required | Role management |
| `/dashboard/permissions` | PermissionsPage | Required | Permission management |
| `/dashboard/guards` | GuardsPage | Required | Guard management |
| `/dashboard/activity-logs` | ActivityLogsPage | Required | Activity logs viewer |
| `/dashboard/system-logs` | SystemLogsPage | Required | System logs viewer |
| `/dashboard/settings` | SettingsPage | Required | Application settings |
| `/dashboard/system-creators` | SystemCreatorsPage | Required (Super Admin) | System Creators list |
| `/dashboard/system-creators/create` | SystemCreatorWizardPage | Required (Super Admin) | Create new module |

### Dynamic Routes (Generated Modules)

| Path Pattern | Component | Auth | Description |
|-------------|-----------|------|-------------|
| `/dashboard/sc/:moduleName` | DynamicCrudPage | Required (Admin+) | Dynamic CRUD for generated module |

**Route resolution**: Client fetches `/api/system-creators/registry` on app load, builds route map from `routePath` field of each registered module.

### Sidebar Menu (AppLayout)

```
Dashboard                         → /dashboard
User Management (group)
    ├── User                      → /dashboard/users
    ├── Guard                     → /dashboard/guards
    ├── Role                      → /dashboard/roles
    └── Permissions               → /dashboard/permissions
Sistem (group)
    ├── Activity Logs             → /dashboard/activity-logs
    ├── System Logs               → /dashboard/system-logs
    └── Settings                  → /dashboard/settings
Admin (group, Super Admin only)
    └── System Creators           → /dashboard/system-creators
Generated Modules (group, dynamic)
    ├── {Module Label 1}         → /dashboard/sc/{name1}
    ├── {Module Label 2}         → /dashboard/sc/{name2}
    └── ...                       → /dashboard/sc/{nameN}
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get profile with roles, permissions, guards | Bearer |

**Profile Response** includes full user data with nested relations:
```json
{
  "id": 1,
  "firstName": "Super",
  "lastName": "Admin",
  "username": "admin",
  "email": "admin@admin.com",
  "roles": [
    {
      "id": 1,
      "roleName": "Super Admin",
      "guards": [{ "guardName": "Full Access", "urls": [{ "url": "/*", "type": "allow" }] }],
      "permissions": [{ "permissionName": "Full Access", "methods": [{ "method": "*" }], "urls": [{ "url": "/*" }] }]
    }
  ]
}
```

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List users (paginated) | Bearer |
| GET | `/api/users/:id` | Get user | Bearer |
| POST | `/api/users` | Create user | Bearer |
| PUT | `/api/users/:id` | Update user | Bearer |
| DELETE | `/api/users/:id` | Delete user | Bearer |

### Roles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/roles` | List roles (paginated) | Bearer |
| GET | `/api/roles/:id` | Get role with guards & permissions | Bearer |
| POST | `/api/roles` | Create role | Bearer |
| PUT | `/api/roles/:id` | Update role | Bearer |
| DELETE | `/api/roles/:id` | Delete role | Bearer |

### Permissions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/permissions` | List permissions (paginated) | Bearer |
| GET | `/api/permissions/:id` | Get permission with methods & urls | Bearer |
| POST | `/api/permissions` | Create permission | Bearer |
| PUT | `/api/permissions/:id` | Update permission | Bearer |
| DELETE | `/api/permissions/:id` | Delete permission | Bearer |

### Guards

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/guards` | List guards (paginated) | Bearer |
| GET | `/api/guards/:id` | Get guard with URLs | Bearer |
| POST | `/api/guards` | Create guard | Bearer |
| PUT | `/api/guards/:id` | Update guard | Bearer |
| DELETE | `/api/guards/:id` | Delete guard | Bearer |

### Activity Logs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/activity-logs` | List activity logs (paginated, filterable) | Bearer |
| GET | `/api/activity-logs/stats` | Get statistics (by action, entity, level) | Bearer |
| GET | `/api/activity-logs/:id` | Get activity log detail | Bearer |

### System Logs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/system-logs/files` | List available log files | Bearer |
| GET | `/api/system-logs/files/:filename` | Read log file content | Bearer |
| GET | `/api/system-logs/stats/:filename` | Get log file statistics | Bearer |

### Settings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/settings` | Get all settings | Public |
| GET | `/api/settings/:key` | Get setting by key | Public |
| PUT | `/api/settings` | Update multiple settings | Bearer + Roles + Permissions |
| POST | `/api/settings/upload` | Upload file (favicon, bg image) | Bearer + Roles + Permissions |

### Storage

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/storage/:subfolder/:filename` | Serve uploaded file | Public |

### System Creators (CRUD Generator)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/system-creators/registry` | List all registered modules | Bearer (Super Admin) |
| GET | `/api/system-creators/registry/:id` | Get module config by ID | Bearer (Super Admin) |
| GET | `/api/system-creators/registry/by-name/:name` | Get module config by name | Bearer (Super Admin) |
| POST | `/api/system-creators/generate` | Generate new module (write files + restart) | Bearer (Super Admin) |
| PUT | `/api/system-creators/:id` | Update module config | Bearer (Super Admin) |
| DELETE | `/api/system-creators/:id` | Delete module (mark inactive) | Bearer (Super Admin) |
| POST | `/api/system-creators/:id/toggle` | Toggle module active/inactive | Bearer (Super Admin) |

### Generated Module Endpoints (Dynamic)

Per generated module, REST endpoints are auto-created:

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/generated/{name}` | List records (paginated, search, sort) | Bearer + RBAC |
| GET | `/api/generated/{name}/:id` | Get record detail | Bearer + RBAC |
| POST | `/api/generated/{name}` | Create record | Bearer + RBAC |
| PUT | `/api/generated/{name}/:id` | Update record | Bearer + RBAC |
| DELETE | `/api/generated/{name}/:id` | Delete record | Bearer + RBAC |
| POST | `/api/generated/{name}/upload` | File upload (if module has file/image fields) | Bearer + RBAC |

---

## RBAC System

### Global Guards

Two global guards are registered in `app.module.ts`:

1. **JwtAuthGuard** — Validates JWT token for all routes (except `@Public()` decorated)
2. **RbacGuard** — Checks role, guard, and permission access (respects `@Roles()` and `@Permissions()` decorators)

### Decorators

| Decorator | File | Usage |
|-----------|------|-------|
| `@Public()` | `common/decorators/public.decorator.ts` | Skip JWT authentication |
| `@Roles(...roles)` | `common/decorators/roles.decorator.ts` | Require specific roles |
| `@Permissions(...perms)` | `common/decorators/permissions.decorator.ts` | Require specific permissions |

### Generated Module RBAC

Generated modules support 3 access levels:

| Level | Behavior |
|-------|----------|
| `public` | `@Public()` — no auth required |
| `admin` | `@Roles('Admin', 'Super Admin')` — admin-only |
| `granular` | Auto-create permission (e.g., "Product Management", "Full Access") + auto-create guard (e.g., "Product Access") + assign to selected roles |

---

## Entity Relationships

### Built-in Entities

```
users ──────< users_roles >────── roles
  │                                   │
  │                   ┌───────────────┼───────────────┐
  │                   │               │               │
  │                   v               v               v
  │             roles_guards    roles_permissions     │
  │                   │               │               │
  │                   v               v               v
  │               guards         permissions
  │                   │               │
  │                   v               v
  │             guard_urls    permission_methods
  │                           permission_urls
  │
  └─────────────< activity_logs
```

### System Creators Entity

```
sc_modules ─── (fields stored as JSON in fieldsConfig column)
               (relations stored as JSON in relationsConfig column)
```

### Generated Module Entities (dynamic)

Each generated module has its own entity with columns defined by the user. Relationships between generated modules are defined via `relationsConfig`:

| Relation Type | TypeORM Decorator | Junction Table |
|--------------|-------------------|----------------|
| ManyToOne | `@ManyToOne` + `@JoinColumn` | None (FK on child) |
| ManyToMany | `@ManyToMany` + `@JoinTable` | Auto-created (`sc_{a}_sc_{b}`) |
| OneToMany | `@OneToMany` | None (FK on child) |

---

## Tech Stack

### Client
- Vue 3.5
- Vite 8
- TypeScript 6
- Naive UI 2.44
- Tailwind CSS 4
- Vue Router 5
- Storybook 10
- Vitest 4

### Server
- NestJS 11
- TypeORM 1.1
- better-sqlite3
- Passport + JWT
- bcrypt
- class-validator
- TypeScript (for code generation at runtime via `ts.transpileModule`)

---

## Design System

Lihat `docs/design-system.md` untuk dokumentasi lengkap design tokens, color palette, typography, spacing, dan komponen.

**Prinsip**:
- **Naive UI** = komponen utama (Button, Input, Form, DataTable, dll)
- **Tailwind CSS** = utility classes (spacing, flexbox, display)
- Customisasi tema via `GlobalThemeOverrides` pada `NConfigProvider`
- Semua komponen harus dibungkus dengan `NConfigProvider`

---

## Table Browse Component

Reusable component untuk semua halaman tabel (Users, Roles, Permissions, Guards, Generated Modules).

### Component: `DataTable.vue`

**Path**: `client/src/components/common/DataTable/DataTable.vue`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `columns` | `ColumnDef[]` | Column definitions with key, title, sortable, searchable, render |
| `data` | `T[]` | Table data |
| `loading` | `boolean` | Loading state |
| `page` | `number` | Current page (default: 1) |
| `limit` | `number` | Page size (default: 20) |
| `total` | `number` | Total items |
| `sortBy` | `string` | Current sort field (default: 'id') |
| `sortOrder` | `'ASC' \| 'DESC'` | Current sort order (default: 'DESC') |
| `searchPlaceholder` | `string` | Search input placeholder |
| `searchableFields` | `{ label: string; value: string }[]` | Available search field options |

**Features**:
1. **Column Visibility Toggle** — NPopover with checkboxes to show/hide columns
2. **Server-Side Sorting** — Click column header to toggle ASC → DESC → none
3. **Field-Specific Search** — NSelect to choose which field to search, or "All Fields"
4. **Global Search** — NInput with debounce (300ms)
5. **Pagination** — NPagination with page size selector (10, 20, 50, 100)
6. **Loading State** — NSpin overlay
7. **Empty State** — NEmpty with message
8. **Reset Filters** — Button to clear all filters

---

## Dynamic Form Renderer

**Path**: `client/src/components/common/DynamicFormRenderer.vue`

Renders form fields dynamically based on field configuration from System Creators.

### Supported Field Types

| Field Type | Naive UI Component | Notes |
|-----------|-------------------|-------|
| `text` | `NInput` | Plain text input |
| `textarea` | `NInput type="textarea"` | Multi-line text |
| `rich-text` | Tiptap editor or `NInput type="textarea"` | Rich text editing |
| `number` | `NInputNumber` | Numeric input |
| `boolean` | `NSwitch` | Toggle switch |
| `date` | `NDatePicker type="date"` | Date picker |
| `datetime` | `NDatePicker type="datetime"` | Date + time picker |
| `email` | `NInput` with email validation | Email input |
| `phone` | `NInput` with phone validation | Phone input |
| `url` | `NInput` with URL validation | URL input |
| `password` | `NInput type="password"` | Password input |
| `color` | `NColorPicker` | Color picker |
| `select` | `NSelect` | Dropdown with configurable options |
| `json` | `NInput type="textarea"` | JSON editor |
| `file` | `NUpload` | File upload |
| `image` | `NUpload` with image preview | Image upload with preview |

### Field Configuration Schema

```typescript
interface ScFieldConfig {
  name: string           // Column name (snake_case)
  label: string          // Display label
  type: ScFieldType      // One of the types above
  required: boolean      // Required validation
  unique: boolean        // Unique constraint
  searchable: boolean    // Include in search
  sortable: boolean      // Allow sorting
  visible: boolean       // Show in table by default
  defaultValue?: any     // Default value
  maxLength?: number     // Max length for text fields
  minLength?: number     // Min length for text fields
  min?: number           // Min value for number
  max?: number           // Max value for number
  options?: { label: string; value: any }[]  // For select type
  placeholder?: string   // Input placeholder
  helpText?: string      // Help text below field
}
```

---

## Dynamic Table Renderer

**Path**: `client/src/components/common/DynamicTableRenderer.vue`

Renders table columns dynamically based on field configuration.

### Column Rendering by Type

| Field Type | Table Display |
|-----------|---------------|
| `text`, `email`, `phone`, `url` | Plain text |
| `boolean` | NTag (Yes/No with color) |
| `date` | Formatted date string |
| `datetime` | Formatted datetime string |
| `select` | NTag with color based on option |
| `number` | Formatted number |
| `password` | `****` (masked) |
| `color` | Color swatch + hex code |
| `json` | Truncated JSON preview |
| `file` | File link/icon |
| `image` | Thumbnail preview |
| `rich-text` | Stripped HTML preview |
