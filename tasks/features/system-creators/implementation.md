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
| 9 | Integration Testing | — | 1h | ✅ Done |

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

---

## Phase Details with Deliverables & Testing

### Phase 1: Server: Registry Module

**Deliverables:**
- [x] `ScModule` entity created with all required columns
- [x] `ScRegistryService` with full CRUD operations + JSON sync
- [x] `SystemCreatorsController` with 7 API endpoints
- [x] DTOs with validation (Create, Update, Query)
- [x] `SystemCreatorsModule` registered in `AppModule`
- [x] `sc_modules` table auto-created via TypeORM synchronize

**Server Logic Testing:**
- [x] `ScRegistryService.create()` saves valid data to database
- [x] `ScRegistryService.create()` rejects invalid name format (uppercase, spaces)
- [x] `ScRegistryService.findAll()` returns paginated results
- [x] `ScRegistryService.findByName()` returns correct module
- [x] `ScRegistryService.update()` modifies existing record
- [x] `ScRegistryService.remove()` soft-deletes (sets isActive=false)
- [x] `ScRegistryService.toggleActive()` flips isActive status
- [x] `ScRegistryService.syncJsonBackup()` writes JSON file
- [x] JSON backup file contains correct module data

**API Endpoint Testing:**
- [x] `GET /api/system-creators/registry` returns empty array initially
- [x] `POST /api/system-creators/generate` creates module with valid data
- [x] `POST /api/system-creators/generate` rejects invalid DTO
- [x] `GET /api/system-creators/registry/:id` returns created module
- [x] `GET /api/system-creators/registry/by-name/:name` returns by name
- [x] `PUT /api/system-creators/:id` updates module config
- [x] `DELETE /api/system-creators/:id` soft-deletes module
- [x] `POST /api/system-creators/:id/toggle` toggles active status

**RBAC Testing:**
- [x] Non-admin user gets 403 on all endpoints
- [x] Admin user gets 403 (requires Super Admin)
- [x] Super Admin can access all endpoints

---

### Phase 2: Server: Code Generator Engine

**Deliverables:**
- [x] `ScGeneratorService` with `generate()` method
- [x] Entity template generates valid TypeORM entity
- [x] Controller template generates NestJS controller
- [x] Service template generates CRUD service
- [x] DTO templates with class-validator decorators
- [x] Module template for NestJS module
- [x] Compilation pipeline (TS → JS)
- [x] Auto-restart mechanism

**Server Logic Testing:**
- [x] Generator creates `server/src/modules/generated/sc_{name}/` directory
- [x] Entity file maps all 16 field types to correct TypeORM columns
- [x] Controller file has correct route prefix (`generated/{name}`)
- [x] Service file has `findAll`, `findOne`, `create`, `update`, `remove` methods
- [x] DTOs have correct validation decorators
- [x] Module file imports all dependencies correctly
- [x] `.js` files created alongside `.ts` files after compilation
- [x] Generated files are syntactically valid TypeScript

**File Generation Testing:**
- [x] Text field → `{ type: 'varchar', length: 255 }`
- [x] Textarea field → `{ type: 'text' }`
- [x] Number field → `{ type: 'integer' }`
- [x] Boolean field → `{ type: 'boolean', default: false }`
- [x] Date field → `{ type: 'date' }`
- [x] Datetime field → `{ type: 'datetime' }`
- [x] Select field → `{ type: 'varchar', length: 255 }` with options
- [x] File/Image field → `{ type: 'varchar', length: 500 }`

---

### Phase 3: Server: Dynamic Module Loader

**Deliverables:**
- [x] `_dynamic-loader.ts` reads JSON registry
- [x] Loader requires compiled `.js` files dynamically
- [x] `GeneratedModulesModule` wraps dynamic modules
- [x] `AppModule` integrates generated entities and modules
- [x] Server starts without errors (empty registry)
- [x] Server starts without errors (with modules)

**Server Logic Testing:**
- [x] Loader reads `sc-modules-registry.json` correctly
- [x] Loader skips inactive modules (isActive=false)
- [x] Loader handles missing `.js` files gracefully (logs error, continues)
- [x] Loader returns empty arrays when no modules exist
- [x] Loader returns correct module classes when modules exist
- [x] Loader returns correct entity classes for TypeORM registration

**Integration Testing:**
- [x] Generated module's entity creates table in database
- [x] Generated controller registers NestJS routes
- [x] Generated service is injectable in controller
- [x] `GET /api/generated/{name}` returns data (empty initially)
- [x] `POST /api/generated/{name}` creates record
- [x] `PUT /api/generated/{name}/:id` updates record
- [x] `DELETE /api/generated/{name}/:id` deletes record

---

### Phase 4: Client: Types, Service, Store

**Deliverables:**
- [x] `system-creator.ts` types file with all interfaces
- [x] `system-creators.service.ts` with API methods
- [x] `system-creators.store.ts` Pinia store
- [x] `useDynamicModules.ts` composable
- [x] Types exported from barrel index

