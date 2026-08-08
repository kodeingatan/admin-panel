<script setup lang="ts">
import { watch, ref } from 'vue'
import {
  NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem,
  NTag, NButton, NSpace, NSpin,
} from 'naive-ui'
import { Edit } from '@vicons/carbon'
import { usersService } from '@/services/users.service'
import type { User } from '@/types/user'

const props = defineProps<{
  visible: boolean
  userId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'edit', user: User): void
}>()

const user = ref<User | null>(null)
const loading = ref(false)

watch(() => props.visible, async (val) => {
  if (val && props.userId) {
    loading.value = true
    try {
      const { data } = await usersService.getById(props.userId)
      user.value = data
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <NDrawer :show="visible" @update:show="(v) => emit('update:visible', v)" :width="400">
    <NDrawerContent title="User Detail">
      <NSpin :show="loading">
        <NDescriptions v-if="user" bordered :column="1" label-placement="left">
          <NDescriptionsItem label="ID">{{ user.id }}</NDescriptionsItem>
          <NDescriptionsItem label="First Name">{{ user.firstName }}</NDescriptionsItem>
          <NDescriptionsItem label="Last Name">{{ user.lastName }}</NDescriptionsItem>
          <NDescriptionsItem label="Username">{{ user.username }}</NDescriptionsItem>
          <NDescriptionsItem label="Email">{{ user.email }}</NDescriptionsItem>
          <NDescriptionsItem label="Roles">
            <NSpace :size="4">
              <NTag v-for="role in user.roles" :key="role.id" size="small" type="info" :bordered="false">
                {{ role.roleName }}
              </NTag>
            </NSpace>
          </NDescriptionsItem>
          <NDescriptionsItem label="Created At">{{ new Date(user.createdAt).toLocaleString() }}</NDescriptionsItem>
          <NDescriptionsItem label="Updated At">{{ new Date(user.updatedAt).toLocaleString() }}</NDescriptionsItem>
        </NDescriptions>
      </NSpin>
      <template #footer>
        <NSpace>
          <NButton type="primary" @click="user && emit('edit', user)">
            <template #icon><Edit /></template>
            Edit
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
