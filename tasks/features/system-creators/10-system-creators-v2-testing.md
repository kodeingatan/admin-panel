# System Creators v2 — Testing Plan

## Overview

Testing plan untuk System Creators v2. Mencakup perbaikan bug, pembaruan fitur, dan validasi end-to-end.

---

## Phase 1: Server Testing — Registry Service (JSON-only)

### 1.1 Test Registry Read/Write
```bash
# Start server
cd server && npm run start:dev

# Test: List modules (harus kosong jika belum ada)
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/system-creators/registry

# Test: Create module via wizard (generate)
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/system-creators/generate \
  -d '{
    "name": "product",
    "label": "Product",
    "menuLabel": "Products",
    "fields": [
      {"name": "title", "label": "Title", "type": "text", "required": true, "unique": false, "searchable": true, "sortable": true, "visible": true}
    ],
    "accessLevel": "admin"
  }'

# Test: Verify JSON file updated
cat server/src/modules/managements/sc-modules-registry.json

# Test: Get by name (authenticated user, not just Super Admin)
curl -H "Authorization: Bearer {user-token}" http://localhost:3000/api/system-creators/registry/by-name/product
```

### 1.2 Test Registry Operations
```bash
# Test: Update module
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/system-creators/1 \
  -d '{"label": "Product Updated"}'

# Test: Toggle active
curl -X POST -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/system-creators/1/toggle

# Test: Delete (deactivate)
curl -X DELETE -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/system-creators/1
```

---

## Phase 2: Server Testing — Generated Module CRUD

### 2.1 Test Generated API Endpoints
```bash
# Test: List records
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/generated/product

# Test: Create record
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/product \
  -d '{"title": "Test Product"}'

# Test: Get record
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/generated/product/1

# Test: Update record
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/product/1 \
  -d '{"title": "Updated Product"}'

# Test: Delete record
curl -X DELETE -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/product/1
```

### 2.2 Test RBAC
```bash
# Test: Non-admin user should get 403
curl -H "Authorization: Bearer {viewer-token}" http://localhost:3000/api/generated/product

# Test: Public module should work without auth (if accessLevel=public)
curl http://localhost:3000/api/generated/public-module
```

---

## Phase 3: Server Testing — New Field Types

### 3.1 Test select-relation
```bash
# Create module with select-relation field
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/system-creators/generate \
  -d '{
    "name": "order",
    "label": "Order",
    "menuLabel": "Orders",
    "fields": [
      {"name": "product", "label": "Product", "type": "select-relation", "required": true, "unique": false, "searchable": false, "sortable": false, "visible": true, "targetModule": "product", "relationField": "title"}
    ],
    "accessLevel": "admin"
  }'

# Create record with relation
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/order \
  -d '{"product": 1}'
```

### 3.2 Test multiple-select-relation
```bash
# Create module with multiple-select-relation
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/system-creators/generate \
  -d '{
    "name": "post",
    "label": "Post",
    "menuLabel": "Posts",
    "fields": [
      {"name": "tags", "label": "Tags", "type": "multiple-select-relation", "required": false, "unique": false, "searchable": false, "sortable": false, "visible": true, "targetModule": "tag", "relationField": "name"}
    ],
    "accessLevel": "admin"
  }'

# Create record with multiple relations
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/post \
  -d '{"tags": [1, 2, 3]}'
```

---

## Phase 4: Client Testing — White Screen Fix

### 4.1 Test DynamicCrudPage Access
```
1. Login sebagai non-Super Admin user (e.g., Admin role)
2. Buat module dengan accessLevel = "admin"
3. Navigate ke /dashboard/sc/{module-name}
4. Expected: Tampil tabel browse (bukan white screen)
5. Test CRUD operations:
   - Create record
   - Edit record
   - Delete record
   - View detail
```

### 4.2 Test Fallback
```
1. Clear useDynamicModules cache
2. Navigate langsung ke /dashboard/sc/{module-name}
3. Expected: Fetch dari API, tampil tabel browse
```

---

## Phase 5: Client Testing — Sidebar Menu

### 5.1 Test Menu Label Parsing
```
Menu Label: "Products"
Expected: Top-level menu item "Products"

Menu Label: "inventory_Products"
Expected: Group "inventory" > Menu item "Products"

Menu Label: "inventory_Electronics_Laptops"
Expected: Group "inventory" > Group "Electronics" > Menu item "Laptops"
```

### 5.2 Test Menu Rendering
```
1. Create multiple modules dengan berbagai menu label format
2. Login sebagai Super Admin
3. Expected:
   - Top-level items muncul di sidebar
   - Groups terbentuk dengan benar
   - Nested groups bekerja
   - Click menu item navigate ke halaman yang benar
```

