# System Creators — Posts Module Fix & Recreation

## Overview

Perbaikan modul `posts` yang menghasilkan error `404 Not Found` pada `POST /api/generated/posts`. Akar masalahnya adalah generated module memiliki beberapa bug pada level generator yang mengakibatkan module tidak bisa di-load oleh dynamic loader, dan beberapa bug pada service/entity yang mengakibatkan CRUD tidak berfungsi.

**Error awal:**
```json
{
    "message": "Cannot POST /api/generated/posts",
    "error": "Not Found",
    "statusCode": 404
}
```

---

## Root Cause Analysis

### Cause 1: `@/` Path Alias di Compiled `.js` Files

**Severity: CRITICAL** — Ini penyebab utama 404.

File `.js` hasil kompilasi menggunakan `require("@/...")` untuk import:
```js
// posts.module.js
const activity_logs_module_1 = require("@/modules/activity-logs/activity-logs.module");
const tag_entity_1 = require("@/modules/managements/sc_tag/entities/tag.entity");
```

Path alias `@/` hanya bekerja di TypeScript (via `tsconfig.json` → `"@/*": ["src/*"]`). Saat file `.js` di-load via `require()` oleh `_dynamic-loader.ts`, Node.js tidak mengenali alias ini → `MODULE_NOT_FOUND` → error ditangkap secara silent oleh loader → module tidak terdaftar → route tidak ada → 404.

**Solusi:** Generator harus meng-compile path relative (`../activity-logs/...`) bukan `@/...` di file `.js` output.

### Cause 2: `relationsConfig` Kosong

**Severity: HIGH**

Registry entry untuk `posts` memiliki `relationsConfig: "[]"` (array kosong), padahal fieldsConfig mendefinisikan:
- `category`: type `select-relation` → seharusnya punya `many-to-one` relation
- `tags`: type `multiple-select-relation` → seharusnya punya `many-to-many` relation

Akibatnya:
- Entity generates plain `integer` column untuk `category` (bukan `@ManyToOne` relation)
- Entity generates plain `text` column untuk `tags` (bukan `@ManyToMany` relation)
- Service tidak generate `leftJoinAndSelect` untuk load relations
- Service tidak generate `relations: { ... }` di `findOne`

**Solusi:** User perlu define relations di Wizard Step 3, atau generator harus otomatis infer relations dari field type `select-relation`/`multiple-select-relation`.

### Cause 3: Column Name Mismatch di Service

**Severity: MEDIUM**

```ts
// posts.service.ts — create()
const mod = this.repo.create({
    title: dto.title,
    content: dto.content,
    category_id: dto.category,  // ← entity column name: "category", bukan "category_id"
    tags: null,
} as any);
```

Entity mendefinisikan column `category` (integer), tapi service assign ke `category_id` (yang tidak ada). `as any` menyembunyikan error ini.

### Cause 4: `tags` Column Type Mismatch

**Severity: MEDIUM**

Entity mendefinisikan `tags` sebagai `type: 'text'`, tapi service menugaskan `Tag[]` (array of objects):
```ts
saved.tags = tagsEntities; // Tag[] → text column = "[object Object]"
```

### Cause 5: Module Impor `Category` Tapi Tidak di Register

**Severity: LOW** (tidak menyebabkan crash)

`posts.module.ts` import `Category` tapi tidak daftarkan di `TypeOrmModule.forFeature`. Import ini di-shake oleh compiler sehingga tidak menimbulkan error di runtime.

---

## Implementation Plan

### Phase 1: Hapus Module Posts yang Ada

**Goal:** Bersihkan semua痕迹 posts module dari sistem.

#### 1.1 Soft-delete via API
```bash
# GET registry entry ID untuk posts
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/system-creators/registry

# DELETE (soft-delete: set isActive=false)
curl -X DELETE -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/system-creators/{posts-id}
```

#### 1.2 Hapus Generated Files
```bash
rm -rf server/src/modules/managements/sc_posts/
```

