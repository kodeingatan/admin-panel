<script setup lang="ts">
import { watch, ref } from 'vue'
import {
  NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem,
  NTag, NButton, NSpace, NSpin,
} from 'naive-ui'
import { Edit } from '@vicons/carbon'
import { permissionsService } from '@/services/permissions.service'
import type { Permission } from '@/types/permission'

const props = defineProps<{
  visible: boolean
  permissionId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'edit', permission: Permission): void
}>()

const permission = ref<Permission | null>(null)
const loading = ref(false)

watch(() => props.visible, async (val) => {
  if (val && props.permissionId) {
    loading.value = true
    try {
      const { data } = await permissionsService.getById(props.permissionId)
      permission.value = data
    } catch {
      permission.value = null
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <NDrawer :show="visible" @update:show="(v) => emit('update:visible', v)" :width="400">
    <NDrawerContent title="Permission Detail">
      <NSpin :show="loading">
        <NDescriptions v-if="permission" bordered :column="1" label-placement="left">
          <NDescriptionsItem label="ID">{{ permission.id }}</NDescriptionsItem>
          <NDescriptionsItem label="Permission Name">{{ permission.permissionName }}</NDescriptionsItem>
          <NDescriptionsItem label="Description">{{ permission.description || '-' }}</NDescriptionsItem>
          <NDescriptionsItem label="Methods">
            <NSpace :size="4">
              <NTag
                v-for="m in permission.methods"
                :key="m.id"
                size="small"
                type="success"
                :bordered="false"
              >
                {{ m.method }}
              </NTag>
            </NSpace>
          </NDescriptionsItem>
          <NDescriptionsItem label="URLs">
            <NSpace :size="4">
              <NTag
                v-for="u in permission.urls"
                :key="u.id"
                size="small"
                type="info"
                :bordered="false"
              >
                {{ u.url }}
              </NTag>
            </NSpace>
          </NDescriptionsItem>
          <NDescriptionsItem label="Created At">{{ new Date(permission.createdAt).toLocaleString() }}</NDescriptionsItem>
          <NDescriptionsItem label="Updated At">{{ new Date(permission.updatedAt).toLocaleString() }}</NDescriptionsItem>
        </NDescriptions>
      </NSpin>
      <template #footer>
        <NSpace>
          <NButton type="primary" @click="permission && emit('edit', permission)">
            <template #icon><Edit /></template>
            Edit
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
