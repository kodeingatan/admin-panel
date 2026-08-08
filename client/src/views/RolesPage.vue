<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import { RoleTable, RoleFormModal, RoleDetailDrawer } from '@/features/users'
import type { Role } from '@/types/role'

const authStore = useAuthStore()
const showForm = ref(false)
const showDetail = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedRole = ref<Role | null>(null)

function handleCreate() {
  formMode.value = 'create'
  selectedRole.value = null
  showForm.value = true
}

function handleEdit(role: Role) {
  formMode.value = 'edit'
  selectedRole.value = role
  showForm.value = true
}

function handleDetail(role: Role) {
  selectedRole.value = role
  showDetail.value = true
}

function handleFormSuccess() {
  showForm.value = false
  selectedRole.value = null
}

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <RoleTable @create="handleCreate" @edit="handleEdit" @detail="handleDetail" />
    <RoleFormModal
      v-model:visible="showForm"
      :mode="formMode"
      :role="selectedRole"
      @success="handleFormSuccess"
    />
    <RoleDetailDrawer
      v-model:visible="showDetail"
      :role-id="selectedRole?.id ?? null"
      @edit="handleEdit"
    />
  </AppLayout>
</template>
