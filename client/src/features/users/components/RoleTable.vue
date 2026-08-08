<script setup lang="ts">
import { h, ref, onMounted, computed } from 'vue'
import {
  NButton, NInput, NDataTable, NSpace, NTag, NPopconfirm,
  NText, NSpin, NEmpty, useMessage,
  type DataTableColumns, type PaginationProps,
} from 'naive-ui'
import { Search, Add, TrashCan, Edit, View } from '@vicons/carbon'
import { useRolesStore } from '@/stores/roles.store'
import type { Role } from '@/types/role'

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', role: Role): void
  (e: 'detail', role: Role): void
}>()

const store = useRolesStore()
const message = useMessage()
const searchText = ref('')

const columns: DataTableColumns<Role> = [
  { title: 'ID', key: 'id', width: 60, sorter: true },
  { title: 'Role Name', key: 'roleName', sorter: true },
  { title: 'Description', key: 'description', ellipsis: { tooltip: true } },
  {
    title: 'Guards',
    key: 'guards',
    render(row) {
      if (!row.guards?.length) return h(NText, { depth: 3 }, () => '-')
      return h(NSpace, { size: 4 }, () =>
        row.guards.map((g) =>
          h(NTag, { key: g.id, size: 'small', type: 'warning', bordered: false }, () => g.guardName)
        )
      )
    },
  },
  {
    title: 'Permissions',
    key: 'permissions',
    render(row) {
      if (!row.permissions?.length) return h(NText, { depth: 3 }, () => '-')
      return h(NSpace, { size: 4 }, () =>
        row.permissions.map((p) =>
          h(NTag, { key: p.id, size: 'small', type: 'info', bordered: false }, () => p.permissionName)
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
            default: () => `Delete role "${row.roleName}"?`,
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
    message.success('Role deleted')
  } catch {
    message.error('Failed to delete role')
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
        placeholder="Search roles..."
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
        Add Role
      </NButton>
    </div>

    <NSpin :show="store.loading">
      <NDataTable
        :columns="columns"
        :data="store.roles"
        :pagination="pagination"
        :row-key="(row: Role) => row.id"
        remote
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </NSpin>

    <NEmpty v-if="!store.loading && store.roles.length === 0" description="No roles found" />
  </div>
</template>
