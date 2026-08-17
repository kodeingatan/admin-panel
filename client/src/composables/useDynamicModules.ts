import { ref } from 'vue'
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
