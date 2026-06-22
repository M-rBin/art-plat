<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0] h-[84px]">
    <div class="max-w-[1200px] mx-auto h-full flex items-center justify-between px-8">
      <router-link to="/" class="flex items-baseline gap-4">
        <span class="text-[#1A1A1A] font-black text-[32px] tracking-[0.06em] leading-none">ZHEN</span>
        <span class="text-[#7F8C8D] text-[11px] tracking-widest uppercase whitespace-nowrap">Collection Paris</span>
        <span class="text-[#1A1A1A] text-sm font-medium tracking-widest">巴黎 臻 藏</span>
      </router-link>
      <slot />
    </div>
  </header>
</template>
