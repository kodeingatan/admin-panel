<script setup lang="ts">
import { ref } from 'vue'
import {
  NButton, NSpace, NCard, NInput, NSelect, NSwitch, NIcon, NText,
} from 'naive-ui'
import { Add, TrashCan, ArrowUp, ArrowDown } from '@vicons/carbon'
import type { CreateScModule, ScFieldConfig, ScFieldType } from '@/types/system-creator'

const props = defineProps<{ modelValue: CreateScModule }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: CreateScModule): void }>()

const FIELD_TYPES = [
  { label: 'Text', value: 'text' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Rich Text', value: 'rich-text' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Date', value: 'date' },
  { label: 'Datetime', value: 'datetime' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'URL', value: 'url' },
  { label: 'Password', value: 'password' },
  { label: 'Color', value: 'color' },
  { label: 'Select', value: 'select' },
  { label: 'JSON', value: 'json' },
  { label: 'File', value: 'file' },
  { label: 'Image', value: 'image' },
]

const expandedIndex = ref<number | null>(null)

function addField() {
  const fields = [...(props.modelValue.fields || [])]
  fields.push({
    name: '',
    label: '',
    type: 'text' as ScFieldType,
    required: false,
    unique: false,
    searchable: false,
    sortable: false,
    visible: true,
    options: [],
  })
  emit('update:modelValue', { ...props.modelValue, fields })
  expandedIndex.value = fields.length - 1
}

function removeField(index: number) {
  const fields = [...(props.modelValue.fields || [])]
  fields.splice(index, 1)
  emit('update:modelValue', { ...props.modelValue, fields })
  expandedIndex.value = null
}

function moveField(index: number, dir: -1 | 1) {
  const fields = [...(props.modelValue.fields || [])]
  const target = index + dir
  if (target < 0 || target >= fields.length) return
  const temp = fields[index]
  fields[index] = fields[target]
  fields[target] = temp
  emit('update:modelValue', { ...props.modelValue, fields })
}

function updateField(index: number, key: keyof ScFieldConfig, value: any) {
  const fields = [...(props.modelValue.fields || [])]
  fields[index] = { ...fields[index], [key]: value }
  if (key === 'name' && value) {
    fields[index].name = value.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_')
  }
  if (key === 'label' && value && !fields[index].name) {
    fields[index].name = value.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_')
  }
  emit('update:modelValue', { ...props.modelValue, fields })
}

function addOption(fieldIndex: number) {
  const fields = [...(props.modelValue.fields || [])]
  const field = { ...fields[fieldIndex] }
  field.options = [...(field.options || []), { label: '', value: '' }]
  fields[fieldIndex] = field
  emit('update:modelValue', { ...props.modelValue, fields })
}

function updateOption(fieldIndex: number, optIndex: number, key: 'label' | 'value', value: any) {
  const fields = [...(props.modelValue.fields || [])]
  const field = { ...fields[fieldIndex] }
  const options = [...(field.options || [])]
  options[optIndex] = { ...options[optIndex], [key]: value }
  if (key === 'label' && value && !options[optIndex].value) {
    options[optIndex].value = value.toLowerCase().replace(/\s+/g, '_')
  }
  field.options = options
  fields[fieldIndex] = field
  emit('update:modelValue', { ...props.modelValue, fields })
}

function removeOption(fieldIndex: number, optIndex: number) {
  const fields = [...(props.modelValue.fields || [])]
  const field = { ...fields[fieldIndex] }
  const options = [...(field.options || [])]
  options.splice(optIndex, 1)
  field.options = options
  fields[fieldIndex] = field
  emit('update:modelValue', { ...props.modelValue, fields })
}
</script>