**Component Testing (Storybook):**
- [x] Types compile without TypeScript errors
- [x] Service methods match server API endpoints exactly
- [x] Store follows existing pattern (`users.store.ts`)
- [x] Composable provides `loadModules()`, `getModuleByName()`, `getTableColumns()`
- [x] Store `fetchAll()` handles pagination state
- [x] Store `generate()` calls API and refreshes list
- [x] Store `toggleActive()` updates module status
- [x] Store `remove()` deletes module and refreshes list

**Flow Testing:**
- [x] Store initialized with default state (empty modules, loading=false)
- [x] `fetchAll()` updates modules, total, page, limit
- [x] `fetchAll()` sets error on failure
- [x] `fetchActiveModules()` filters only active modules
- [x] `generate()` shows loading state during API call
- [x] `remove()` clears selected module after deletion

---

### Phase 5: Client: System Creators List Page

**Deliverables:**
- [x] `ScTable.vue` component with DataTable
- [x] `SystemCreatorsPage.vue` list page
- [x] Feature barrel export
- [x] Routes added to router

**Component Testing (Storybook):**
- [x] `ScTable` renders table with correct columns (ID, Name, Label, Fields, Access, Status, Created, Actions)
- [x] `ScTable` shows "Create Module" button
- [x] `ScTable` handles empty state ("No modules found")
- [x] `ScTable` emits `detail` event on View button click
- [x] `ScTable` emits `create` event on Create button click
- [x] `ScTable` shows NTag for accessLevel (public=green, admin=blue, granular=purple)
- [x] `ScTable` shows NTag for isActive (Active=green, Inactive=gray)
- [x] `ScTable` shows field count badge
- [x] `SystemCreatorsPage` renders `ScTable` inside `AppLayout`
- [x] `SystemCreatorsPage` handles detail drawer open/close

**Flow Testing:**
- [x] Page fetches modules on mount
- [x] Search filters table results
- [x] Sort changes column order (ASC/DESC)
- [x] Pagination navigates between pages
- [x] Page size selector changes items per page
- [x] Toggle button deactivates/activates module
- [x] Delete button shows confirmation dialog
- [x] Create button navigates to `/dashboard/system-creators/create`

---

### Phase 6: Client: Create Wizard

**Deliverables:**
- [x] `SystemCreatorWizardPage.vue` with 5-step wizard
- [x] `ScWizardStep1Basic.vue` — basic info form
- [x] `ScWizardStep2Fields.vue` — field definitions
- [x] `ScWizardStep3Relations.vue` — relations (optional)
- [x] `ScWizardStep4Access.vue` — access control
- [x] `ScWizardStep5Review.vue` — review & generate

**Component Testing (Storybook):**
- [x] Step indicator shows 5 steps with progress
- [x] Step 1 validates module name format (`^[a-z][a-z0-9_]*$`)
- [x] Step 1 auto-generates Label from Name
- [x] Step 1 auto-generates Menu Label from Label + "s"
- [x] Step 2 shows "Add Field" button
- [x] Step 2 field row shows all toggles (Required, Unique, Searchable, Sortable, Visible)
- [x] Step 2 type dropdown shows all 16 field types
- [x] Step 2 select type shows options editor
- [x] Step 2 validates field name (snake_case, no duplicates)
- [x] Step 3 shows "No other modules" message when empty
- [x] Step 3 shows target module dropdown when modules exist
- [x] Step 4 shows access level radio buttons (public/admin/granular)
- [x] Step 4 shows role selector for granular access
- [x] Step 5 shows complete summary (name, label, route, fields, relations, access)
- [x] Back/Next buttons navigate correctly between steps

**Flow Testing:**
- [x] Wizard starts at Step 1
- [x] Step 1 → Step 2: validates name before advancing
- [x] Step 2 → Step 3: validates at least one field
- [x] Step 3 → Step 4: skips validation (optional)
- [x] Step 4 → Step 5: shows summary
- [x] Step 5 "Generate" button calls API
- [x] Generate shows loading spinner
- [x] Generate success redirects to `/dashboard/sc/{name}`
- [x] Generate failure shows error message

---

### Phase 7: Client: Dynamic CRUD Renderer

**Deliverables:**
- [x] `DynamicCrudPage.vue` — main CRUD page
- [x] `DynamicFormRenderer.vue` — dynamic form modal
- [x] `DynamicTableRenderer.vue` — dynamic table

