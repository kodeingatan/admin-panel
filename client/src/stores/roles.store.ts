import { defineStore } from 'pinia'
import { ref } from 'vue'
import { rolesService } from '@/services/roles.service'
import type { Role, QueryRole } from '@/types/role'

export const useRolesStore = defineStore('roles', () => {
  const roles = ref<Role[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const search = ref('')
  const sortBy = ref('id')
  const sortOrder = ref<'ASC' | 'DESC'>('DESC')
  const searchField = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(params?: Partial<QueryRole>) {
    loading.value = true
    error.value = null
    try {
      const query: QueryRole = {
        page: params?.page ?? page.value,
        limit: params?.limit ?? limit.value,
        search: params?.search ?? (search.value || undefined),
        searchField: params?.searchField ?? (searchField.value || undefined),
        sortBy: params?.sortBy ?? sortBy.value,
        sortOrder: params?.sortOrder ?? sortOrder.value,
      }
      const { data } = await rolesService.getAll(query)
      roles.value = data.data
      total.value = data.total
      page.value = data.page
      limit.value = data.limit
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch roles'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(role: Parameters<typeof rolesService.create>[0]) {
    loading.value = true
    error.value = null
    try {
      const { data } = await rolesService.create(role)
      await fetchAll()
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create role'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, role: Parameters<typeof rolesService.update>[1]) {
    loading.value = true
    error.value = null
    try {
      const { data } = await rolesService.update(id, role)
      await fetchAll()
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update role'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await rolesService.delete(id)
      await fetchAll()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete role'
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
    roles, total, page, limit, search, sortBy, sortOrder, searchField, loading, error,
    fetchAll, create, update, remove,
    setPage, setLimit, setSearch, setSort, setSearchField, resetFilters,
  }
})
