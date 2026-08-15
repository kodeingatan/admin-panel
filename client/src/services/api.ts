import axios from 'axios'

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
            message:
              error.response?.data?.message ||
              "Access denied. You don't have permission to perform this action.",
          },
        }),
      )
    }
    return Promise.reject(error)
  },
)

export default api
