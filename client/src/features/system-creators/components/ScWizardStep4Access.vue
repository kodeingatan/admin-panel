<script setup lang="ts">
import { NForm, NFormItem, NRadioGroup, NRadio, NText, NSpace } from 'naive-ui'
import type { CreateScModule } from '@/types/system-creator'

const props = defineProps<{ modelValue: CreateScModule }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: CreateScModule): void }>()

function update(field: keyof CreateScModule, value: any) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <div>
    <NText depth="3" class="block mb-4">
      Configure who can access this module's CRUD endpoints.
    </NText>

    <NForm label-placement="left">
      <NFormItem label="Access Level">
        <NRadioGroup :value="modelValue.accessLevel" @update:value="(v) => update('accessLevel', v)">
          <NSpace vertical>
            <NRadio value="public">
              <NText>Public</NText>
              <NText depth="3" class="text-xs block">No authentication required</NText>
            </NRadio>
            <NRadio value="admin">
              <NText>Admin Only</NText>
              <NText depth="3" class="text-xs block">Admin + Super Admin roles</NText>
            </NRadio>
            <NRadio value="granular">
              <NText>Granular</NText>
              <NText depth="3" class="text-xs block">Custom permissions and guards</NText>
            </NRadio>
          </NSpace>
        </NRadioGroup>
      </NFormItem>
    </NForm>

    <div v-if="modelValue.accessLevel === 'admin'" class="mt-4 p-3 bg-blue-50 rounded">
      <NText class="text-sm">
        Generated endpoints will require <NText strong>Admin</NText> or <NText strong>Super Admin</NText> role.
      </NText>
    </div>

    <div v-if="modelValue.accessLevel === 'granular'" class="mt-4 space-y-3">
      <div class="p-3 bg-purple-50 rounded">
        <NText class="text-sm">
          A permission "<NText strong>{{ modelValue.label }} Management</NText> → Full Access" and a guard
          "<NText strong>{{ modelValue.label }} Access</NText>" will be auto-created.
        </NText>
      </div>
    </div>
  </div>
</template>
