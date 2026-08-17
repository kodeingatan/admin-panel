import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

interface Setting {
  id: number
  key: string
  value: string
}

export const useSettingsStore = defineStore('settings', () => {
  const appName = ref('MyApp')
  const appFavicon = ref('/favicon.svg')
  const loginBgGradient = ref('#1e40af,#3b82f6,#6366f1')
  const loginBgImage = ref('')
  const loading = ref(false)

  function applySettings(data: Setting[]) {
    const map = Object.fromEntries(data.map(s => [s.key, s.value]))
    if (map['app_name']) appName.value = map['app_name']
    if (map['app_favicon']) appFavicon.value = map['app_favicon']
    if (map['login_bg_gradient']) loginBgGradient.value = map['login_bg_gradient']
    if (map['login_bg_image']) loginBgImage.value = map['login_bg_image']
  }

  async function fetchSettings() {
    loading.value = true
    try {
      const { data } = await api.get<Setting[]>('/settings')
      applySettings(data)
      updateHtmlMeta()
      return data
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(settings: { key: string; value: string }[]) {
    loading.value = true
    try {
      const { data } = await api.put<Setting[]>('/settings', { settings })
      applySettings(data)
      updateHtmlMeta()
      return data
    } finally {
      loading.value = false
    }
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await api.post<{ url: string }>('/settings/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
      return `${base}${data.url}`
    } catch {
      return null
    }
  }

  function updateHtmlMeta() {
    document.title = appName.value
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (link) link.href = appFavicon.value
  }

  function getGradientColors(): string[] {
    return loginBgGradient.value.split(',').map(c => c.trim())
  }

  return {
    appName,
    appFavicon,
    loginBgGradient,
    loginBgImage,
    loading,
    fetchSettings,
    updateSettings,
    uploadFile,
    getGradientColors,
    updateHtmlMeta,
  }
})
