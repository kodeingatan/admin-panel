import { defineStore } from 'pinia'
import { ref } from 'vue'
import { guardsService } from '@/services/guards.service'
import type { Guard, QueryGuard } from '@/types/guard'

export const useGuardsStore = defineStore('guards', () => {
  const guards = ref<Guard[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const search = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(params?: Partial<QueryGuard>) {
    loading.value = true
    error.value = null
    try {
      const query: QueryGuard = {
        page: params?.page ?? page.value,
        limit: params?.limit ?? limit.value,
        search: params?.search ?? (search.value || undefined),
      }
      const { data } = await guardsService.getAll(query)
      guards.value = data.data
      total.value = data.total
      page.value = data.page
      limit.value = data.limit
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch guards'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(guard: Parameters<typeof guardsService.create>[0]) {
    loading.value = true
    error.value = null
    try {
      const { data } = await guardsService.create(guard)
      await fetchAll()
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create guard'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, guard: Parameters<typeof guardsService.update>[1]) {
    loading.value = true
    error.value = null
    try {
      const { data } = await guardsService.update(id, guard)
      await fetchAll()
      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update guard'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await guardsService.delete(id)
      await fetchAll()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete guard'
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

  return { guards, total, page, limit, search, loading, error, fetchAll, create, update, remove, setPage, setLimit, setSearch }
})
