# Anti-Patterns Naive UI

## 1. ❌ Global Import (Bundle Bloat)

```vue
<!-- ❌ Salah — semua komponen ter-load -->
<script setup>
import naive from 'naive-ui'
app.use(naive)
</script>
```

**Masalah**: Bundle size membengkak karena semua 90+ komponen di-load meskipun hanya digunakan beberapa.

**Solusi**: Gunakan direct import per komponen.

## 2. ❌ Menggunakan CSS Framework Lain

```vue
<!-- ❌ Salah — konflik styling -->
<n-button class="bg-blue-500 text-white px-4">
  Click
</n-button>
```

**Masalah**: Naive UI menggunakan CSS-in-JS internally. CSS framework lain dapat mengkonflik.

**Solusi**: Gunakan theme overrides Naive UI untuk kustomisasi.

## 3. ❌ Tidak Menggunakan NConfigProvider

```vue
<!-- ❌ Salah — tema dan locale tidak berfungsi -->
<template>
  <n-button>Click</n-button>
</template>
```

**Masalah**: Tema default tidak diterapkan, locale tidak berfungsi, provider programatik tidak tersedia.

**Solusi**: Selalu bungkus aplikasi dengan `NConfigProvider`.

## 4. ❌ Direct DOM Manipulation

```vue
<script setup>
function handleClick() {
  // ❌ Salah — menghindari reactive system
  document.querySelector('.n-button').style.color = 'red'
}
</script>
```

**Masalah**: Melanggar reactive system Vue, menyebabkan bugs yang sulit di-debug.

**Solusi**: Gunakan refs, reactive state, atau theme overrides.

## 5. ❌ Tidak Menggunakan Typed Forms

```vue
<!-- ❌ Salah — tidak ada type safety -->
<script setup>
const formValue = ref({})
</script>

<template>
  <n-form :model="formValue">
    <n-form-item label="Name">
      <n-input v-model:value="formValue.name" />
    </n-form-item>
  </n-form>
</template>
```

**Masalah**: Tidak ada autocompletion, tidak ada validasi type saat compile time.

**Solusi**: Gunakan TypeScript interface untuk form model.

## 6. ❌ Mengabaikan Event Naming Convention

```vue
<!-- ❌ Salah — event handler tidak berfungsi -->
<n-input @change="handleChange" />

<!-- ✅ Benar -->
<n-input @update:value="handleChange" />
```

**Masalah**: Event handler tidak dipanggil karena Naive UI menggunakan pola `on-update:*`.

**Solusi**: Selalu gunakan pola `on-update:*` untuk event handler.

## 7. ❌ Tidak Menggunakan Virtual Scrolling untuk Data Besar

```vue
<!-- ❌ Salah — render ribuan baris -->
<n-data-table :data="thousandsOfRows" />
```

**Masalah**: Browser akan crash atau sangat lambat saat render ribuan DOM elements.

**Solusi**: Gunakan `virtual-scroll` prop dan `max-height`.

## 8. ❌ Menggunakan v-model Tanpa Value

```vue
<!-- ❌ Salah -->
<n-select v-model="selected" :options="options" />

<!-- ✅ Benar -->
<n-select v-model:value="selected" :options="options" />
```

**Masalah**: Naive UI v3 menggunakan `v-model:value` alih-alih `v-model` biasa.

**Solusi**: Selalu gunakan `v-model:value` untuk semua komponen.

## 9. ❌ Tidak Menggunakan Provider untuk API Programatik

```vue
<script setup>
// ❌ Salah — message tidak akan muncul
import { useMessage } from 'naive-ui'

const message = useMessage()
message.success('Hello')
</script>
```

**Masalah**: `useMessage()` hanya bisa digunakan di dalam `NMessageProvider`.

**Solusi**: Bungkus komponen dengan provider yang sesuai.

## 10. ❌ Menggunakan Inline Styles untuk Theme

```vue
<!-- ❌ Salah — tidak responsive terhadap tema -->
<n-button :style="{ color: 'red' }">Click</n-button>
```

**Masalah**: Inline styles tidak berubah saat tema berganti (light/dark).

**Solusi**: Gunakan theme overrides atau CSS variables dari Naive UI.
