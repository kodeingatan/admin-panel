---
name: naiveui-practices
description: Best practices untuk menggunakan Naive UI component library pada project Vue 3 + Vite. Mencakup installation, theming, form system, DataTable, navigation, feedback components, dan production recommendations.
metadata:
  author: opencompany
  version: "1.0"
  category: ui
  stack: vue3-vite
---

# Naive UI Best Practices Skill

## Tujuan

Skill ini menyediakan pedoman komprehensif untuk menggunakan **Naive UI** — komponen library Vue 3 yang dibuat oleh TuSimple — dengan benar dan efisif pada project Vue 3 + Vite.

## Kapan Skill Digunakan

- Saat menulis komponen Vue yang menggunakan Naive UI
- Saat mengkonfigurasi tema, locale, atau provider
- Saat membuat form dengan validasi
- Saat menggunakan DataTable, Tree, atau komponen data lainnya
- Saat mengintegrasikan feedback components (Dialog, Modal, Message, dll)
- Saat melakukan migrasi dari Naive UI v1 ke v3
- Saat mengoptimalkan performa bundle

## Kapan Skill Tidak Digunakan

- Saat menggunakan UI framework lain (Element Plus, Vuetify, dll)
- Saat hanya menggunakan CSS/Tailwind tanpa komponen library
- Saat bekerja di backend/server-side code

## Workflow Penggunaan

1. **Baca referensi** yang relevan dari folder `references/` sesuai topik
2. **Ikuti best practices** yang telah dirangkum dari dokumentasi resmi
3. **Hindari anti-patterns** yang terdaftar di `references/anti-patterns.md`
4. **Verifikasi** dengan linting dan type checking setelah implementasi

## Aturan Implementasi

### Import

```vue
<!-- ✅ Selalu gunakan direct import -->
<script setup>
import { NButton, NInput, NForm, NFormItem } from 'naive-ui'
</script>

<!-- ❌ Jangan gunakan global import -->
<script setup>
import naive from 'naive-ui'
app.use(naive)
</script>
```

### v-model

```vue
<!-- ✅ Gunakan v-model:value (Vue 3 convention) -->
<n-input v-model:value="text" />
<n-select v-model:value="selected" />

<!-- ❌ Jangan gunakan v-model biasa -->
<n-input v-model="text" />
```

### Event Handler

```vue
<!-- ✅ Gunakan pola on-update:* -->
<n-input @update:value="handleChange" />
<n-select @update:value="handleSelect" />

<!-- ❌ Jangan gunakan @change -->
<n-input @change="handleChange" />
```

### Provider

```vue
<!-- ✅ Selalu bungkus dengan NConfigProvider -->
<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <app />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<!-- ❌ Jangan gunakan komponen tanpa provider -->
<template>
  <n-button>Click</n-button>
</template>
```

### Theme

```vue
<script setup>
import { computed, ref } from 'vue'
import { darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

const isDark = ref(false)
const theme = computed(() => isDark.value ? darkTheme : undefined)

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43'
  }
}
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <app />
  </n-config-provider>
</template>
```

## Checklist Sebelum Implementasi

- [ ] Package `naive-ui` sudah terinstall
- [ ] Menggunakan direct import untuk setiap komponen
- [ ] Aplikasi dibungkus dengan `NConfigProvider`
- [ ] Provider programatik ditambahkan jika diperlukan (Message, Dialog, dll)
- [ ] Theme overrides disiapkan jika ada kustomisasi
- [ ] TypeScript types dikonfigurasi (`naive-ui/volar`)
- [ ] `NGlobalStyle` ditambahkan untuk sync body styles

## Checklist Setelah Implementasi

- [ ] Semua v-model menggunakan `v-model:value`
- [ ] Semua event handler menggunakan pola `on-update:*`
- [ ] Tidak ada global import (`app.use(naive)`)
- [ ] Form validation berfungsi dengan benar
- [ ] Theme konsisten di seluruh komponen
- [ ] Virtual scrolling diaktifkan untuk data >1000 rows
- [ ] Bundle size dioptimasi (cek dengan bundle analyzer)
- [ ] Type checking lulus (`vue-tsc -b`)
- [ ] Linting lulus

