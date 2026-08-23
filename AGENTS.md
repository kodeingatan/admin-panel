# Agent Guide

## Project Structure

Two independent packages (no root package.json):
- `client/` — Vue 3 + TypeScript + Vite component library with Storybook
- `server/` — NestJS backend API
- `docs/` — Architecture & design documentation
- `tasks/` — Implementation task lists
- `stories/` — Storybook stories & tests (root level)

## Client (Vue 3 + Vite + Storybook)

**Commands** (run from `client/`):
```bash
npm run dev              # Vite dev server
npm run build            # vue-tsc type check + vite build
npm run storybook        # Storybook on http://localhost:6006
npm run build-storybook  # Static Storybook build
```

**Testing**: Vitest via `@storybook/addon-vitest` — tests run inside Storybook with Playwright (headless Chromium). No standalone test script; tests are defined as Story stories.

**Directory Structure**:
```
client/
├── .storybook/              # Storybook config (main.ts, preview.ts)
├── stories/                 # Storybook stories & tests
│   ├── Button.stories.ts
│   ├── LoginPage.stories.ts
│   ├── AuthForm/
│   ├── FormField/
│   └── AppLayout/
├── src/
│   ├── components/
│   │   ├── base/           # Base components (Button)
│   │   ├── common/         # Common components (AuthForm, FormField, DataTable)
│   │   │   ├── DataTable/  # Reusable table browse component
│   │   │   ├── DynamicFormRenderer.vue  # Renders form fields from config
│   │   │   └── DynamicTableRenderer.vue # Renders table columns from config
│   │   └── layout/         # Layout components (AppLayout)
│   ├── composables/        # Vue composables (useAuth, useDataTable, useDynamicModules)
│   ├── constants/          # Constants & enums
│   ├── directives/         # Custom Vue directives
│   ├── features/           # Feature-based modules
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── system-creators/ # System Creators feature (CRUD generator)
│   ├── layouts/            # Layout components
│   ├── plugins/            # Vue plugins
│   ├── router/             # Vue Router (index.ts)
│   ├── services/           # API services
│   │   ├── system-creators.service.ts  # System Creators API
│   │   └── ...
│   ├── stores/             # State management (Pinia)
│   │   ├── system-creators.store.ts    # System Creators state
│   │   └── ...
│   ├── types/              # TypeScript types (user.ts, auth.ts, system-creator.ts, index.ts)
│   ├── utils/              # Utility functions
│   ├── views/              # Page components
│   │   ├── SystemCreatorsPage.vue       # List all generated modules
│   │   ├── SystemCreatorWizardPage.vue  # Multi-step creation wizard
│   │   ├── DynamicCrudPage.vue          # Dynamic CRUD renderer
│   │   └── ...
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/         # main.css (Tailwind)
│   ├── App.vue
│   └── main.ts
```

**Key conventions**:
- Vue 3 `<script setup>` SFCs with TypeScript
- UI: **Naive UI** (priority) + **Tailwind CSS v4**
- Tailwind CSS v4 without preflight (to avoid Naive UI conflicts)
- Import alias: `@/` → `src/` (e.g., `import Button from '@/components/base/Button.vue'`)
- Components: `src/components/{base,common,layout}/`
- Views: `src/views/`
- Composables: `src/composables/`
- Types: `src/types/`
- Storybook: `stories/` (root level)
- Design System: `docs/design-system.md` — color palette, typography, spacing, component dimensions
- Naive UI components use `GlobalThemeOverrides` for theming, wrap app with `NConfigProvider`
- Table browse: Use `DataTable` component for all list/table pages (supports sort, search, column visibility, pagination)
- Dynamic form/table: Use `DynamicFormRenderer` and `DynamicTableRenderer` for generated modules
- Vite proxy: `/api` requests proxy to `http://localhost:3000` (see `vite.config.ts`)

**DataTable Requirements** (ALL tables must have):
- Global search input (min-width: `320px`, clearable, debounced 300ms)
- Field-specific search selector (NSelect, width: `160px`, default: "All Fields")
- Column visibility toggle (NPopover + NCheckbox, persist to localStorage)
- Sorting (ASC/DESC per column via header click)
- Pagination (page navigation)
- Page size selector (10, 20, 50, 100 items)
- Refresh/reload button (fetch data without state reset)
- See `docs/design-system.md` Table section for full specification

**Routing**: Vue Router configured in `src/router/index.ts`
- `/login` — LoginPage (guest only)
- `/register` — RegisterPage (guest only)
- `/dashboard` — DashboardPage (requires auth)
- `/dashboard/users` — UsersPage (requires auth)
- `/dashboard/roles` — RolesPage (requires auth)
- `/dashboard/permissions` — PermissionsPage (requires auth)
- `/dashboard/guards` — GuardsPage (requires auth)
- `/dashboard/activity-logs` — ActivityLogsPage (requires auth)
- `/dashboard/system-logs` — SystemLogsPage (requires auth)
- `/dashboard/settings` — SettingsPage (requires auth)
- `/dashboard/system-creators` — SystemCreatorsPage (requires Super Admin)
- `/dashboard/system-creators/create` — SystemCreatorWizardPage (requires Super Admin)
- `/dashboard/sc/:moduleName` — DynamicCrudPage (dynamic, requires auth)
- JWT token stored in `localStorage` as `accessToken`

