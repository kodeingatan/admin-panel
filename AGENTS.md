# Agent Guide

## Project Structure

Two independent packages (no root package.json):
- `client/` — Vue 3 + TypeScript + Vite component library with Storybook
- `server/` — NestJS backend API
- `imp/` — Implementation docs & reference code for features

## Client (Vue 3 + Vite + Storybook)

**Commands** (run from `client/`):
```bash
npm run dev              # Vite dev server
npm run build            # vue-tsc type check + vite build
npm run storybook        # Storybook on http://localhost:6006
npm run build-storybook  # Static Storybook build
```

**Testing**: Vitest via `@storybook/addon-vitest` — tests run inside Storybook with Playwright (headless Chromium). No standalone test script; tests are defined as Story stories.

**Key conventions**:
- Vue 3 `<script setup>` SFCs with TypeScript
- Rich text editors: TipTap (primary) and Editor.js
- Storybook stories: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Pages/components in `src/pages/` and `src/components/`
- Composables in `src/composables/`

**Routing**: Vue Router configured in `src/router.ts`
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

**Key conventions**:
- TypeORM with `better-sqlite3` driver — database file: `db.sqlite`
- Global prefix: `/api`
- Validation pipe: whitelist + transform enabled
- CORS origin: `http://localhost:5173`

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
- Server tests use `ts-jest` with `rootDir: "src"` — test files must be `*.spec.ts` in `src/`
- Server builds with `better-sqlite3` native addon — may take a while on first install
- JWT secret defaults to `default-secret-change-me` — set `JWT_SECRET` env var for production
