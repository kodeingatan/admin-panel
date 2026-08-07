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
│   │   ├── common/         # Common components (AuthForm, FormField)
│   │   └── layout/         # Layout components (AppLayout)
│   ├── composables/        # Vue composables (useAuth, useApi)
│   ├── constants/          # Constants & enums
│   ├── directives/         # Custom Vue directives
│   ├── features/           # Feature-based modules
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── users/
│   ├── layouts/            # Layout components
│   ├── plugins/            # Vue plugins
│   ├── router/             # Vue Router (index.ts)
│   ├── services/           # API services
│   ├── stores/             # State management (Pinia)
│   ├── types/              # TypeScript types (user.ts, auth.ts, index.ts)
│   ├── utils/              # Utility functions
│   ├── views/              # Page components (LoginPage, RegisterPage, DashboardPage)
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
- Components: `src/components/{base,common,layout}/`
- Views: `src/views/`
- Composables: `src/composables/`
- Types: `src/types/`
- Storybook: `stories/` (root level)

**Routing**: Vue Router configured in `src/router/index.ts`
- `/login` — LoginPage (guest only)
- `/register` — RegisterPage (guest only)
- `/dashboard` — DashboardPage (requires auth)
- JWT token stored in `localStorage` as `accessToken`

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
│   └── users/
│       ├── controllers/
│       ├── services/
│       ├── dto/
│       ├── entities/       # user.entity.ts
│       └── repositories/
├── shared/             # Shared business logic
│   ├── cache/
│   ├── mail/
│   └── logger/
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
- Modules: `src/modules/{feature}/`
- Shared: `src/common/`

**Auth API**:
| Method | Endpoint             | Description    | Auth   |
|--------|----------------------|----------------|--------|
| POST   | `/api/auth/register` | Register user  | Public |
| POST   | `/api/auth/login`    | Login user     | Public |
| GET    | `/api/auth/profile`  | Get profile    | Bearer |

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
