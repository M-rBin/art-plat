import { defineStore } from 'pinia'
import { acceptHMRUpdate } from 'pinia'
import { ref, computed, readonly } from 'vue'
import * as authApi from '@/api/auth'
import type { AuthUser } from '@/api/auth'

// Token 仅保存在内存中；迁移至 httpOnly Cookie 后可实现跨页刷新持久化登录
export const useAuthStore = defineStore('auth', () => {
  const _token = ref<string>('')
  const user = ref<AuthUser | null>(null)
  const token = readonly(_token)

  const isLoggedIn = computed(() => !!_token.value)

  function clearSession() {
    _token.value = ''
    user.value = null
  }

  async function login(email: string, password: string) {
    try {
      const data = await authApi.login(email, password)
      if (data.code === 0 && data.data) {
        _token.value = data.data.token
        user.value = data.data.user
        return { success: true as const }
      }
      return { success: false as const, message: data.message }
    } catch {
      return { success: false as const, message: '网络异常，请稍后重试' }
    }
  }

  async function register(email: string, password: string) {
    try {
      const data = await authApi.register(email, password)
      if (data.code === 0 && data.data) {
        return { success: true as const, message: data.message }
      }
      return { success: false as const, message: data.message }
    } catch {
      return { success: false as const, message: '网络异常，请稍后重试' }
    }
  }

  async function logout() {
    const currentToken = _token.value
    try {
      if (currentToken) {
        await authApi.logout(currentToken)
      }
    } finally {
      clearSession()
    }
  }

  async function initAuth() {
    if (!_token.value) return

    try {
      const data = await authApi.getMe(_token.value, { notifyUnauthorized: false })
      if (data.code === 0 && data.data) {
        user.value = data.data
        return
      }
      clearSession()
    } catch {
      clearSession()
    }
  }

  return { token, user, isLoggedIn, login, register, logout, clearSession, initAuth }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
