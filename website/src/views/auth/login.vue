<template>
  <div
    class="min-h-screen bg-[#F0F0F0] flex flex-col"
    style="font-family: 'Inter', 'Helvetica Neue', -apple-system, sans-serif;"
  >
    <AuthHeader />

    <div class="flex-1 flex items-center justify-center px-4 pt-[84px] pb-12">
      <div class="w-full max-w-[420px] bg-white rounded-[12px] border border-[#E0E0E0] px-8 py-10">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-[#1A1A1A] tracking-[-0.01em]">Connexion</h1>
          <p class="mt-1 text-sm text-[#7F8C8D]">登录</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div v-if="errorMsg" class="px-3 py-2 rounded-[8px] bg-[#C0392B]/8 text-sm text-[#C0392B]" role="alert">
            {{ errorMsg }}
          </div>

          <div class="space-y-1.5">
            <label for="email" class="text-xs text-[#1A1A1A] font-medium">
              E-mail <span class="text-[#7F8C8D] font-normal">邮箱</span>
            </label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              maxlength="254"
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full px-3 py-2.5 rounded-[8px] border text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none transition-colors"
              :class="fieldErrors.email ? 'border-[#C0392B]' : 'border-[#E0E0E0] focus:border-[#C0392B]'"
              @input="fieldErrors.email = ''"
            />
            <p v-if="fieldErrors.email" class="text-xs text-[#C0392B]">{{ fieldErrors.email }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="password" class="text-xs text-[#1A1A1A] font-medium">
              Mot de passe <span class="text-[#7F8C8D] font-normal">密码</span>
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              maxlength="128"
              autocomplete="current-password"
              placeholder="••••••"
              class="w-full px-3 py-2.5 rounded-[8px] border text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none transition-colors"
              :class="fieldErrors.password ? 'border-[#C0392B]' : 'border-[#E0E0E0] focus:border-[#C0392B]'"
              @input="fieldErrors.password = ''"
            />
            <p v-if="fieldErrors.password" class="text-xs text-[#C0392B]">{{ fieldErrors.password }}</p>
          </div>

          <button
            type="submit"
            class="w-full mt-6 px-5 py-2.5 rounded-[8px] text-sm font-medium bg-[#C0392B] text-white hover:bg-[#a93226] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
              <span>{{ loading ? 'Connexion…' : 'Se connecter' }}</span>
              <span class="text-xs opacity-70">{{ loading ? '登录中…' : '登录' }}</span>
            </span>
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-[#7F8C8D]">
          Pas encore de compte ?
          <router-link to="/register" class="text-[#C0392B] hover:underline underline-offset-2">
            S'inscrire / 注册
          </router-link>
        </p>

        <p v-if="isDev" class="mt-4 text-center text-xs text-[#7F8C8D]">
          Copyright (c) 2026. 巴黎臻藏. 版权所有。
        </p>
      </div>
    </div>
    <footer class="py-4 text-center text-[11px] text-[#BEBEBE]">
      Copyright &copy; 2026 巴黎臻藏 · ZHEN Collection Paris. 版权所有。
    </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthHeader from '@/components/AuthHeader.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const fieldErrors = reactive({
  email: '',
  password: '',
})

const errorMsg = ref('')
const loading = ref(false)
const isDev = import.meta.env.DEV

// 注意：此锁仅为 UX 友好提示，不能替代服务端限流；后端须独立实现 IP/账号维度限速
const LOCK_STORAGE_PREFIX = 'login-lock:'

interface LoginLockState {
  attempts: number
  lockedUntil: number
}

function getLockKey(email: string) {
  return `${LOCK_STORAGE_PREFIX}${email.toLowerCase()}`
}

function readLockState(email: string): LoginLockState {
  const raw = sessionStorage.getItem(getLockKey(email))
  if (!raw) return { attempts: 0, lockedUntil: 0 }
  try {
    return JSON.parse(raw) as LoginLockState
  } catch {
    return { attempts: 0, lockedUntil: 0 }
  }
}

function writeLockState(email: string, state: LoginLockState) {
  sessionStorage.setItem(getLockKey(email), JSON.stringify(state))
}

function clearLockState(email: string) {
  sessionStorage.removeItem(getLockKey(email))
}

function validate() {
  fieldErrors.email = ''
  fieldErrors.password = ''
  let valid = true

  if (!form.email) {
    fieldErrors.email = '请输入邮箱'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    fieldErrors.email = '请输入有效的邮箱地址'
    valid = false
  }

  if (!form.password) {
    fieldErrors.password = '请输入密码'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  errorMsg.value = ''
  const lockState = readLockState(form.email)
  if (Date.now() < lockState.lockedUntil) {
    const seconds = Math.ceil((lockState.lockedUntil - Date.now()) / 1000)
    errorMsg.value = `尝试次数过多，请 ${seconds} 秒后再试`
    return
  }
  if (!validate()) return

  loading.value = true
  try {
    const result = await authStore.login(form.email, form.password)
    if (result.success) {
      clearLockState(form.email)
      const rawRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
      const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/profile'
      router.push(redirect)
      return
    }
    const nextAttempts = lockState.attempts + 1
    if (nextAttempts >= 5) {
      writeLockState(form.email, { attempts: 0, lockedUntil: Date.now() + 60_000 })
      errorMsg.value = '尝试次数过多，请 1 分钟后再试'
      return
    }
    writeLockState(form.email, { attempts: nextAttempts, lockedUntil: 0 })
    errorMsg.value = result.message
  } finally {
    loading.value = false
  }
}
</script>
