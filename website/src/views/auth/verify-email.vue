<template>
  <div
    class="min-h-screen bg-[#F0F0F0] flex flex-col"
    style="font-family: 'Inter', 'Helvetica Neue', -apple-system, sans-serif;"
  >
    <AuthHeader />

    <div class="flex-1 flex items-center justify-center px-4 pt-[84px] pb-12">
      <div class="w-full max-w-[420px] bg-white rounded-[12px] border border-[#E0E0E0] px-8 py-10 text-center">
        <template v-if="status === 'loading'">
          <div class="mx-auto w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-[#7F8C8D] animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-[#1A1A1A] tracking-[-0.01em]">Vérification…</h1>
          <p class="mt-1 text-sm text-[#7F8C8D]">正在确认邮箱…</p>
        </template>

        <template v-else-if="status === 'success'">
          <div class="mx-auto w-14 h-14 rounded-full bg-[#C0392B]/8 flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-[#C0392B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-[#1A1A1A] tracking-[-0.01em]">E-mail confirmé</h1>
          <p class="mt-1 text-sm text-[#7F8C8D]">邮箱确认成功</p>
          <p class="mt-4 text-sm text-[#7F8C8D] leading-relaxed">{{ message }}</p>
          <router-link
            to="/login"
            class="inline-flex items-center justify-center w-full mt-6 px-5 py-2.5 rounded-[8px] text-sm font-medium bg-[#C0392B] text-white hover:bg-[#a93226] transition-colors"
          >
            <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
              <span>Se connecter</span>
              <span class="text-xs opacity-70">前往登录</span>
            </span>
          </router-link>
        </template>

        <template v-else>
          <div class="mx-auto w-14 h-14 rounded-full bg-[#C0392B]/8 flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-[#C0392B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-[#1A1A1A] tracking-[-0.01em]">Échec de la vérification</h1>
          <p class="mt-1 text-sm text-[#7F8C8D]">确认失败</p>
          <p class="mt-4 text-sm text-[#C0392B] leading-relaxed" role="alert">{{ message }}</p>
          <div class="mt-6 flex flex-col gap-3">
            <router-link
              to="/register"
              class="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-[8px] text-sm font-medium bg-[#C0392B] text-white hover:bg-[#a93226] transition-colors"
            >
              <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>S'inscrire à nouveau</span>
                <span class="text-xs opacity-70">重新注册</span>
              </span>
            </router-link>
            <router-link
              to="/login"
              class="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-[8px] text-sm font-medium border border-[#E0E0E0] text-[#7F8C8D] hover:border-[#C0392B] hover:text-[#C0392B] transition-colors"
            >
              <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Se connecter</span>
                <span class="text-xs opacity-60">前往登录</span>
              </span>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <footer class="py-4 text-center text-[11px] text-[#BEBEBE]">
      Copyright &copy; 2026 巴黎臻藏 · ZHEN Collection Paris. 版权所有。
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AuthHeader from '@/components/AuthHeader.vue'
import { verifyEmail } from '@/api/auth'

type VerifyStatus = 'loading' | 'success' | 'error'

const route = useRoute()
const status = ref<VerifyStatus>('loading')
const message = ref('')

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''

  if (!token) {
    status.value = 'error'
    message.value = '确认链接无效，请重新注册'
    return
  }

  try {
    const data = await verifyEmail(token)
    if (data.code === 0) {
      status.value = 'success'
      message.value = data.message || '邮箱确认成功，现在可以登录了'
      return
    }
    status.value = 'error'
    message.value = data.message || '确认失败，请重试'
  } catch {
    status.value = 'error'
    message.value = '网络异常，请稍后重试'
  }
})
</script>
