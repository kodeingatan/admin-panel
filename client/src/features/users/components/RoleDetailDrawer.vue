<script setup lang="ts">
import { watch, ref } from 'vue'
import {
  NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem,
  NTag, NButton, NSpace, NSpin,
} from 'naive-ui'
import { Edit } from '@vicons/carbon'
import { rolesService } from '@/services/roles.service'
import type { Role } from '@/types/role'

const props = defineProps<{
  visible: boolean
  roleId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'edit', role: Role): void
}>()

const role = ref<Role | null>(null)
const loading = ref(false)

watch(() => props.visible, async (val) => {
  if (val && props.roleId) {
    loading.value = true
    try {
      const { data } = await rolesService.getById(props.roleId)
      role.value = data
    } catch {
      role.value = null
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <NDrawer :show="visible" @update:show="(v) => emit('update:visible', v)" :width="400">
    <NDrawerContent title="Role Detail">
      <NSpin :show="loading">
        <NDescriptions v-if="role" bordered :column="1" label-placement="left">
          <NDescriptionsItem label="ID">{{ role.id }}</NDescriptionsItem>
          <NDescriptionsItem label="Role Name">{{ role.roleName }}</NDescriptionsItem>
          <NDescriptionsItem label="Description">{{ role.description || '-' }}</NDescriptionsItem>
          <NDescriptionsItem label="Guards">
            <NSpace :size="4">
              <NTag
                v-for="g in role.guards"
                :key="g.id"
                size="small"
                type="warning"
                :bordered="false"
              >
                {{ g.guardName }}
              </NTag>
            </NSpace>
          </NDescriptionsItem>
          <NDescriptionsItem label="Permissions">
            <NSpace :size="4">
              <NTag
                v-for="p in role.permissions"
                :key="p.id"
                size="small"
                type="info"
                :bordered="false"
              >
                {{ p.permissionName }}
              </NTag>
            </NSpace>
          </NDescriptionsItem>
          <NDescriptionsItem label="Created At">{{ new Date(role.createdAt).toLocaleString() }}</NDescriptionsItem>
          <NDescriptionsItem label="Updated At">{{ new Date(role.updatedAt).toLocaleString() }}</NDescriptionsItem>
        </NDescriptions>
      </NSpin>
      <template #footer>
        <NSpace>
          <NButton type="primary" @click="role && emit('edit', role)">
            <template #icon><Edit /></template>
            Edit
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
