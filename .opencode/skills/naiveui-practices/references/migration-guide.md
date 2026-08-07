# Migration Guide v1 ke v3

## Overview

Migrasi dari Naive UI v1 ke v3 melibatkan perubahan dari Vue 2 ke Vue 3, dengan perubahan API signifikan.

## Perubahan Dependencies

### Package yang Dipindah
| Asset | V1 | V3 |
|-------|----|----|
| Icons | `naive-ui/lib/icons/*` | `xicons` package |
| Fonts | `naive-ui/lib/styles/fonts/*` | `vfonts` package |
| CSS Index | `naive-ui/lib/styles/index.css` | Dihapus (gunakan component-level) |

### Install Dependencies Baru
```bash
npm install vfonts @vicons/ionicons5
```

## Perubahan v-model Syntax

```vue
<!-- V1 -->
<n-input v-model="text" />
<n-select v-model="selected" />

<!-- V3 -->
<n-input v-model:value="text" />
<n-select v-model:value="selected" />
```

## Perubahan Event Naming

| Komponen | V1 Event | V3 Event |
|----------|----------|----------|
| Input | `@change` | `@update:value` |
| Select | `@change` | `@update:value` |
| Checkbox | `@change` | `@update:checked` |
| Pagination | `@page-change` | `@update:page` |
| DataTable | `@filters-change` | `@update:filters` |

## Perubahan Props

### Layout Components
| Komponen | V1 | V3 |
|----------|----|----|
| `n-affix` | `target` | `listen-to` |
| `n-anchor` | `target` | `listen-to` |
| `n-layout-sider` | `use-native-scrollbar` | `native-scrollbar` |

### Provider Components
```vue
<!-- V1 -->
<n-message-provider ref="messageProvider">
  <app />
</n-message-provider>

<!-- V3 -->
<n-message-provider>
  <app />
</n-message-provider>

<script setup>
import { useMessage } from 'naive-ui'
const message = useMessage() // di dalam komponen
</script>
```

## Perubahan Theme System

```ts
// V1 — string-based
const theme = 'dark'

// V3 — object-based
import { darkTheme } from 'naive-ui'
const theme = darkTheme
```

## Perubahan Icon System

```vue
<!-- V1 -->
<n-icon><ios-alert /></n-icon>

<!-- V3 -->
<script setup>
import { NIcon } from 'naive-ui'
import { AlertCircleOutline } from '@vicons/ionicons5'
</script>

<template>
  <n-icon :component="AlertCircleOutline" />
</template>
```

## Perubahan ConfigProvider

```vue
<!-- V1 -->
<n-config-provider theme="dark" :locale="enUS">
  <app />
</n-config-provider>

<!-- V3 -->
<n-config-provider :theme="darkTheme" :locale="enUS" :date-locale="dateEnUS">
  <app />
</n-config-provider>
```

## Checklist Migrasi

### Sebelum Migrasi
- [ ] Update Vue ke versi 3.x
- [ ] Install dependencies baru (`vfonts`, `@vicons/ionicons5`)
- [ ] Hapus import `naive-ui/lib/styles/index.css`
- [ ] Hapus import `naive-ui/lib/icons/*`

### Saat Migrasi
- [ ] Update semua v-model syntax
- [ ] Ganti event handler dengan pola `on-update:*`
- [ ] Tambahkan `default-value` props jika diperlukan
- [ ] Update provider components ke composition API hooks
- [ ] Migrate theme configuration ke object-based themes

### Setelah Migrasi
- [ ] Test semua form components dengan v-model syntax baru
- [ ] Verify provider pattern components bekerja dengan hooks baru
- [ ] Check theme application dengan configuration system baru
- [ ] Validate build output untuk tree-shaking yang benar
