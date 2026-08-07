# Feedback Components Naive UI

## Dialog

### Component API

```vue
<template>
  <n-button @click="showDialog">Tampilkan Dialog</n-button>

  <n-dialog-provider>
    <dialog-consumer />
  </n-dialog-provider>
</template>

<script setup>
import { useDialog, useMessage } from 'naive-ui'

const dialog = useDialog()
const message = useMessage()

function showDialog() {
  dialog.warning({
    title: 'Konfirmasi',
    content: 'Apakah Anda yakin?',
    positiveText: 'Ya',
    negativeText: 'Tidak',
    onPositiveClick: () => {
      message.success('Dikonfirmasi')
    },
    onNegativeClick: () => {
      message.info('Dibatalkan')
    }
  })
}
</script>
```

### Dialog Options

| Props | Tipe | Deskripsi |
|-------|------|-----------|
| `title` | `string` | Judul dialog |
| `content` | `string \| () => VNodeChild` | Konten dialog |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | Tipe dialog |
| `positiveText` | `string` | Teks tombol positif |
| `negativeText` | `string` | Teks tombol negatif |
| `onPositiveClick` | `(e: MouseEvent) => boolean \| Promise<boolean>` | Handler tombol positif |
| `onNegativeClick` | `(e: MouseEvent) => boolean \| Promise<boolean>` | Handler tombol negatif |
| `onMaskClick` | `(e: MouseEvent) => void` | Handler klik mask |
| `onClose` | `() => void` | Handler close |
| `closable` | `boolean` | Tampilkan tombol close |
| `maskClosable` | `boolean` | Tutup dengan klik mask |

## Modal

### Component API

```vue
<template>
  <n-button @click="showModal = true">Tampilkan Modal</n-button>

  <n-modal
    v-model:show="showModal"
    title="Modal Title"
    positive-text="Submit"
    negative-text="Cancel"
    @positive-click="handleSubmit"
  >
    <p>Modal content</p>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)

function handleSubmit() {
  console.log('Submitted')
  showModal.value = false
}
</script>
```

### Programmatic Modal

```vue
<script setup>
import { useModal } from 'naive-ui'

const modal = useModal()

function showModal() {
  modal.create({
    title: 'Modal Title',
    content: 'Modal content',
    positiveText: 'OK'
  })
}
</script>
```

### Draggable Modal

```vue
<template>
  <n-modal
    v-model:show="showModal"
    draggable
    :style="{ width: '400px' }"
  >
    <!-- content -->
  </n-modal>
</template>
```

## Popover

### Component API

```vue
<template>
  <n-popover trigger="hover" :width="200">
    <template #trigger>
      <n-button>Hover me</n-button>
    </template>
    <p>Popover content</p>
  </n-popover>
</template>
```

### Trigger Types

| Trigger | Deskripsi |
|---------|-----------|
| `'hover'` | Tampilkan saat hover |
| `'click'` | Tampilkan saat klik |
| `'focus'` | Tampilkan saat focus |
| `'manual'` | Kontrol manual via `show` prop |

### Popover Features

```vue
<template>
  <n-popover
    trigger="click"
    placement="right"
    :width="300"
    :delay="300"
    :raw="false"
    :arrow="true"
    :offset="[10, 10]"
  >
    <template #trigger>
      <n-button>Klik saya</n-button>
    </template>
    <template #default>
      <p>Konten popover</p>
    </template>
  </n-popover>
</template>
```

## Dropdown

### Component API

```vue
<template>
  <n-dropdown :options="options" @select="handleSelect">
    <n-button>Aksi</n-button>
  </n-dropdown>
</template>

<script setup>
import { h } from 'vue'
import { NIcon } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'

const options: DropdownOption[] = [
  { label: 'Edit', key: 'edit' },
  { label: 'Duplicate', key: 'duplicate' },
  { type: 'divider', key: 'd1' },
  { label: 'Delete', key: 'delete' }
]

function handleSelect(key) {
  console.log('Dipilih:', key)
}
</script>
```

### Dropdown Features

```vue
<template>
  <n-dropdown
    :options="options"
    :disabled="false"
    trigger="click"
    placement="bottom-start"
    :width="200"
    :render-label="renderLabel"
    :render-icon="renderIcon"
    @select="handleSelect"
  >
    <n-button>Aksi</n-button>
  </n-dropdown>
</template>
```

## Message

### Programmatic API

```vue
<script setup>
import { useMessage } from 'naive-ui'

const message = useMessage()

// Tipe message
message.success('Berhasil!')
message.error('Gagal!')
message.warning('Peringatan!')
message.info('Info')
message.loading('Loading...')

// Dengan options
message.success('Berhasil!', {
  duration: 3000,
  closable: true,
  onClose: () => console.log('closed')
})
</script>
```

## Notification

### Programmatic API

```vue
<script setup>
import { useNotification } from 'naive-ui'

const notification = useNotification()

notification.success({
  title: 'Sukses',
  content: 'Operasi berhasil dilakukan',
  duration: 5000
})

notification.error({
  title: 'Error',
  content: 'Terjadi kesalahan',
  duration: 0, // tidak auto-close
  closable: true
})
</script>
```

## Alert

```vue
<template>
  <n-alert title="Title" type="info">
    Ini adalah info alert
  </n-alert>

  <n-alert title="Success" type="success" closable>
    Operasi berhasil
  </n-alert>

  <n-alert title="Warning" type="warning">
    <template #header-extra>
      <n-button size="small">Detail</n-button>
    </template>
    Perhatian!
  </n-alert>
</template>
```

## Loading Bar

```vue
<script setup>
import { useLoadingBar } from 'naive-ui'

const loadingBar = useLoadingBar()

loadingBar.start()
// ... async operation
loadingBar.finish()

// atau
loadingBar.error()
</script>
```

## Spin

```vue
<template>
  <n-spin :show="loading">
    <p>Konten yang sedang di-load</p>
  </n-spin>

  <n-spin size="large" />
</template>
```