#### 1.3 Hapus dari Registry
Edit `server/src/modules/managements/sc-modules-registry.json` — hapus entry `posts` (id:5) sepenuhnya dari array. Ini diperlukan karena `ScRegistryService.create()` melakukan pengecekan nama unik bahkan untuk entry inactive.

#### 1.4 Drop Database Table
```bash
# Option A: Hapus db.sqlite dan re-seed
rm server/db.sqlite
# Server akan auto-create tables via TypeORM synchronize

# Option B: Jalankan SQL langsung
sqlite3 server/db.sqlite "DROP TABLE IF EXISTS posts;"
```

#### 1.5 Restart Server
```bash
cd server && npm run start:dev
```

**Verifikasi:**
- [ ] `sc_posts/` directory tidak ada
- [ ] `sc-modules-registry.json` tidak ada entry `posts`
- [ ] Table `posts` tidak ada di database
- [ ] `GET /api/generated/posts` return 404 (module tidak ter-load)

---

### Phase 2: Fix Generator Service

**File:** `server/src/modules/system-creators/services/sc-generator.service.ts`

Sebelum regenerate, fix bug pada generator agar module baru bisa berfungsi dengan benar.

#### 2.1 Fix Compiled `.js` Path Resolution

**Masalah:** `ts.transpileModule()` menghasilkan `require("@/...")` karena source `.ts` menggunakan alias `@/`.

**Solusi:** Setelah transpile, lakukan string replacement untuk convert `@/` paths ke relative paths.

```ts
// Di method `generate()`, setelah transpile每个文件:
let compiledJs = ts.transpileModule(tsContent, { ... }).outputText;

// Replace @/ imports dengan relative paths
compiledJs = compiledJs.replace(
  /require\("@\/(.*?)"\)/g,
  (_, path) => {
    // Hitung relative path dari file output ke target
    const relativePath = path.relative(
      path.dirname(outputFilePath),
      path.join(SRC_DIR, path)
    );
    return `require("${relativePath}")`;
  }
);
```

**Alternative (lebih robust):** Register `tsconfig-paths` di runtime sebelum loader berjalan. Tapi ini lebih kompleks dan rentan race condition.

#### 2.2 Auto-Infer Relations dari Field Type

**Masalah:** Jika user tidak define relations di Wizard Step 3, module generated tanpa TypeORM relations.

**Solusi:** Di `generate()`, auto-generate relation config untuk field type `select-relation` dan `multiple-select-relation` jika belum ada di `config.relations`:

```ts
// Di generate(), sebelum genEntity()
if (!config.relations) config.relations = [];

for (const field of config.fields) {
  if (field.type === 'select-relation' && field.targetModule) {
    const exists = config.relations.find(r => r.name === field.name);
    if (!exists) {
      config.relations.push({
        name: field.name,
        type: 'many-to-one',
        targetModule: field.targetModule,
      });
    }
  }
  if (field.type === 'multiple-select-relation' && field.targetModule) {
    const exists = config.relations.find(r => r.name === field.name);
    if (!exists) {
      config.relations.push({
        name: field.name,
        type: 'many-to-many',
        targetModule: field.targetModule,
      });
    }
  }
}
```

#### 2.3 Fix Service `create()` — Column Name Mapping

**Masalah:** Service generate `category_id: dto.category` tapi entity column adalah `category`.

**Solusi:**
- Untuk `select-relation` field: generate `mod.category = dto.category` (TypeORM auto-maps relation property ke join column)
- Untuk field biasa: gunakan nama field asli

```ts
// genService() — createFields
if (f.type === 'select-relation') {
  return `      ${f.name}: dto.${f.name},`;  // TypeORM handles FK mapping
}
```

#### 2.4 Fix Service `findAll()` — Load All Relations

**Masalah:** Hanya load `many-to-many` dan `one-to-many`, tidak load `many-to-one`.

```ts
// SEBELUM
const relationFields = config.relations?.filter(
  (r) => r.type === 'many-to-many' || r.type === 'one-to-many',
) || [];

// SESUDAH — load semua relations
const relationFields = config.relations || [];
```