### 5.3 Test System Creators Icon
```
1. Login sebagai Super Admin
2. Cek sidebar "Admin" group
3. Expected: "System Creators" memiliki icon (Add icon)
```

---

## Phase 6: Client Testing — Wizard Layout Step

### 6.1 Test Layout Step
```
1. Login sebagai Super Admin
2. Buka /dashboard/system-creators/create
3. Isi Step 1-5 seperti biasa
4. Navigate ke Step 6 (Layout)
5. Test Browse Layout:
   - Reorder columns (drag & drop)
   - Set column widths
6. Test Create Form Layout:
   - Select layout type (flex/grid)
   - Set columns count
   - Add sections
   - Add fields ke sections
   - Set field width
   - Set field placeholder
7. Test Update Form Layout:
   - Independent config atau clone dari create
8. Submit dan verify:
   - layoutConfig tersimpan di JSON
   - Generated module menggunakan layout config
```

### 6.2 Test Form Rendering with Layout
```
1. Set create form layout:
   - Section "Basic Info" dengan 2 fields (width: full)
   - Section "Details" dengan 2 fields (width: half)
2. Buka create form
3. Expected:
   - Fields ter-render dalam sections
   - Section labels muncul
   - Field widths sesuai config
   - Placeholders sesuai config
```

### 6.3 Test Table Rendering with Layout
```
1. Set browse layout:
   - Column order: [title, price, category, createdAt]
   - Column widths: { title: "200px", price: "100px" }
2. Buka dynamic CRUD page
3. Expected:
   - Kolom sesuai urutan config
   - Lebar kolom sesuai config
```

---

## Phase 7: Client Testing — New Field Types

### 7.1 Test select-relation Form
```
1. Create module dengan select-relation field
2. Buka create form
3. Expected:
   - NSelect muncul
   - Options loaded dari related module API
   - Filterable & clearable
   - Value tersimpan sebagai ID (number)
```

### 7.2 Test multiple-select-relation Form
```
1. Create module dengan multiple-select-relation field
2. Buka create form
3. Expected:
   - NSelect multiple muncul
   - Options loaded dari related module API
   - Bisa pilih lebih dari satu
   - Values tersimpan sebagai array of IDs
```

### 7.3 Test Table Display
```
1. Create records dengan relation fields
2. Lihat tabel browse
3. Expected:
   - select-relation: Tampilkan label dari related entity
   - multiple-select-relation: Tampilkan tags dari related entities
```

---

## Phase 8: Integration Testing — End-to-End Flow

### 8.1 Full Flow Test
```
1. Login sebagai Super Admin
2. Navigate ke /dashboard/system-creators
3. Klik "Create Module"
4. Wizard Step 1: Isi basic info (menuLabel: "inventory_Products")
5. Wizard Step 2: Tambah fields:
   - name (text, required, searchable, sortable)
   - description (textarea)
   - price (number, required)
   - category (select-relation ke category module)
   - tags (multiple-select-relation ke tag module)
6. Wizard Step 3: Tambah relation many-to-one ke category
7. Wizard Step 4: Access level = admin
8. Wizard Step 5: Review
9. Wizard Step 6: Layout config:
   - Browse: column order [name, price, category, createdAt]
   - Create: grid layout, 2 columns, 2 sections
10. Klik "Generate Module"
11. Expected:
    - Server restart
    - Module muncul di sidebar (dalam group "inventory")
    - Navigate ke /dashboard/sc/products
    - Tabel browse tampil dengan layout yang benar
    - Create form tampil dengan sections
    - CRUD operations berfungsi
    - select-relation & multiple-select-relation berfungsi
```

### 8.2 Multi-User Access Test
```
1. Login sebagai Super Admin → bisa akses System Creators
2. Login sebagai Admin → bisa akses generated module CRUD
3. Login sebagai Viewer → tidak bisa akses generated module (403)
4. Login sebagai user tanpa role → tidak bisa akses
```

---

## Phase 9: Regression Testing

### 9.1 Existing Features
```
- Login/Register berfungsi
- User Management CRUD berfungsi
- Role Management CRUD berfungsi
- Permission Management CRUD berfungsi
- Guard Management CRUD berfungsi
- Activity Logs tampil
- System Logs tampil
- Settings berfungsi
- File upload berfungsi
```

### 9.2 Data Integrity
```
- JSON registry konsisten
- Generated files lengkap (7 files)
- Compiled JS files ada
- Dynamic loader berhasil load modules
- TypeORM sync tables dengan benar
```

---

## Phase 10: Performance Testing

