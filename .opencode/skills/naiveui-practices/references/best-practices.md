# Best Practices Naive UI

## 1. Selalu Gunakan Direct Import

```vue
<!-- ✅ Benar -->
<script setup>
import { NButton, NInput } from 'naive-ui'
</script>

<!-- ❌ Salah — kehilangan tree-shaking -->
<script setup>
import naive from 'naive-ui'
</script>
```

**Alasan**: Direct import memungkinkan tree-shaking, mengurangi bundle size secara signifikan.

## 2. Bungkus Aplikasi dengan NConfigProvider

```vue
<!-- ✅ Benar -->
<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <app />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
```

**Alasan**: Provider diperlukan untuk tema, locale, dan komponen programatik.

## 3. Gunakan useMessage/useDialog untuk API Programatik

```vue
<script setup>
import { useMessage, useDialog } from 'naive-ui'

const message = useMessage()
const dialog = useDialog()

function handleDelete() {
  dialog.warning({
    title: 'Konfirmasi',
    content: 'Yakin ingin menghapus?',
    onPositiveClick: () => {
      message.success('Berhasil dihapus')
    }
  })
}
</script>
```

**Alasan**: API programatik lebih fleksibel dan tidak memerlukan template state management.

## 4. Gunakan Controlled Mode untuk Form

```vue
<script setup>
import { ref } from 'vue'

const formValue = ref({
  name: '',
  email: ''
})

const rules = {
  name: { required: true, message: 'Nama harus diisi' },
  email: { required: true, type: 'email', message: 'Email tidak valid' }
}
</script>

<template>
  <n-form v-model:value="formValue" :rules="rules">
    <n-form-item label="Nama" path="name">
      <n-input v-model:value="formValue.name" />
    </n-form-item>
  </n-form>
</template>
```

**Alasan**: Controlled mode memudahkan validasi dan state management.

## 5. Gunakan NGlobalStyle untuk Sync Body Style

```vue
<n-config-provider :theme="theme">
  <app />
  <n-global-style />
</n-config-provider>
```

**Alasan**: Global style seperti font-family tidak otomatis sync ke body.

## 6. Gunakan Theme Overrides untuk Konsistensi

```ts
// theme.ts
import type { GlobalThemeOverrides } from 'naive-ui'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43'
  },
  Button: {
    textColor: '#333'
  }
}
```

**Alasan**: Theme overrides menjamin konsistensi visual di seluruh aplikasi.

## 7. Gunakan Typed Components untuk TypeScript

```vue
<script setup lang="ts">
import type { FormInst, FormItemRule } from 'naive-ui'
import { NForm, NFormItem, NInput } from 'naive-ui'

const formRef = ref<FormInst | null>(null)

const rules: Record<string, FormItemRule[]> = {
  name: [{ required: true, message: 'Wajib diisi', trigger: 'blur' }]
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    // submit logic
  } catch (errors) {
    console.error(errors)
  }
}
</script>
```

**Alasan**: TypeScript memberikan type safety dan autocompletion yang lebih baik.

## 8. Gunakan Display Directive untuk Tabs

```vue
<!-- ✅ Konten dihancurkan saat tab tidak aktif -->
<n-tabs display-directive="if">
  <n-tab-pane name="tab1" tab="Tab 1">Content 1</n-tab-pane>
  <n-tab-pane name="tab2" tab="Tab 2">Content 2</n-tab-pane>
</n-tabs>

<!-- ✅ Konten disembunyikan saat tab tidak aktif -->
<n-tabs display-directive="show">
  <n-tab-pane name="tab1" tab="Tab 1">Content 1</n-tab-pane>
</n-tabs>
```

**Alasan**: `show` mempertahankan state, `if` menghemat memory.

## 9. Gunakan Peers Variables untuk Kompleks

```vue
<script setup>
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#333'
      },
      InternalSelectMenu: {
        borderRadius: '6px'
      }
    }
  }
}
</script>
```

**Alasan**: Beberapa komponen menggunakan komponen internal lain yang perlu di-style.

## 10. Virtual Scrolling untuk Dataset Besar

```vue
<n-data-table
  :columns="columns"
  :data="largeDataset"
  :pagination="{ pageSize: 100 }"
  :virtual-scroll="true"
  :max-height="400"
/>
```

**Alasan**: Virtual scrolling mencegah browser crash saat menampilkan ribuan baris.