<template>
  <div>
    <NText depth="3" class="block mb-4">
      Define the fields for your module. Each field becomes a database column.
    </NText>

    <div v-if="!modelValue.fields?.length" class="text-center py-8 text-gray-400">
      No fields yet. Click "Add Field" to start.
    </div>

    <div v-for="(field, i) in modelValue.fields" :key="i" class="mb-3">
      <NCard
        size="small"
        :segmented="{ content: true }"
        :title="field.label || field.name || `Field ${i + 1}`"
      >
        <template #header-extra>
          <NSpace :size="4">
            <NButton size="tiny" quaternary :disabled="i === 0" @click="moveField(i, -1)">
              <template #icon><NIcon><ArrowUp /></NIcon></template>
            </NButton>
            <NButton size="tiny" quaternary :disabled="i === (modelValue.fields?.length || 0) - 1" @click="moveField(i, 1)">
              <template #icon><NIcon><ArrowDown /></NIcon></template>
            </NButton>
            <NButton size="tiny" quaternary type="error" @click="removeField(i)">
              <template #icon><NIcon><TrashCan /></NIcon></template>
            </NButton>
          </NSpace>
        </template>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <NText class="text-xs block mb-1">Name *</NText>
            <NInput
              :value="field.name"
              placeholder="e.g. title"
              size="small"
              @update:value="(v) => updateField(i, 'name', v)"
            />
          </div>
          <div>
            <NText class="text-xs block mb-1">Label *</NText>
            <NInput
              :value="field.label"
              placeholder="e.g. Title"
              size="small"
              @update:value="(v) => updateField(i, 'label', v)"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 mb-3">
          <div>
            <NText class="text-xs block mb-1">Type</NText>
            <NSelect
              :value="field.type"
              :options="FIELD_TYPES"
              size="small"
              @update:value="(v) => updateField(i, 'type', v)"
            />
          </div>
          <div class="flex items-end gap-4">
            <div class="flex items-center gap-1">
              <NSwitch :value="field.required" size="small" @update:value="(v) => updateField(i, 'required', v)" />
              <NText class="text-xs">Required</NText>
            </div>
            <div class="flex items-center gap-1">
              <NSwitch :value="field.unique" size="small" @update:value="(v) => updateField(i, 'unique', v)" />
              <NText class="text-xs">Unique</NText>
            </div>
          </div>
          <div class="flex items-end gap-4">
            <div class="flex items-center gap-1">
              <NSwitch :value="field.searchable" size="small" @update:value="(v) => updateField(i, 'searchable', v)" />
              <NText class="text-xs">Search</NText>
            </div>
            <div class="flex items-center gap-1">
              <NSwitch :value="field.sortable" size="small" @update:value="(v) => updateField(i, 'sortable', v)" />
              <NText class="text-xs">Sort</NText>
            </div>
            <div class="flex items-center gap-1">
              <NSwitch :value="field.visible" size="small" @update:value="(v) => updateField(i, 'visible', v)" />
              <NText class="text-xs">Visible</NText>
            </div>
          </div>
        </div>

        <div v-if="field.type === 'select'" class="border-t pt-3 mt-2">
          <NText class="text-xs block mb-2">Options</NText>
          <div v-for="(opt, oi) in field.options" :key="oi" class="flex gap-2 mb-2">
            <NInput
              :value="opt.label"
              placeholder="Label"
              size="small"
              class="flex-1"
              @update:value="(v) => updateOption(i, oi, 'label', v)"
            />
            <NInput
              :value="String(opt.value)"
              placeholder="Value"
              size="small"
              class="flex-1"
              @update:value="(v) => updateOption(i, oi, 'value', v)"
            />
            <NButton size="small" quaternary type="error" @click="removeOption(i, oi)">
              <template #icon><NIcon><TrashCan /></NIcon></template>
            </NButton>
          </div>
          <NButton size="small" quaternary @click="addOption(i)">
            <template #icon><NIcon><Add /></NIcon></template>
            Add Option
          </NButton>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-3" v-if="['text', 'textarea', 'password'].includes(field.type)">
          <div>
            <NText class="text-xs block mb-1">Min Length</NText>
            <NInput
              :value="String(field.minLength || '')"
              placeholder="Min"
              size="small"
              @update:value="(v) => updateField(i, 'minLength', v)"
            />
          </div>
          <div>
            <NText class="text-xs block mb-1">Max Length</NText>
            <NInput
              :value="String(field.maxLength || '')"
              placeholder="Max"
              size="small"
              @update:value="(v) => updateField(i, 'maxLength', v)"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-3" v-if="field.type === 'number'">
          <div>
            <NText class="text-xs block mb-1">Min</NText>
            <NInput
              :value="String(field.min || '')"
              placeholder="Min"
              size="small"
              @update:value="(v) => updateField(i, 'min', v)"
            />
          </div>
          <div>
            <NText class="text-xs block mb-1">Max</NText>
            <NInput
              :value="String(field.max || '')"
              placeholder="Max"
              size="small"
              @update:value="(v) => updateField(i, 'max', v)"
            />
          </div>
        </div>
      </NCard>
    </div>

    <NButton dashed block @click="addField">
      <template #icon><NIcon><Add /></NIcon></template>
      Add Field
    </NButton>
  </div>
</template>
