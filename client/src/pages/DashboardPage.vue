<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

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

function logout() {
  localStorage.removeItem('accessToken')
  router.push('/login')
}

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
  <div class="dashboard-page">
    <header class="dashboard-header">
      <h2>Dashboard</h2>
      <button class="logout-btn" @click="logout">Logout</button>
    </header>

    <main class="dashboard-content">
      <div v-if="loading" class="loading">Loading...</div>

      <div v-else-if="user" class="welcome-card">
        <h1>Welcome, {{ user.firstName }} {{ user.lastName }}!</h1>
        <div class="user-info">
          <div class="info-item">
            <span class="label">Username</span>
            <span class="value">{{ user.username }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email</span>
            <span class="value">{{ user.email }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--bg);
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border);
}

.dashboard-header h2 {
  margin: 0;
  color: var(--text-h);
}

.logout-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-h);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: var(--social-bg);
}

.dashboard-content {
  padding: 2rem;
}

.loading {
  text-align: center;
  color: var(--text);
}

.welcome-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg);
}

.welcome-card h1 {
  margin: 0 0 1.5rem;
  color: var(--text-h);
  font-size: 24px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text);
}

.info-item .value {
  font-size: 16px;
  color: var(--text-h);
}
</style>