#### 2.5 Fix Service `findOne()` — Load All Relations

```ts
// SEBELUM
relations: { tags: true }

// SESUDAH — dinamis berdasarkan config
relations: { category: true, tags: true }  // atau build dari config
```

#### 2.6 Fix Module Import — Register Semua Entity

**Masalah:** Module hanya register entity utama + Tag, tidak register target entity lain (misal Category).

```ts
// genModule() — imports
// SEBELUM
TypeOrmModule.forFeature([${entityName}, Tag])

// SESUDAH — register semua target entity dari relations
const entities = [${entityName}];
for (const rel of config.relations) {
  const targetEntity = capitalize(rel.targetModule);
  if (!entities.includes(targetEntity)) {
    entities.push(targetEntity);
  }
}
TypeOrmModule.forFeature([${entities.join(', ')}])
```

---

### Phase 3: Regenerate Module Posts

**Goal:** Buat ulang module `posts` dengan config yang benar.

#### 3.1 Config untuk Regeneration

```json
{
  "name": "posts",
  "label": "Post",
  "menuLabel": "Content_Post",
  "fields": [
    {
      "name": "title",
      "label": "Title",
      "type": "text",
      "required": true,
      "unique": false,
      "searchable": true,
      "sortable": true,
      "visible": true,
      "maxLength": 255
    },
    {
      "name": "thumbnail",
      "label": "Thumbnail",
      "type": "image",
      "required": false,
      "unique": false,
      "searchable": false,
      "sortable": false,
      "visible": true
    },
    {
      "name": "content",
      "label": "Content",
      "type": "rich-text",
      "required": false,
      "unique": false,
      "searchable": false,
      "sortable": false,
      "visible": true
    },
    {
      "name": "category",
      "label": "Category",
      "type": "select-relation",
      "required": false,
      "unique": false,
      "searchable": false,
      "sortable": false,
      "visible": true,
      "targetModule": "category",
      "relationField": "name",
      "relationLabel": "name"
    },
    {
      "name": "tags",
      "label": "Tags",
      "type": "multiple-select-relation",
      "required": false,
      "unique": false,
      "searchable": false,
      "sortable": false,
      "visible": true,
      "targetModule": "tag",
      "relationField": "name",
      "relationLabel": "name"
    }
  ],
  "relations": [
    {
      "name": "category",
      "type": "many-to-one",
      "targetModule": "category"
    },
    {
      "name": "tags",
      "type": "many-to-many",
      "targetModule": "tag"
    }
  ],
  "accessLevel": "granular",
  "accessRoles": ["Admin", "Super Admin"],
  "accessPermissions": ["Post Management"],
  "layoutConfig": {
    "browse": {
      "columnOrder": ["id", "title", "thumbnail", "category", "tags", "createdAt"],
      "columnWidths": {
        "id": "80px",
        "title": "200px",
        "thumbnail": "100px"
      }
    },
    "create": {
      "layout": "grid",
      "columns": 2,
      "sections": [
        {
          "label": "Basic Info",
          "fields": [
            { "name": "title", "width": "full", "placeholder": "Post title" },
            { "name": "content", "width": "full", "placeholder": "Write your content here..." }
          ]
        },
        {
          "label": "Media",
          "fields": [
            { "name": "thumbnail", "width": "full" }
          ]
        },
        {
          "label": "Classification",
          "fields": [
            { "name": "category", "width": "half" },
            { "name": "tags", "width": "half" }
          ]
        }
      ]
    },
    "update": {
      "layout": "grid",
      "columns": 2,
      "sections": []
    }
  }
}
```

#### 3.2 Execute Regeneration

```bash
# Pastikan server running
cd server && npm run start:dev

# Generate via API
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {super-admin-token}" \
  http://localhost:3000/api/system-creators/generate \
  -d '{ ... config di atas ... }'
```

#### 3.3 Verifikasi Generated Files

