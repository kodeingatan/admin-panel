# Common Mistakes Naive UI

## 1. Menggunakan v-model Tanpa :value

```vue
<!-- ❌ Salah -->
<n-input v-model="text" />
<n-select v-model="selected" />

<!-- ✅ Benar -->
<n-input v-model:value="text" />
<n-select v-model:value="selected" />
```

**Alasan**: Naive UI v3 mengikuti Vue 3 convention yang menggunakan explicit v-model argument.

## 2. Menggunakan @change Alih-alih @update:value

```vue
<!-- ❌ Salah -->
<n-input @change="handleChange" />
<n-select @change="handleSelect" />

<!-- ✅ Benar -->
<n-input @update:value="handleChange" />
<n-select @update:value="handleSelect" />
```

**Alasan**: Event naming convention Naive UI v3 menggunakan pola `on-update:*`.

## 3. Tidak Bungkus dengan NConfigProvider

```vue
<!-- ❌ Salah — tema, locale, dan provider tidak berfungsi -->
<template>
  <n-button>Click</n-button>
  <n-message-provider>
    <app />
  </n-message-provider>
</template>

<!-- ✅ Benar -->
<template>
  <n-config-provider>
    <n-message-provider>
      <app />
    </n-message-provider>
  </n-config-provider>
</template>
```

## 4. Menggunakan useMessage di Luar Provider

```vue
<!-- ❌ Salah -->
<script setup>
import { useMessage } from 'naive-ui'
const message = useMessage() // Error! Tidak ada provider
</script>

<!-- ✅ Benar — harus di dalam NMessageProvider -->
<template>
  <n-message-provider>
    <my-component />
  </n-message-provider>
</template>
```

## 5. Menggunakan Global Import di Production

```ts
// ❌ Salah — bundle size membengkak
import naive from 'naive-ui'
app.use(naive)

// ✅ Benar — tree-shakable
import { NButton, NInput } from 'naive-ui'
```

## 6. Tidak Menggunakan row-key di DataTable

```vue
<!-- ❌ Salah — selection tidak berfungsi dengan benar -->
<n-data-table :data="data" :columns="columns" />

<!-- ✅ Benar -->
<n-data-table
  :data="data"
  :columns="columns"
  :row-key="(row) => row.id"
/>
```

## 7. Menggunakan Inline Styles untuk Theme

```vue
<!-- ❌ Salah — tidak responsive terhadap dark/light mode -->
<n-button :style="{ color: 'red' }">Click</n-button>

<!-- ✅ Benar — gunakan theme overrides -->
<script setup>
const themeOverrides = {
  Button: { textColor: 'red' }
}
</script>
```

## 8. Mengabaikan Default Value Props

```vue
<!-- ❌ Salah — uncontrolled mode tanpa default value -->
<n-input />

<!-- ✅ Benar — controlled atau uncontrolled dengan jelas -->
<n-input v-model:value="text" />
<!-- atau -->
<n-input default-value="" />
```

## 9. Menggunakan CSS Framework Lain

```vue
<!-- ❌ Salah — konflik styling -->
<n-button class="px-4 py-2 bg-blue-500">Click</n-button>

<!-- ✅ Benar — gunakan props Naive UI -->
<n-button type="primary" size="medium">Click</n-button>
```

## 10. Tidak Menggunakan Typed Forms

```vue
<!-- ❌ Salah — tidak ada type safety -->
<script setup>
const form = ref({})
</script>

<!-- ✅ Benar — gunakan TypeScript interface -->
<script setup lang="ts">
interface FormData {
  name: string
  email: string
}
const form = ref<FormData>({ name: '', email: '' })
</script>
```
