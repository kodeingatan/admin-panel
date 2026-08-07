<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NSpin,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NGrid,
  NGi,
} from 'naive-ui'
import AppLayout from '../components/AppLayout/AppLayout.vue'

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
    <n-spin :show="loading" style="width: 100%;">
      <template #description>Loading...</template>

      <div v-if="!loading && user">
        <n-card title="Dashboard" style="margin-bottom: 16px;">
          <template #header-extra>
            Welcome back!
          </template>
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
            Hello, {{ user.firstName }} {{ user.lastName }}!
          </h2>
          <p style="color: #666;">Here's your account overview.</p>
        </n-card>

        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-gi>
            <n-card title="Profile Information">
              <n-descriptions label-placement="left" bordered :column="1">
                <n-descriptions-item label="Username">
                  {{ user.username }}
                </n-descriptions-item>
                <n-descriptions-item label="Email">
                  {{ user.email }}
                </n-descriptions-item>
              </n-descriptions>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card title="Quick Actions">
              <n-button
                type="primary"
                block
                @click="router.push('/dashboard/users')"
              >
                Manage Users
              </n-button>
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </n-spin>
  </AppLayout>
</template>
