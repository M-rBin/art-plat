<template>
  <!-- 页面背景：浅灰，内容容器居中白色 -->
  <div class="min-h-screen bg-[#F0F0F0]" style="font-family: 'Inter', 'Helvetica Neue', -apple-system, sans-serif;">

    <!-- ── Fixed Top Bar ───────────────────────────────────────────────── -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0] h-[84px]">
      <div class="max-w-[1200px] mx-auto h-full flex items-center justify-between px-8">
        <div class="flex items-baseline gap-4">
          <span class="text-[#1A1A1A] font-black text-[32px] tracking-[0.06em] leading-none">ZHEN</span>
          <span class="text-[#7F8C8D] text-[11px] tracking-widest uppercase whitespace-nowrap">Collection Paris</span>
          <span class="text-[#1A1A1A] text-sm font-medium tracking-widest">巴 黎 臻 藏</span>
        </div>
        <button
          class="inline-flex items-center gap-1.5 text-sm text-[#7F8C8D] hover:text-[#C0392B] transition-colors"
          @click="handleLogout"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3h-9m9 0l-3-3m3 3l-3 3"/>
          </svg>
          <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
            <span>Déconnexion</span>
            <span class="text-xs opacity-60">注销</span>
          </span>
        </button>
      </div>
    </header>

    <!-- ── Page Body：整体随页面滚动 ──────────────────────────────────── -->
    <div class="max-w-[1200px] mx-auto pt-[84px] bg-white border-x border-[#E0E0E0] min-h-screen flex">

      <!-- ── Left Sidebar（随内容一起滚动）──────────────────────────────── -->
      <aside
        class="w-[200px] shrink-0 bg-[#F7F3EE] hidden md:block"
        aria-label="侧边导航"
      >
        <nav class="py-3 flex flex-col gap-1" aria-label="主导航">
          <template v-for="item in navItems" :key="item.labelZh">
            <!-- 搜索与关于我们之间的分隔线 -->
            <div v-if="item.labelFr === 'À propos'" class="mx-4 my-2 border-t border-[#E0D8CC]"></div>
            <button
              :aria-current="item.active ? 'page' : undefined"
            class="w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-[8px] transition-colors text-left"
            style="width: calc(100% - 16px);"
            :class="item.active
              ? 'bg-[#C0392B]/8 text-[#C0392B]'
              : 'text-[#7F8C8D] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]'"
          >
            <svg class="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.iconPath" />
            </svg>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium leading-tight truncate">{{ item.labelFr }}</span>
                <span v-if="item.badge" class="px-1.5 py-0.5 rounded-[3px] bg-[#C0392B] text-white text-[7px] font-semibold shrink-0">
                  {{ item.badge }}
                </span>
              </div>
              <span class="text-xs leading-tight opacity-50 truncate block mt-0.5">{{ item.labelZh }}</span>
            </div>
          </button>
          </template>
        </nav>
      </aside>

      <!-- ── Main Content（随页面整体滚动）────────────────────────────── -->
      <main class="flex-1 min-w-0 bg-white">
        <div class="px-8 py-8 space-y-10">

          <!-- ── Artist Header ────────────────────────────────────────── -->
          <section class="flex items-center gap-8 py-8" aria-label="艺术家基本信息">
            <div class="w-[115px] h-[115px] rounded-full overflow-hidden shrink-0 bg-[#E0E0E0]">
              <img
                v-if="profile?.avatarUrl"
                :src="profile.avatarUrl"
                :alt="displayName + ' 肖像'"
                class="w-full h-full object-cover grayscale"
                width="115"
                height="115"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-2xl font-bold text-[#7F8C8D]">
                {{ displayName.charAt(0) }}
              </div>
            </div>
            <div class="space-y-2 flex-1">
              <h1 class="text-[37px] font-bold text-[#1A1A1A] leading-[1.15] tracking-[-0.02em]">{{ displayName }}</h1>
              <div class="flex items-center gap-2">
                <p class="text-[15px] text-[#7F8C8D] leading-relaxed">{{ title }}</p>
                <template v-if="nationality">
                  <span class="text-[#E0E0E0]">·</span>
                  <p class="text-[15px] text-[#7F8C8D] leading-relaxed">{{ nationality }}</p>
                </template>
              </div>
              <p v-if="city" class="text-[15px] text-[#7F8C8D] leading-relaxed">{{ city }}</p>
            </div>
            <!-- 编辑按钮 -->
            <button
              class="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-[8px] border border-[#E0E0E0] text-sm text-[#7F8C8D] hover:border-[#C0392B] hover:text-[#C0392B] transition-colors"
              @click="handleEditProfile"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
              </svg>
              <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Modifier le profil</span>
                <span class="text-xs opacity-60">编辑档案</span>
              </span>
            </button>
          </section>

          <!-- ── Two-Column Body ──────────────────────────────────────── -->
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch pt-2">

            <!-- Left Column (2/5) -->
            <div class="lg:col-span-2 space-y-8 pr-8">

              <!-- 个人信息 -->
              <section aria-labelledby="section-personal">
                <div class="mb-4 flex items-baseline gap-2 whitespace-nowrap">
                  <h2 id="section-personal" class="text-sm font-semibold text-[#1A1A1A]">Informations personnelles</h2>
                  <span class="text-xs text-[#7F8C8D]">个人信息</span>
                </div>
                <dl>
                  <div
                    v-for="item in personalInfo"
                    :key="item.key"
                    class="grid grid-cols-[28px_1fr] gap-x-3 gap-y-1 py-2.5 border-b border-[#F5F5F5] last:border-b-0"
                  >
                    <div class="col-start-1 row-start-1 w-7 h-7 rounded-[6px] border border-[#E0E0E0] bg-white flex items-center justify-center shrink-0">
                      <svg class="w-3.5 h-3.5 text-[#7F8C8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.iconPath" />
                      </svg>
                    </div>
                    <dt class="col-start-2 row-start-1 flex items-baseline gap-2 whitespace-nowrap text-left">
                      <span class="text-xs text-[#1A1A1A]">{{ item.labelFr }}</span>
                      <span class="text-xs text-[#7F8C8D]">{{ item.labelZh }}</span>
                    </dt>
                    <dd class="col-start-2 row-start-2 text-sm font-semibold text-[#1A1A1A] text-left break-words">{{ item.value }}</dd>
                  </div>
                </dl>
              </section>

              <!-- 联系方式 -->
              <section aria-labelledby="section-contact" class="border-t border-[#E0E0E0] pt-8">
                <div class="mb-4 flex items-baseline gap-2 whitespace-nowrap">
                  <h2 id="section-contact" class="text-sm font-semibold text-[#1A1A1A]">Contact</h2>
                  <span class="text-xs text-[#7F8C8D]">联系方式</span>
                </div>
                <ul class="space-y-3.5" role="list">
                  <li
                    v-for="c in contacts"
                    :key="c.key"
                    class="grid grid-cols-[28px_1fr] gap-x-3 gap-y-1"
                  >
                    <div class="col-start-1 row-start-1 w-7 h-7 rounded-[6px] border border-[#E0E0E0] bg-white flex items-center justify-center shrink-0 overflow-hidden">
                      <template v-if="c.key === 'xiaohongshu'">
                        <span class="text-[#FF2442] text-[10px] font-black leading-none">小</span>
                      </template>
                      <template v-else-if="c.key === 'wechat'">
                        <span class="text-[#07C160] text-[10px] font-black leading-none">微</span>
                      </template>
                      <template v-else>
                        <svg class="w-3.5 h-3.5 text-[#7F8C8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="c.iconPath" />
                        </svg>
                      </template>
                    </div>
                    <p class="col-start-2 row-start-1 flex items-baseline gap-2 leading-none whitespace-nowrap text-left">
                      <span class="text-xs text-[#1A1A1A]">{{ c.labelFr }}</span>
                      <span class="text-xs text-[#7F8C8D]">{{ c.labelZh }}</span>
                    </p>
                    <p class="col-start-2 row-start-2 text-sm font-semibold text-[#1A1A1A] text-left break-words">{{ c.value }}</p>
                  </li>
                </ul>
              </section>

              <!-- 代理画廊 -->
              <section aria-labelledby="section-gallery" class="border-t border-[#E0E0E0] pt-8">
                <div class="mb-4 flex items-baseline gap-2 whitespace-nowrap">
                  <h2 id="section-gallery" class="text-sm font-semibold text-[#1A1A1A]">Galeries</h2>
                  <span class="text-xs text-[#7F8C8D]">代理画廊</span>
                </div>
                <ul class="space-y-4" role="list">
                  <li
                    v-for="g in galleries"
                    :key="g.name"
                    class="grid grid-cols-[28px_1fr] gap-x-3 gap-y-1"
                  >
                    <div class="col-start-1 row-start-1 w-7 h-7 rounded-[6px] border border-[#E0E0E0] bg-white overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        v-if="g.logo"
                        :src="g.logo"
                        :alt="`${g.name} logo`"
                        class="w-full h-full object-cover"
                      />
                      <span v-else class="text-[9px] font-semibold text-[#7F8C8D] leading-none">{{ getGalleryInitials(g.name) }}</span>
                    </div>
                    <p class="col-start-2 row-start-1 text-sm font-semibold text-[#1A1A1A]">{{ g.name }}</p>
                    <p class="col-start-2 row-start-2 text-xs font-semibold text-[#7F8C8D]">{{ g.location }}</p>
                  </li>
                </ul>
              </section>

            </div>

            <!-- Right Column (3/5) — Quote -->
            <div class="lg:col-span-3 flex h-full">
              <section
                class="flex flex-col flex-1 w-full rounded-[12px] bg-[#F7F3EE] px-8 py-7 border border-[#EAE0D5]"
                aria-label="问答引用"
              >
                <template v-if="quoteEntries.length">
                  <div class="space-y-7">
                    <div
                      v-for="entry in quoteEntries"
                      :key="entry.questionId"
                      class="flex flex-col"
                    >
                      <!-- 问题标题 -->
                      <div class="mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <h2
                          :id="`section-quote-${entry.questionId}`"
                          class="text-[22px] font-bold text-[#1A1A1A] leading-[1.3]"
                        >
                          {{ entry.questionFr }}
                        </h2>
                        <span class="text-sm text-[#7F8C8D]">{{ entry.questionZh }}</span>
                      </div>
                      <div class="border-t border-[#E0D8CC] mb-5"></div>
                      <!-- 引号 + 回答 -->
                      <div class="text-[#D4A373] text-7xl font-serif leading-none mb-2 select-none" aria-hidden="true">&ldquo;</div>
                      <div class="space-y-[1.1em]">
                        <p
                          v-for="(line, li) in entry.answer.split('\n').filter(l => l.trim())"
                          :key="li"
                          class="text-[15px] text-[#4A3728] leading-[2] indent-[2em]"
                        >{{ line }}</p>
                      </div>
                      <div class="text-[#D4A373] text-7xl font-serif leading-none text-right select-none mt-2" aria-hidden="true">&rdquo;</div>
                    </div>
                  </div>
                </template>

                <!-- 空状态占位 -->
                <template v-else>
                  <div class="mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h2 class="text-[22px] font-bold text-[#1A1A1A] leading-[1.3]">
                      {{ questions[0]?.contentFr ?? 'Pourquoi la Chine est-elle importante pour vous ?' }}
                    </h2>
                    <span class="text-sm text-[#7F8C8D]">{{ questions[0]?.contentZh ?? '为什么中国对您如此重要？' }}</span>
                  </div>
                  <div class="border-t border-[#E0D8CC] mb-5"></div>
                  <div class="text-[#D4A373] text-7xl font-serif leading-none mb-2 select-none" aria-hidden="true">&ldquo;</div>
                  <div class="flex-1 flex items-center">
                    <p class="text-[15px] text-[#C8B89A] leading-[2] italic" aria-live="polite">
                      Votre réponse apparaîtra ici après avoir rempli votre profil.
                    </p>
                  </div>
                  <div class="text-[#D4A373] text-7xl font-serif leading-none text-right select-none mt-2" aria-hidden="true">&rdquo;</div>
                </template>
              </section>
            </div>

          </div>

          <!-- ── Documents Section ─────────────────────────────────────── -->
          <section class="pt-8 border-t border-[#E0E0E0]" aria-labelledby="section-docs">
            <div class="mb-4 flex items-baseline gap-2 whitespace-nowrap">
              <h2 id="section-docs" class="text-sm font-semibold text-[#1A1A1A]">Documents déposés</h2>
              <span class="text-xs text-[#7F8C8D]">已上传资料</span>
            </div>
            <div class="rounded-[12px] border border-[#E0E0E0] overflow-hidden">
              <template v-for="meta in DOC_META" :key="meta.key">
                <!-- 分类行 -->
                <div class="grid grid-cols-[240px_minmax(0,1fr)_auto] gap-x-8 items-center px-5 py-3.5 border-b border-[#F5F5F5] last:border-b-0">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0" :class="meta.iconBg">
                      <svg class="w-4 h-4" :class="meta.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="meta.iconPath" />
                      </svg>
                    </div>
                    <div class="flex items-baseline gap-2 whitespace-nowrap text-left min-w-0">
                      <p class="text-sm text-[#1A1A1A] font-medium">{{ meta.nameFr }}</p>
                      <p class="text-xs text-[#7F8C8D]">{{ meta.nameZh }}</p>
                    </div>
                  </div>
                  <p class="text-xs font-normal text-[#7F8C8D] text-left">{{ docCountLabel(meta.key) }}</p>
                  <div class="flex gap-2 shrink-0">
                    <button
                      v-if="docFiles[meta.key].length"
                      type="button"
                      :aria-label="`Voir ${meta.nameFr}`"
                      :aria-expanded="expandedDoc === meta.key"
                      class="text-sm transition-colors"
                      :class="expandedDoc === meta.key ? 'text-[#C0392B]' : 'text-[#7F8C8D] hover:text-[#1A1A1A]'"
                      @click="toggleDocExpand(meta.key)"
                    >
                      <span class="inline-flex items-baseline gap-1 whitespace-nowrap">
                        <span>{{ expandedDoc === meta.key ? 'Masquer' : 'Voir' }}</span>
                        <span class="text-xs opacity-70">{{ expandedDoc === meta.key ? '收起' : '查看' }}</span>
                      </span>
                    </button>
                  </div>
                </div>

                <!-- 展开的文件明细 -->
                <ul
                  v-if="expandedDoc === meta.key"
                  class="divide-y divide-[#F9F9F9] bg-[#FAFAFA] border-b border-[#F0F0F0]"
                  role="list"
                >
                  <li
                    v-for="file in docFiles[meta.key]"
                    :key="file.id"
                    class="flex items-center gap-3 px-8 py-2.5 cursor-pointer hover:bg-[#F5F5F5] transition-colors"
                    role="button"
                    tabindex="0"
                    :aria-label="`预览 ${file.fileName}`"
                    @click="openDocPreview(file)"
                    @keydown.enter="openDocPreview(file)"
                  >
                    <div
                      class="w-7 h-7 rounded-[5px] flex items-center justify-center shrink-0"
                      :class="file.mimeType === 'application/pdf' ? 'bg-[#F5F5F5]' : 'bg-[#F5F0E8]'"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        :class="file.mimeType === 'application/pdf' ? 'text-[#7F8C8D]' : 'text-[#D4A373]'"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          :d="file.mimeType === 'application/pdf'
                            ? 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
                            : 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z'"
                        />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-[#1A1A1A] truncate">{{ file.fileName }}</p>
                    </div>
                    <button
                      type="button"
                      class="text-xs text-[#7F8C8D] hover:text-[#C0392B] transition-colors shrink-0 px-2 py-1"
                      :aria-label="`删除 ${file.fileName}`"
                      @click.stop="requestDeleteDoc(file)"
                    >
                      <span class="inline-flex items-baseline gap-1 whitespace-nowrap">
                        <span>Supprimer</span>
                        <span class="opacity-70">删除</span>
                      </span>
                    </button>
                  </li>
                </ul>
              </template>
            </div>
          </section>

          <!-- ── 删除确认 Dialog ──────────────────────────────────────────── -->
          <Teleport to="body">
            <div
              v-if="confirmDeleteDoc"
              ref="confirmDialogRef"
              tabindex="-1"
              class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 outline-none"
              role="dialog"
              aria-modal="true"
              aria-label="确认删除"
              @keydown.esc="cancelDeleteDoc"
              @click.self="cancelDeleteDoc"
            >
              <div class="bg-white rounded-[12px] shadow-xl px-8 py-7 max-w-[380px] w-full mx-4">
                <p class="text-sm font-semibold text-[#1A1A1A] mb-1">确认删除？</p>
                <p class="text-sm text-[#7F8C8D] mb-6 break-all">{{ confirmDeleteDoc.fileName }}</p>
                <div class="flex gap-3 justify-end">
                  <button
                    type="button"
                    class="px-5 py-2 rounded-[8px] text-sm text-[#7F8C8D] border border-[#E0E0E0] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                    @click="cancelDeleteDoc"
                  >
                    <span class="inline-flex items-baseline gap-1 whitespace-nowrap">
                      <span>Annuler</span>
                      <span class="text-xs opacity-60">取消</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    class="px-5 py-2 rounded-[8px] text-sm font-medium bg-[#C0392B] text-white hover:bg-[#a93226] transition-colors"
                    @click="confirmDeleteDocFile"
                  >
                    <span class="inline-flex items-baseline gap-1 whitespace-nowrap">
                      <span>Supprimer</span>
                      <span class="text-xs opacity-70">删除</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Teleport>

          <!-- ── 预览 Dialog ──────────────────────────────────────────────── -->
          <Teleport to="body">
            <div
              v-if="previewDoc"
              ref="previewDialogRef"
              tabindex="-1"
              class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 outline-none"
              role="dialog"
              aria-modal="true"
              :aria-label="`预览 ${previewDoc.fileName}`"
              @click.self="closeDocPreview"
              @keydown.esc="closeDocPreview"
            >
              <div class="relative max-w-[90vw] max-h-[90vh] bg-white rounded-[12px] overflow-hidden shadow-2xl flex flex-col">
                <div class="flex items-center justify-between px-4 py-3 border-b border-[#E0E0E0] shrink-0">
                  <p class="text-sm text-[#1A1A1A] font-medium truncate max-w-[60vw]">{{ previewDoc.fileName }}</p>
                  <button
                    type="button"
                    class="ml-4 w-7 h-7 rounded-[6px] flex items-center justify-center text-[#7F8C8D] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors shrink-0"
                    aria-label="关闭预览"
                    @click="closeDocPreview"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div class="flex-1 overflow-auto flex items-center justify-center p-4">
                  <img
                    v-if="previewDoc.mimeType !== 'application/pdf'"
                    :src="previewDoc.url"
                    :alt="previewDoc.fileName"
                    class="max-w-full max-h-[75vh] object-contain rounded-[4px]"
                    loading="eager"
                  />
                  <div v-else class="flex flex-col items-center gap-3 py-8 px-12 text-center">
                    <svg class="w-12 h-12 text-[#7F8C8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                    </svg>
                    <p class="text-sm text-[#1A1A1A] font-medium">{{ previewDoc.fileName }}</p>
                    <a
                      :href="previewDoc.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm text-[#C0392B] hover:underline underline-offset-2"
                    >在新标签页打开 PDF</a>
                  </div>
                </div>
              </div>
            </div>
          </Teleport>

        </div>
      </main>

    </div>
    <footer class="py-4 text-center text-[11px] text-[#BEBEBE]">
      Copyright &copy; 2026 巴黎臻藏 · ZHEN Collection Paris. 版权所有。
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getProfile } from '@/api/profile'
import { listQuestions } from '@/api/questions'
import { listDocuments, deleteDocument } from '@/api/documents'
import type { ProfileData } from '@/api/profile'
import type { QuestionItem } from '@/api/questions'
import type { DocumentItem } from '@/api/documents'

const router = useRouter()
const authStore = useAuthStore()

const profile = ref<ProfileData | null>(null)
const loading = ref(true)
const questions = ref<QuestionItem[]>([])

// 文件数据：category key → 文件列表
type DocCategoryKey = 'portrait' | 'studio' | 'cv' | 'portfolio' | 'media'
const docFiles = ref<Record<DocCategoryKey, DocumentItem[]>>({
  portrait: [], studio: [], cv: [], portfolio: [], media: [],
})
// 展开状态
const expandedDoc = ref<DocCategoryKey | null>(null)
// 预览
const previewDoc = ref<DocumentItem | null>(null)
// 删除确认
const confirmDeleteDoc = ref<DocumentItem | null>(null)
const confirmDialogRef = ref<HTMLElement | null>(null)

const previewDialogRef = ref<HTMLElement | null>(null)

function toggleDocExpand(key: DocCategoryKey) {
  expandedDoc.value = expandedDoc.value === key ? null : key
}

async function openDocPreview(doc: DocumentItem) {
  previewDoc.value = doc
  await nextTick()
  previewDialogRef.value?.focus()
}

function closeDocPreview() {
  previewDoc.value = null
}

async function requestDeleteDoc(doc: DocumentItem) {
  confirmDeleteDoc.value = doc
  await nextTick()
  confirmDialogRef.value?.focus()
}

function cancelDeleteDoc() {
  confirmDeleteDoc.value = null
}

async function confirmDeleteDocFile() {
  const doc = confirmDeleteDoc.value
  if (!doc || !authStore.token) return
  confirmDeleteDoc.value = null
  try {
    const res = await deleteDocument(authStore.token, doc.id)
    if (res.code === 0) {
      const key = doc.category as DocCategoryKey
      if (docFiles.value[key]) {
        docFiles.value[key] = docFiles.value[key].filter((f) => f.id !== doc.id)
      }
    }
  } catch {
    // 网络异常静默忽略
  }
}

onMounted(async () => {
  const questionsRes = await listQuestions()
  if (questionsRes.code === 0 && questionsRes.data) {
    questions.value = questionsRes.data
  }

  if (!authStore.token) return
  try {
    const res = await getProfile(authStore.token)
    if (res.code === 0 && res.data) {
      profile.value = res.data
      // 加载文件列表
      if (res.data.id) {
        const docRes = await listDocuments(authStore.token, res.data.id)
        if (docRes.code === 0 && docRes.data) {
          for (const doc of docRes.data) {
            const key = doc.category as DocCategoryKey
            if (docFiles.value[key]) docFiles.value[key].push(doc)
          }
        }
      }
    }
  } finally {
    loading.value = false
  }
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function handleEditProfile() {
  router.push('/profile/edit')
}

function getGalleryInitials(name: string): string {
  const words = name.split(/\s+/).filter((w) => /[A-Za-zÀ-ÿ]/.test(w[0] ?? ''))
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'G'
}

const displayName = computed(() => {
  const firstName = profile.value?.personal?.firstName?.trim() || ''
  const lastName = profile.value?.personal?.lastName?.trim() || ''
  if (firstName || lastName) return [firstName, lastName].filter(Boolean).join(' ')
  return profile.value?.displayName || authStore.user?.name || 'Artiste'
})
const title = computed(() => profile.value?.title || 'Artiste')
const nationality = computed(() => profile.value?.nationality || '')
const city = computed(() => profile.value?.city || '')

// ── Sidebar Nav ──────────────────────────────────────────────────────────
interface NavItem {
  labelZh: string
  labelFr: string
  iconPath: string
  active: boolean
  badge?: string
}

const navItems: NavItem[] = [
  {
    labelZh: '我的档案',
    labelFr: 'Mon profil',
    iconPath: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    active: true,
  },
  {
    labelZh: '对话',
    labelFr: 'Dialogues',
    iconPath: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
    active: false,
  },
  {
    labelZh: '展览',
    labelFr: 'Expositions',
    iconPath: 'M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z',
    active: false,
  },
  {
    labelZh: '臻藏推荐',
    labelFr: 'Recommandations',
    iconPath: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
    active: false,
    badge: '臻',
  },
  {
    labelZh: '搜索',
    labelFr: 'Recherche',
    iconPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    active: false,
  },
  {
    labelZh: '关于我们',
    labelFr: 'À propos',
    iconPath: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
    active: false,
  },
  {
    labelZh: '联系我们',
    labelFr: 'Contact',
    iconPath: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    active: false,
  },
]

// ── Personal Info ────────────────────────────────────────────────────────
const personalInfo = computed(() => [
  {
    key: 'birthYear',
    labelFr: 'Date de naissance',
    labelZh: '出生年月',
    value: profile.value?.personal?.birthYear || '—',
    iconPath: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  },
  {
    key: 'birthPlace',
    labelFr: 'Lieu de naissance',
    labelZh: '出生地',
    value: profile.value?.personal?.birthPlace || '—',
    iconPath: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  },
  {
    key: 'residence',
    labelFr: 'Résidence actuelle',
    labelZh: '现居地',
    value: profile.value?.personal?.residence || '—',
    iconPath: 'm2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  },
  {
    key: 'studyAbroad',
    labelFr: 'Expérience à l\'étranger',
    labelZh: '留学经历',
    value: profile.value?.personal?.studyAbroad || '—',
    iconPath: 'M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5',
  },
  {
    key: 'education',
    labelFr: 'Formation',
    labelZh: '学历',
    value: profile.value?.personal?.education || '—',
    iconPath: 'M4.26 10.147a60.438 60.438 0 0014.72 0M6.375 17.625a48.012 48.012 0 0112.747 0M4.26 8.583a51.47 51.47 0 0115.479 0M19.5 8.583v7.2a1.8 1.8 0 01-1.35 1.743l-3.6.9a4.499 4.499 0 01-8.1 0l-3.6-.9A1.8 1.8 0 014.5 15.783V8.583',
  },
])

// ── Contacts ─────────────────────────────────────────────────────────────
interface ContactItem {
  key: string
  labelFr: string
  labelZh: string
  value: string
  iconPath: string
}

const contacts = computed<ContactItem[]>(() => [
  {
    key: 'website',
    labelFr: 'Site web',
    labelZh: '网站',
    value: profile.value?.contact?.website || '—',
    iconPath: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
  },
  {
    key: 'instagram',
    labelFr: 'Instagram',
    labelZh: 'Instagram',
    value: profile.value?.contact?.instagram || '—',
    iconPath: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z',
  },
  {
    key: 'xiaohongshu',
    labelFr: 'Xiaohongshu',
    labelZh: '小红书',
    value: profile.value?.contact?.xiaohongshu || '—',
    iconPath: '',
  },
  {
    key: 'wechat',
    labelFr: 'WeChat',
    labelZh: '微信',
    value: profile.value?.contact?.wechat || '—',
    iconPath: '',
  },
  {
    key: 'email',
    labelFr: 'E-mail',
    labelZh: '邮箱',
    value: profile.value?.contact?.email || '—',
    iconPath: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  },
  {
    key: 'phone',
    labelFr: 'Téléphone',
    labelZh: '电话',
    value: profile.value?.contact?.phone || '—',
    iconPath: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
  },
])

// ── Galleries ─────────────────────────────────────────────────────────────
const galleries = computed(() =>
  (profile.value?.galleries || []).map((g) => ({
    name: g.name || '',
    location: g.location || '',
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(getGalleryInitials(g.name || 'G'))}&background=F7F3EE&color=1A1A1A&size=56&bold=true`,
  })),
)

// ── Quote Paragraphs ──────────────────────────────────────────────────────
interface QuoteEntry { questionId: number; answer: string; questionFr: string; questionZh: string }

const quoteEntries = computed<QuoteEntry[]>(() => {
  const raw = profile.value?.quoteParagraphs
  if (!Array.isArray(raw) || raw.length === 0) return []
  const qMap = new Map(questions.value.map((q) => [q.id, q]))
  return (raw as Array<{ questionId: number; answer: string }>)
    .filter((q) => q.questionId > 0 && q.answer?.trim())
    .map((q) => {
      const found = qMap.get(q.questionId)
      if (!found) return null
      return { questionId: q.questionId, answer: q.answer, questionFr: found.contentFr, questionZh: found.contentZh }
    })
    .filter((e): e is QuoteEntry => e !== null)
})

// ── Documents ─────────────────────────────────────────────────────────────
interface DocMeta {
  key: DocCategoryKey
  nameFr: string
  nameZh: string
  iconPath: string
  iconBg: string
  iconColor: string
}

const DOC_META: DocMeta[] = [
  {
    key: 'portrait', nameFr: 'Photos portrait', nameZh: '肖像照片',
    iconPath: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z',
    iconBg: 'bg-[#F5F0E8]', iconColor: 'text-[#D4A373]',
  },
  {
    key: 'studio', nameFr: 'Photos atelier', nameZh: '工作室照片',
    iconPath: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
    iconBg: 'bg-[#F5F0E8]', iconColor: 'text-[#D4A373]',
  },
  {
    key: 'cv', nameFr: 'CV', nameZh: '个人简历',
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    iconBg: 'bg-[#F5F5F5]', iconColor: 'text-[#7F8C8D]',
  },
  {
    key: 'portfolio', nameFr: 'Portfolio', nameZh: '作品集',
    iconPath: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
    iconBg: 'bg-[#F5F5F5]', iconColor: 'text-[#7F8C8D]',
  },
  {
    key: 'media', nameFr: 'Couverture média', nameZh: '媒体报道',
    iconPath: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z',
    iconBg: 'bg-[#F5F5F5]', iconColor: 'text-[#7F8C8D]',
  },
]

function docCountLabel(key: DocCategoryKey): string {
  const files = docFiles.value[key]
  const n = files.length
  if (n === 0) return '0 个文件'
  const hasPdf = files.some((f) => f.mimeType === 'application/pdf')
  return hasPdf && files.every((f) => f.mimeType === 'application/pdf')
    ? `${n} 个文件（PDF）`
    : `${n} 个文件`
}
</script>