**Sidebar Menu** (AppLayout.vue):
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
{Dynamic generated modules}       → Based on menuLabel format
    ├── {Module without group}    → /dashboard/sc/{name} (top-level)
    └── {Group} (group)           → Nested group from menuLabel
        └── {Module in group}     → /dashboard/sc/{name}
```

**Menu Label Rules**: `{name}` = top-level, `{group}_{name}` = in group, `{g1}_{g2}_{name}` = nested groups.
See `docs/system-creators/PRD.md` for full specification.

## Server (NestJS)

**Commands** (run from `server/`):
```bash
npm run start:dev    # Watch mode
npm run build        # Build
npm run test         # Jest unit tests
npm run test:e2e     # E2E tests
npm run lint         # ESLint + fix
npm run format       # Prettier
```

**Directory Structure**:
```
server/src/
├── common/             # Shared modules
│   ├── dto/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── pipes/
│   ├── types/
│   └── utils/
├── config/             # Configuration
├── modules/
│   ├── auth/
│   │   ├── controllers/    # auth.controller.ts
│   │   ├── services/       # auth.service.ts
│   │   ├── dto/            # register.dto.ts, login.dto.ts
│   │   ├── entities/
│   │   ├── strategies/     # jwt.strategy.ts
│   │   ├── guards/         # jwt-auth.guard.ts
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── entities/       # user.entity.ts
│   │   └── repositories/
│   ├── roles/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── entities/       # role.entity.ts, user-role.entity.ts, role-guard.entity.ts, role-permission.entity.ts
│   │   └── repositories/
│   ├── permissions/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── entities/       # permission.entity.ts, permission-method.entity.ts, permission-url.entity.ts
│   │   └── repositories/
│   ├── guards/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   ├── entities/       # guard.entity.ts, guard-url.entity.ts
│   │   └── repositories/
│   ├── activity-logs/
│   │   ├── controllers/    # activity-logs.controller.ts
│   │   ├── services/       # activity-logs.service.ts
│   │   ├── dto/            # query-activity-log.dto.ts
│   │   ├── entities/       # activity-log.entity.ts
│   │   └── activity-logs.module.ts
│   ├── system-logs/
│   │   ├── controllers/    # system-logs.controller.ts
│   │   ├── services/       # system-logs.service.ts
│   │   ├── dto/            # query-system-log.dto.ts
│   │   └── system-logs.module.ts
│   ├── settings/
│   │   ├── controllers/    # settings.controller.ts
│   │   ├── services/       # settings.service.ts
│   │   ├── dto/            # update-setting.dto.ts
│   │   ├── entities/       # setting.entity.ts
│   │   └── settings.module.ts
│   ├── storage/
│   │   ├── controllers/    # storage.controller.ts
│   │   ├── services/       # storage.service.ts
│   │   └── storage.module.ts
│   ├── system-creators/     # System Creators module (CRUD generator)
│   │   ├── controllers/
│   │   │   └── system-creators.controller.ts
│   │   ├── services/
│   │   │   ├── sc-registry.service.ts
│   │   │   └── sc-generator.service.ts
│   │   ├── dto/
│   │   │   ├── create-sc-module.dto.ts
│   │   │   ├── update-sc-module.dto.ts
│   │   │   └── query-sc-module.dto.ts
│   │   ├── entities/
│   │   │   └── sc-module.entity.ts
│   │   └── system-creators.module.ts
│   └── managements/           # Auto-generated modules (created by System Creators)
│       ├── index.ts         # Barrel + dynamic loader
│       ├── _dynamic-loader.ts
│       └── sc_{name}/       # Per-module (e.g., sc_product)
│           ├── {name}.module.ts
│           ├── entities/{name}.entity.ts
│           ├── controllers/{name}.controller.ts
│           ├── services/{name}.service.ts
│           └── dto/...
├── shared/             # Shared business logic
│   ├── cache/
│   ├── mail/
│   └── logger/
│       └── custom.logger.ts    # Custom logger with file transport
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

**Key conventions**:
- TypeORM with `better-sqlite3` driver — database file: `db.sqlite`
- Global prefix: `/api`
- Validation pipe: whitelist + transform enabled
- CORS origin: `http://localhost:5173`
- Import alias: `@/` → `src/` (e.g., `import { AuthService } from '@/modules/auth/services/auth.service'`)
- Modules: `src/modules/{feature}/`
- Shared: `src/common/`
- Uploaded files: `server/storage/{subfolder}/` (gitignored) — subfolders: `settings`, `avatars`, `general`
- File serving: `GET /api/storage/:subfolder/:filename` — public endpoint, serves binary with correct Content-Type
- Generated modules: `src/modules/managements/sc_{name}/` — prefix `sc_` for System Creator modules
- Generated modules compiled from .ts → .js at generation time, loaded via `require()` at startup

