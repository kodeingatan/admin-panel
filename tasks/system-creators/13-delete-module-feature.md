# System Creators — Delete Module Feature

## Overview

Menambahkan fitur **hard delete** pada System Creators. Saat ini, tombol delete di ScTable hanya melakukan soft-delete (`isActive: false`). Fitur baru ini akan menghapus module secara permanen: folder generated files, registry entry, dan database table.

**Current behavior:**
- Tombol delete sudah ada di `ScTable.vue` (column Actions) dengan NPopconfirm
- Backend `remove()` hanya set `isActive: false` (soft-delete)
- Folder generated module dan database table TIDAK terhapus

**New behavior:**
- Hard delete: hapus folder `sc_{name}/` beserta semua isinya (`.ts` + `.js`)
- Hapus entry dari `sc-modules-registry.json` (src + dist)
- Drop database table yang di-generate
- Server auto-restart setelah delete

---

## Root Cause Analysis

### Current Delete Flow (Soft-Delete)

```
[ScTable.vue] → handleDelete(id) → store.remove(id) → DELETE /api/system-creators/{id}
                                                                  ↓
[sc-registry.service.ts] → remove() → set isActive=false → writeRegistry()
```

**Problem:** Folder `sc_{name}/` dan database table masih ada setelah "delete".

### New Delete Flow (Hard Delete)

```
[ScTable.vue] → handleDelete(id) → store.remove(id) → DELETE /api/system-creators/{id}
                                                                  ↓
[sc-registry.service.ts] → remove() → 1. Hapus folder sc_{name}/
                                       2. Hapus entry dari registry JSON
                                       3. Drop database table
                                       4. Log activity
```

---

## Implementation Plan

### Phase 1: Server — Update ScRegistryService

**File:** `server/src/modules/system-creators/services/sc-registry.service.ts`

#### 1.1 Update `remove()` Method

Ganti method `remove()` yang soft-delete dengan hard delete:

```typescript
async remove(id: number, req?: any) {
  const modules = this.readRegistry();
  const index = modules.findIndex((m) => m.id === id);
  if (index === -1) throw new NotFoundException('Module not found');

  const mod = modules[index];
  const moduleName = mod.name;

  // 1. Hapus folder generated module (sc_{name}/)
  const moduleDir = path.join(REGISTRY_DIR, `sc_${moduleName}`);
  if (fs.existsSync(moduleDir)) {
    fs.rmSync(moduleDir, { recursive: true, force: true });
    this.logger.log(`Deleted module folder: sc_${moduleName}`);
  }

  // 2. Hapus folder compiled dist (jika ada)
  const distModuleDir = path.join(
    process.cwd(), 'dist', 'modules', 'managements', `sc_${moduleName}`
  );
  if (fs.existsSync(distModuleDir)) {
    fs.rmSync(distModuleDir, { recursive: true, force: true });
    this.logger.log(`Deleted dist folder: sc_${moduleName}`);
  }

  // 3. Hapus entry dari registry
  modules.splice(index, 1);
  this.writeRegistry(modules);
  this.logger.log(`Removed module "${moduleName}" from registry`);

  // 4. Drop database table (TypeORM synchronize akan recreate jika ada new module)
  // Note: TypeORM synchronize tidak bisa drop table secara otomatis
  // Kita perlu gunakan query runner untuk drop table
  // Tapi karena kita tidak akses TypeORM connection di sini,
  // kita akan log warning agar admin tahu harus drop manual

  // 5. Log activity
  await this.activityLogsService.log({
    userId: req?.user?.sub,
    action: 'DELETE',
    entity: 'ScModule',
    entityId: id,
    description: `Deleted system creator module "${moduleName}" (hard delete)`,
    metadata: { name: moduleName, label: mod.label },
    ipAddress: req?.ip,
    userAgent: req?.headers?.['user-agent'],
  });

  return { success: true, message: `Module "${moduleName}" deleted permanently` };
}
```

#### 1.2 Add TypeORM Connection Injection (Optional — untuk Drop Table)

Jika ingin otomatis drop database table, inject TypeORM Connection:

