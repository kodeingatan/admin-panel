# 19 — App Description Setting

## Goal
Tambahkan setting `app_description` yang bisa diedit di halaman Settings, dan tampilkan nilainya pada halaman Login/Register sebagai pengganti teks hardcoded "Sistem manajemen bisnis digital".

---

## Server

### 1. Seeder — tambah default value
**File**: `server/src/common/services/seeder.service.ts` — `seedSettings()`

Tambahkan entry baru di array `defaultSettings`:
```ts
{ key: 'app_description', value: 'Sistem manajemen bisnis digital' },
```

> Tidak perlu ubah entity, service, controller, atau DTO — sudah key-value generic.

---

## Client

### 2. Settings Store — tambah ref `appDescription`
**File**: `client/src/stores/settings.store.ts`

- Tambah `const appDescription = ref('Sistem manajemen bisnis digital')`
- Tambah mapping di `applySettings()`: `if (map['app_description']) appDescription.value = map['app_description']`
- Export `appDescription` dari store

### 3. Settings Page — tambah input field
**File**: `client/src/views/SettingsPage.vue`

- Tambah `const appDescription = ref('')`
- In `onMounted`: isi `appDescription.value = settingsStore.appDescription`
- Tambahkan card baru di `settings-grid` (setelah card Nama Aplikasi):
  - Header: icon `Document` + label "Deskripsi Aplikasi"
  - Body: `NInput` v-model `appDescription`, type `textarea`, placeholder "Masukkan deskripsi aplikasi"
  - Hint: "Deskripsi yang tampil di halaman login & register"
- Di `handleSave()`, tambah `{ key: 'app_description', value: appDescription.value }` ke array

### 4. AuthLayout — gunakan setting
**File**: `client/src/components/common/AuthLayout/AuthLayout.vue`

Ganti line 44:
```html
<!-- sebelum -->
<p class="auth-image__subtitle">Sistem manajemen bisnis digital</p>
<!-- sesudah -->
<p class="auth-image__subtitle">{{ settingsStore.appDescription }}</p>
```

Store sudah di-import (`settingsStore`) — tinggal akses properti baru.

---

## Files yang diubah

| File | Perubahan |
|------|-----------|
| `server/src/common/services/seeder.service.ts` | Tambah 1 line di `seedSettings()` |
| `client/src/stores/settings.store.ts` | Tambah 1 ref + 1 mapping + export |
| `client/src/views/SettingsPage.vue` | Tambah ref, load on mount, 1 NCard, 1 entry di save |
| `client/src/components/common/AuthLayout/AuthLayout.vue` | Ganti hardcoded string → store |

---

## Checklist

- [ ] Server: seeder `app_description` default
- [ ] Client store: `appDescription` ref + `applySettings` + export
- [ ] Client settings: input textarea card + save
- [ ] Client auth layout: tampilkan dari store
- [ ] Test: buka /dashboard/settings → isi deskripsi → save → buka /login → teks berubah
