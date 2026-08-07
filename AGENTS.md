# Agent Guide

## Project Structure

Two independent packages (no root package.json):
- `client/` — Vue 3 + TypeScript + Vite component library with Storybook
- `server/` — NestJS backend API

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

## Server (NestJS)

**Commands** (run from `server/`):
```bash
npm run start:dev    # Watch mode
npm run test         # Jest unit tests
npm run test:e2e     # E2E tests
npm run lint         # ESLint + fix
npm run format       # Prettier
```

## Storybook MCP

`opencode.json` configures Storybook MCP at `http://localhost:6006/mcp`.
Start Storybook first (`npm run storybook` in `client/`) before using MCP features.

## Gotchas

- No root-level scripts — always `cd` into `client/` or `server/`
- Client type checking requires `vue-tsc -b` (part of `npm run build`)
- Server tests use `ts-jest` with `rootDir: "src"` — test files must be `*.spec.ts` in `src/`
