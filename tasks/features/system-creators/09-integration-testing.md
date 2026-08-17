# 09 — Integration Testing

## Goal

Verifikasi end-to-end seluruh fitur System Creators: wizard → generate → CRUD.

## Pre-requisites

- Server running (`cd server && npm run start:dev`)
- Client running (`cd client && npm run dev`)
- Logged in as Super Admin (`admin` / `P455w0rd!!!`)

## Test Cases

### T1: Access Control

- [ ] Non-admin user cannot access `/dashboard/system-creators` → redirected to `/dashboard`
- [ ] Non-super-admin user gets 403 on `/api/system-creators/*`
- [ ] Super Admin can access System Creators page

### T2: List Page

- [ ] System Creators page loads without errors
- [ ] Empty state shows "No modules found"
- [ ] Table shows correct columns (ID, Name, Label, Fields, Access, Status, Created, Actions)

### T3: Create Wizard — Step 1

- [ ] Wizard page loads with step indicator
- [ ] Step 1 shows Basic Info form
- [ ] Empty name shows validation error
- [ ] Invalid name format (e.g., "Product" with uppercase) shows error
- [ ] Auto-generates Label from Name
- [ ] Auto-generates Menu Label from Label
- [ ] Next button validates and advances to Step 2

### T4: Create Wizard — Step 2

- [ ] Step 2 shows Field Definitions
- [ ] "Add Field" adds new field row
- [ ] Can set field name, label, type
- [ ] Type dropdown shows all 16 types
- [ ] Select type shows options editor
- [ ] Required/Unique/Searchable/Sortable/Visible toggles work
- [ ] Can delete a field
- [ ] Validation: field name required, no duplicates, snake_case

### T5: Create Wizard — Step 3

- [ ] Step 3 shows Relations (optional)
- [ ] If no other modules exist, shows info message
- [ ] If other modules exist, can add relations
- [ ] Can set relation type, target module, field name
- [ ] Can delete a relation

### T6: Create Wizard — Step 4

- [ ] Step 4 shows Access Control
- [ ] Radio buttons for public/admin/granular
- [ ] Granular shows role selector
- [ ] Auto-create permission toggle works
- [ ] Auto-create guard toggle works

### T7: Create Wizard — Step 5

- [ ] Step 5 shows Review summary
- [ ] Displays module name, label, route
- [ ] Lists all fields with types and properties
- [ ] Lists relations (if any)
- [ ] Shows access level config
- [ ] "Generate Module" button enabled

### T8: Generate

- [ ] Clicking "Generate Module" shows loading spinner
- [ ] Server creates files in `server/src/modules/generated/sc_{name}/`
- [ ] Server creates JSON backup
- [ ] Server restarts (or process exits)
- [ ] After restart, new module table exists in database
- [ ] Client redirects to `/dashboard/sc/{name}`

### T9: Generated CRUD — Table

- [ ] DynamicCrudPage loads module config
- [ ] Table shows correct columns from fieldsConfig
- [ ] Table data loads from `/api/generated/{name}`
- [ ] Search works (global and field-specific)
- [ ] Sorting works
- [ ] Pagination works
- [ ] Column visibility toggle works

### T10: Generated CRUD — Create

- [ ] "Add" button opens form modal
- [ ] Form renders correct input types per field config
- [ ] Required field validation works
- [ ] Submit creates record → table refreshes
- [ ] File upload works for file/image fields

### T11: Generated CRUD — Edit

- [ ] Edit button opens form with pre-filled data
- [ ] Can modify fields
- [ ] Submit updates record → table refreshes

### T12: Generated CRUD — Detail

- [ ] View button opens detail drawer
- [ ] Shows all fields with correct rendering
- [ ] Boolean fields show Yes/No tag
- [ ] Date fields show formatted date
- [ ] Select fields show option label
- [ ] Password fields show `****`
- [ ] Image fields show thumbnail

### T13: Generated CRUD — Delete

- [ ] Delete button shows confirmation dialog
- [ ] Confirm deletes record → table refreshes

### T14: Sidebar Menu

- [ ] "Generated Modules" group appears after creating a module
- [ ] Module menu item shows correct label
- [ ] Clicking navigates to correct CRUD page
- [ ] Active menu highlighting works

### T15: Toggle / Deactivate

- [ ] Toggle button on list page deactivates module
- [ ] Deactivated module: CRUD page returns 404
- [ ] Deactivated module: menu item hidden
- [ ] Toggle again reactivates module

### T16: Multiple Modules

- [ ] Can create multiple modules
- [ ] Each module has independent CRUD
- [ ] Relations between modules work (ManyToOne)
- [ ] ManyToMany creates junction table

### T17: Error Handling

- [ ] Invalid module name shows 404
- [ ] Server errors show appropriate messages
- [ ] Validation errors show inline
- [ ] Network errors handled gracefully

### T18: RBAC (Granular)

- [ ] Create module with granular access
- [ ] Verify permission auto-created in database
- [ ] Verify guard auto-created with URL rules
- [ ] Non-assigned role gets 403 on generated endpoints
- [ ] Assigned role can access generated endpoints

## Regression

- [ ] Existing CRUD pages (Users, Roles, Permissions, Guards) still work
- [ ] Login/Register still work
- [ ] Dashboard still works
- [ ] Settings still work
- [ ] Activity logs still record actions
- [ ] File upload for settings still works

## Performance

- [ ] Server starts within 5 seconds with 5 generated modules
- [ ] Generated module table loads within 2 seconds
- [ ] Form submit completes within 3 seconds
- [ ] File upload works for files up to 5MB
