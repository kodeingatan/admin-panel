<script setup lang="ts">
import { h, computed } from 'vue'
import { NTag, NSpace, NButton, NPopconfirm, NIcon, NText } from 'naive-ui'
import { View, Edit, TrashCan } from '@vicons/carbon'
import DataTable from '@/components/common/DataTable/DataTable.vue'
import type { ScModule, ScFieldConfig } from '@/types/system-creator'

const props = defineProps<{
  module: ScModule
  data: any[]
  loading: boolean
  page: number
  limit: number
  total: number
  sortBy: string
  sortOrder: 'ASC' | 'DESC'
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', item: any): void
  (e: 'detail', item: any): void
  (e: 'delete', id: number): void
  (e: 'update:page', p: number): void
  (e: 'update:limit', l: number): void
  (e: 'sort-change', sorter: { columnKey: string; order: 'ascend' | 'descend' | false }): void
  (e: 'search', value: string): void
  (e: 'search-field-change', field: string): void
}>()

function renderCellValue(field: ScFieldConfig, row: any) {
  const val = row[field.name]
  if (val === null || val === undefined) return h(NText, { depth: 3 }, () => '-')

  switch (field.type) {
    case 'boolean':
      return h(NTag, { size: 'small', type: val ? 'success' : 'default', bordered: false }, () => val ? 'Yes' : 'No')
    case 'date':
      return new Date(val).toLocaleDateString()
    case 'datetime':
      return new Date(val).toLocaleString()
    case 'select': {
      const opt = field.options?.find((o) => o.value === val)
      return h(NTag, { size: 'small', bordered: false }, () => opt?.label || val)
    }
    case 'password':
      return '••••••'
    case 'json':
      return h(NText, { code: true, depth: 3 }, () => typeof val === 'string' ? val.slice(0, 50) : JSON.stringify(val).slice(0, 50))
    case 'file':
      return h(NButton, { size: 'small', text: true, tag: 'a', href: val, target: '_blank' }, () => 'Download')
    case 'image':
      return h('img', { src: val, style: 'width:32px;height:32px;border-radius:4px;object-fit:cover;' })
    default:
      return String(val)
  }
}

const columns = computed(() => {
  const fields = props.module.fieldsConfig || []
  const cols: any[] = fields
    .filter((f) => f.visible)
    .map((f) => ({
      key: f.name,
      title: f.label,
      sortable: f.sortable,
      render: (row: any) => renderCellValue(f, row),
    }))

  cols.push({
    key: 'actions',
    title: 'Actions',
    sortable: false,
    width: 140,
    render: (row: any) =>
      h(NSpace, { size: 4 }, () => [
        h(NButton, { size: 'small', quaternary: true, type: 'info', onClick: () => emit('detail', row) }, { default: () => h(NIcon, null, { default: () => h(View) }) }),
        h(NButton, { size: 'small', quaternary: true, type: 'warning', onClick: () => emit('edit', row) }, { default: () => h(NIcon, null, { default: () => h(Edit) }) }),
        h(NPopconfirm, { onPositiveClick: () => emit('delete', row.id) }, {
          trigger: () => h(NButton, { size: 'small', quaternary: true, type: 'error' }, { default: () => h(NIcon, null, { default: () => h(TrashCan) }) }),
          default: () => `Delete this item?`,
        }),
      ]),
  })

  return cols
})

const searchableFields = computed(() => {
  const fields = props.module.fieldsConfig || []
  return [
    { label: 'All Fields', value: '' },
    ...fields.filter((f) => f.searchable).map((f) => ({ label: f.label, value: f.name })),
  ]
})
</script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :page="page"
    :limit="limit"
    :total="total"
    :sort-by="sortBy"
    :sort-order="sortOrder"
    :search-placeholder="`Search ${module.label}...`"
    :searchable-fields="searchableFields"
    @search="(v) => emit('search', v)"
    @search-field-change="(v) => emit('search-field-change', v)"
    @update:page="(p) => emit('update:page', p)"
    @update:limit="(l) => emit('update:limit', l)"
    @sort-change="(s) => emit('sort-change', s)"
  >
    <template #toolbar>
      <NButton type="primary" @click="emit('create')">
        Create {{ module.label }}
      </NButton>
    </template>
  </DataTable>
</template>
