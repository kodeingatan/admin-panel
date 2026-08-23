<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NText, NResult, NSpin } from 'naive-ui'
import { useAuthStore } from '@/stores/auth.store'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import DynamicTableRenderer from '@/components/common/DynamicTableRenderer.vue'
import DynamicFormRenderer from '@/components/common/DynamicFormRenderer.vue'
import { useDynamicModules } from '@/composables/useDynamicModules'
import { systemCreatorsService } from '@/services/system-creators.service'
import api from '@/services/api'
import type { ScModule } from '@/types/system-creator'

const route = useRoute()
const authStore = useAuthStore()
const { getModuleByName } = useDynamicModules()

const moduleName = computed(() => route.params.moduleName as string)
const moduleConfig = ref<ScModule | null>(null)
const loading = ref(true)
const error = ref('')

const data = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(20)
const search = ref('')
const sortBy = ref('id')
const sortOrder = ref<'ASC' | 'DESC'>('DESC')
const searchField = ref('')
const tableLoading = ref(false)

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedItem = ref<any | null>(null)
const showDetail = ref(false)

async function fetchConfig() {
  const cached = getModuleByName(moduleName.value)
  if (cached) {
    moduleConfig.value = cached
    return
  }
  try {
    const { data: config } = await systemCreatorsService.getByName(moduleName.value)
    moduleConfig.value = config
  } catch {
    error.value = 'Module not found'
  }
}

async function fetchData() {
  tableLoading.value = true
  try {
    const params: Record<string, any> = {
      page: page.value,
      limit: limit.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    }
    if (search.value) params.search = search.value
    if (searchField.value) params.searchField = searchField.value
    const { data: response } = await api.get(`/generated/${moduleName.value}`, { params })
    data.value = response.data
    total.value = response.total
  } catch {
    data.value = []
    total.value = 0
  } finally {
    tableLoading.value = false
  }
}

function handleCreate() {
  formMode.value = 'create'
  selectedItem.value = null
  showForm.value = true
}

function handleEdit(item: any) {
  formMode.value = 'edit'
  selectedItem.value = item
  showForm.value = true
}

function handleDetail(item: any) {
  selectedItem.value = item
  showDetail.value = true
}

async function handleDelete(id: number) {
  await api.delete(`/generated/${moduleName.value}/${id}`)
  await fetchData()
}

function handleFormSuccess() {
  showForm.value = false
  selectedItem.value = null
  fetchData()
}

function handleSearch(v: string) { search.value = v; fetchData() }
function handleSearchField(v: string) { searchField.value = v; fetchData() }
function handlePageChange(p: number) { page.value = p; fetchData() }
function handleLimitChange(l: number) { limit.value = l; page.value = 1; fetchData() }
function handleSortChange(s: { columnKey: string; order: 'ascend' | 'descend' | false }) {
  if (!s.order) { sortBy.value = 'id' } else { sortBy.value = s.columnKey }
  sortOrder.value = s.order === 'ascend' ? 'ASC' : 'DESC'
  fetchData()
}

onMounted(async () => {
  await authStore.fetchProfile()
  await fetchConfig()
  if (moduleConfig.value) await fetchData()
  loading.value = false
})

watch(moduleName, async () => {
  loading.value = true
  error.value = ''
  await fetchConfig()
  if (moduleConfig.value) await fetchData()
  loading.value = false
})
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <NSpin :show="loading">
      <div v-if="error" class="py-12">
        <NResult status="404" :title="error" />
      </div>

      <template v-else-if="moduleConfig">
        <DynamicTableRenderer
          :module="moduleConfig"
          :data="data"
          :loading="tableLoading"
          :page="page"
          :limit="limit"
          :total="total"
          :sort-by="sortBy"
          :sort-order="sortOrder"
          @create="handleCreate"
          @edit="handleEdit"
          @detail="handleDetail"
          @delete="handleDelete"
          @update:page="handlePageChange"
          @update:limit="handleLimitChange"
          @sort-change="handleSortChange"
          @search="handleSearch"
          @search-field-change="handleSearchField"
        />

        <DynamicFormRenderer
          v-model:visible="showForm"
          :module="moduleConfig"
          :mode="formMode"
          :item="selectedItem"
          @success="handleFormSuccess"
        />

        <div v-if="showDetail && selectedItem" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" @click.self="showDetail = false">
          <div class="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <NText strong class="text-lg block mb-4">{{ moduleConfig.label }} Detail</NText>
            <div v-for="field in moduleConfig.fieldsConfig" :key="field.name" class="mb-3">
              <NText depth="3" class="text-xs block">{{ field.label }}</NText>
              <template v-if="field.type === 'select-relation' && selectedItem[field.name]">
                <NText>{{ selectedItem[field.name][field.relationLabel || 'name'] ?? '-' }}</NText>
              </template>
              <template v-else-if="field.type === 'multiple-select-relation' && selectedItem[field.name]?.length">
                <NText>{{ selectedItem[field.name].map((item: any) => item[field.relationLabel || 'name']).join(', ') }}</NText>
              </template>
              <template v-else-if="field.type === 'image' && selectedItem[field.name]">
                <img :src="selectedItem[field.name].startsWith('http') ? selectedItem[field.name] : `/api/storage/general/${selectedItem[field.name]}`" style="max-width:128px;max-height:128px;border-radius:4px;object-fit:cover;" />
              </template>
              <template v-else>
                <NText>{{ selectedItem[field.name] ?? '-' }}</NText>
              </template>
            </div>
            <NButton class="mt-4" @click="showDetail = false">Close</NButton>
          </div>
        </div>
      </template>
    </NSpin>
  </AppLayout>
</template>
