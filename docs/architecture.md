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
│   │   │   └── DataTable/      # Reusable table browse component
│   │   └── layout/             # Layout components (AppLayout)
│   │
│   ├── composables/            # Vue composables (useAuth, useApi, useCrudTable)
│   │
│   ├── constants/              # Constants & enums
│   │
│   ├── directives/             # Custom Vue directives
│   │
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Auth feature (login, register)
│   │   ├── dashboard/          # Dashboard feature
│   │   └── users/              # User management feature
│   │       ├── components/     # Feature-specific components
│   │       │   ├── UserTable.vue
│   │       │   ├── UserFormModal.vue
│   │       │   └── UserDetailDrawer.vue
│   │       ├── composables/    # Feature composables
│   │       │   └── useUsers.ts
│   │       └── index.ts        # Barrel exports
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
│   │   └── guards.service.ts   # Guards CRUD API
│   │
│   ├── stores/                 # State management (Pinia)
│   │   ├── auth.store.ts       # Auth state (token, user)
│   │   ├── users.store.ts      # Users list & CRUD state
│   │   ├── roles.store.ts      # Roles list & CRUD state
│   │   ├── permissions.store.ts # Permissions list & CRUD state
│   │   └── guards.store.ts     # Guards list & CRUD state
│   │
│   ├── types/                  # TypeScript types & interfaces
│   │   ├── user.ts             # User, CreateUser, UpdateUser, QueryUser
│   │   ├── role.ts             # Role, CreateRole, UpdateRole, QueryRole
│   │   ├── permission.ts       # Permission, CreatePermission, UpdatePermission
│   │   ├── guard.ts            # Guard, CreateGuard, UpdateGuard
│   │   ├── api.ts              # PaginatedResponse, ApiResponse
│   │   └── index.ts            # Barrel exports
│   │
│   ├── utils/                  # Utility functions
│   │
│   ├── views/                  # Page-level components
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
│   │   └── guards/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── dto/
│   │       ├── entities/
│   │       │   ├── guard.entity.ts
│   │       │   └── guard-url.entity.ts
│   │       ├── repositories/
│   │       └── guards.module.ts
│   │
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
│   │   └── system-logs/
│   │       ├── controllers/
│   │       │   └── system-logs.controller.ts
│   │       ├── services/
│   │       │   └── system-logs.service.ts
│   │       ├── dto/
│   │       │   └── query-system-log.dto.ts
│   │       └── system-logs.module.ts
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
├── uploads/
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

### Server
- TypeORM with `better-sqlite3` driver
- Global prefix: `/api`
- Validation: whitelist + transform enabled
- CORS origin: `http://localhost:5173`
- Import alias: `@/` → `src/` (e.g., `import { AuthService } from '@/modules/auth/services/auth.service'`)
- Modules: `src/modules/{feature}/`
- Shared: `src/common/`
- RBAC: Use `@Roles()` and `@Permissions()` decorators on controller methods

---

## Routing

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

### Sidebar Menu (AppLayout)

```
Dashboard                    → /dashboard
User Management (group)
    ├── User                 → /dashboard/users
    ├── Guard                → /dashboard/guards
    ├── Role                 → /dashboard/roles
    └── Permissions          → /dashboard/permissions
Sistem (group)
    ├── Activity Logs        → /dashboard/activity-logs
    ├── System Logs          → /dashboard/system-logs
    └── Settings             → /dashboard/settings
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

**Query Parameters** (GET `/api/users`):
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string) — global search across firstName, lastName, username, email
- `searchField` (string) — search specific field only (e.g., `email`, `username`)
- `sortBy` (string, default: 'id') — sort column (whitelisted: id, firstName, lastName, username, email, createdAt, updatedAt)
- `sortOrder` (string, default: 'DESC') — sort direction: `ASC` or `DESC`

**Response Format**:
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

**Create/Update DTO**:
- `firstName` (string, required for create)
- `lastName` (string, required for create)
- `username` (string, required for create, unique)
- `email` (string, email format, required for create, unique)
- `password` (string, required for create)
- `confirmPassword` (string, must match password)
- `roleIds` (number[], optional) — assign roles to user

### Roles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/roles` | List roles (paginated) | Bearer |
| GET | `/api/roles/:id` | Get role with guards & permissions | Bearer |
| POST | `/api/roles` | Create role | Bearer |
| PUT | `/api/roles/:id` | Update role | Bearer |
| DELETE | `/api/roles/:id` | Delete role | Bearer |

