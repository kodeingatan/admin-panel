# Konfigurasi Naive UI

## NConfigProvider

Komponen pusat untuk mengelola konfigurasi global. Seluruh komponen Naive UI harus berada di dalam provider ini.

```vue
<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <n-global-style />
    <app />
  </n-config-provider>
</template>
```

## Konfigurasi yang Tersedia

| Tipe | Property | Deskripsi |
|------|----------|-----------|
| Theme | `theme` | Tema aktif (light/dark) |
| Theme Overrides | `theme-overrides` | Custom theme variables |
| Locale | `locale` | Terjemahan UI text |
| Date Locale | `date-locale` | Format tanggal/waktu |
| Components | `component-props` | Props global per komponen |
| Icons | `icons` | Mapping icon global |
| RTL | `rtl` | Right-to-left layout |
| CSS Prefix | `cls-prefix` | CSS class prefix |

## Hierarki Konfigurasi

Prioritas dari tertinggi ke terendah:
1. Component-level `theme-overrides` prop
2. Nearest parent `NConfigProvider` theme-overrides
3. Built-in component theme
4. Global theme defaults

## Inline Theme Control

Untuk optimasi SSR atau devtools yang lebih bersih:

```vue
<n-config-provider :inline-theme-disabled="true">
  <app />
</n-config-provider>
```

Ketika diaktifkan, komponen menggunakan class-based theming alih-alih inline style variables.

## Style Mount Target

Kontrol dimana style di-inject:

```vue
<n-config-provider style-mount-target="head">
  <app />
</n-config-provider>
```

## Global Style Sync

Gunakan `NGlobalStyle` untuk menyinkronkan tema ke `document.body`:

```vue
<n-config-provider :theme="theme">
  <app />
  <n-global-style />
</n-config-provider>
```

Ini penting karena:
1. Naive UI mount global style yang tidak responsive terhadap tema
2. `n-config-provider` tidak bisa sync global style ke luar scope-nya
