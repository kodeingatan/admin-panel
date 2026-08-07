# Tema Naive UI

## Arsitektur Tema

Naive UI menggunakan sistem tema CSS-in-JS yang dibangun dengan `css-render`. Tidak ada dependency CSS framework seperti Tailwind atau SASS.

### Hierarki Tema

```
Global Theme (common variables)
├── Component Theme (per-komponen)
└── Peers Theme (komponen internal)
```

## Tema Bawaan

### Light Theme (Default)
```ts
import { lightTheme } from 'naive-ui'
```

### Dark Theme
```ts
import { darkTheme } from 'naive-ui'
```

## Kustomisasi Tema

### Menggunakan ConfigProvider
```vue
<script setup>
import { NConfigProvider, darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a'
  },
  Button: {
    textColor: '#333',
    heightMedium: '40px'
  }
}
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <app />
  </n-config-provider>
</template>
```

### Menggunakan Theme Editor
```vue
<template>
  <n-theme-editor>
    <app />
  </n-theme-editor>
</template>

<script>
import { NThemeEditor } from 'naive-ui'
</script>
```

## Theme Variables Umum

| Variable | Deskripsi |
|----------|-----------|
| `primaryColor` | Warna utama |
| `primaryColorHover` | Warna hover |
| `primaryColorPressed` | Warna pressed |
| `infoColor` | Warna info |
| `successColor` | Warna sukses |
| `warningColor` | Warna warning |
| `errorColor` | Warna error |
| `borderRadius` | Border radius global |
| `fontFamily` | Font family global |
| `fontSize` | Font size base |

## Theme per Komponen

Setiap komponen memiliki theme variables sendiri:

```ts
const themeOverrides: GlobalThemeOverrides = {
  Button: {
    textColor: '#333',
    colorPrimary: '#18a058',
    borderRadiusMedium: '4px'
  },
  Input: {
    textColor: '#333',
    color: '#f5f5f5',
    border: '1px solid #d9d9d9'
  }
}
```

## Peers Variables

Komponen yang menggunakan komponen internal lain:

```ts
const themeOverrides: GlobalThemeOverrides = {
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#333',
        heightMedium: '42px'
      },
      InternalSelectMenu: {
        borderRadius: '6px'
      }
    }
  },
  DataTable: {
    paginationMargin: '40px 0 0 0',
    peers: {
      Empty: { textColor: '#999' },
      Pagination: { itemTextColor: '#333' }
    }
  }
}
```

## Dark/Light Theme Toggle

```vue
<script setup>
import { ref, computed } from 'vue'
import { darkTheme } from 'naive-ui'

const isDark = ref(false)
const theme = computed(() => isDark.value ? darkTheme : undefined)
</script>

<template>
  <n-config-provider :theme="theme">
    <n-switch v-model:value="isDark" />
    <app />
  </n-config-provider>
</template>
```

## Akses Theme Variables

```vue
<script setup>
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()
// themeVars.value.primaryColor
// themeVars.value.textColor
</script>
```

## Optimasi Performa

### Inline Theme Disabled
```vue
<n-config-provider :inline-theme-disabled="true">
  <app />
</n-config-provider>
```

Menggunakan class-based theming alih-alih inline CSS variables, lebih efisien untuk SSR.
