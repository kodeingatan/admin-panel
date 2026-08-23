<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NCard, NText, NInput, NSelect, NButton, NIcon, NSpace,
} from 'naive-ui'
import { Add, TrashCan, ArrowUp, ArrowDown } from '@vicons/carbon'
import type { CreateScModule, ScLayoutConfig, ScFormLayout, ScBrowseLayout, ScLayoutField } from '@/types/system-creator'

const props = defineProps<{ modelValue: CreateScModule }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: CreateScModule): void }>()

const activeTab = ref<'browse' | 'create' | 'update'>('browse')

function getLayoutConfig(): ScLayoutConfig {
  return props.modelValue.layoutConfig || {}
}

function getBrowseLayout(): ScBrowseLayout {
  return getLayoutConfig().browse || {
    columnOrder: (props.modelValue.fields || []).map((f) => f.name),
    columnWidths: {},
  }
}

function getFormLayout(type: 'create' | 'update'): ScFormLayout {
  return getLayoutConfig()[type] || {
    layout: 'flex',
    sections: [
      {
        label: 'General',
        fields: (props.modelValue.fields || []).map((f) => ({
          name: f.name,
          width: 'full',
          placeholder: f.placeholder,
        })),
      },
    ],
  }
}

function updateBrowseColumnOrder(order: string[]) {
  const browse = { ...getBrowseLayout(), columnOrder: order }
  emit('update:modelValue', {
    ...props.modelValue,
    layoutConfig: { ...getLayoutConfig(), browse },
  })
}

function updateBrowseColumnWidth(fieldName: string, width: string) {
  const browse = { ...getBrowseLayout() }
  browse.columnWidths = { ...browse.columnWidths, [fieldName]: width }
  emit('update:modelValue', {
    ...props.modelValue,
    layoutConfig: { ...getLayoutConfig(), browse },
  })
}

function moveColumn(fieldName: string, dir: -1 | 1) {
  const browse = getBrowseLayout()
  const order = [...browse.columnOrder]
  const idx = order.indexOf(fieldName)
  if (idx === -1) return
  const target = idx + dir
  if (target < 0 || target >= order.length) return
  const temp = order[idx]
  order[idx] = order[target]
  order[target] = temp
  updateBrowseColumnOrder(order)
}

function updateFormLayout(type: 'create' | 'update', layout: ScFormLayout) {
  emit('update:modelValue', {
    ...props.modelValue,
    layoutConfig: { ...getLayoutConfig(), [type]: layout },
  })
}

function updateFormLayoutType(type: 'create' | 'update', layoutType: 'flex' | 'grid') {
  const formLayout = { ...getFormLayout(type), layout: layoutType }
  updateFormLayout(type, formLayout)
}

function addSection(type: 'create' | 'update') {
  const formLayout = { ...getFormLayout(type) }
  formLayout.sections = [
    ...formLayout.sections,
    { label: 'New Section', fields: [] },
  ]
  updateFormLayout(type, formLayout)
}

function removeSection(type: 'create' | 'update', sectionIdx: number) {
  const formLayout = { ...getFormLayout(type) }
  formLayout.sections = formLayout.sections.filter((_, i) => i !== sectionIdx)
  updateFormLayout(type, formLayout)
}

function updateSectionLabel(type: 'create' | 'update', sectionIdx: number, label: string) {
  const formLayout = { ...getFormLayout(type) }
  formLayout.sections = formLayout.sections.map((s, i) =>
    i === sectionIdx ? { ...s, label } : s
  )
  updateFormLayout(type, formLayout)
}

function addFieldToSection(type: 'create' | 'update', sectionIdx: number) {
  const formLayout = { ...getFormLayout(type) }
  formLayout.sections = formLayout.sections.map((s, i) => {
    if (i !== sectionIdx) return s
    const usedNames = s.fields.map((f) => f.name)
    const available = (props.modelValue.fields || []).filter((f) => !usedNames.includes(f.name))
    if (available.length === 0) return s
    return {
      ...s,
      fields: [...s.fields, { name: available[0].name, width: 'full' }],
    }
  })
  updateFormLayout(type, formLayout)
}

function removeFieldFromSection(type: 'create' | 'update', sectionIdx: number, fieldIdx: number) {
  const formLayout = { ...getFormLayout(type) }
  formLayout.sections = formLayout.sections.map((s, i) => {
    if (i !== sectionIdx) return s
    return { ...s, fields: s.fields.filter((_, fi) => fi !== fieldIdx) }
  })
  updateFormLayout(type, formLayout)
}

function updateFieldInSection(type: 'create' | 'update', sectionIdx: number, fieldIdx: number, updates: Partial<ScLayoutField>) {
  const formLayout = { ...getFormLayout(type) }
  formLayout.sections = formLayout.sections.map((s, i) => {
    if (i !== sectionIdx) return s
    return {
      ...s,
      fields: s.fields.map((f, fi) =>
        fi === fieldIdx ? { ...f, ...updates } : f
      ),
    }
  })
  updateFormLayout(type, formLayout)
}

function cloneCreateToUpdate() {
  const createLayout = getFormLayout('create')
  updateFormLayout('update', { ...createLayout })
}

