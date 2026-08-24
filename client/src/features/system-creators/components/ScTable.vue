<script setup lang="ts">
import { h, ref, onMounted, computed } from 'vue'
import { NTag, NSpace, NButton, NPopconfirm, NIcon, useMessage } from 'naive-ui'
import { Add, TrashCan, View, Switcher } from '@vicons/carbon'
import DataTable from '@/components/common/DataTable/DataTable.vue'
import { useSystemCreatorsStore } from '@/stores/system-creators.store'
import type { ScModule } from '@/types/system-creator'

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'detail', module: ScModule): void
}>()

const store = useSystemCreatorsStore()
const message = useMessage()
const deleting = ref(false)

const columns = computed(() => [
  { key: 'id', title: 'ID', sortable: true, width: 60 },
  { key: 'name', title: 'Name', sortable: true, searchable: true },
  { key: 'label', title: 'Label', sortable: true, searchable: true },
  {
    key: 'fieldsConfig',
    title: 'Fields',
    width: 80,
    render(row: ScModule) {
      const count = Array.isArray(row.fieldsConfig) ? row.fieldsConfig.length : 0
      return h(NTag, { size: 'small', type: 'info', bordered: false }, () => `${count} fields`)
    },
  },
  {
    key: 'accessLevel',
    title: 'Access',
    sortable: true,
    width: 100,
    render(row: ScModule) {
      const typeMap: Record<string, 'success' | 'info' | 'warning'> = {
        public: 'success',
        admin: 'info',
        granular: 'warning',
      }
      return h(NTag, { size: 'small', type: typeMap[row.accessLevel] || 'default', bordered: false }, () => row.accessLevel)
    },
  },
  {
    key: 'isActive',
    title: 'Status',
    sortable: true,
    width: 80,
    render(row: ScModule) {
      return h(NTag, { size: 'small', type: row.isActive ? 'success' : 'default', bordered: false }, () => row.isActive ? 'Active' : 'Inactive')
    },
  },
  {
    key: 'createdAt',
    title: 'Created',
    sortable: true,
    width: 140,
    render(row: ScModule) {
      return new Date(row.createdAt).toLocaleDateString()
    },
  },
  {
    key: 'actions',
    title: 'Actions',
    width: 160,
    render(row: ScModule) {
      return h(NSpace, { size: 4 }, () => [
        h(NButton, {
          size: 'small', quaternary: true, type: 'info',
          onClick: () => emit('detail', row),
        }, { default: () => h(NIcon, null, { default: () => h(View) }) }),
        h(NButton, {
          size: 'small', quaternary: true, type: row.isActive ? 'warning' : 'success',
          onClick: () => handleToggle(row.id),
        }, { default: () => h(NIcon, null, { default: () => h(Switcher) }) }),
        h(
          NPopconfirm,
          { onPositiveClick: () => handleDelete(row.id) },
          {
            trigger: () => h(NButton, {
              size: 'small',
              quaternary: true,
              type: 'error',
              loading: deleting.value,
              disabled: deleting.value,
            }, { default: () => h(NIcon, null, { default: () => h(TrashCan) }) }),
            default: () => `Delete module "${row.label}" permanently? This will remove all files and cannot be undone.`,
          }
        ),
      ])
    },
  },
])

const searchableFields = [
  { label: 'All Fields', value: '' },
  { label: 'Name', value: 'name' },
  { label: 'Label', value: 'label' },
]

async function handleToggle(id: number) {
  try {
    await store.toggleActive(id)
    message.success('Module status toggled')
  } catch {
    message.error('Failed to toggle module')
  }
}

async function handleDelete(id: number) {
  deleting.value = true
  try {
    await store.remove(id)
    message.success('Module deleted permanently')
  } catch {
    message.error('Failed to delete module')
  } finally {
    deleting.value = false
  }
}

function handleSearch(value: string) {
  store.setSearch(value)
  store.fetchAll()
}

function handleSearchField(field: string) {
  store.setSearchField(field)
  store.fetchAll()
}

function handlePageChange(p: number) {
  store.setPage(p)
  store.fetchAll()
}

function handleLimitChange(l: number) {
  store.setLimit(l)
  store.fetchAll()
}

function handleSortChange(sorter: { columnKey: string; order: 'ascend' | 'descend' | false }) {
  if (!sorter.order) {
    store.setSort('id')
  } else {
    store.setSort(sorter.columnKey)
  }
  store.fetchAll()
}

onMounted(() => {
  store.fetchAll()
})
</script>

<template>
  <div>
    <DataTable
      :columns="columns"
      :data="store.modules"
      :loading="store.loading"
      :page="store.page"
      :limit="store.limit"
      :total="store.total"
      :sort-by="store.sortBy"
      :sort-order="store.sortOrder"
      search-placeholder="Search modules..."
      :searchable-fields="searchableFields"
      @search="handleSearch"
      @search-field-change="handleSearchField"
      @update:page="handlePageChange"
      @update:limit="handleLimitChange"
      @sort-change="handleSortChange"
    >
      <template #toolbar>
        <NButton type="primary" @click="emit('create')">
          <template #icon><NIcon><Add /></NIcon></template>
          Create Module
        </NButton>
      </template>
    </DataTable>
  </div>
</template>
