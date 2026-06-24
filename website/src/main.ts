import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore, TOKEN_KEY } from '@/stores/auth'
import './style.css'

async function bootstrap() {
  if (import.meta.env.VITE_MOCK === 'true') {
    await import('./mock')
  }

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  const authStore = useAuthStore(pinia)

  window.addEventListener('auth:unauthorized', () => {
    authStore.clearSession()
    router.push({ name: 'login' })
  })

  // 其他标签页退出登录时同步清空本页状态
  window.addEventListener('storage', (e) => {
    if (e.key === TOKEN_KEY && e.newValue === null) {
      authStore.clearSession()
      router.push({ name: 'login' })
    }
  })

  await authStore.initAuth()
  app.mount('#app')
}

bootstrap()
