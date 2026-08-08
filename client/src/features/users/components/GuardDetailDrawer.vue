<script setup lang="ts">
import { watch, ref } from 'vue'
import {
  NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem,
  NTag, NButton, NSpace, NSpin,
} from 'naive-ui'
import { Edit } from '@vicons/carbon'
import { guardsService } from '@/services/guards.service'
import type { Guard } from '@/types/guard'

const props = defineProps<{
  visible: boolean
  guardId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'edit', guard: Guard): void
}>()

const guard = ref<Guard | null>(null)
const loading = ref(false)

watch(() => props.visible, async (val) => {
  if (val && props.guardId) {
    loading.value = true
    try {
      const { data } = await guardsService.getById(props.guardId)
      guard.value = data
    } catch {
      guard.value = null
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <NDrawer :show="visible" @update:show="(v) => emit('update:visible', v)" :width="400">
    <NDrawerContent title="Guard Detail">
      <NSpin :show="loading">
        <NDescriptions v-if="guard" bordered :column="1" label-placement="left">
          <NDescriptionsItem label="ID">{{ guard.id }}</NDescriptionsItem>
          <NDescriptionsItem label="Guard Name">{{ guard.guardName }}</NDescriptionsItem>
          <NDescriptionsItem label="Description">{{ guard.description || '-' }}</NDescriptionsItem>
          <NDescriptionsItem label="Allow URLs">
            <NSpace :size="4">
              <NTag
                v-for="u in guard.urls?.filter((u) => u.type === 'allow')"
                :key="u.id"
                size="small"
                type="success"
                :bordered="false"
              >
                {{ u.url }}
              </NTag>
            </NSpace>
          </NDescriptionsItem>
          <NDescriptionsItem label="Deny URLs">
            <NSpace :size="4">
              <NTag
                v-for="u in guard.urls?.filter((u) => u.type === 'deny')"
                :key="u.id"
                size="small"
                type="error"
                :bordered="false"
              >
                {{ u.url }}
              </NTag>
            </NSpace>
          </NDescriptionsItem>
          <NDescriptionsItem label="Created At">{{ new Date(guard.createdAt).toLocaleString() }}</NDescriptionsItem>
          <NDescriptionsItem label="Updated At">{{ new Date(guard.updatedAt).toLocaleString() }}</NDescriptionsItem>
        </NDescriptions>
      </NSpin>
      <template #footer>
        <NSpace>
          <NButton type="primary" @click="guard && emit('edit', guard)">
            <template #icon><Edit /></template>
            Edit
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
