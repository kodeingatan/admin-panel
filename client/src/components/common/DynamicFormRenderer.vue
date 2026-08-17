<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  NModal, NCard, NForm, NFormItem, NInput, NInputNumber, NSwitch,
  NSelect, NDatePicker, NColorPicker, NUpload, NButton, NSpace, useMessage,
} from 'naive-ui'
import api from '@/services/api'
import type { ScModule, ScFieldConfig } from '@/types/system-creator'

const props = defineProps<{
  visible: boolean
  module: ScModule
  mode: 'create' | 'edit'
  item?: any
}>()

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'success'): void
}>()

const message = useMessage()
const form = ref<Record<string, any>>({})
const submitting = ref(false)

function buildEmptyForm() {
  const f: Record<string, any> = {}
  for (const field of props.module.fieldsConfig || []) {
    if (props.mode === 'edit' && props.item?.[field.name] !== undefined) {
      f[field.name] = props.item[field.name]
    } else {
      f[field.name] = field.defaultValue ?? (field.type === 'boolean' ? false : null)
    }
  }
  return f
}

watch(
  () => props.visible,
  (v) => {
    if (v) form.value = buildEmptyForm()
  },
)

function handleUploadFinish(fieldName: string, { event }: { event: ProgressEvent }) {
  const resp = JSON.parse((event.target as XMLHttpRequest).response)
  form.value[fieldName] = resp.url
}

async function handleSubmit() {
  submitting.value = true
  try {
    const url = `/generated/${props.module.name}`
    if (props.mode === 'create') {
      await api.post(url, form.value)
    } else {
      await api.put(`${url}/${props.item.id}`, form.value)
    }
    message.success(props.mode === 'create' ? 'Created successfully' : 'Updated successfully')
    emit('update:visible', false)
    emit('success')
  } catch (e: any) {
    message.error(e.response?.data?.message || 'Failed to save')
  } finally {
    submitting.value = false
  }
}

function renderField(field: ScFieldConfig) {
  const type = field.type
  if (['text', 'email', 'phone', 'url'].includes(type)) {
    return { component: NInput, props: { value: form.value[field.name], placeholder: field.placeholder, onUpdateValue: (v: string) => { form.value[field.name] = v } } }
  }
  if (['textarea', 'rich-text'].includes(type)) {
    return { component: NInput, props: { value: form.value[field.name], type: 'textarea', rows: 3, placeholder: field.placeholder, onUpdateValue: (v: string) => { form.value[field.name] = v } } }
  }
  if (type === 'number') {
    return { component: NInputNumber, props: { value: form.value[field.name], min: field.min ? Number(field.min) : undefined, max: field.max ? Number(field.max) : undefined, onUpdateValue: (v: number) => { form.value[field.name] = v } } }
  }
  if (type === 'boolean') {
    return { component: NSwitch, props: { value: form.value[field.name], onUpdateValue: (v: boolean) => { form.value[field.name] = v } } }
  }
  if (type === 'date') {
    return { component: NDatePicker, props: { value: form.value[field.name], type: 'date', onUpdateValue: (v: number) => { form.value[field.name] = v } } }
  }
  if (type === 'datetime') {
    return { component: NDatePicker, props: { value: form.value[field.name], type: 'datetime', onUpdateValue: (v: number) => { form.value[field.name] = v } } }
  }
  if (type === 'password') {
    return { component: NInput, props: { value: form.value[field.name], type: 'password', showPasswordOn: 'click', onUpdateValue: (v: string) => { form.value[field.name] = v } } }
  }
  if (type === 'color') {
    return { component: NColorPicker, props: { value: form.value[field.name], onUpdateValue: (v: string) => { form.value[field.name] = v } } }
  }
  if (type === 'select') {
    return { component: NSelect, props: { value: form.value[field.name], options: field.options?.map((o) => ({ label: o.label, value: o.value })), onUpdateValue: (v: any) => { form.value[field.name] = v } } }
  }
  if (type === 'json') {
    return { component: NInput, props: { value: form.value[field.name], type: 'textarea', rows: 5, placeholder: 'JSON', onUpdateValue: (v: string) => { form.value[field.name] = v } } }
  }
  if (type === 'file') {
    return { component: NUpload, props: { action: `/api/generated/${props.module.name}/upload`, defaultFileList: form.value[field.name] ? [{ name: form.value[field.name], url: form.value[field.name] }] : [], onFinish: (args: any) => handleUploadFinish(field.name, args) } }
  }
  if (type === 'image') {
    return { component: NUpload, props: { action: `/api/generated/${props.module.name}/upload`, listType: 'image-card', defaultFileList: form.value[field.name] ? [{ name: form.value[field.name], url: form.value[field.name] }] : [], onFinish: (args: any) => handleUploadFinish(field.name, args) } }
  }
  return { component: NInput, props: { value: form.value[field.name], onUpdateValue: (v: string) => { form.value[field.name] = v } } }
}
</script>

<template>
  <NModal :show="visible" @update:show="(v) => emit('update:visible', v)">
    <NCard
      :title="mode === 'create' ? `Create ${module.label}` : `Edit ${module.label}`"
      style="width: 600px; max-height: 80vh; overflow-y: auto"
      :bordered="false"
    >
      <NForm label-placement="top">
        <NFormItem
          v-for="field in module.fieldsConfig"
          :key="field.name"
          :label="field.label"
          :required="field.required"
        >
          <component
            :is="renderField(field).component"
            v-bind="renderField(field).props"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="emit('update:visible', false)">Cancel</NButton>
          <NButton type="primary" :loading="submitting" :disabled="submitting" @click="handleSubmit">
            {{ mode === 'create' ? 'Create' : 'Save' }}
          </NButton>
        </NSpace>
      </template>
    </NCard>
  </NModal>
</template>
