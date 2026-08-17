import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import App from '@/App.vue'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const { useSettingsStore } = await import('@/stores/settings.store')
const settingsStore = useSettingsStore()
await settingsStore.fetchSettings()
settingsStore.updateHtmlMeta()

app.mount('#app')