**Query Parameters** (GET `/api/roles`):
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string) — global search across roleName, description
- `searchField` (string) — search specific field only (e.g., `roleName`)
- `sortBy` (string, default: 'id') — sort column (whitelisted: id, roleName, description, createdAt, updatedAt)
- `sortOrder` (string, default: 'DESC') — sort direction: `ASC` or `DESC`

**Create/Update DTO**:
- `roleName` (string, required for create, unique)
- `description` (string, optional)
- `guardIds` (number[], optional) — assign guards to role
- `permissionIds` (number[], optional) — assign permissions to role

### Permissions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/permissions` | List permissions (paginated) | Bearer |
| GET | `/api/permissions/:id` | Get permission with methods & urls | Bearer |
| POST | `/api/permissions` | Create permission | Bearer |
| PUT | `/api/permissions/:id` | Update permission | Bearer |
| DELETE | `/api/permissions/:id` | Delete permission | Bearer |

**Query Parameters** (GET `/api/permissions`):
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string) — global search across permissionName, description
- `searchField` (string) — search specific field only (e.g., `permissionName`)
- `sortBy` (string, default: 'id') — sort column (whitelisted: id, permissionName, description, createdAt, updatedAt)
- `sortOrder` (string, default: 'DESC') — sort direction: `ASC` or `DESC`

**Create/Update DTO**:
- `permissionName` (string, required for create, unique)
- `description` (string, optional)
- `methods` (string[], optional) — HTTP methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, or * for all
- `urls` (string[], optional) — URL patterns: `/api/users/*`, `/*`, etc.

### Guards

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/guards` | List guards (paginated) | Bearer |
| GET | `/api/guards/:id` | Get guard with URLs | Bearer |
| POST | `/api/guards` | Create guard | Bearer |
| PUT | `/api/guards/:id` | Update guard | Bearer |
| DELETE | `/api/guards/:id` | Delete guard | Bearer |

**Query Parameters** (GET `/api/guards`):
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string) — global search across guardName, description
- `searchField` (string) — search specific field only (e.g., `guardName`)
- `sortBy` (string, default: 'id') — sort column (whitelisted: id, guardName, description, createdAt, updatedAt)
- `sortOrder` (string, default: 'DESC') — sort direction: `ASC` or `DESC`

**Create/Update DTO**:
- `guardName` (string, required for create, unique)
- `description` (string, optional)
- `allowUrls` (string[], optional) — allowed URL patterns
- `denyUrls` (string[], optional) — denied URL patterns

### Activity Logs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/activity-logs` | List activity logs (paginated, filterable) | Bearer |
| GET | `/api/activity-logs/stats` | Get statistics (by action, entity, level) | Bearer |
| GET | `/api/activity-logs/:id` | Get activity log detail | Bearer |

**Query Parameters** (GET `/api/activity-logs`):
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string) — global search across description, user.username, user.firstName, user.lastName
- `action` (string) — filter by action: CREATE, UPDATE, DELETE, LOGIN, LOGOUT
- `entity` (string) — filter by entity: User, Role, Permission, Guard, Auth
- `userId` (number) — filter by user ID
- `level` (string) — filter by level: INFO, WARNING, ERROR
- `startDate` (string, ISO date) — filter from date
- `endDate` (string, ISO date) — filter to date
- `sortBy` (string, default: 'createdAt') — sort column
- `sortOrder` (string, default: 'DESC') — sort direction

**Response Format**:
```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "user": { "id": 1, "firstName": "Super", "lastName": "Admin", "username": "admin" },
      "action": "CREATE",
      "entity": "User",
      "entityId": 5,
      "description": "Created user john",
      "metadata": "{\"username\":\"john\",\"email\":\"john@example.com\"}",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0...",
      "level": "INFO",
      "createdAt": "2026-08-15T10:30:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### System Logs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/system-logs/files` | List available log files | Bearer |
| GET | `/api/system-logs/files/:filename` | Read log file content | Bearer |
| GET | `/api/system-logs/stats/:filename` | Get log file statistics | Bearer |

### Settings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/settings` | Get all settings | Bearer |
| GET | `/api/settings/:key` | Get setting by key | Bearer |
| PUT | `/api/settings` | Update multiple settings | Bearer + Roles |

**Query Parameters** (GET `/api/system-logs/files/:filename`):
- `level` (string) — filter by log level: INFO, WARN, ERROR, DEBUG, TRACE
- `search` (string) — search in message and context
- `startDate` (string, ISO date) — filter from timestamp
- `endDate` (string, ISO date) — filter to timestamp
- `limit` (number, default: 100) — max entries to return
- `offset` (number, default: 0) — offset for pagination

