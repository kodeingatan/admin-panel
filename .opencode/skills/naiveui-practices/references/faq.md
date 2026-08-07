# FAQ Naive UI

## Umum

### Apakah Naive UI mendukung Vue 2?
Tidak. Naive UI hanya mendukung Vue 3 (>3.0.5). Untuk Vue 2, gunakan UI library lain.

### Apakah Naive UI mendukung SSR?
Ya. Naive UI dirancang untuk SSR tanpa asumsi client-only.

### Bagaimana cara mengganti tema ke dark mode?
```vue
<script setup>
import { computed, ref } from 'vue'
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

### Bagaimana cara custom warna primary?
```ts
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#your-color',
    primaryColorHover: '#your-color-hover',
    primaryColorPressed: '#your-color-pressed'
  }
}
```

### Apakah Naive UI bisa digunakan dengan Tailwind CSS?
Tidak direkomendasikan. Naive UI menggunakan CSS-in-JS internally. Gunakan theme overrides untuk kustomisasi.

## Import

### Kenapa saya tidak bisa menggunakan `v-model` biasa?
Naive UI v3 menggunakan `v-model:value` sesuai Vue 3 convention:
```vue
<!-- ❌ Salah -->
<n-input v-model="text" />

<!-- ✅ Benar -->
<n-input v-model:value="text" />
```

### Bagaimana cara import icon?
```bash
npm install @vicons/ionicons5
```

```vue
<script setup>
import { NIcon } from 'naive-ui'
import { AlertCircleOutline } from '@vicons/ionicons5'
</script>

<template>
  <n-icon :component="AlertCircleOutline" />
</template>
```

### Bagaimana cara menggunakan auto import?
```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ]
}
```

## Form

### Bagaimana cara validasi form?
```vue
<script setup>
import { ref } from 'vue'
import type { FormInst } from 'naive-ui'

const formRef = ref<FormInst>()

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    // submit
  } catch (errors) {
    console.error(errors)
  }
}
</script>

<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <!-- form items -->
  </n-form>
</template>
```

### Bagaimana cara custom error message?
```ts
const rules = {
  email: [
    {
      required: true,
      message: () => 'Email wajib diisi',
      trigger: 'blur'
    }
  ]
}
```

## DataTable

### Bagaimana cara sorting custom?
```ts
const columns = [
  {
    title: 'Nama',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
  }
]
```

### Bagaimana cara export CSV?
```vue
<template>
  <n-data-table
    :columns="columns"
    :data="data"
  />
</template>
```

Naive UI mendukung CSV export built-in.

### Bagaimana cara menambahkan kolom aksi?
```ts
import { h } from 'vue'
import { NButton } from 'naive-ui'

const columns = [
  // ... other columns
  {
    title: 'Aksi',
    key: 'actions',
    render(row) {
      return h(NButton, {
        size: 'small',
        onClick: () => handleEdit(row)
      }, { default: () => 'Edit' })
    }
  }
]
```

## Performance

### Bagaimana cara mengurangi bundle size?
1. Gunakan direct import: `import { NButton } from 'naive-ui'`
2. Jangan gunakan global install: `app.use(naive)`
3. Gunakan virtual scrolling untuk data besar
4. Lazy load komponen berat

### Apakah Naive UI support code splitting?
Ya. Karena tree-shakable, bundler seperti Vite dan Webpack bisa melakukan code splitting otomatis.

## Debugging

### Bagaimana cara melihat theme variables?
Buka Theme Editor di situs naiveui.com, atau gunakan `useThemeVars`:
```vue
<script setup>
import { useThemeVars } from 'naive-ui'

const vars = useThemeVars()
console.log(vars.value.primaryColor)
</script>
```

### Kenapa style tidak berubah saat tema diganti?
Pastikan menggunakan `NGlobalStyle` untuk sync body styles:
```vue
<n-config-provider :theme="theme">
  <app />
  <n-global-style />
</n-config-provider>
```
