<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NSpin,
  NCard,
  NDataTable,
  NButton,
  NSpace,
} from 'naive-ui'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'

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
  { title: 'Guard Name', key: 'name' },
  { title: 'URL Pattern', key: 'urlPattern' },
  { title: 'Method', key: 'method' },
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
        <n-card title="Guard Management" class="mb-4">
          <template #header-extra>
            <n-space>
              <n-button type="primary">Add Guard</n-button>
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
