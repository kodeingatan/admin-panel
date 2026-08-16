import axios from 'axios'
import { getErrorMessage } from '@/utils/error'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    if (error.response?.status === 403) {
      window.dispatchEvent(
        new CustomEvent('rbac-denied', {
          detail: {
            message: getErrorMessage(
              error,
              "Anda tidak memiliki akses untuk melakukan aktivitas ini.",
            ),
          },
        }),
      )
    }
    return Promise.reject(error)
  },
)

export default api
