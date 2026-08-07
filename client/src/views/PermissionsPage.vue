<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NSpin,
  NCard,
  NDataTable,
  NButton,
  NSpace,
  NIcon,
} from 'naive-ui'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import { Add } from '@vicons/carbon'

const router = useRouter()

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

const user = ref<User | null>(null)
const loading = ref(true)

const columns = [
  { title: 'ID', key: 'id' },
  { title: 'Permission Name', key: 'name' },
  { title: 'Resource', key: 'resource' },
  { title: 'Action', key: 'action' },
  { title: 'Actions', key: 'actions' },
]

const tableData = ref([])

onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      throw new Error('Unauthorized')
    }

    user.value = await res.json()
  } catch {
    localStorage.removeItem('accessToken')
    router.push('/login')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppLayout v-if="user" :user="user">
    <n-spin :show="loading" class="w-full">
      <template #description>Loading...</template>

      <div v-if="!loading && user">
        <n-card title="Permission Management" class="mb-4">
          <template #header-extra>
            <n-space>
              <n-button type="primary">
                <template #icon>
                  <n-icon><Add /></n-icon>
                </template>
                Add Permission
              </n-button>
            </n-space>
          </template>
          <n-data-table
            :columns="columns"
            :data="tableData"
            :bordered="true"
            :single-line="false"
          />
        </n-card>
      </div>
    </n-spin>
  </AppLayout>
</template>
