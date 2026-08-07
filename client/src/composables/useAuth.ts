import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

interface AuthResponse {
  accessToken: string
  user: User
}

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref('')

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!localStorage.getItem('accessToken'))
  const currentUser = computed(() => user.value)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = ''

    try {
      const data = await useApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      localStorage.setItem('accessToken', data.accessToken)
      user.value = data.user
      router.push('/dashboard')
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(payload: {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
    confirmPassword: string
  }) {
    loading.value = true
    error.value = ''

    try {
      const data = await useApi<AuthResponse>('/auth/register', {
        method: 'POST',
        body: payload,
      })

      localStorage.setItem('accessToken', data.accessToken)
      user.value = data.user
      router.push('/dashboard')
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getProfile() {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    loading.value = true

    try {
      const data = await useApi<User>('/auth/profile', { token })
      user.value = data
    } catch {
      localStorage.removeItem('accessToken')
      router.push('/login')
    } finally {
      loading.value = false
    }
  }

  function logout() {
    localStorage.removeItem('accessToken')
    user.value = null
    router.push('/login')
  }

  return {
    user: currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    getProfile,
    logout,
  }
}
