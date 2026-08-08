<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import { UserTable, UserFormModal, UserDetailDrawer } from '@/features/users'
import type { User } from '@/types/user'

const authStore = useAuthStore()
const showForm = ref(false)
const showDetail = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedUser = ref<User | null>(null)

function handleCreate() {
  formMode.value = 'create'
  selectedUser.value = null
  showForm.value = true
}

function handleEdit(user: User) {
  formMode.value = 'edit'
  selectedUser.value = user
  showForm.value = true
}

function handleDetail(user: User) {
  selectedUser.value = user
  showDetail.value = true
}

function handleFormSuccess() {
  showForm.value = false
  selectedUser.value = null
}

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <UserTable @create="handleCreate" @edit="handleEdit" @detail="handleDetail" />
    <UserFormModal
      v-model:visible="showForm"
      :mode="formMode"
      :user="selectedUser"
      @success="handleFormSuccess"
    />
    <UserDetailDrawer
      v-model:visible="showDetail"
      :user-id="selectedUser?.id ?? null"
      @edit="handleEdit"
    />
  </AppLayout>
</template>