```typescript
import { DataSource } from 'typeorm';

constructor(
  private readonly activityLogsService: ActivityLogsService,
  private readonly dataSource: DataSource,
) {}

// Di dalam remove():
try {
  await this.dataSource.query(`DROP TABLE IF EXISTS "${moduleName}"`);
  this.logger.log(`Dropped table: ${moduleName}`);
} catch (e) {
  this.logger.warn(`Failed to drop table "${moduleName}": ${e.message}`);
}
```

**Note:** Method ini bersifat optional. Jika tidak di-inject, admin perlu drop table manual atau menggunakan tool DB lain.

#### 1.3 Add Logger

Pastikan `Logger` sudah di-import di service:

```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
```

Dan tambahkan property:

```typescript
private readonly logger = new Logger(ScRegistryService.name);
```

---

### Phase 2: Client — Update Store & Service

**File:** `client/src/stores/system-creators.store.ts`

#### 2.1 Update `remove()` Method

Method `remove()` sudah ada dan berfungsi. Tidak perlu perubahan signifikan.

```typescript
async function remove(id: number) {
  loading.value = true
  try {
    await systemCreatorsService.remove(id)
    await fetchAll() // Refresh list setelah delete
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to delete module'
    throw e
  } finally {
    loading.value = false
  }
}
```

**Note:** Service `remove()` sudah ada di `system-creators.service.ts`:

```typescript
remove(id: number) {
  return api.delete(`/system-creators/${id}`)
}
```

Tidak perlu perubahan di service.

---

### Phase 3: Client — Update ScTable.vue (UX Improvement)

**File:** `client/src/features/system-creators/components/ScTable.vue`

#### 3.1 Update Delete Confirmation Message

Perbarui pesan konfirmasi delete agar lebih jelas bahwa ini hard delete:

```typescript
h(
  NPopconfirm,
  { onPositiveClick: () => handleDelete(row.id) },
  {
    trigger: () => h(NButton, { size: 'small', quaternary: true, type: 'error' }, { default: () => h(NIcon, null, { default: () => h(TrashCan) }) }),
    default: () => `Delete module "${row.label}" permanently? This will remove all files and cannot be undone.`,
  }
),
```

#### 3.2 Add Loading State pada Delete

Tambahkan loading state agar user tahu proses delete sedang berjalan:

```typescript
const deleting = ref(false)

async function handleDelete(id: number) {
  deleting.value = true
  try {
    await store.remove(id)
    message.success('Module deleted permanently')
  } catch {
    message.error('Failed to delete module')
  } finally {
    deleting.value = false
  }
}
```

---

### Phase 4: Server — Auto-Restart After Delete

**File:** `server/src/modules/system-creators/controllers/system-creators.controller.ts`

#### 4.1 Add Auto-Restart After Delete

Tambahkan auto-restart setelah delete (mirip dengan generate):

```typescript
@Delete(':id')
@Permissions('System Creators', 'Full Access')
@Roles('Super Admin')
async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
  const result = await this.registryService.remove(id, req);

  // Auto-restart server setelah 500ms
  setTimeout(() => {
    this.logger.log('Server restarting after module deletion...');
    process.exit(0);
  }, 500);

  return result;
}
```

**Note:** Pastikan `Logger` di-import di controller:

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, ParseIntPipe, Logger } from '@nestjs/common';
```

Dan tambahkan property:

```typescript
private readonly logger = new Logger(SystemCreatorsController.name);
```

---

## Files to Modify

| # | File | Changes |
|---|------|---------|
| 1 | `server/src/modules/system-creators/services/sc-registry.service.ts` | Update `remove()` method: hard delete folder + registry entry + drop table |
| 2 | `server/src/modules/system-creators/controllers/system-creators.controller.ts` | Add auto-restart after delete |
| 3 | `client/src/features/system-creators/components/ScTable.vue` | Update confirmation message, add loading state |

---

## Testing Flow

### Test 1: Delete Module via UI

```
1. Login sebagai Super Admin
2. Navigate ke /dashboard/system-creators
3. Pastikan ada minimal 1 module (misal: product)
4. Klik tombol Delete (ikon trash) pada module tersebut
5. Expected: Konfirmasi dialog muncul dengan pesan "Delete module 'Product' permanently?..."
6. Klik "OK" / "Confirm"
7. Expected:
   - Loading indicator muncul
   - Success message: "Module deleted permanently"
   - Module tidak muncul di tabel
   - Server restart otomatis (~2-3 detik)
