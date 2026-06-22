<template>
  <div
    class="min-h-screen bg-[#F0F0F0] flex flex-col"
    style="font-family: 'Inter', 'Helvetica Neue', -apple-system, sans-serif;"
  >
    <AuthHeader />

    <div class="flex-1 flex items-center justify-center px-4 pt-[84px] pb-12">
      <div class="w-full max-w-[420px] bg-white rounded-[12px] border border-[#E0E0E0] px-8 py-10">
        <template v-if="!registered">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-[#1A1A1A] tracking-[-0.01em]">Inscription</h1>
            <p class="mt-1 text-sm text-[#7F8C8D]">注册</p>
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
                autocomplete="new-password"
                placeholder="至少 8 位，含字母和数字"
                class="w-full px-3 py-2.5 rounded-[8px] border text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none transition-colors"
                :class="fieldErrors.password ? 'border-[#C0392B]' : 'border-[#E0E0E0] focus:border-[#C0392B]'"
                @input="fieldErrors.password = ''"
              />
              <p v-if="fieldErrors.password" class="text-xs text-[#C0392B]">{{ fieldErrors.password }}</p>
            </div>

            <div class="space-y-1.5">
              <label for="confirmPassword" class="text-xs text-[#1A1A1A] font-medium">
                Confirmer le mot de passe <span class="text-[#7F8C8D] font-normal">确认密码</span>
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                maxlength="128"
                autocomplete="new-password"
                placeholder="再次输入密码"
                class="w-full px-3 py-2.5 rounded-[8px] border text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none transition-colors"
                :class="fieldErrors.confirmPassword ? 'border-[#C0392B]' : 'border-[#E0E0E0] focus:border-[#C0392B]'"
                @input="fieldErrors.confirmPassword = ''"
              />
              <p v-if="fieldErrors.confirmPassword" class="text-xs text-[#C0392B]">{{ fieldErrors.confirmPassword }}</p>
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
                <span>{{ loading ? 'Envoi…' : "S'inscrire" }}</span>
                <span class="text-xs opacity-70">{{ loading ? '提交中…' : '注册' }}</span>
              </span>
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-[#7F8C8D]">
            Déjà un compte ?
            <router-link to="/login" class="text-[#C0392B] hover:underline underline-offset-2">
              Se connecter / 登录
            </router-link>
          </p>
        </template>

        <template v-else>
          <div class="text-center space-y-4">
            <div class="mx-auto w-14 h-14 rounded-full bg-[#C0392B]/8 flex items-center justify-center">
              <svg class="w-7 h-7 text-[#C0392B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>

            <div>
              <h1 class="text-2xl font-bold text-[#1A1A1A] tracking-[-0.01em]">Vérifiez votre e-mail</h1>
              <p class="mt-1 text-sm text-[#7F8C8D]">请查收确认邮件</p>
            </div>

            <p class="text-sm text-[#7F8C8D] leading-relaxed">
              我们已向
              <span class="font-medium text-[#1A1A1A]">{{ form.email }}</span>
              发送确认邮件，请点击邮件中的链接完成注册。
            </p>

            <div v-if="isDev && safeVerifyUrl" class="rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 text-left">
              <p class="text-xs text-[#7F8C8D] mb-2">演示环境确认链接（Mock）</p>
              <a
                :href="safeVerifyUrl"
                class="text-sm text-[#C0392B] break-all hover:underline underline-offset-2"
              >
                {{ safeVerifyUrl }}
              </a>
            </div>

            <router-link
              to="/login"
              class="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-[8px] text-sm font-medium border border-[#E0E0E0] text-[#7F8C8D] hover:border-[#C0392B] hover:text-[#C0392B] transition-colors"
            >
              <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Aller à la connexion</span>
                <span class="text-xs opacity-60">前往登录</span>
              </span>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AuthHeader from '@/components/AuthHeader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const fieldErrors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const errorMsg = ref('')
const loading = ref(false)
const registered = ref(false)
const verifyUrl = ref('')
const isDev = import.meta.env.DEV

function sanitizeHttpUrl(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin)
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : ''
  } catch {
    return ''
  }
}

const safeVerifyUrl = computed(() => sanitizeHttpUrl(verifyUrl.value))

function validate() {
  fieldErrors.email = ''
  fieldErrors.password = ''
  fieldErrors.confirmPassword = ''
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
  } else if (form.password.length < 8) {
    fieldErrors.password = '密码至少需要 8 位'
    valid = false
  } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)) {
    fieldErrors.password = '密码需至少 8 位，且包含字母和数字'
    valid = false
  }

  if (!form.confirmPassword) {
    fieldErrors.confirmPassword = '请确认密码'
    valid = false
  } else if (form.confirmPassword !== form.password) {
    fieldErrors.confirmPassword = '两次输入的密码不一致'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  errorMsg.value = ''
  if (!validate()) return

  loading.value = true
  try {
    const result = await authStore.register(form.email, form.password)
    if (result.success) {
      verifyUrl.value = result.verifyUrl
      registered.value = true
      return
    }
    errorMsg.value = result.message
  } finally {
    loading.value = false
  }
}
</script>
