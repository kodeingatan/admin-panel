import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User } from '@/types/user'
import type { LoginPayload, RegisterPayload, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const fullName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}` : '')

  async function login(payload: LoginPayload) {
    loading.value = true
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      token.value = data.accessToken
      user.value = data.user
      localStorage.setItem('accessToken', data.accessToken)
      return data
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', payload)
      token.value = data.accessToken
      user.value = data.user
      localStorage.setItem('accessToken', data.accessToken)
      return data
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    loading.value = true
    try {
      const { data } = await api.get<User>('/auth/profile')
      user.value = data
      return data
    } catch {
      token.value = null
      user.value = null
      localStorage.removeItem('accessToken')
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('accessToken')
  }

  return { token, user, loading, isAuthenticated, fullName, login, register, fetchProfile, logout }
})
