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
  const appDescription = ref('Sistem manajemen bisnis digital')
  const loading = ref(false)

  function applySettings(data: Setting[]) {
    const map = Object.fromEntries(data.map(s => [s.key, s.value]))
    if (map['app_name']) appName.value = map['app_name']
    if (map['app_favicon']) appFavicon.value = map['app_favicon']
    if (map['login_bg_gradient']) loginBgGradient.value = map['login_bg_gradient']
    if (map['login_bg_image']) loginBgImage.value = map['login_bg_image']
    if (map['app_description']) appDescription.value = map['app_description']
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
      return data.url
    } catch {
      return null
    }
  }

  function getMimeType(url: string): string {
    const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase() ?? ''
    const mimeMap: Record<string, string> = {
      svg: 'image/svg+xml',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
      ico: 'image/x-icon',
    }
    return mimeMap[ext] ?? 'image/svg+xml'
  }

  function updateHtmlMeta() {
    document.title = appName.value
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (link) {
      link.href = appFavicon.value
      link.type = getMimeType(appFavicon.value)
    }
  }

  function getGradientColors(): string[] {
    return loginBgGradient.value.split(',').map(c => c.trim())
  }

  return {
    appName,
    appFavicon,
    loginBgGradient,
    loginBgImage,
    appDescription,
    loading,
    fetchSettings,
    updateSettings,
    uploadFile,
    getGradientColors,
    updateHtmlMeta,
  }
})
