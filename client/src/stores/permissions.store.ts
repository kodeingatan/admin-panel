import { defineStore } from 'pinia'
import { ref } from 'vue'
import { permissionsService } from '@/services/permissions.service'
import type { Permission, QueryPermission } from '@/types/permission'

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref<Permission[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const search = ref('')
  const sortBy = ref('id')
  const sortOrder = ref<'ASC' | 'DESC'>('DESC')
  const searchField = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(params?: Partial<QueryPermission>) {
    loading.value = true
    error.value = null
    try {
      const query: QueryPermission = {
        page: params?.page ?? page.value,
        limit: params?.limit ?? limit.value,
        search: params?.search ?? (search.value || undefined),
        searchField: params?.searchField ?? (searchField.value || undefined),
        sortBy: params?.sortBy ?? sortBy.value,
        sortOrder: params?.sortOrder ?? sortOrder.value,
      }
      const { data } = await permissionsService.getAll(query)
      permissions.value = data.data
      total.value = data.total
      page.value = data.page
      limit.value = data.limit
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch permissions'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(permission: Parameters<typeof permissionsService.create>[0]) {
    loading.value = true
    error.value = null
    try {
      const { data } = await permissionsService.create(permission)
      await fetchAll()
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create permission'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, permission: Parameters<typeof permissionsService.update>[1]) {
    loading.value = true
    error.value = null
    try {
      const { data } = await permissionsService.update(id, permission)
      await fetchAll()
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update permission'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await permissionsService.delete(id)
      await fetchAll()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete permission'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setPage(p: number) {
    page.value = p
  }

  function setLimit(l: number) {
    limit.value = l
    page.value = 1
  }

  function setSearch(s: string) {
    search.value = s
    page.value = 1
  }

  function setSort(field: string) {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
    } else {
      sortBy.value = field
      sortOrder.value = 'ASC'
    }
    page.value = 1
  }

  function setSearchField(field: string) {
    searchField.value = field
    page.value = 1
  }

  function resetFilters() {
    page.value = 1
    search.value = ''
    sortBy.value = 'id'
    sortOrder.value = 'DESC'
    searchField.value = ''
  }

  return {
    permissions, total, page, limit, search, sortBy, sortOrder, searchField, loading, error,
    fetchAll, create, update, remove,
    setPage, setLimit, setSearch, setSort, setSearchField, resetFilters,
  }
})
