import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:3000/api'

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

export function useAuth() {
  const router = useRouter()
  const user = ref<User | null>(null)
  const error = ref<string>('')
  const loading = ref(false)

  const token = ref<string | null>(localStorage.getItem('accessToken'))

  function setToken(accessToken: string) {
    token.value = accessToken
    localStorage.setItem('accessToken', accessToken)
  }

  function clearToken() {
    token.value = null
    localStorage.removeItem('accessToken')
  }

  async function register(data: {
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
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message || 'Registration failed')
      }

      setToken(json.accessToken)
      user.value = json.user
      router.push('/dashboard')
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = ''

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message || 'Login failed')
      }

      setToken(json.accessToken)
      user.value = json.user
      router.push('/dashboard')
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function logout() {
    clearToken()
    user.value = null
    router.push('/login')
  }

  return { user, error, loading, token, register, login, logout }
}
