# Task 10: Fix Alert Design, Animation & Super Admin Access

## Analisis Masalah

### Masalah 1: Alert menggeser design & tidak ada animasi

**Root Cause**:
- `AccessDeniedAlert.vue` menggunakan `v-if` yang menyebabkan DOM insertion/removal
- Tidak ada CSS transition/animation untuk animasi muncul/hilang
- Meskipun menggunakan `fixed` positioning, `v-if` menyebabkan re-render yang bisa mempengaruhi layout

**File terkait**:
- `client/src/components/common/AccessDeniedAlert.vue` — komponen alert utama

### Masalah 2: Super Admin tidak dapat mengakses fitur manage

**Root Cause**:
- `auth.service.ts` method `getProfile()` dan `login()` **tidak mengembalikan data roles/permissions/guards**
- Response hanya berisi basic user info: `{ id, firstName, lastName, username, email }`
- Frontend type `User` mengharapkan `roles: Role[]`, tapi data roles tidak pernah dikirim

**Dampak**:
- `useAuthorization().hasAnyRole(['Admin', 'Super Admin'])` selalu return `false`
- Sidebar menu User Management tidak pernah muncul
- Router guard membaca roles dari localStorage, tapi login response tidak include roles
- `useAuthorization` composable tidak bisa menentukan permissions/guards

**File terkait**:
- `server/src/modules/auth/services/auth.service.ts` — `login()` & `getProfile()`
- `client/src/stores/auth.store.ts` — menyimpan user data dari response
- `client/src/composables/useAuthorization.ts` — membaca roles/permissions dari authStore
- `client/src/components/layout/AppLayout/AppLayout.vue` — sidebar menu menggunakan `hasAnyRole`

### Masalah 3: Seeder type bug

**Root Cause**:
- `seedGuards()` method memiliki return type `Promise<Role[]>` padahal seharusnya `Promise<Guard[]>`
- Tidak mempengaruhi runtime (karena `any[]` di `seedRoles`), tapi merupakan type safety issue

**File terkait**:
- `server/src/common/services/seeder.service.ts` — `seedGuards()` return type

---

## Rencana Implementasi

### Langkah 1: Fix auth.service.ts — Return roles/permissions/guards

**File**: `server/src/modules/auth/services/auth.service.ts`

**Perubahan pada `login()` method**:
```typescript
// Saat ini (BENAR - tidak perlu ubah login, karena login mengembalikan data user tanpa roles)
// Login cukup return basic info + token, frontend fetch profile setelah login
```

**Perubahan pada `getProfile()` method**:
```typescript
async getProfile(userId: number) {
  const user = await this.usersRepository.findOne({
    where: { id: userId },
    relations: {
      roles: {
        guards: { urls: true },
        permissions: { methods: true, urls: true },
      },
    },
  });
  if (!user) {
    throw new UnauthorizedException();
  }

  const { password, ...result } = user as any;
  return result;
}
```

**Alasan**: Frontend memanggil `fetchProfile()` setelah login untuk mendapatkan data lengkap termasuk roles. Profile endpoint harus mengembalikan data user dengan relasi roles → guards → urls dan roles → permissions → methods & urls.

### Langkah 2: Fix AccessDeniedAlert.vue — Tambah animasi & fix layout shift

**File**: `client/src/components/common/AccessDeniedAlert.vue`

**Perubahan**:
1. Ganti `v-if` menjadi `v-show` agar DOM selalu ada, hanya visibility yang diubah
2. Tambah CSS transition untuk slide-in dari kanan dan fade
3. Gunakan `transform: translateX()` untuk animasi geser
4. Tambah `will-change: transform, opacity` untuk performance

