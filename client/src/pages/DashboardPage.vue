<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NSpin } from 'naive-ui'
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
    <div v-if="loading" class="flex justify-center py-12">
      <NSpin size="large" />
    </div>

    <div v-else-if="user" class="max-w-4xl">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        Welcome, {{ user.firstName }} {{ user.lastName }}!
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm text-gray-500">Username</dt>
              <dd class="text-sm font-medium text-gray-900">{{ user.username }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-500">Email</dt>
              <dd class="text-sm font-medium text-gray-900">{{ user.email }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <router-link
              to="/dashboard/users"
              class="block w-full text-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
            >
              Manage Users
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