**Log File Format** (`.log` files in `server/logs/`):
```
[2026-08-15T10:30:00.000Z] [INFO] [Auth] User logged in: admin
[2026-08-15T10:31:00.000Z] [ERROR] [UsersService] Failed to create user
```

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

### RBAC Guard Logic (`common/guards/rbac.guard.ts`)

1. Loads user with full relations (roles → guards.urls, roles → permissions.methods, permissions.urls)
2. Checks `@Roles()` — if defined, user must have at least one matching role name
3. Checks `@Permissions()` — if defined, user must have at least one matching permission name
4. **Guard URL enforcement** — For each role's guards:
   - Collect all `deny` URLs → if request URL matches any, deny access
   - Collect all `allow` URLs → if request URL matches any, grant access
5. **Permission method+URL enforcement** — For each role's permissions:
   - Check if HTTP method matches permission's `methods` (or `*` wildcard)
   - Check if request URL matches permission's `urls` patterns

### Access Control Flow

```
Request → JwtAuthGuard → RbacGuard
  │
  ├─ @Public()? → Allow (skip all checks)
  │
  ├─ @Roles() set? → Check user has matching role → Fail: 403
  │
  ├─ @Permissions() set? → Check user has matching permission → Fail: 403
  │
  ├─ Neither @Roles nor @Permissions? → Allow (any authenticated user)
  │
  └─ Guard-Based Enforcement:
       For each role → For each permission:
         Method matches? → URL matches permission urls?
           → For each guard on role:
             Deny URLs match? → DENY
             Allow URLs match? → ALLOW
       → Fail: 403 "Access denied"
```

### Client-Side Authorization

The client implements complementary access control:

1. **Route Guards** — Vue Router `beforeEach` checks `meta.requiresAuth` and `meta.guest`
2. **Menu Visibility** — Sidebar menu items conditionally rendered based on user roles/permissions
3. **API Error Handling** — Axios interceptor catches 401/403 responses:
   - 401 → Clear token, redirect to `/login`
   - 403 → Show NAlert "Access Denied" message
4. **Composable `useAuthorization`** — Centralized role/permission checking:
   - `hasRole(roleName)` — Check if user has specific role
   - `hasPermission(permissionName)` — Check if user has specific permission
   - `hasAnyRole(roles[])` — Check if user has any of the listed roles
   - `hasAnyPermission(perms[])` — Check if user has any of the listed permissions

---

## Entity Relationships

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

| Relationship | Type | Description |
|-------------|------|-------------|
| User → Role | Many-to-Many | User can have multiple roles |
| Role → Guard | Many-to-Many | Role can have multiple guards |
| Role → Permission | Many-to-Many | Role can have multiple permissions |
| Guard → GuardUrl | One-to-Many | Guard has many URL rules (allow/deny) |
| Permission → PermissionMethod | One-to-Many | Permission has many method rules |
| Permission → PermissionUrl | One-to-Many | Permission has many URL rules |
| User → ActivityLog | One-to-Many | User has many activity logs (nullable FK) |

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

Reusable component untuk semua halaman tabel (Users, Roles, Permissions, Guards).

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

**Emits**:
| Event | Payload | Description |
|-------|---------|-------------|
| `update:page` | `number` | Page changed |
| `update:limit` | `number` | Page size changed |
| `search` | `string` | Search text changed (debounced 300ms) |
| `search-field-change` | `string` | Search field changed |
| `sort-change` | `{ columnKey: string; order: 'ascend' \| 'descend' \| false }` | Sort changed |

**Slots**:
| Slot | Description |
|------|-------------|
| `toolbar` | Custom toolbar content (e.g., Add button) |

### Features
1. **Column Visibility Toggle** — NPopover with checkboxes to show/hide columns
2. **Server-Side Sorting** — Click column header to toggle ASC → DESC → none
3. **Field-Specific Search** — NSelect to choose which field to search, or "All Fields"
4. **Global Search** — NInput with debounce (300ms)
5. **Pagination** — NPagination with page size selector (10, 20, 50, 100)
6. **Loading State** — NSpin overlay
7. **Empty State** — NEmpty with message
8. **Reset Filters** — Button to clear all filters

### Composable: `useDataTable`

**Path**: `client/src/composables/useDataTable.ts`

Manages table state (search, sort, column visibility). Used by DataTable component internally.