**Implementasi**:
```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { NAlert, NIcon } from 'naive-ui'
import { Locked } from '@vicons/carbon'

const visible = ref(false)
const message = ref('')

function handleDenied(event: Event) {
  const detail = (event as CustomEvent).detail
  message.value = detail?.message || 'Access denied'
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, 5000)
}

onMounted(() => window.addEventListener('rbac-denied', handleDenied))
onUnmounted(() => window.removeEventListener('rbac-denied', handleDenied))
</script>

<template>
  <Transition name="alert-slide">
    <NAlert
      v-show="visible"
      type="error"
      :bordered="false"
      class="fixed top-4 right-4 z-50 shadow-lg max-w-md"
      closable
      @close="visible = false"
    >
      <template #icon>
        <NIcon><Locked /></NIcon>
      </template>
      <template #header>Access Denied</template>
      {{ message }}
    </NAlert>
  </Transition>
</template>

<style scoped>
.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.alert-slide-enter-from,
.alert-slide-leave-to {
  transform: translateX(120%);
  opacity: 0;
}

.alert-slide-enter-to,
.alert-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
```

### Langkah 3: Fix seeder return type

**File**: `server/src/common/services/seeder.service.ts`

**Perubahan**:
```typescript
// Ubah return type dari seedGuards()
private async seedGuards(): Promise<Guard[]> {
  // ... existing code ...
  return [fullAccess, webAccess, apiOnly, adminOnly, readOnlyGuard, userMgmtGuard, roleMgmtGuard, dashboardOnly];
}
```

### Langkah 4: Re-seed database

**Alasan**: Database mungkin sudah ter-seed sebelum perubahan RBAC. Perlu delete `db.sqlite` dan restart server untuk memastikan seed data yang benar.

**Command**:
```bash
rm server/db.sqlite
cd server && npm run start:dev
```

### Langkah 5: Update docs/

**File**: `docs/PRD.md`
- Tambahkan section tentang animasi alert pada bagian UI/UX
- Update authorization flow untuk menjelaskan data yang dikembalikan profile endpoint

**File**: `docs/architecture.md`  
- Update bagian auth flow: profile endpoint mengembalikan user + roles + permissions + guards
- Document accessor pattern: User → Roles → Guards → GuardUrls, User → Roles → Permissions → PermissionMethods + PermissionUrls

### Langkah 6: Update AGENTS.md

**File**: `AGENTS.md`
- Tambahkan note bahwa `getProfile()` mengembalikan data user dengan relasi lengkap (roles, guards, permissions)
- Note bahwa alert menggunakan animation transition

---

## Urutan Eksekusi

1. **Fix `auth.service.ts`** — Tambahkan relasi ke `getProfile()` (paling krusial)
2. **Fix `AccessDeniedAlert.vue`** — Ganti `v-if` → `v-show` + tambah CSS transition
3. **Fix `seeder.service.ts`** — Koreksi return type `seedGuards()`
4. **Delete `db.sqlite` + restart server** — Re-seed database
5. **Update `docs/`** — PRD.md & architecture.md
6. **Update `AGENTS.md`** — Catatan baru

---

## Verifikasi

### Test 1: Alert Animation
- Login sebagai user biasa (non-admin)
- Akses `/dashboard/users` → harus muncul alert dengan animasi slide dari kanan
- Alert harus hilang setelah 5 detik dengan animasi
- Layout tidak boleh geser saat alert muncul/hilang

### Test 2: Super Admin Access
- Login sebagai `admin@admin.com` / `P455w0rd!!!`
- Sidebar harus menampilkan menu User Management (User, Guard, Role, Permissions)
- Bisa akses semua halaman: `/dashboard/users`, `/dashboard/roles`, `/dashboard/permissions`, `/dashboard/guards`
- Semua CRUD operations harus berhasil (create, read, update, delete)

### Test 3: Role-Based Access
- Login sebagai `editor@example.com` / `P455w0rd!!!`
- Sidebar tidak boleh menampilkan menu User Management
- Akses `/dashboard/users` harus ditolak dengan alert

### Test 4: Type Check
```bash
cd client && npx vue-tsc -b --noEmit  # Type check frontend
cd server && npx tsc --noEmit          # Type check backend
```
