<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sidebarCollapsed = ref(false)

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

defineProps<{ user: User }>()

function logout() {
  localStorage.removeItem('accessToken')
  router.push('/login')
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-gray-100 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="text-xl font-bold text-indigo-600"> MyApp </span>
      </div>

      <div class="relative group">
        <button class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition">
          <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm">
            {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
          </div>
          <span class="text-sm font-medium text-gray-700">{{ user.firstName }}</span>
        </button>
        <!-- Dropdown menu (hidden by default, show on group-hover) -->
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
          <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside
        :class="[
          'bg-white border-r border-gray-200 transition-all duration-300 shrink-0 flex flex-col',
          sidebarCollapsed ? 'w-16' : 'w-64'
        ]"
      >
        <nav class="flex-1 py-4">
          <router-link
            to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span v-if="!sidebarCollapsed" class="text-sm font-medium">Dashboard</span>
          </router-link>

          <router-link
            to="/dashboard/users"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span v-if="!sidebarCollapsed" class="text-sm font-medium">User Management</span>
          </router-link>
        </nav>
      </aside>

      <!-- Content Area -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500 shrink-0">
      &copy; 2026 MyApp. All rights reserved.
    </footer>
  </div>
</template>