**Auth API**:
| Method | Endpoint             | Description    | Auth   |
|--------|----------------------|----------------|--------|
| POST   | `/api/auth/register` | Register user  | Public |
| POST   | `/api/auth/login`    | Login user     | Public |
| GET    | `/api/auth/profile`  | Get profile with roles, permissions, guards | Bearer |

**Note**: `GET /api/auth/profile` returns full user data including nested relations: `roles[].guards[].urls[]` and `roles[].permissions[].methods[]` + `roles[].permissions[].urls[]`. This data is used by `useAuthorization` composable for client-side access control.

**RBAC Modules** (Implemented):
| Module | Endpoint Prefix | Entities | Description |
|--------|----------------|----------|-------------|
| Users | `/api/users` | User | User management with role assignment |
| Roles | `/api/roles` | Role, UserRole, RoleGuard, RolePermission | Role management with guard & permission assignment |
| Permissions | `/api/permissions` | Permission, PermissionMethod, PermissionUrl | Permission management with method & URL rules |
| Guards | `/api/guards` | Guard, GuardUrl | Guard management with URL allow/deny rules |
| Activity Logs | `/api/activity-logs` | ActivityLog | Audit trail for all user activities |
| System Logs | `/api/system-logs` | (file-based) | System log viewer for log files |
| Settings | `/api/settings` | Setting | Application settings (key-value store) |
| Storage | `/api/storage` | (file-based) | File serving for uploaded images |
| System Creators | `/api/system-creators` | (JSON registry) | CRUD Generator — create/manage dynamic modules |
| Generated | `/api/generated/{name}` | (dynamic) | Auto-created CRUD endpoints per generated module |

**RBAC Guard Chain** (Global):
| Guard | File | Purpose |
|-------|------|---------|
| JwtAuthGuard | `modules/auth/guards/jwt-auth.guard.ts` | Validates JWT token (skips @Public) |
| RbacGuard | `common/guards/rbac.guard.ts` | Checks roles, permissions, guard URL rules |

**Custom Decorators**:
| Decorator | File | Usage |
|-----------|------|-------|
| `@Public()` | `common/decorators/public.decorator.ts` | Skip JWT + RBAC |
| `@Roles(...roles)` | `common/decorators/roles.decorator.ts` | Require specific roles |
| `@Permissions(...perms)` | `common/decorators/permissions.decorator.ts` | Require specific permissions |

**Database**: SQLite via TypeORM — 12 tables total (users, roles, permissions, guards, settings, + 6 junction tables)
- See `docs/database.md` for full schema and `docs/PRD.md` for authorization flow

**System Creators** (CRUD Generator):
- Only Super Admin can access
- Generates TypeScript files in `server/src/modules/managements/sc_{name}/`
- Compiles .ts → .js via `ts.transpileModule()`
- Server auto-restarts after generation
- Registry stored in JSON file only (`managements/sc-modules-registry.json`)
- Menu label format determines sidebar grouping (`{group}_{name}`)
- New field types: `select-relation`, `multiple-select-relation`
- New wizard step: Layout Configuration (browse, create, update)
- See `docs/system-creators/PRD.md` for full specification

## Storybook MCP

`opencode.json` configures Storybook MCP at `http://localhost:6006/mcp`.
Start Storybook first (`npm run storybook` in `client/`) before using MCP features.

## Gotchas

- No root-level scripts — always `cd` into `client/` or `server/`
- Client type checking requires `vue-tsc -b` (part of `npm run build`)
- Storybook stories are in `client/stories/` (not `client/src/stories/`) — `.storybook/main.ts` globs `../stories/**`
- Story imports: `stories/*.stories.ts` uses `../src/...`, `stories/subdir/*.stories.ts` uses `../../src/...`
- Server tests use `ts-jest` with `rootDir: "src"` — test files must be `*.spec.ts` in `src/`
- Server builds with `better-sqlite3` native addon — may take a while on first install
- JWT secret defaults to `default-secret-change-me` — set `JWT_SECRET` env var for production
- AccessDeniedAlert uses CSS transition animation (slide-in from right) — uses `v-show` not `v-if` to avoid layout shift
- To re-seed database: delete `server/db.sqlite` then restart server (`npm run start:dev`)
- Uploaded files stored in `server/storage/` (gitignored) — create subdirectories `settings/`, `avatars/`, `general/` as needed
- Generated module files in `server/src/modules/managements/` — prefixed with `sc_` for System Creator modules
- After generating a module, server auto-restarts — expect ~2-3 second downtime
- Dynamic routes (`/dashboard/sc/:moduleName`) — client fetches registry to build route map