```bash
# Pastikan semua file ter-generate
ls -la server/src/modules/managements/sc_posts/

# Expected files:
# posts.module.ts / posts.module.js
# controllers/posts.controller.ts / posts.controller.js
# services/posts.service.ts / posts.service.js
# entities/posts.entity.ts / posts.entity.js
# dto/create-posts.dto.ts / create-posts.dto.js
# dto/update-posts.dto.ts / update-posts.dto.js
# dto/query-posts.dto.ts / query-posts.dto.js

# Pastikan .js files menggunakan relative paths (bukan @/)
grep -r 'require("@/' server/src/modules/managements/sc_posts/
# Should return EMPTY — no @/ imports in compiled files
```

#### 3.4 Restart Server & Verify Module Load

```bash
# Restart server
cd server && npm run start:dev

# Check server logs — tidak ada error "Failed to load generated module posts"
# Test endpoint
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/generated/posts
```

---

### Phase 4: Testing CRUD Operations

#### 4.1 Test Browse (READ All)

```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/generated/posts?page=1&limit=10"
```

**Expected:**
- [ ] Response 200 dengan data array
- [ ] Field `category` berisi object `{ id, name, ... }` (bukan raw integer)
- [ ] Field `tags` berisi array of objects `[{ id, name, ... }]` (bukan raw JSON string)
- [ ] Pagination info (total, page, limit)

#### 4.2 Test Create

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/posts \
  -d '{
    "title": "Test Post",
    "content": "<p>Hello World</p>",
    "category": 1,
    "tags": [1, 2]
  }'
```

**Expected:**
- [ ] Response 201 dengan created object
- [ ] `title` tersimpan dengan benar
- [ ] `category` tersimpan sebagai relation (category_id = 1)
- [ ] `tags` tersimpan sebagai many-to-many relation
- [ ] Activity log tercatat

#### 4.3 Test Read (One)

```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/posts/1
```

**Expected:**
- [ ] Response 200 dengan object lengkap
- [ ] `category` = `{ id: 1, name: "..." }` (full relation object)
- [ ] `tags` = `[{ id: 1, name: "...", color: "..." }, ...]` (full relation objects)
- [ ] Field lain (title, content, thumbnail) benar

#### 4.4 Test Update

```bash
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/posts/1 \
  -d '{
    "title": "Updated Post Title",
    "category": 2,
    "tags": [1, 3]
  }'
```

**Expected:**
- [ ] Response 200 dengan updated object
- [ ] `title` ter-update
- [ ] `category` berubah ke category baru
- [ ] `tags` ter-update (hanya tag 1 dan 3)
- [ ] Activity log tercatat

#### 4.5 Test Delete

```bash
curl -X DELETE -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/generated/posts/1
```

**Expected:**
- [ ] Response 200 atau 204
- [ ] Record tidak muncul di browse
- [ ] Activity log tercatat

#### 4.6 Test Search & Sort

```bash
# Search by title
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/generated/posts?search=Updated"

# Sort by title DESC
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/generated/posts?sortBy=title&sortOrder=DESC"
```

**Expected:**
- [ ] Search mengembalikan record yang sesuai
- [ ] Sort mengembalikan record dalam urutan yang benar

---

### Phase 5: Client-Side Verification

#### 5.1 Test DynamicCrudPage — Browse View
```
1. Login sebagai Admin
2. Navigate ke /dashboard/sc/posts (atau /dashboard/content/posts tergantung menuLabel)
3. Expected:
   - Tabel browse tampil dengan kolom: id, title, thumbnail, category, tags, createdAt
   - category menampilkan name (bukan "-")
   - tags menampilkan tag names (bukan raw JSON)
   - thumbnail menampilkan gambar (bukan "-")
   - Search, sort, pagination berfungsi
