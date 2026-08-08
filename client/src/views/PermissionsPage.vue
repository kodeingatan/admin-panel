<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import { PermissionTable, PermissionFormModal, PermissionDetailDrawer } from '@/features/users'
import type { Permission } from '@/types/permission'

const authStore = useAuthStore()
const showForm = ref(false)
const showDetail = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedPermission = ref<Permission | null>(null)

function handleCreate() {
  formMode.value = 'create'
  selectedPermission.value = null
  showForm.value = true
}

function handleEdit(permission: Permission) {
  formMode.value = 'edit'
  selectedPermission.value = permission
  showForm.value = true
}

function handleDetail(permission: Permission) {
  selectedPermission.value = permission
  showDetail.value = true
}

function handleFormSuccess() {
  showForm.value = false
  selectedPermission.value = null
}

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <PermissionTable @create="handleCreate" @edit="handleEdit" @detail="handleDetail" />
    <PermissionFormModal
      v-model:visible="showForm"
      :mode="formMode"
      :permission="selectedPermission"
      @success="handleFormSuccess"
    />
    <PermissionDetailDrawer
      v-model:visible="showDetail"
      :permission-id="selectedPermission?.id ?? null"
      @edit="handleEdit"
    />
  </AppLayout>
</template>