**Component Testing (Storybook):**
- [x] `DynamicTableRenderer` renders columns from `fieldsConfig`
- [x] `DynamicTableRenderer` shows boolean as NTag (Yes/No)
- [x] `DynamicTableRenderer` shows date as formatted date
- [x] `DynamicTableRenderer` shows select as option label
- [x] `DynamicTableRenderer` shows password as `****`
- [x] `DynamicTableRenderer` shows file as link
- [x] `DynamicTableRenderer` shows image as thumbnail
- [x] `DynamicTableRenderer` has actions column (View/Edit/Delete)
- [x] `DynamicFormRenderer` renders text input for text/email/phone/url
- [x] `DynamicFormRenderer` renders textarea for textarea/rich-text
- [x] `DynamicFormRenderer` renders NInputNumber for number
- [x] `DynamicFormRenderer` renders NSwitch for boolean
- [x] `DynamicFormRenderer` renders NDatePicker for date/datetime
- [x] `DynamicFormRenderer` renders NColorPicker for color
- [x] `DynamicFormRenderer` renders NSelect for select
- [x] `DynamicFormRenderer` renders NUpload for file/image
- [x] `DynamicFormRenderer` validates required fields
- [x] `DynamicCrudPage` handles module not found (shows error)

**Flow Testing:**
- [x] Page fetches module config from API on mount
- [x] Table data loads from `/api/generated/{name}`
- [x] Search filters table results
- [x] Sort changes column order
- [x] Pagination navigates between pages
- [x] Create opens form modal in create mode
- [x] Edit opens form modal with pre-filled data
- [x] Submit creates/updates record and refreshes table
- [x] Delete shows confirmation and removes record
- [x] Detail drawer shows all fields with correct rendering

---

### Phase 8: Client: Dynamic Routing + Menu

**Deliverables:**
- [x] Dynamic wildcard route `/dashboard/sc/:moduleName`
- [x] AppLayout fetches active modules on mount
- [x] Sidebar shows "Generated Modules" menu group
- [x] Route key map updated for active highlighting

**Component Testing (Storybook):**
- [x] AppLayout renders "Generated Modules" group when modules exist
- [x] AppLayout hides "Generated Modules" when no modules
- [x] Menu items show correct labels from `menuLabel`
- [x] Menu items have correct route paths

**Flow Testing:**
- [x] AppLayout fetches modules on mount
- [x] Menu item click navigates to `/dashboard/sc/{name}`
- [x] Active menu highlighting works for dynamic routes
- [x] Route guard requires Admin+ role
- [x] Non-admin user redirected from dynamic CRUD page
- [x] Empty state: no menu group when no modules
- [x] Module deactivation removes menu item
- [x] Module reactivation adds menu item

---

### Phase 9: Integration Testing

**End-to-End Flow Testing:**
- [x] T1: Access Control — non-admin blocked from System Creators
- [x] T2: List Page — shows empty state, then modules
- [x] T3-T7: Wizard Steps — each step validates and progresses correctly
- [x] T8: Generate — creates files, restarts server, redirects
- [x] T9-T13: Generated CRUD — full table/form/detail/delete flow
- [x] T14: Sidebar Menu — generated module appears in menu
- [x] T15: Toggle/Deactivate — module hidden when inactive
- [x] T16: Multiple Modules — independent CRUD for each
- [x] T17: Error Handling — invalid names, network errors, validation
- [ ] T18: RBAC (Granular) — permission/guard auto-creation (not auto-created, requires manual setup)

**Regression Testing:**
- [x] Existing Users CRUD still works
- [x] Existing Roles CRUD still works
- [x] Existing Permissions CRUD still works
- [x] Existing Guards CRUD still works
- [x] Login/Register still work
- [x] Dashboard still works
- [x] Settings still work
- [x] Activity logs still record actions
- [ ] File upload for settings still works (not tested — no file upload test in API)

**Performance Testing:**
- [x] Server starts within 5 seconds with 5 generated modules
- [x] Generated module table loads within 2 seconds
- [x] Form submit completes within 3 seconds
- [ ] File upload works for files up to 5MB (not tested)

**Bugs Found & Fixed:**
- [x] `COLUMN_MAP` double-braces bug — entity `@Column({ { } })` → fixed to `@Column({ })`
- [x] `_dynamic-loader.ts` registry path — read from `src/` instead of `dist/` (avoids `deleteOutDir` issue)
- [x] `syncJsonBackup()` — also writes to `dist/` at runtime
- [x] `genQueryDto()` empty array type — added `string[]` annotation to prevent `never[]` inference

---

## Key Decisions

1. **Auto-restart**: Server auto-restarts after generating files (`process.exit(0)` + nodemon)
2. **Compilation**: `ts.transpileModule()` to compile .ts → .js at generation time
3. **Registry**: Database table `sc_modules` + JSON backup file
4. **RBAC**: Configurable per module (public / admin / granular)
5. **Relationships**: Full support (ManyToOne, ManyToMany, OneToMany)
6. **Field Types**: 16 types (text, textarea, rich-text, number, boolean, date, datetime, email, phone, url, password, color, select, json, file, image)
7. **File Storage**: Separate folder per module (`server/storage/generated/{module}/`)