### 10.1 Registry Load Time
```
- 0 modules: < 100ms
- 10 modules: < 200ms
- 50 modules: < 500ms
```

### 10.2 Dynamic Module Load
```
- Server restart time: < 3 seconds
- Module appear in sidebar: < 1 second after restart
- CRUD page load: < 2 seconds
```

---

## Test Data

### Modules to Create
```json
[
  {
    "name": "category",
    "label": "Category",
    "menuLabel": "Categories",
    "fields": [
      {"name": "name", "label": "Name", "type": "text", "required": true, "searchable": true, "sortable": true, "visible": true},
      {"name": "description", "label": "Description", "type": "textarea", "required": false, "visible": true}
    ],
    "accessLevel": "admin"
  },
  {
    "name": "tag",
    "label": "Tag",
    "menuLabel": "Tags",
    "fields": [
      {"name": "name", "label": "Name", "type": "text", "required": true, "searchable": true, "sortable": true, "visible": true},
      {"name": "color", "label": "Color", "type": "color", "required": false, "visible": true}
    ],
    "accessLevel": "admin"
  },
  {
    "name": "product",
    "label": "Product",
    "menuLabel": "inventory_Products",
    "fields": [
      {"name": "title", "label": "Title", "type": "text", "required": true, "searchable": true, "sortable": true, "visible": true, "maxLength": 255},
      {"name": "description", "label": "Description", "type": "textarea", "required": false, "visible": true},
      {"name": "price", "label": "Price", "type": "number", "required": true, "sortable": true, "visible": true, "min": 0},
      {"name": "stock", "label": "Stock", "type": "number", "required": true, "sortable": true, "visible": true, "min": 0},
      {"name": "category", "label": "Category", "type": "select-relation", "required": true, "visible": true, "targetModule": "category", "relationField": "name"},
      {"name": "tags", "label": "Tags", "type": "multiple-select-relation", "required": false, "visible": true, "targetModule": "tag", "relationField": "name"},
      {"name": "image", "label": "Image", "type": "image", "required": false, "visible": true},
      {"name": "isActive", "label": "Active", "type": "boolean", "required": false, "visible": true, "defaultValue": true}
    ],
    "relations": [
      {"name": "category", "type": "many-to-one", "targetModule": "category"}
    ],
    "accessLevel": "admin",
    "layoutConfig": {
      "browse": {
        "columnOrder": ["id", "title", "price", "category", "stock", "isActive", "createdAt"],
        "columnWidths": {"id": "80px", "title": "200px", "price": "120px"}
      },
      "create": {
        "layout": "grid",
        "columns": 2,
        "sections": [
          {"label": "Basic Info", "fields": [
            {"name": "title", "width": "full", "placeholder": "Product name"},
            {"name": "description", "width": "full"}
          ]},
          {"label": "Pricing & Stock", "fields": [
            {"name": "price", "width": "half"},
            {"name": "stock", "width": "half"}
          ]},
          {"label": "Classification", "fields": [
            {"name": "category", "width": "half"},
            {"name": "tags", "width": "half"}
          ]},
          {"label": "Media", "fields": [
            {"name": "image", "width": "full"}
          ]}
        ]
      },
      "update": {
        "layout": "grid",
        "columns": 2,
        "sections": []
      }
    }
  }
]
```

---

## Checklist

### Bug Fixes
- [ ] DynamicCrudPage tampil tabel browse (bukan white screen)
- [ ] Generated module CRUD berfungsi
- [ ] System Creators menu memiliki icon

### New Features
- [ ] SC modules tidak disimpan di database
- [ ] Menu item top-level (bukan dalam group "Generated Modules")
- [ ] Menu label format menentukan grouping
- [ ] Folder renamed: generated → managements
- [ ] Field type: select-relation
- [ ] Field type: multiple-select-relation
- [ ] Wizard step: Layout Configuration
- [ ] Layout config applied ke browse table
- [ ] Layout config applied ke create form
- [ ] Layout config applied ke update form

### Documentation
- [ ] docs/system-creators/architecture.md created
- [ ] docs/system-creators/PRD.md created
- [ ] docs/system-creators/database.md created
- [ ] docs/architecture.md updated
- [ ] docs/PRD.md updated
- [ ] docs/database.md updated
- [ ] AGENTS.md updated

### Testing
- [ ] Server registry operations work
- [ ] Generated module CRUD works
- [ ] New field types work
- [ ] Sidebar menu renders correctly
- [ ] Wizard layout step works
- [ ] Form rendering with layout works
- [ ] Table rendering with layout works
- [ ] RBAC enforcement works
- [ ] No regression in existing features
