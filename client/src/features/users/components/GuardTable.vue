<script setup lang="ts">
import { h, ref, onMounted, computed } from 'vue'
import {
  NButton, NInput, NDataTable, NSpace, NTag, NPopconfirm,
  NText, NSpin, NEmpty, useMessage,
  type DataTableColumns, type PaginationProps,
} from 'naive-ui'
import { Search, Add, TrashCan, Edit, View } from '@vicons/carbon'
import { useGuardsStore } from '@/stores/guards.store'
import type { Guard } from '@/types/guard'

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', guard: Guard): void
  (e: 'detail', guard: Guard): void
}>()

const store = useGuardsStore()
const message = useMessage()
const searchText = ref('')

const columns: DataTableColumns<Guard> = [
  { title: 'ID', key: 'id', width: 60, sorter: true },
  { title: 'Guard Name', key: 'guardName', sorter: true },
  { title: 'Description', key: 'description', ellipsis: { tooltip: true } },
  {
    title: 'Allow URLs',
    key: 'allowUrls',
    render(row) {
      const allowUrls = row.urls?.filter((u) => u.type === 'allow') || []
      if (!allowUrls.length) return h(NText, { depth: 3 }, () => '-')
      return h(NSpace, { size: 4 }, () =>
        allowUrls.slice(0, 3).map((u) =>
          h(NTag, { key: u.id, size: 'small', type: 'success', bordered: false }, () => u.url)
        )
      )
    },
  },
  {
    title: 'Deny URLs',
    key: 'denyUrls',
    render(row) {
      const denyUrls = row.urls?.filter((u) => u.type === 'deny') || []
      if (!denyUrls.length) return h(NText, { depth: 3 }, () => '-')
      return h(NSpace, { size: 4 }, () =>
        denyUrls.slice(0, 3).map((u) =>
          h(NTag, { key: u.id, size: 'small', type: 'error', bordered: false }, () => u.url)
        )
      )
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    render(row) {
      return h(NSpace, { size: 4 }, () => [
        h(NButton, {
          size: 'small',
          quaternary: true,
          type: 'info',
          onClick: () => emit('detail', row),
        }, { default: () => h(View) }),
        h(NButton, {
          size: 'small',
          quaternary: true,
          type: 'warning',
          onClick: () => emit('edit', row),
        }, { default: () => h(Edit) }),
        h(
          NPopconfirm,
          { onPositiveClick: () => handleDelete(row.id) },
          {
            trigger: () =>
              h(NButton, { size: 'small', quaternary: true, type: 'error' }, { default: () => h(TrashCan) }),
            default: () => `Delete guard "${row.guardName}"?`,
          }
        ),
      ])
    },
  },
]

const pagination = computed<PaginationProps>(() => ({
  page: store.page,
  pageSize: store.limit,
  pageCount: Math.ceil(store.total / store.limit),
  itemCount: store.total,
  pageSizes: [10, 20, 50, 100],
  showSizePicker: true,
}))

async function handleDelete(id: number) {
  try {
    await store.remove(id)
    message.success('Guard deleted')
  } catch {
    message.error('Failed to delete guard')
  }
}

function handlePageChange(p: number) {
  store.setPage(p)
  store.fetchAll()
}

function handlePageSizeChange(size: number) {
  store.setLimit(size)
  store.fetchAll()
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
function handleSearch(value: string) {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.setSearch(value)
    store.fetchAll()
  }, 300)
}

onMounted(() => {
  store.fetchAll()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <NInput
        :value="searchText"
        placeholder="Search guards..."
        clearable
        @update:value="(v) => { searchText = v; handleSearch(v) }"
        class="max-w-xs"
      >
        <template #prefix>
          <Search />
        </template>
      </NInput>
      <NButton type="primary" @click="emit('create')">
        <template #icon><Add /></template>
        Add Guard
      </NButton>
    </div>

    <NSpin :show="store.loading">
      <NDataTable
        :columns="columns"
        :data="store.guards"
        :pagination="pagination"
        :row-key="(row: Guard) => row.id"
        remote
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </NSpin>

    <NEmpty v-if="!store.loading && store.guards.length === 0" description="No guards found" />
  </div>
</template>
