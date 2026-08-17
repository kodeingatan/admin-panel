<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NButton, NCard, NSelect, NInput, NIcon, NText, NEmpty } from 'naive-ui'
import { Add, TrashCan } from '@vicons/carbon'
import { systemCreatorsService } from '@/services/system-creators.service'
import type { CreateScModule, ScRelationConfig, ScRelationType, ScModule } from '@/types/system-creator'

const props = defineProps<{ modelValue: CreateScModule }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: CreateScModule): void }>()

const existingModules = ref<ScModule[]>([])

const RELATION_TYPES = [
  { label: 'Many-to-One (FK on this entity)', value: 'many-to-one' },
  { label: 'Many-to-Many (junction table)', value: 'many-to-many' },
  { label: 'One-to-Many (FK on target)', value: 'one-to-many' },
]

onMounted(async () => {
  try {
    const { data } = await systemCreatorsService.getRegistry({ limit: 100 })
    existingModules.value = data.data.filter((m) => m.isActive)
  } catch {
    existingModules.value = []
  }
})

function addRelation() {
  const relations = [...(props.modelValue.relations || [])]
  relations.push({
    name: '',
    type: 'many-to-one' as ScRelationType,
    targetModule: '',
    joinTable: '',
  })
  emit('update:modelValue', { ...props.modelValue, relations })
}

function removeRelation(index: number) {
  const relations = [...(props.modelValue.relations || [])]
  relations.splice(index, 1)
  emit('update:modelValue', { ...props.modelValue, relations })
}

function updateRelation(index: number, key: keyof ScRelationConfig, value: any) {
  const relations = [...(props.modelValue.relations || [])]
  relations[index] = { ...relations[index], [key]: value }
  if (key === 'targetModule' && value && !relations[index].name) {
    relations[index].name = value
  }
  emit('update:modelValue', { ...props.modelValue, relations })
}
</script>

<template>
  <div>
    <NText depth="3" class="block mb-4">
      Define relationships to other modules. This step is optional.
    </NText>

    <div v-if="existingModules.length === 0" class="py-6">
      <NEmpty description="No other modules available to relate to yet." />
    </div>

    <div v-for="(rel, i) in modelValue.relations" :key="i" class="mb-3">
      <NCard size="small" :title="rel.name || rel.targetModule || `Relation ${i + 1}`">
        <template #header-extra>
          <NButton size="tiny" quaternary type="error" @click="removeRelation(i)">
            <template #icon><NIcon><TrashCan /></NIcon></template>
          </NButton>
        </template>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <NText class="text-xs block mb-1">Type *</NText>
            <NSelect
              :value="rel.type"
              :options="RELATION_TYPES"
              size="small"
              @update:value="(v) => updateRelation(i, 'type', v)"
            />
          </div>
          <div>
            <NText class="text-xs block mb-1">Target Module *</NText>
            <NSelect
              :value="rel.targetModule"
              :options="existingModules.map((m) => ({ label: m.label, value: m.name }))"
              size="small"
              @update:value="(v) => updateRelation(i, 'targetModule', v)"
            />
          </div>
          <div>
            <NText class="text-xs block mb-1">Field Name *</NText>
            <NInput
              :value="rel.name"
              placeholder="e.g. category"
              size="small"
              @update:value="(v) => updateRelation(i, 'name', v)"
            />
          </div>
        </div>

        <div v-if="rel.type === 'many-to-many'" class="mt-3">
          <NText class="text-xs block mb-1">Join Table Name</NText>
          <NInput
            :value="rel.joinTable"
            :placeholder="`${modelValue.name}_${rel.targetModule}`"
            size="small"
            @update:value="(v) => updateRelation(i, 'joinTable', v)"
          />
        </div>
      </NCard>
    </div>

    <NButton dashed block @click="addRelation" :disabled="existingModules.length === 0">
      <template #icon><NIcon><Add /></NIcon></template>
      Add Relation
    </NButton>
  </div>
</template>
