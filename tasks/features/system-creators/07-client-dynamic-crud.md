# 07 — Client: Dynamic CRUD Renderer

## Goal

Buat komponen yang render halaman CRUD secara dinamis berdasarkan konfigurasi module dari System Creators.

## Files to Create

### 1. DynamicCrudPage

**File**: `client/src/views/DynamicCrudPage.vue`

This is the main page that renders when user navigates to `/dashboard/sc/:moduleName`.

Flow:
1. Extract `moduleName` from route params
2. Fetch module config via `systemCreatorsService.getByName(moduleName)`
3. Build DataTable columns from `fieldsConfig`
4. Build form fields from `fieldsConfig`
5. Render table + form modal + detail drawer

```vue
<script setup>
const route = useRoute()
const moduleName = computed(() => route.params.moduleName as string)

const moduleConfig = ref<ScModule | null>(null)
const loading = ref(true)

// Table state
const data = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(20)
const search = ref('')
const sortBy = ref('id')
const sortOrder = ref<'ASC' | 'DESC'>('DESC')
const searchField = ref('')
const tableLoading = ref(false)

// Form state
const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedItem = ref<any | null>(null)

// Detail state
const showDetail = ref(false)

onMounted(async () => {
  try {
    const { data: config } = await systemCreatorsService.getByName(moduleName.value)
    moduleConfig.value = config
    await fetchData()
  } catch (e) {
    // Module not found — show error
  } finally {
    loading.value = false
  }
})

async function fetchData() {
  tableLoading.value = true
  try {
    const params = { page, limit, search, sortBy, sortOrder, searchField }
    const { data: response } = await api.get(`/generated/${moduleName.value}`, { params })
    data.value = response.data
    total.value = response.total
  } finally {
    tableLoading.value = false
  }
}

async function handleCreate() {
  formMode.value = 'create'
  selectedItem.value = null
  showForm.value = true
}

async function handleEdit(item: any) {
  formMode.value = 'edit'
  selectedItem.value = item
  showForm.value = true
}

async function handleDetail(item: any) {
  selectedItem.value = item
  showDetail.value = true
}

async function handleDelete(id: number) {
  await api.delete(`/generated/${moduleName.value}/${id}`)
  await fetchData()
}

async function handleFormSuccess() {
  showForm.value = false
  selectedItem.value = null
  await fetchData()
}
</script>
```

Template:
```vue
<template>
  <AppLayout v-if="authStore.user && moduleConfig" :user="authStore.user">
    <!-- Table -->
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
      @update:page="..."
      @update:limit="..."
      @sort-change="..."
      @search="..."
      @search-field-change="..."
    />

    <!-- Form Modal -->
    <DynamicFormRenderer
      v-model:visible="showForm"
      :module="moduleConfig"
      :mode="formMode"
      :item="selectedItem"
      @success="handleFormSuccess"
    />

    <!-- Detail Drawer -->
    <DynamicDetailDrawer
      v-model:visible="showDetail"
      :module="moduleConfig"
      :item="selectedItem"
      @edit="handleEdit"
    />
  </AppLayout>
</template>
```

### 2. DynamicFormRenderer

**File**: `client/src/components/common/DynamicFormRenderer.vue`

Renders a form modal based on module's `fieldsConfig`.

Props:
- `visible: boolean`
- `module: ScModule`
- `mode: 'create' | 'edit'`
- `item: any` (pre-filled for edit mode)

Logic:
- Watch `visible`: when opening, build form state from `fieldsConfig`
- For each field, render appropriate Naive UI component based on `field.type`
- Validate with NForm rules (required, unique, email, etc.)
- Submit: POST/PUT to `/api/generated/{name}/`
- If module has file/image fields: use FormData + file upload endpoint

Field rendering switch:
```vue
<template v-for="field in module.fieldsConfig" :key="field.name">
  <NFormItem :label="field.label" :required="field.required" :path="field.name">
    <!-- text, email, phone, url -->
    <NInput v-if="['text','email','phone','url'].includes(field.type)"
      v-model:value="form[field.name]" :placeholder="field.placeholder" />

    <!-- textarea, rich-text -->
    <NInput v-else-if="['textarea','rich-text'].includes(field.type)"
      v-model:value="form[field.name]" type="textarea" :rows="3" />

    <!-- number -->
    <NInputNumber v-else-if="field.type === 'number'"
      v-model:value="form[field.name]" :min="field.min" :max="field.max" />

    <!-- boolean -->
    <NSwitch v-else-if="field.type === 'boolean'"
      v-model:value="form[field.name]" />

    <!-- date -->
    <NDatePicker v-else-if="field.type === 'date'"
      v-model:value="form[field.name]" type="date" />

    <!-- datetime -->
    <NDatePicker v-else-if="field.type === 'datetime'"
      v-model:value="form[field.name]" type="datetime" />

    <!-- password -->
    <NInput v-else-if="field.type === 'password'"
      v-model:value="form[field.name]" type="password" show-password-on="click" />

    <!-- color -->
    <NColorPicker v-else-if="field.type === 'color'"
      v-model:value="form[field.name]" />

    <!-- select -->
    <NSelect v-else-if="field.type === 'select'"
      v-model:value="form[field.name]" :options="field.options" />

    <!-- json -->
    <NInput v-else-if="field.type === 'json'"
      v-model:value="form[field.name]" type="textarea" :rows="5" />

    <!-- file -->
    <NUpload v-else-if="field.type === 'file'"
      :action="`/api/generated/${module.name}/upload`"
      :default-file-list="form[field.name] ? [{ name: form[field.name], url: form[field.name] }] : []"
      @finish="handleUploadFinish(field.name, $event)" />

    <!-- image -->
    <NUpload v-else-if="field.type === 'image'"
      :action="`/api/generated/${module.name}/upload`"
      list-type="image-card"
      :default-file-list="form[field.name] ? [{ name: form[field.name], url: form[field.name] }] : []"
      @finish="handleUploadFinish(field.name, $event)" />
  </NFormItem>
</template>
```

### 3. DynamicTableRenderer

**File**: `client/src/components/common/DynamicTableRenderer.vue`

Renders DataTable with columns from module config.

Props:
- `module: ScModule`
- `data: any[]`
- `loading, page, limit, total, sortBy, sortOrder`

Logic:
- Build `columns` array from `fieldsConfig`
- For each field type, create appropriate column render function:
  - `boolean` → NTag Yes/No
  - `date` → formatted date
  - `select` → NTag with option label
  - `password` → `****`
  - `file` → link
  - `image` → thumbnail
  - etc.
- Add actions column (View/Edit/Delete)
- Emit events for pagination, sort, search

## Files to Modify

(none — these are new files)

## Verification

- [ ] DynamicCrudPage loads module config from API
- [ ] Table renders correct columns from fieldsConfig
- [ ] Form renders correct input types per field config
- [ ] Create flow works: fill form → submit → table refreshes
- [ ] Edit flow works: click edit → form pre-filled → save → table refreshes
- [ ] Detail drawer shows all fields with correct rendering
- [ ] Delete flow works: confirm → delete → table refreshes
- [ ] File upload works for file/image fields
- [ ] Search, sort, pagination work
- [ ] Module not found shows appropriate error
