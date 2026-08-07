# Form System Naive UI

## Arsitektur Form

Form system dibangun di atas `NForm` dan `NFormItem` dengan integrasi `async-validator` untuk validasi.

```
NForm (validation rules, model)
├── NFormItem (field wrapper, label, validation)
│   ├── NInput
│   ├── NSelect
│   ├── NDatePicker
│   └── ... (input components)
```

## Dasar Penggunaan

```vue
<script setup>
import { ref } from 'vue'
import type { FormInst, FormItemRule } from 'naive-ui'

const formRef = ref<FormInst | null>(null)
const model = ref({
  name: '',
  email: '',
  age: null
})

const rules: Record<string, FormItemRule[]> = {
  name: [
    { required: true, message: 'Nama harus diisi', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email harus diisi', trigger: 'blur' },
    { type: 'email', message: 'Format email tidak valid', trigger: 'blur' }
  ],
  age: [
    { required: true, type: 'number', min: 18, message: 'Minimal 18 tahun', trigger: 'blur' }
  ]
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    console.log('Validasi berhasil')
  } catch (errors) {
    console.error('Validasi gagal:', errors)
  }
}
</script>

<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left">
    <n-form-item label="Nama" path="name">
      <n-input v-model:value="model.name" placeholder="Masukkan nama" />
    </n-form-item>
    <n-form-item label="Email" path="email">
      <n-input v-model:value="model.email" placeholder="Masukkan email" />
    </n-form-item>
    <n-form-item label="Umur" path="age">
      <n-input-number v-model:value="model.age" :min="18" />
    </n-form-item>
    <n-form-item>
      <n-button type="primary" @click="handleSubmit">Submit</n-button>
    </n-form-item>
  </n-form>
</template>
```

## Form Props

| Props | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `model` | `object` | - | Data model form |
| `rules` | `object` | - | Validasi rules |
| `label-placement` | `'left' \| 'top'` | `'top'` | Posisi label |
| `label-width` | `number \| string` | - | Lebar label |
| `label-align` | `'left' \| 'center' \| 'right'` | - | Align label |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Ukuran form |
| `disabled` | `boolean` | `false` | Nonaktifkan semua field |
| `show-feedback` | `boolean` | `true` | Tampilkan feedback |
| `show-require-mark` | `boolean` | `true` | Tampilkan tanda wajib |

## Form Item Props

| Props | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `label` | `string` | - | Label field |
| `path` | `string` | - | Path ke field di model |
| `required` | `boolean` | - | Tanda wajib |
| `validation-status` | `'error' \| 'warning' \| 'success'` | - | Status validasi manual |
| `feedback` | `string` | - | Pesan feedback manual |
| `ignore-path-change` | `boolean` | `false` | Abaikan perubahan path |

## Validation Rules

### Rule Types

```ts
interface FormItemRule {
  key?: string
  required?: boolean
  message?: string | (() => string)
  trigger?: 'input' | 'blur' | 'change'
  type?: 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email' | 'any'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: (rule: FormItemRule, value: any) => boolean | Promise<boolean>
  asyncValidator?: (rule: FormItemRule, value: any, callback: (error?: string) => void) => Promise<void>
}
```

### Trigger Types

| Trigger | Kapan Dieksekusi |
|---------|------------------|
| `'input'` | Setiap kali user mengetik |
| `'blur'` | Ketika field kehilangan focus |
| `'change'` | Ketika value berubah |

## Programmatic Validation

```vue
<script setup>
const formRef = ref<FormInst>()

// Validate specific fields
await formRef.value?.validate((errors) => {
  if (errors) {
    console.error(errors)
  }
})

// Validate and get promise
try {
  await formRef.value?.validate()
  // validation passed
} catch (errors) {
  // validation failed
}

// Restore validation state
formRef.value?.restoreValidation()
</script>
```

## Form Events

| Event | Parameter | Deskripsi |
|-------|-----------|-----------|
| `@validate` | `{validations: object}` | Ketika validasi selesai |

## Integration dengan Input Components

Semua form input components terintegrasi otomatis dengan form system melalui `useFormItem` hook:

- Size inheritance dari form
- Disabled state management
- Validation status propagation
- Form event triggering

## Warning vs Error

```ts
const rules = {
  email: [
    {
      required: true,
      type: 'email',
      message: 'Email tidak valid',
      level: 'error' // default
    },
    {
      type: 'email',
      message: 'Format email tidak direkomendasikan',
      level: 'warning'
    }
  ]
}
```

Level `'warning'` menampilkan border oranye, level `'error'` menampilkan border merah.
