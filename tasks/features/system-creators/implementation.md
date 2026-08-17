# System Creators — Implementation Plan

## Overview

Sistem CRUD Generator yang memungkinkan Super Admin membuat module CRUD baru melalui UI wizard. Server generate TypeScript files, compile ke JS, register entities ke TypeORM, dan client render CRUD secara dinamis.

## Architecture

```
[Client Wizard] → [POST /api/system-creators/generate] → [Server writes .ts files]
     ↓                                                         ↓
[Server compiles TS→JS] → [Updates registry DB + JSON] → [Auto-restart server]
     ↓
[Client re-fetches registry] → [Dynamic route + menu] → [CRUD rendered]
```

## Phases

| Phase | Description | Files | Est. | Status |
|-------|-------------|-------|------|--------|
| 1 | Server: Registry Module | 6 | 1-2h | ✅ Done |
| 2 | Server: Code Generator Engine | 3 | 2-3h | ✅ Done |
| 3 | Server: Dynamic Module Loader | 3 | 1-2h | ✅ Done |
| 4 | Client: Types, Service, Store | 4 | 1h | ✅ Done |
| 5 | Client: System Creators List Page | 3 | 1h | ✅ Done |
| 6 | Client: Create Wizard | 6 | 2-3h | ✅ Done |
| 7 | Client: Dynamic CRUD Renderer | 3 | 2-3h | ✅ Done |
| 8 | Client: Dynamic Routing + Menu | 2 | 1h | ✅ Done |
| 9 | Integration Testing | — | 1h | ⬜ Pending |

**Total: ~30 new files, ~9 modified files, ~12-16h estimated**

## Task Files

| File | Phase | Description |
|------|-------|-------------|
| `01-server-registry.md` | 1 | ScModule entity, registry service, controller, DTOs, module |
| `02-server-code-generator.md` | 2 | Code generator engine — writes .ts files to disk |
| `03-server-dynamic-loader.md` | 3 | Dynamic loader — reads registry, loads modules at startup |
| `04-client-types-service-store.md` | 4 | TypeScript types, API service, Pinia store |
| `05-client-sc-list-page.md` | 5 | SystemCreatorsPage — list all modules with table |
| `06-client-create-wizard.md` | 6 | Multi-step wizard (5 steps) |
| `07-client-dynamic-crud.md` | 7 | DynamicCrudPage + DynamicFormRenderer + DynamicTableRenderer |
| `08-client-routing-menu.md` | 8 | Dynamic route registration + sidebar menu |
| `09-integration-testing.md` | 9 | End-to-end testing checklist |

## Key Decisions

1. **Auto-restart**: Server auto-restarts after generating files (`process.exit(0)` + nodemon)
2. **Compilation**: `ts.transpileModule()` to compile .ts → .js at generation time
3. **Registry**: Database table `sc_modules` + JSON backup file
4. **RBAC**: Configurable per module (public / admin / granular)
5. **Relationships**: Full support (ManyToOne, ManyToMany, OneToMany)
6. **Field Types**: 16 types (text, textarea, rich-text, number, boolean, date, datetime, email, phone, url, password, color, select, json, file, image)
7. **File Storage**: Separate folder per module (`server/storage/generated/{module}/`)