```

#### 5.2 Test DynamicCrudPage — Create Form
```
1. Klik "Create" button
2. Expected:
   - Form muncul dengan sections sesuai layoutConfig
   - Title field (text input, full width)
   - Content field (rich-text editor, full width)
   - Thumbnail field (image upload, full width)
   - Category field (NSelect, half width) — options loaded dari /api/generated/category
   - Tags field (NSelect multiple, half width) — options loaded dari /api/generated/tag
3. Isi form dan submit
4. Expected: Record created, tabel ter-refresh
```

#### 5.3 Test DynamicCrudPage — Edit Form
```
1. Klik "Edit" pada salah satu record
2. Expected:
   - Form terisi dengan data existing
   - Category field ter-select dengan value yang benar
   - Tags field ter-select dengan values yang benar
3. Update beberapa field dan submit
4. Expected: Record ter-update, tabel ter-refresh
```

#### 5.4 Test DynamicCrudPage — Delete
```
1. Klik "Delete" pada salah satu record
2. Expected: Confirm dialog muncul
3. Konfirmasi delete
4. Expected: Record terhapus, tabel ter-refresh
```

---

## Files to Modify

| # | File | Changes |
|---|------|---------|
| 1 | `server/src/modules/system-creators/services/sc-generator.service.ts` | Fix `@/` path resolution in compiled JS, auto-infer relations, fix column name mapping, fix findAll/findOne relation loading, fix module entity registration |
| 2 | `server/src/modules/managements/sc-modules-registry.json` | Remove old `posts` entry (manual cleanup) |
| 3 | `server/src/modules/managements/sc_posts/` | Delete entire directory (manual cleanup) |
| 4 | `server/db.sqlite` | Drop `posts` table or recreate database |

---

## Verification Checklist

### Module Loading
- [ ] `sc_posts/` directory exists with all 7 generated files (`.ts` + `.js`)
- [ ] Compiled `.js` files do NOT contain `require("@/...")` — only relative paths
- [ ] Server starts without errors related to posts module
- [ ] Dynamic loader successfully loads posts module (check server logs)

### CRUD Operations
- [ ] **Browse**: `GET /api/generated/posts` returns paginated list with relations
- [ ] **Read**: `GET /api/generated/posts/:id` returns full object with category and tags
- [ ] **Create**: `POST /api/generated/posts` creates record with relations
- [ ] **Update**: `PUT /api/generated/posts/:id` updates record with relations
- [ ] **Delete**: `DELETE /api/generated/posts/:id` removes record

### Data Integrity
- [ ] `category` field stores proper FK (category_id in database)
- [ ] `tags` field stores proper many-to-many relation (join table)
- [ ] `title`, `content`, `thumbnail` fields store correct types
- [ ] Activity logs recorded for create, update, delete operations

### Client-Side
- [ ] DynamicCrudPage renders browse table correctly
- [ ] Select-relation fields display relation names (not IDs)
- [ ] Multiple-select-relation fields display tag names (not JSON)
- [ ] Image fields display thumbnails (not "-")
- [ ] Create form has proper layout with sections
- [ ] Edit form pre-fills existing values correctly
- [ ] Search, sort, pagination work

### RBAC
- [ ] Admin role can access all CRUD operations
- [ ] Non-admin role gets 403 on protected endpoints

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Generator fix breaks other modules (product, category, tag) | HIGH | Test existing modules after fix |
| `ts.transpileModule` path replacement edge cases | MEDIUM | Handle both single/double quotes, template literals |
| Auto-infer relations conflicts with user-defined relations | LOW | Check `config.relations` before adding |
| Database table not dropped properly | LOW | Use `db.sqlite` recreation approach |

---

## Post-Fix: Generator Improvement (Optional)

Jika masih ada waktu, pertimbangkan improvement ini:

1. **Add `remove()` method to `ScRegistryService`** — hard delete (hapus entry dari JSON + hapus files dari disk)
2. **Add hot-reload for generated modules** — register routes tanpa restart server
3. **Improve error logging in `_dynamic-loader.ts`** — log full stack trace, bukan hanya `error.message`
4. **Add validation in generator** — pastikan `relationsConfig` konsisten dengan field types
