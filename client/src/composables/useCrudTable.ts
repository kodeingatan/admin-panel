import { ref, computed } from 'vue'

export interface UseCrudTableOptions<T> {
  fetchFn: (params: { page: number; limit: number; search: string }) => Promise<{ data: T[]; total: number }>
  defaultLimit?: number
  searchDebounce?: number
}

export function useCrudTable<T extends Record<string, any>>(options: UseCrudTableOptions<T>) {
  const { fetchFn, defaultLimit = 20, searchDebounce = 300 } = options

  const data = ref<T[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(defaultLimit)
  const search = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedRowKeys = ref<number[]>([])

  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  const totalPages = computed(() => Math.ceil(total.value / limit.value))

  const pagination = computed(() => ({
    page: page.value,
    pageSize: limit.value,
    pageCount: totalPages.value,
    itemCount: total.value,
    pageSizes: [10, 20, 50, 100],
    showSizePicker: true,
  }))

  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchFn({
        page: page.value,
        limit: limit.value,
        search: search.value,
      })
      data.value = result.data
      total.value = result.total
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to fetch data'
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(p: number) {
    page.value = p
    fetchData()
  }

  function handlePageSizeChange(size: number) {
    limit.value = size
    page.value = 1
    fetchData()
  }

  function handleSearch(value: string) {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      search.value = value
      page.value = 1
      fetchData()
    }, searchDebounce)
  }

  function handleSelectionChange(keys: number[]) {
    selectedRowKeys.value = keys
  }

  function refresh() {
    fetchData()
  }

  return {
    data,
    total,
    page,
    limit,
    search,
    loading,
    error,
    selectedRowKeys,
    pagination,
    totalPages,
    fetchData,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleSelectionChange,
    refresh,
  }
}