```

### Test 2: Verify Files Deleted

```bash
# Setelah delete module "product"
ls -la server/src/modules/managements/sc_product/
# Expected: No such file or directory

ls -la server/src/modules/managements/sc_product.js
# Expected: No such file or directory
```

### Test 3: Verify Registry Updated

```bash
# Cek registry JSON
cat server/src/modules/managements/sc-modules-registry.json | jq '.[].name'
# Expected: Module "product" tidak ada dalam list
```

### Test 4: Verify API Endpoint Removed

```bash
# Setelah server restart
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/generated/product
# Expected: 404 Not Found
```

### Test 5: Verify Dynamic Route Removed

```
1. Login sebagai Admin (bukan Super Admin)
2. Navigate ke /dashboard/sc/product
3. Expected: Halaman tidak ditemukan atau redirect ke dashboard
```

### Test 6: Verify Sidebar Menu Updated

```
1. Login sebagai Admin
2. Periksa sidebar menu
3. Expected: Menu item untuk module "product" tidak ada
```

### Test 7: Verify Database Table Dropped (if implemented)

```bash
sqlite3 server/db.sqlite ".tables"
# Expected: Table "product" tidak ada
```

### Test 8: Test Delete Non-Existent Module

```bash
curl -X DELETE -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/system-creators/99999
# Expected: 404 "Module not found"
```

### Test 9: Test Permission

```bash
# Login sebagai Admin biasa (bukan Super Admin)
curl -X DELETE -H "Authorization: Bearer {admin-token}" \
  http://localhost:3000/api/system-creators/1
# Expected: 403 Forbidden
```

### Test 10: Verify Activity Log

```bash
# Setelah delete
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/activity-logs?page=1&limit=10"
# Expected: Ada log dengan action="DELETE", entity="ScModule", description berisi "hard delete"
```

### Test 11: Test Delete Then Re-Create

```
1. Delete module "product"
2. Buat ulang module "product" dengan config yang sama
3. Expected:
   - Module berhasil di-generate ulang
   - Folder sc_product/ tercipta lagi
   - Registry ada entry baru untuk product
   - API endpoint /api/generated/product berfungsi
```

---

## Verification Checklist

### Server
- [ ] `remove()` method menghapus folder `sc_{name}/` secara rekursif
- [ ] `remove()` method menghapus entry dari `sc-modules-registry.json`
- [ ] `remove()` method menghapus folder dist `sc_{name}/`
- [ ] `remove()` method drop database table (jika TypeORM di-inject)
- [ ] `remove()` method log activity dengan action="DELETE"
- [ ] Controller auto-restart server setelah delete
- [ ] Error handling untuk module yang tidak ditemukan (404)
- [ ] RBAC: hanya Super Admin yang bisa delete

### Client
- [ ] ScTable menampilkan tombol delete dengan konfirmasi
- [ ] Konfirmasi message menjelaskan hard delete
- [ ] Loading state muncul saat proses delete
- [ ] Success message muncul setelah delete
- [ ] Error message muncul jika delete gagal
- [ ] Tabel refresh setelah delete

### Integration
- [ ] Setelah delete, module tidak muncul di tabel list
- [ ] Setelah delete, API endpoint 404
- [ ] Setelah delete, dynamic route tidak berfungsi
- [ ] Setelah delete, sidebar menu tidak ada
- [ ] Setelah delete + restart, module bisa di-generate ulang

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Folder tidak terhapus karena permission | MEDIUM | Log error, return partial success |
| Registry JSON corrupt setelah delete | HIGH | Backup sebelum write, validate JSON |
| Database table drop gagal | LOW | Log warning, admin bisa drop manual |
| Server restart terlalu cepat | LOW | Gunakan timeout 500ms |
| User accidentally delete module | HIGH | Konfirmasi dialog dengan nama module |

---

## Post-Implementation (Optional)

1. **Add "Trash" page** — Tampilkan module yang sudah di-hard delete (dari activity logs) dengan opsi restore
2. **Add backup before delete** — Zip folder module sebelum dihapus
3. **Add bulk delete** — Pilih multiple modules untuk di-delete sekaligus
4. **Add soft-delete option** — Toggle antara soft-delete dan hard-delete