## Best Practices Ringkas

| Topik | Best Practice |
|-------|---------------|
| Import | Direct import per komponen |
| v-model | `v-model:value` |
| Events | `on-update:*` pattern |
| Provider | Selalu gunakan NConfigProvider |
| Theme | Gunakan GlobalThemeOverrides |
| Forms | Gunakan FormInst, rules dengan trigger |
| DataTable | Gunakan row-key, virtual-scroll untuk data besar |
| Tabs | Gunakan display-directive sesuai kebutuhan |
| Performance | Hindari global import, gunakan tree shaking |

## Conventions

- Semua komponen harus berada di dalam `NConfigProvider`
- Form components harus menggunakan controlled mode (`v-model:value`)
- DataTable harus memiliki `row-key` prop
- Theme overrides harus didefinisikan sebagai typed object (`GlobalThemeOverrides`)
- Event handlers harus menggunakan pola `on-update:*`
- Icon harus diimport dari package `@vicons/*`

## Anti-Patterns

Lihat `references/anti-patterns.md` untuk daftar lengkap anti-patterns.

Ringkasan anti-patterns utama:
- ❌ Global import (`app.use(naive)`)
- ❌ v-model tanpa `:value`
- ❌ Event handler `@change` alih-alih `@update:value`
- ❌ Menggunakan CSS framework lain
- ❌ Direct DOM manipulation
- ❌ Tidak menggunakan virtual scrolling untuk data besar
- ❌ Menggunakan inline styles untuk theme

## Hal yang Wajib Dihindari

1. **Jangan gunakan global import** — Bundle size membengkak
2. **Jangan gunakan v-model biasa** — Tidak sesuai Vue 3 convention
3. **Jangan gunakan @change** — Event tidak akan ter-trigger
4. **Jangan gunakan CSS framework lain** — Konflik styling
5. **Jangan abaikan TypeScript** — Kehilangan type safety
6. **Jangan skip provider** — Theme dan locale tidak berfungsi
7. **Jangan gunakan inline styles** — Tidak responsive terhadap tema
8. **Jangan render ribuan baris** — Tanpa virtual scrolling

## Referensi Internal

Folder `references/` berisi dokumentasi lengkap:

| File | Topik |
|------|-------|
| `official-documentation.md` | Sumber resmi dan overview |
| `installation.md` | Instalasi dan pola penggunaan |
| `configuration.md` | NConfigProvider dan konfigurasi |
| `concepts.md` | Konsep inti (provider, controlled/uncontrolled, composable) |
| `components.md` | Daftar komponen dan kategorinya |
| `theming.md` | Sistem tema dan kustomisasi |
| `form-system.md` | Form validation dan integrasi |
| `datatable.md` | DataTable lengkap |
| `navigation-layout.md` | Tabs, Menu, Breadcrumb, dll |
| `feedback-components.md` | Dialog, Modal, Popover, Message, dll |
| `internationalization.md` | Locale dan multi-bahasa |
| `performance.md` | Optimasi performa |
| `best-practices.md` | Best practices lengkap |
| `anti-patterns.md` | Anti-patterns yang harus dihindari |
| `common-mistakes.md` | Kesalahan umum dan solusinya |
| `migration-guide.md` | Migrasi v1 ke v3 |
| `production-recommendations.md` | Rekomendasi untuk production |
| `faq.md` | Pertanyaan umum |
| `changelog.md` | Changelog dan versi |

## Instruksi untuk AI

Ketika mengimplementasikan komponen Naive UI:

1. **Selalu rujuk folder references** sebelum menulis kode
2. **Ikuti pola import** yang benar (direct import)
3. **Gunakan TypeScript** dengan type yang sesuai
4. **Terapkan best practices** dari referensi
5. **Hindari semua anti-patterns** yang terdaftar
6. **Jangan membuat asumsi** — baca dokumentasi terlebih dahulu
7. **Verifikasi kode** dengan type checking dan linting
8. **Gunakan controlled mode** untuk form components
9. **Tambahkan provider** yang diperlukan
10. **Optimasi performa** dengan virtual scrolling dan tree shaking
