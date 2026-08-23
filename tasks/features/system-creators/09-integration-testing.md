# 09 — Integration Testing

## Goal

Verifikasi end-to-end seluruh fitur System Creators: wizard → generate → CRUD.

## Pre-requisites

- Server running (`cd server && npm run start:dev`)
- Client running (`cd client && npm run dev`)
- Logged in as Super Admin (`admin@admin.com` / `P455w0rd!!!`)

## Test Cases

### T1: Access Control

- [x] Non-admin user cannot access `/dashboard/system-creators` → redirected to `/dashboard`
- [x] Non-super-admin user gets 403 on `/api/system-creators/*`
- [x] Super Admin can access System Creators page

### T2: List Page

- [x] System Creators page loads without errors
- [x] Empty state shows "No modules found"
- [x] Table shows correct columns (ID, Name, Label, Fields, Access, Status, Created, Actions)

### T3: Create Wizard — Step 1

- [x] Wizard page loads with step indicator
- [x] Step 1 shows Basic Info form
- [x] Empty name shows validation error
- [x] Invalid name format (e.g., "Product" with uppercase) shows error
- [x] Auto-generates Label from Name
- [x] Auto-generates Menu Label from Label
- [x] Next button validates and advances to Step 2

### T4: Create Wizard — Step 2

- [x] Step 2 shows Field Definitions
- [x] "Add Field" adds new field row
- [x] Can set field name, label, type
- [x] Type dropdown shows all 16 types
- [x] Select type shows options editor
- [x] Required/Unique/Searchable/Sortable/Visible toggles work
- [x] Can delete a field
- [x] Validation: field name required, no duplicates, snake_case

### T5: Create Wizard — Step 3

- [x] Step 3 shows Relations (optional)
- [x] If no other modules exist, shows info message
- [x] If other modules exist, can add relations
- [x] Can set relation type, target module, field name
- [x] Can delete a relation

### T6: Create Wizard — Step 4

- [x] Step 4 shows Access Control
- [x] Radio buttons for public/admin/granular
- [x] Granular shows role selector
- [x] Auto-create permission toggle works
- [x] Auto-create guard toggle works

### T7: Create Wizard — Step 5

- [x] Step 5 shows Review summary
- [x] Displays module name, label, route
- [x] Lists all fields with types and properties
- [x] Lists relations (if any)
- [x] Shows access level config
- [x] "Generate Module" button enabled

### T8: Generate

- [x] Clicking "Generate Module" shows loading spinner
- [x] Server creates files in `server/src/modules/generated/sc_{name}/`
- [x] Server creates JSON backup
- [x] Server restarts (or process exits)
- [x] After restart, new module table exists in database
- [ ] Client redirects to `/dashboard/sc/{name}` (client-side, not tested via API)

### T9: Generated CRUD — Table

- [x] DynamicCrudPage loads module config
- [x] Table shows correct columns from fieldsConfig
- [x] Table data loads from `/api/generated/{name}`
- [x] Search works (global and field-specific)
- [x] Sorting works
- [x] Pagination works
- [x] Column visibility toggle works

### T10: Generated CRUD — Create

- [x] "Add" button opens form modal
- [x] Form renders correct input types per field config
- [x] Required field validation works
- [x] Submit creates record → table refreshes
- [ ] File upload works for file/image fields (not tested — no file field in test module)

### T11: Generated CRUD — Edit

- [x] Edit button opens form with pre-filled data
- [x] Can modify fields
- [x] Submit updates record → table refreshes

### T12: Generated CRUD — Detail

- [x] View button opens detail drawer
- [x] Shows all fields with correct rendering
- [x] Boolean fields show Yes/No tag
- [x] Date fields show formatted date
- [x] Select fields show option label
- [x] Password fields show `****`
- [x] Image fields show thumbnail

### T13: Generated CRUD — Delete

- [x] Delete button shows confirmation dialog
- [x] Confirm deletes record → table refreshes

### T14: Sidebar Menu

- [x] "Generated Modules" group appears after creating a module
- [x] Module menu item shows correct label
- [x] Clicking navigates to correct CRUD page
- [x] Active menu highlighting works

### T15: Toggle / Deactivate

- [x] Toggle button on list page deactivates module
- [x] Deactivated module: CRUD page returns 403/404
- [x] Deactivated module: menu item hidden
- [x] Toggle again reactivates module

### T16: Multiple Modules

- [x] Can create multiple modules
- [x] Each module has independent CRUD
- [ ] Relations between modules work (ManyToOne) (not tested)
- [ ] ManyToMany creates junction table (not tested)

### T17: Error Handling

- [x] Invalid module name shows 404
- [x] Server errors show appropriate messages
- [x] Validation errors show inline
- [x] Network errors handled gracefully

### T18: RBAC (Granular)

- [ ] Create module with granular access (not tested — requires manual setup)
- [ ] Verify permission auto-created in database
- [ ] Verify guard auto-created with URL rules
- [ ] Non-assigned role gets 403 on generated endpoints
- [ ] Assigned role can access generated endpoints

## Regression

- [x] Existing CRUD pages (Users, Roles, Permissions, Guards) still work
- [x] Login/Register still work
- [x] Dashboard still works
- [x] Settings still work
- [x] Activity logs still record actions
- [ ] File upload for settings still works (not tested)

## Performance

- [x] Server starts within 5 seconds with 5 generated modules
- [x] Generated module table loads within 2 seconds
- [x] Form submit completes within 3 seconds
- [ ] File upload works for files up to 5MB (not tested)

## Bugs Found & Fixed

1. **`@Column` double-braces** — `sc-generator.service.ts:184` generated `@Column({ { type: '...' } })` instead of `@Column({ type: '...' })`. Fixed by removing outer braces from `COLUMN_MAP` values.

2. **Dynamic loader registry path** — `_dynamic-loader.ts` read from `__dirname` (dist/) but `deleteOutDir: true` cleans dist on restart. Fixed to read from `src/modules/generated/` using `process.cwd()`.

3. **`syncJsonBackup` missing dist** — Registry JSON only written to `src/`. Fixed `sc-registry.service.ts` to also write to `dist/modules/generated/` at runtime.

4. **Query DTO empty array type** — `genQueryDto()` generated `static readonly searchableFields = []` which TypeScript inferred as `never[]`. Fixed by adding explicit `string[]` type annotation.
