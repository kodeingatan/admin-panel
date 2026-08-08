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
│   │   ├── base/               # Base components (Button, Input, Modal)
│   │   ├── common/             # Common components (AuthForm, FormField, DataTable)
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
│   └── shared/                     # Shared business logic
│       ├── cache/
│       ├── mail/
│       └── logger/
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

### Sidebar Menu (AppLayout)

```
Dashboard                    → /dashboard
User Management (group)
    ├── User                 → /dashboard/users
    ├── Guard                → /dashboard/guards
    ├── Role                 → /dashboard/roles
    └── Permissions          → /dashboard/permissions
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get profile | Bearer |

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
- `search` (string) — searches firstName, lastName, username, email

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
- `search` (string) — searches roleName, description

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
- `search` (string) — searches permissionName, description

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
- `search` (string) — searches guardName, description

**Create/Update DTO**:
- `guardName` (string, required for create, unique)
- `description` (string, optional)
- `allowUrls` (string[], optional) — allowed URL patterns
- `denyUrls` (string[], optional) — denied URL patterns

---

## RBAC System

### Global Guards

Two global guards are registered in `app.module.ts`:

1. **JwtAuthGuard** — Validates JWT token for all routes (except `@Public()` decorated)
2. **RbacGuard** — Checks role & permission access (respects `@Roles()` and `@Permissions()` decorators)

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
4. Checks Guard URL rules — matches request URL against allow/deny patterns
5. Checks Permission method+URL rules — matches HTTP method and URL against permission rules

---

## Entity Relationships

```
users ──────< users_roles >────── roles
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    v               v               v
              roles_guards    roles_permissions     │
                    │               │               │
                    v               v               v
                guards         permissions
                    │               │
                    v               v
              guard_urls    permission_methods
                            permission_urls
```

| Relationship | Type | Description |
|-------------|------|-------------|
| User → Role | Many-to-Many | User can have multiple roles |
| Role → Guard | Many-to-Many | Role can have multiple guards |
| Role → Permission | Many-to-Many | Role can have multiple permissions |
| Guard → GuardUrl | One-to-Many | Guard has many URL rules (allow/deny) |
| Permission → PermissionMethod | One-to-Many | Permission has many method rules |
| Permission → PermissionUrl | One-to-Many | Permission has many URL rules |

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
