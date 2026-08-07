# Komponen Naive UI

## Kategori Komponen

### Data Display
| Komponen | Fungsi |
|----------|--------|
| `NDataTable` | Tabel data dengan sorting, filtering, pagination |
| `NTree` | Hierarchical data visualization |
| `NTreeSelect` | Tree-based selection |
| `NCascader` | Multi-level cascading selection |
| `NAutoComplete` | Input dengan data suggestions |
| `NPagination` | Navigasi dataset |
| `NTag` | Label/status |
| `NAvatar` | Representasi user |
| `NBadge` | Indikator count |
| `NDescriptions` | Key-value display |

### Form Components
| Komponen | Fungsi |
|----------|--------|
| `NForm` | Container form dengan validation |
| `NFormItem` | Wrapper untuk setiap form field |
| `NInput` | Text input |
| `NInputNumber` | Number input |
| `NSelect` | Dropdown selection |
| `NDatePicker` | Date picker |
| `NTimePicker` | Time picker |
| `NColorPicker` | Color selection |
| `NSwitch` | Toggle switch |
| `NRadio` / `NRadioGroup` | Radio button |
| `NCheckbox` / `NCheckboxGroup` | Checkbox |
| `NSlider` | Range slider |
| `NRate` | Star rating |
| `NUpload` | File upload |

### Navigation & Layout
| Komponen | Fungsi |
|----------|--------|
| `NTabs` / `NTabPane` | Tabbed interface |
| `NMenu` | Hierarchical navigation |
| `NLayout` / `NLayoutHeader` / `NLayoutSider` / `NLayoutContent` | Layout system |
| `NBreadcrumb` | Breadcrumb navigation |
| `NAnchor` | Anchor navigation |
| `NAffix` | Sticky element |
| `NBackTop` | Back to top button |

### Feedback
| Komponen | Fungsi |
|----------|--------|
| `NDialog` / `useDialog` | Confirmation dialogs |
| `NModal` / `useModal` | Overlay windows |
| `NPopover` | Contextual overlay |
| `NDropdown` | Dropdown menu |
| `NMessage` / `useMessage` | Transient messages |
| `NNotification` / `useNotification` | Notifications |
| `NAlert` | Inline alerts |
| `NLoadingBar` / `useLoadingBar` | Loading indicator |
| `NSpin` | Spinner |

### Layout Primitives
| Komponen | Fungsi |
|----------|--------|
| `NCard` | Content container |
| `NDivider` | Visual separator |
| `NSpace` | Flex spacing |
| `NGrid` / `NGridItem` | Grid system |
| `NResult` | Result display |
| `NScrollbar` | Custom scrollbar |

## Pola Penggunaan Komponen

### Import di Script Setup
```vue
<script setup>
import { NButton, NInput, NForm, NFormItem } from 'naive-ui'
</script>
```

### Template Syntax
```vue
<template>
  <n-button type="primary" @click="handleClick">
    Click Me
  </n-button>
</template>
```

### Props Konsisten
| Props | Tipe | Fungsi |
|-------|------|--------|
| `size` | `'small' \| 'medium' \| 'large'` | Ukuran komponen |
| `disabled` | `boolean` | Nonaktifkan komponen |
| `loading` | `boolean` | Tampilkan loading state |
| `type` | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | Tipe visual |

### Event Naming
Semua event update menggunakan pola `on-update:*`:
```vue
<n-input @update:value="handleInput" />
<n-select @update:value="handleSelect" />
<n-data-table @update:filters="handleFilter" />
```
