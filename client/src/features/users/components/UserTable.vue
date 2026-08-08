<script setup lang="ts">
import { h, ref, onMounted, computed } from 'vue'
import {
  NButton, NInput, NDataTable, NSpace, NTag, NPopconfirm,
  NText, NSpin, NEmpty, useMessage,
  type DataTableColumns, type PaginationProps,
} from 'naive-ui'
import { Search, Add, TrashCan, Edit, View } from '@vicons/carbon'
import { useUsersStore } from '@/stores/users.store'
import type { User } from '@/types/user'

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', user: User): void
  (e: 'detail', user: User): void
}>()

const store = useUsersStore()
const message = useMessage()
const searchText = ref('')

const columns: DataTableColumns<User> = [
  { title: 'ID', key: 'id', width: 60, sorter: true },
  { title: 'First Name', key: 'firstName', sorter: true },
  { title: 'Last Name', key: 'lastName', sorter: true },
  { title: 'Username', key: 'username', sorter: true },
  { title: 'Email', key: 'email', sorter: true },
  {
    title: 'Roles',
    key: 'roles',
    render(row) {
      if (!row.roles?.length) return h(NText, { depth: 3 }, () => '-')
      return h(NSpace, { size: 4 }, () =>
        row.roles.map((role) =>
          h(NTag, { key: role.id, size: 'small', type: 'info', bordered: false }, () => role.roleName)
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
            default: () => `Delete user "${row.firstName} ${row.lastName}"?`,
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
    message.success('User deleted')
  } catch {
    message.error('Failed to delete user')
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
        placeholder="Search users..."
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
        Add User
      </NButton>
    </div>

    <NSpin :show="store.loading">
      <NDataTable
        :columns="columns"
        :data="store.users"
        :pagination="pagination"
        :row-key="(row: User) => row.id"
        remote
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </NSpin>

    <NEmpty v-if="!store.loading && store.users.length === 0" description="No users found" />
  </div>
</template>
