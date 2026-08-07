# Data Table Naive UI

## Komponen NDataTable

Tabel data canggih dengan fitur sorting, filtering, pagination, selection, virtual scrolling, dan CSV export.

## Dasar Penggunaan

```vue
<script setup>
import { h, ref } from 'vue'
import { NButton, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const data = ref([
  { id: 1, name: 'John', age: 28, status: 'active' },
  { id: 2, name: 'Jane', age: 34, status: 'inactive' },
  { id: 3, name: 'Bob', age: 22, status: 'active' }
])

const columns: DataTableColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Nama', key: 'name', width: 200 },
  { title: 'Umur', key: 'age', width: 100, sorter: (a, b) => a.age - b.age },
  {
    title: 'Status',
    key: 'status',
    width: 120,
    render(row) {
      return h(NTag, {
        type: row.status === 'active' ? 'success' : 'warning'
      }, { default: () => row.status })
    }
  },
  {
    title: 'Aksi',
    key: 'actions',
    width: 150,
    render(row) {
      return h(NButton, {
        size: 'small',
        onClick: () => handleEdit(row)
      }, { default: () => 'Edit' })
    }
  }
]

function handleEdit(row) {
  console.log('Edit:', row)
}
</script>

<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :bordered="true"
    :single-line="false"
  />
</template>
```

## Props Utama

| Props | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `columns` | `DataTableColumns` | - | Definisi kolom |
| `data` | `object[]` | - | Data yang ditampilkan |
| `row-key` | `(row: object) => string \| number` | - | Unique key untuk row |
| `pagination` | `false \| PaginationProps` | `false` | Konfigurasi pagination |
| `loading` | `boolean` | `false` | Tampilkan loading state |
| `bordered` | `boolean` | `true` | Tampilkan border |
| `single-line` | `boolean` | `true` | Single line style |
| `striped` | `boolean` | `false` | Zebra striping |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Ukuran tabel |
| `max-height` | `number \| string` | - | Tinggi maksimum (aktifkan scroll) |
| `virtual-scroll` | `boolean` | `false` | Aktifkan virtual scrolling |
| `checked-row-keys` | `Key[]` | - | Selected rows (controlled) |
| `selectable` | `(row: object) => boolean` | - | Apakah row bisa diselect |

## Column Definition

```ts
interface DataTableColumn {
  title?: string
  key: string
  width?: number | string
  minWidth?: number | string
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  sortOrder?: 'ascend' | 'descend' | false
  sorter?: boolean | ((a: any, b: any) => number)
  defaultSortOrder?: 'ascend' | 'descend'
  render?: (row: any, index: number) => VNodeChild
  renderHeader?: (column: DataTableColumn) => VNodeChild
  children?: DataTableColumn[]
  resizable?: boolean
  draggable?: boolean
}
```

## Sorting

```ts
const columns = [
  {
    title: 'Nama',
    key: 'name',
    sorter: true // default sort
  },
  {
    title: 'Umur',
    key: 'age',
    sorter: (a, b) => a.age - b.age
  }
]
```

## Filtering

```vue
<script setup>
const columns = [
  {
    title: 'Status',
    key: 'status',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ],
    filter(value: any, row: any) {
      return row.status === value
    }
  }
]
</script>
```

## Selection

```vue
<script setup>
const checkedRowKeys = ref([])

function handleCheck(rowKeys) {
  checkedRowKeys.value = rowKeys
}
</script>

<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :checked-row-keys="checkedRowKeys"
    @update:checked-row-keys="handleCheck"
    :row-key="(row) => row.id"
  />
</template>
```

## Pagination

```vue
<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="{
      page: 1,
      pageSize: 10,
      showSizePicker: true,
      pageSizes: [10, 20, 50],
      onChange: (page) => {},
      onUpdatePageSize: (pageSize) => {}
    }"
  />
</template>
```

## Virtual Scrolling

```vue
<template>
  <n-data-table
    :columns="columns"
    :data="largeDataset"
    virtual-scroll
    :max-height="400"
  />
</template>
```

## Expandable Rows

```ts
const columns = [
  {
    type: 'expand',
    renderExpand(row) {
      return h('div', { style: 'padding: 12px' }, [
        h('p', `Detail untuk ${row.name}`)
      ])
    }
  },
  // ... other columns
]
```

## Summary Row

```vue
<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :summary-method="getSummary"
  />
</template>

<script setup>
function getSummary({ columns, data }) {
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = 'Total'
      return
    }
    const values = data.map(item => Number(item[column.key]))
    if (!values.every(isNaN)) {
      const sum = values.reduce((a, b) => a + b, 0)
      sums[index] = sum
    } else {
      sums[index] = 'N/A'
    }
  })
  return sums
}
</script>
```

## CSV Export

```ts
import { csv export from naive-ui' }

function exportCSV() {
  // DataTable provides built-in CSV export
}
```

## Event

| Event | Parameter | Deskripsi |
|-------|-----------|-----------|
| `@update:checked-row-keys` | `(keys: Key[])` | Selection berubah |
| `@update:filters` | `(filters: object)` | Filter berubah |
| `@update:sorter` | `(sorter: object)` | Sorter berubah |
| `@update:page` | `(page: number)` | Halaman berubah |
| `@update:pageSize` | `(pageSize: number)` | Page size berubah |
| `@scroll` | `(e: Event)` | Scroll event |
