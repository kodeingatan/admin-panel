import { defineStore } from 'pinia'
import { ref } from 'vue'
import { systemCreatorsService } from '@/services/system-creators.service'
import type { ScModule, CreateScModule, QueryScModule } from '@/types/system-creator'

export const useSystemCreatorsStore = defineStore('system-creators', () => {
  const modules = ref<ScModule[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const search = ref('')
  const sortBy = ref('id')
  const sortOrder = ref<'ASC' | 'DESC'>('DESC')
  const searchField = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeModules = ref<ScModule[]>([])

  async function fetchAll(params?: Partial<QueryScModule>) {
    loading.value = true
    error.value = null
    try {
      const query: QueryScModule = {
        page: params?.page ?? page.value,
        limit: params?.limit ?? limit.value,
        search: params?.search ?? (search.value || undefined),
        searchField: params?.searchField ?? (searchField.value || undefined),
        sortBy: params?.sortBy ?? sortBy.value,
        sortOrder: params?.sortOrder ?? sortOrder.value,
      }
      const { data } = await systemCreatorsService.getRegistry(query)
      modules.value = data.data
      total.value = data.total
      page.value = data.page
      limit.value = data.limit
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch modules'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchActiveModules() {
    try {
      const { data } = await systemCreatorsService.getRegistry({ limit: 100 })
      activeModules.value = data.data.filter(m => m.isActive)
      return activeModules.value
    } catch {
      activeModules.value = []
      return []
    }
  }

  async function generate(module: CreateScModule) {
    loading.value = true
    error.value = null
    try {
      const { data } = await systemCreatorsService.generate(module)
      await fetchAll()
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to generate module'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function toggleActive(id: number) {
    try {
      const { data } = await systemCreatorsService.toggleActive(id)
      await fetchAll()
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to toggle module'
      throw e
    }
  }

  async function remove(id: number) {
    loading.value = true
    try {
      await systemCreatorsService.remove(id)
      await fetchAll()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete module'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setPage(p: number) { page.value = p }
  function setLimit(l: number) { limit.value = l; page.value = 1 }
  function setSearch(s: string) { search.value = s; page.value = 1 }
  function setSort(field: string) {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
    } else {
      sortBy.value = field
      sortOrder.value = 'ASC'
    }
    page.value = 1
  }
  function setSearchField(f: string) { searchField.value = f; page.value = 1 }
  function resetFilters() {
    page.value = 1
    search.value = ''
    sortBy.value = 'id'
    sortOrder.value = 'DESC'
    searchField.value = ''
  }

  return {
    modules, total, page, limit, search, sortBy, sortOrder, searchField, loading, error,
    activeModules,
    fetchAll, fetchActiveModules, generate, toggleActive, remove,
    setPage, setLimit, setSearch, setSort, setSearchField, resetFilters,
  }
})
