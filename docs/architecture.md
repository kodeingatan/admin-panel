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
│   │   ├── common/             # Common components (AuthForm, FormField)
│   │   └── layout/             # Layout components (AppLayout)
│   │
│   ├── composables/            # Vue composables (useAuth, useApi)
│   │
│   ├── constants/              # Constants & enums
│   │
│   ├── directives/             # Custom Vue directives
│   │
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Auth feature (login, register)
│   │   ├── dashboard/          # Dashboard feature
│   │   └── users/              # User management feature
│   │
│   ├── layouts/                # Layout components
│   │
│   ├── plugins/                # Vue plugins
│   │
│   ├── router/                 # Vue Router configuration
│   │
│   ├── services/               # API services
│   │
│   ├── stores/                 # State management (Pinia)
│   │
│   ├── types/                  # TypeScript types & interfaces
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
- Features: `src/features/`
- Storybook: `stories/`

### Server
- TypeORM with `better-sqlite3` driver
- Global prefix: `/api`
- Validation: whitelist + transform enabled
- CORS origin: `http://localhost:5173`
- Import alias: `@/` → `src/` (e.g., `import { AuthService } from '@/modules/auth/services/auth.service'`)
- Modules: `src/modules/{feature}/`
- Shared: `src/common/`

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

### Users (Planned)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List users (paginated) | Bearer + Permission |
| GET | `/api/users/:id` | Get user | Bearer + Permission |
| POST | `/api/users` | Create user | Bearer + Permission |
| PUT | `/api/users/:id` | Update user | Bearer + Permission |
| DELETE | `/api/users/:id` | Delete user | Bearer + Permission |

### Roles (Planned)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/roles` | List roles | Bearer + Permission |
| GET | `/api/roles/:id` | Get role | Bearer + Permission |
| POST | `/api/roles` | Create role | Bearer + Permission |
| PUT | `/api/roles/:id` | Update role | Bearer + Permission |
| DELETE | `/api/roles/:id` | Delete role | Bearer + Permission |

### Permissions (Planned)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/permissions` | List permissions | Bearer + Permission |
| GET | `/api/permissions/:id` | Get permission | Bearer + Permission |
| POST | `/api/permissions` | Create permission | Bearer + Permission |
| PUT | `/api/permissions/:id` | Update permission | Bearer + Permission |
| DELETE | `/api/permissions/:id` | Delete permission | Bearer + Permission |

### Guards (Planned)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/guards` | List guards | Bearer + Permission |
| GET | `/api/guards/:id` | Get guard | Bearer + Permission |
| POST | `/api/guards` | Create guard | Bearer + Permission |
| PUT | `/api/guards/:id` | Update guard | Bearer + Permission |
| DELETE | `/api/guards/:id` | Delete guard | Bearer + Permission |

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
