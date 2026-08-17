# 04 — Client: Types, Service, Store

## Goal

Buat TypeScript types, API service, dan Pinia store untuk System Creators di sisi client.

## Files to Create

### 1. Types

**File**: `client/src/types/system-creator.ts`

```typescript
export type ScFieldType =
  | 'text' | 'textarea' | 'rich-text' | 'number' | 'boolean'
  | 'date' | 'datetime' | 'email' | 'phone' | 'url'
  | 'password' | 'color' | 'select' | 'json' | 'file' | 'image';

export type ScAccessLevel = 'public' | 'admin' | 'granular';

export type ScRelationType = 'many-to-one' | 'many-to-many' | 'one-to-many';

export interface ScFieldOption {
  label: string;
  value: string | number;
}

export interface ScFieldConfig {
  name: string;                    // snake_case column name
  label: string;                   // Display label
  type: ScFieldType;
  required: boolean;
  unique: boolean;
  searchable: boolean;
  sortable: boolean;
  visible: boolean;                // Show in table by default
  defaultValue?: any;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  options?: ScFieldOption[];       // For select type
  placeholder?: string;
  helpText?: string;
}

export interface ScRelationConfig {
  name: string;                    // Field name for the relation
  type: ScRelationType;
  targetModule: string;            // Target module name
  joinTable?: string;              // Junction table name (for many-to-many)
}

export interface ScModule {
  id: number;
  name: string;
  label: string;
  routePath: string;
  menuLabel: string;
  accessLevel: ScAccessLevel;
  accessRoles: string[] | null;
  accessPermissions: string[] | null;
  isActive: boolean;
  fieldsConfig: ScFieldConfig[];
  relationsConfig: ScRelationConfig[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScModule {
  name: string;
  label: string;
  menuLabel: string;
  description?: string;
  fields: ScFieldConfig[];
  relations?: ScRelationConfig[];
  accessLevel: ScAccessLevel;
  accessRoles?: string[];
  accessPermissions?: string[];
}

export interface UpdateScModule {
  label?: string;
  menuLabel?: string;
  fields?: ScFieldConfig[];
  relations?: ScRelationConfig[];
  accessLevel?: ScAccessLevel;
  accessRoles?: string[];
  accessPermissions?: string[];
}

export interface QueryScModule {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
```

### 2. Service

**File**: `client/src/services/system-creators.service.ts`

```typescript
import api from '@/services/api'
import type { PaginatedResponse } from '@/types/api'
import type { ScModule, CreateScModule, UpdateScModule, QueryScModule } from '@/types/system-creator'

export const systemCreatorsService = {
  getRegistry(query?: QueryScModule) {
    return api.get<PaginatedResponse<ScModule>>('/system-creators/registry', { params: query })
  },

  getById(id: number) {
    return api.get<ScModule>(`/system-creators/registry/${id}`)
  },

  getByName(name: string) {
    return api.get<ScModule>(`/system-creators/registry/by-name/${name}`)
  },

  generate(data: CreateScModule) {
    return api.post<ScModule>('/system-creators/generate', data)
  },

  update(id: number, data: UpdateScModule) {
    return api.put<ScModule>(`/system-creators/${id}`, data)
  },

  remove(id: number) {
    return api.delete(`/system-creators/${id}`)
  },

  toggleActive(id: number) {
    return api.post<ScModule>(`/system-creators/${id}/toggle`)
  },
}
```

### 3. Store

**File**: `client/src/stores/system-creators.store.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { systemCreatorsService } from '@/services/system-creators.service'
import type { ScModule, QueryScModule } from '@/types/system-creator'

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

  // For dynamic route building
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
      const { data } = await systemCreatorsService.getRegistry({ limit: 100, search: '' })
      activeModules.value = data.data.filter(m => m.isActive)
      return activeModules.value
    } catch {
      activeModules.value = []
      return []
    }
  }

  async function generate(module: Parameters<typeof systemCreatorsService.generate>[0]) {
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

  return {
    modules, total, page, limit, search, sortBy, sortOrder, searchField, loading, error,
    activeModules,
    fetchAll, fetchActiveModules, generate, toggleActive, remove,
    setPage, setLimit, setSearch, setSort, setSearchField,
  }
})
```

### 4. Dynamic Module Composable

**File**: `client/src/composables/useDynamicModules.ts`

```typescript
import { ref, onMounted } from 'vue'
import { systemCreatorsService } from '@/services/system-creators.service'
import type { ScModule, ScFieldConfig } from '@/types/system-creator'

const registeredModules = ref<ScModule[]>([])
const loaded = ref(false)

export function useDynamicModules() {
  async function loadModules() {
    if (loaded.value) return registeredModules.value
    try {
      const { data } = await systemCreatorsService.getRegistry({ limit: 100 })
      registeredModules.value = data.data.filter(m => m.isActive)
      loaded.value = true
      return registeredModules.value
    } catch {
      return []
    }
  }

  function getModuleByName(name: string): ScModule | undefined {
    return registeredModules.value.find(m => m.name === name)
  }

  function getTableColumns(fields: ScFieldConfig[]) {
    return fields
      .filter(f => f.visible)
      .map(f => ({
        key: f.name,
        title: f.label,
        sortable: f.sortable,
        searchable: f.searchable,
      }))
  }

  function getSearchableFields(fields: ScFieldConfig[]) {
    return [
      { label: 'All Fields', value: '' },
      ...fields
        .filter(f => f.searchable)
        .map(f => ({ label: f.label, value: f.name })),
    ]
  }

  return {
    registeredModules,
    loadModules,
    getModuleByName,
    getTableColumns,
    getSearchableFields,
  }
}
```

## Files to Modify

### 5. `client/src/types/index.ts`

Add export:
```typescript
export type { ScModule, CreateScModule, UpdateScModule, QueryScModule, ScFieldConfig, ScRelationConfig, ScFieldType, ScAccessLevel } from '@/types/system-creator'
```

## Verification

- [ ] TypeScript types compile without errors
- [ ] Service methods match server API endpoints
- [ ] Store follows existing pattern (users.store.ts)
- [ ] Composable works with dynamic imports
- [ ] Types exported from barrel index