const fieldOptions = computed(() =>
  (props.modelValue.fields || []).map((f) => ({ label: `${f.label} (${f.name})`, value: f.name }))
)

const formTab = computed(() => activeTab.value as 'create' | 'update')

const WIDTH_OPTIONS = [
  { label: 'Full', value: 'full' },
  { label: 'Half', value: 'half' },
  { label: 'Third', value: 'third' },
  { label: 'Quarter', value: 'quarter' },
]

const LAYOUT_OPTIONS = [
  { label: 'Flex (Stacked)', value: 'flex' },
  { label: 'Grid', value: 'grid' },
]
</script>

<template>
  <div>
    <NText depth="3" class="block mb-4">
      Configure the layout for browse, create, and update views.
    </NText>

    <div class="flex gap-2 mb-4">
      <NButton :type="activeTab === 'browse' ? 'primary' : 'default'" @click="activeTab = 'browse'">Browse Layout</NButton>
      <NButton :type="activeTab === 'create' ? 'primary' : 'default'" @click="activeTab = 'create'">Create Form</NButton>
      <NButton :type="activeTab === 'update' ? 'primary' : 'default'" @click="activeTab = 'update'">Update Form</NButton>
    </div>

    <div v-if="activeTab === 'browse'">
      <NText class="text-sm block mb-2">Column order and widths for the table view:</NText>
      <div v-for="(col, i) in getBrowseLayout().columnOrder" :key="col" class="flex items-center gap-2 mb-2">
        <NSpace :size="4">
          <NButton size="tiny" quaternary :disabled="i === 0" @click="moveColumn(col, -1)">
            <template #icon><NIcon><ArrowUp /></NIcon></template>
          </NButton>
          <NButton size="tiny" quaternary :disabled="i === getBrowseLayout().columnOrder.length - 1" @click="moveColumn(col, 1)">
            <template #icon><NIcon><ArrowDown /></NIcon></template>
          </NButton>
        </NSpace>
        <NText class="w-32 text-sm">{{ col }}</NText>
        <NSelect
          :value="getBrowseLayout().columnWidths?.[col] || ''"
          :options="[{ label: 'Auto', value: '' }, ...WIDTH_OPTIONS]"
          size="small"
          style="width: 120px"
          @update:value="(v) => updateBrowseColumnWidth(col, v)"
        />
      </div>
    </div>

    <div v-if="activeTab === 'create' || activeTab === 'update'">
      <div class="flex items-center justify-between mb-3">
        <NText class="text-sm">{{ activeTab === 'create' ? 'Create' : 'Update' }} Form Layout:</NText>
        <NSpace v-if="activeTab === 'update'" :size="4">
          <NButton size="small" quaternary @click="cloneCreateToUpdate">Clone from Create</NButton>
        </NSpace>
      </div>

      <div class="mb-3">
        <NText class="text-xs block mb-1">Layout Type</NText>
        <NSelect
          :value="getFormLayout(formTab).layout"
          :options="LAYOUT_OPTIONS"
          size="small"
          style="width: 200px"
          @update:value="(v) => updateFormLayoutType(formTab, v)"
        />
      </div>

      <div v-for="(section, si) in getFormLayout(formTab).sections" :key="si" class="mb-3">
        <NCard size="small" :title="section.label || `Section ${si + 1}`">
          <template #header-extra>
            <NButton size="tiny" quaternary type="error" @click="removeSection(formTab, si)">
              <template #icon><NIcon><TrashCan /></NIcon></template>
            </NButton>
          </template>

          <div class="mb-2">
            <NText class="text-xs block mb-1">Section Label</NText>
            <NInput
              :value="section.label"
              size="small"
              @update:value="(v) => updateSectionLabel(formTab, si, v)"
            />
          </div>

          <div v-for="(field, fi) in section.fields" :key="fi" class="flex items-center gap-2 mb-2">
            <NSelect
              :value="field.name"
              :options="fieldOptions"
              size="small"
              style="flex: 1"
              @update:value="(v) => updateFieldInSection(formTab, si, fi, { name: v })"
            />
            <NSelect
              :value="field.width || 'full'"
              :options="WIDTH_OPTIONS"
              size="small"
              style="width: 100px"
              @update:value="(v) => updateFieldInSection(formTab, si, fi, { width: v })"
            />
            <NInput
              :value="field.placeholder || ''"
              size="small"
              placeholder="Placeholder"
              style="width: 140px"
              @update:value="(v) => updateFieldInSection(formTab, si, fi, { placeholder: v })"
            />
            <NButton size="small" quaternary type="error" @click="removeFieldFromSection(formTab, si, fi)">
              <template #icon><NIcon><TrashCan /></NIcon></template>
            </NButton>
          </div>

          <NButton size="small" quaternary block @click="addFieldToSection(formTab, si)">
            <template #icon><NIcon><Add /></NIcon></template>
            Add Field
          </NButton>
        </NCard>
      </div>

      <NButton dashed block @click="addSection(formTab)">
        <template #icon><NIcon><Add /></NIcon></template>
        Add Section
      </NButton>
    </div>
  </div>
</template>
