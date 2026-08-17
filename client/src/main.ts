import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

import('@/stores/settings.store').then(({ useSettingsStore }) => {
  const settingsStore = useSettingsStore()
  settingsStore.fetchSettings().then(() => settingsStore.updateHtmlMeta()).catch(() => {})
})
