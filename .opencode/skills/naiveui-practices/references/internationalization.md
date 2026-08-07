# Internationalization Naive UI

## Lokalisasi

Naive UI mendukung multi-bahasa melalui locale system yang dikonfigurasi di `NConfigProvider`.

## Pengaturan Locale

```vue
<script setup>
import { NConfigProvider } from 'naive-ui'
import { enUS, jaJP, zhCN } from 'naive-ui'
import { dateEnUS, dateJaJP, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="enUS" :date-locale="dateEnUS">
    <app />
  </n-config-provider>
</template>
```

## Locale yang Tersedia

### UI Locale
- `enUS` — English
- `zhCN` — 简体中文
- `zhTW` — 繁體中文
- `jaJP` — 日本語
- `koKR` — 한국어
- `ruRU` — Русский
- `deDE` — Deutsch
- `frFR` — Français
- `esAR` — Español (Argentina)
- `ptBR` — Português (Brasil)
- `itIT` — Italiano
- `plPL` — Polski
- `ukUA` — Українська
- `viVN` — Tiếng Việt
- `idID` — Bahasa Indonesia
- `thTH` — ไทย
- `trTR` — Türkçe
- `arDZ` — العربية (الجزائر)
- `arEG` — العربية (مصر)
- `arSA` — العربية (السعودية)
- `arIQ` — العربية (العراق)

### Date Locale
Setiap UI locale memiliki date locale yang sesuai:
- `dateEnUS`
- `dateZhCN`
- `dateJaJP`
- dst.

## Nested ConfigProvider

Locale bisa dikonfigurasi berbeda untuk bagian yang berbeda:

```vue
<template>
  <n-config-provider :locale="enUS">
    <header>
      <!-- English header -->
    </header>

    <n-config-provider :locale="jaJP">
      <main>
        <!-- Japanese main content -->
      </main>
    </n-config-provider>
  </n-config-provider>
</template>
```

## Custom Locale

```ts
const customLocale = {
  name: 'id-ID',
  locale: {
    // UI strings
  },
  date: {
    // Date locale
  }
}
```

## Penggunaan di Component

Komponen otomatis menggunakan locale dari `NConfigProvider`:

```vue
<!-- Teks placeholder dan label otomatis terjemahkan -->
<n-input placeholder="Ini akan diterjemahkan" />
<n-pagination />
<n-date-picker />
```

## Composable useLocale

```vue
<script setup>
import { useLocale } from 'naive-ui'

const { t } = useLocale()

// Menggunakan terjemahan
const placeholder = t('input.placeholder')
</script>
```

## Best Practices

1. **Satu locale untuk seluruh app** — Kecuali ada kebutuhan multi-bahasa dalam satu halaman
2. **Selalu sertakan date-locale** — Jika menggunakan date components
3. **Gunakan nested provider untuk multi-bahasa** — Untuk section yang berbeda bahasa
4. **Custom locale untuk kebutuhan spesifik** — Jika locale bawaan tidak tersedia
