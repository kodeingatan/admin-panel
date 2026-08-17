<script setup lang="ts">
import { watch } from 'vue'
import { NForm, NFormItem, NInput, NText } from 'naive-ui'
import type { CreateScModule } from '@/types/system-creator'

const props = defineProps<{ modelValue: CreateScModule }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: CreateScModule): void }>()

function update(field: keyof CreateScModule, value: any) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

watch(
  () => props.modelValue.name,
  (name) => {
    if (!name) return
    const label = name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ')
    const menuLabel = label + 's'
    emit('update:modelValue', {
      ...props.modelValue,
      label: props.modelValue.label || label,
      menuLabel: props.modelValue.menuLabel || menuLabel,
    })
  },
)
</script>

<template>
  <NForm label-placement="top">
    <NFormItem label="Module Name" required>
      <NInput
        :value="modelValue.name"
        placeholder="e.g. product"
        @update:value="(v) => update('name', v)"
      />
      <NText depth="3" class="mt-1 block text-xs">snake_case, e.g. product_order, blog_post</NText>
    </NFormItem>
    <NFormItem label="Label" required>
      <NInput
        :value="modelValue.label"
        placeholder="e.g. Product"
        @update:value="(v) => update('label', v)"
      />
    </NFormItem>
    <NFormItem label="Menu Label" required>
      <NInput
        :value="modelValue.menuLabel"
        placeholder="e.g. Products"
        @update:value="(v) => update('menuLabel', v)"
      />
    </NFormItem>
    <NFormItem label="Description">
      <NInput
        :value="modelValue.description"
        type="textarea"
        placeholder="Optional description"
        @update:value="(v) => update('description', v)"
      />
    </NFormItem>
  </NForm>
</template>
