<template>
  <div class="min-h-screen bg-[#F0F0F0]" style="font-family: 'Inter', 'Helvetica Neue', -apple-system, sans-serif;">

    <!-- ── Fixed Top Bar ───────────────────────────────────────────────── -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E0E0E0] h-[84px]">
      <div class="max-w-[1200px] mx-auto h-full flex items-center justify-between px-8">
        <div class="flex items-baseline gap-4">
          <span class="text-[#1A1A1A] font-black text-[32px] tracking-[0.06em] leading-none">ZHEN</span>
          <span class="text-[#7F8C8D] text-[11px] tracking-widest uppercase whitespace-nowrap">Collection Paris</span>
          <span class="text-[#1A1A1A] text-sm font-medium tracking-widest">巴黎 臻 藏</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-sm text-[#7F8C8D] border border-[#E0E0E0] hover:border-[#C0392B] hover:text-[#C0392B] transition-colors"
            @click="handleCancel"
          >
            <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
              <span>Annuler</span>
              <span class="text-xs opacity-60">取消</span>
            </span>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-5 py-2 rounded-[8px] text-sm font-medium bg-[#C0392B] text-white hover:bg-[#a93226] transition-colors"
            :disabled="saving"
            @click="handleSave"
          >
            <svg v-if="saving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <span v-if="saving" class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
              <span>Enregistrement…</span>
              <span class="text-xs text-white/70">保存中…</span>
            </span>
            <span v-else class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
              <span>Enregistrer</span>
              <span class="text-xs text-white/70">保存</span>
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- ── Page Body ───────────────────────────────────────────────────── -->
    <div class="max-w-[1200px] mx-auto pt-[84px] bg-white border-x border-[#E0E0E0] min-h-screen flex">

      <!-- ── Left Sidebar ────────────────────────────────────────────── -->
      <aside class="w-[200px] shrink-0 bg-[#F7F3EE] hidden md:block" aria-label="侧边导航">
        <nav class="py-3 flex flex-col gap-1" aria-label="主导航">
          <template v-for="item in navItems" :key="item.labelZh">
            <div v-if="item.labelFr === 'À propos'" class="mx-4 my-2 border-t border-[#E0D8CC]"></div>
            <button
              :aria-current="item.active ? 'page' : undefined"
              class="w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-[8px] transition-colors text-left"
              style="width: calc(100% - 16px);"
              :class="item.active
                ? 'bg-[#C0392B]/8 text-[#C0392B]'
                : 'text-[#7F8C8D] hover:text-[#1A1A1A] hover:bg-white/60'"
            >
              <svg class="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.iconPath" />
              </svg>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium leading-tight truncate">{{ item.labelFr }}</span>
                </div>
                <span class="text-xs leading-tight opacity-50 truncate block mt-0.5">{{ item.labelZh }}</span>
              </div>
            </button>
          </template>
        </nav>
      </aside>

      <!-- ── Main Content ────────────────────────────────────────────── -->
      <main class="flex-1 min-w-0 bg-white">
        <div class="px-8 py-8 space-y-10">

          <!-- ── Page Title ──────────────────────────────────────────── -->
          <div class="pb-6 border-b border-[#E0E0E0] flex items-baseline gap-2 whitespace-nowrap">
            <h1 class="text-2xl font-bold text-[#1A1A1A] tracking-[-0.01em]">Modifier le profil</h1>
            <span class="text-sm text-[#7F8C8D]">编辑档案</span>
          </div>

          <!-- ── 头像 ────────────────────────────────────────────────── -->
          <section aria-labelledby="edit-avatar">
            <div class="mb-5 flex items-baseline gap-2 whitespace-nowrap">
              <h2 id="edit-avatar" class="text-sm font-semibold text-[#1A1A1A]">Photo de profil</h2>
              <span class="text-xs text-[#7F8C8D]">头像</span>
            </div>
            <div class="flex items-center gap-6">
              <div class="w-[80px] h-[80px] rounded-full overflow-hidden bg-[#E0E0E0] shrink-0">
                <img
                  v-if="form.avatarUrl"
                  :src="form.avatarUrl"
                  alt="头像预览"
                  class="w-full h-full object-cover grayscale"
                  width="80"
                  height="80"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-xl font-bold text-[#7F8C8D]">
                  {{ (form.personal.firstName || form.displayName || '?').charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <input
                  ref="avatarInputRef"
                  type="file"
                  class="sr-only"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  @change="handleAvatarSelect"
                />
                <button
                  type="button"
                  class="px-4 py-2 rounded-[8px] border border-[#E0E0E0] text-sm text-[#7F8C8D] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
                  :disabled="avatarUploading"
                  @click="avatarInputRef?.click()"
                >
                  <span v-if="avatarUploading" class="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    <span>上传中…</span>
                  </span>
                  <span v-else class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                    <span>Changer la photo</span>
                    <span class="text-xs opacity-60">更换头像</span>
                  </span>
                </button>
                <p v-if="avatarError" class="text-xs text-[#C0392B]">{{ avatarError }}</p>
                <p class="text-xs text-[#7F8C8D]">JPG、PNG、WebP，最大 5MB</p>
              </div>
            </div>
          </section>

          <!-- ── 个人信息 ────────────────────────────────────────────── -->
          <section aria-labelledby="edit-personal" class="border-t border-[#E0E0E0] pt-8">
            <div class="mb-5 flex items-baseline gap-2 whitespace-nowrap">
              <h2 id="edit-personal" class="text-sm font-semibold text-[#1A1A1A]">Informations personnelles</h2>
              <span class="text-xs text-[#7F8C8D]">个人信息</span>
            </div>
            <div class="space-y-4">
              <div
                v-for="field in personalFields"
                :key="field.key"
                class="grid grid-cols-[24px_1fr] gap-x-2 gap-y-1.5"
              >
                <div class="col-start-1 row-start-1 w-6 h-6 rounded-[5px] border border-[#E0E0E0] bg-[#FAFAFA] flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-[#7F8C8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="field.iconPath" />
                  </svg>
                </div>
                <label :for="`field-${field.key}`" class="col-start-2 row-start-1 flex items-baseline gap-2 whitespace-nowrap text-left">
                  <span class="text-xs text-[#1A1A1A]">{{ field.labelFr }}</span>
                  <span class="text-xs text-[#7F8C8D]">{{ field.labelZh }}</span>
                </label>
                <input
                  :id="`field-${field.key}`"
                  v-model="form.personal[field.key]"
                  type="text"
                  :placeholder="field.placeholder"
                  class="col-start-2 row-start-2 w-full px-3 py-2.5 rounded-[8px] border border-[#E0E0E0] text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none focus:border-[#C0392B] transition-colors text-left"
                />
              </div>
            </div>
          </section>

          <!-- ── 联系方式 ────────────────────────────────────────────── -->
          <section aria-labelledby="edit-contact" class="border-t border-[#E0E0E0] pt-8">
            <div class="mb-5 flex items-baseline gap-2 whitespace-nowrap">
              <h2 id="edit-contact" class="text-sm font-semibold text-[#1A1A1A]">Contact</h2>
              <span class="text-xs text-[#7F8C8D]">联系方式</span>
            </div>
            <div class="space-y-4">
              <div
                v-for="field in contactFields"
                :key="field.key"
                class="grid grid-cols-[24px_1fr] gap-x-2 gap-y-1.5"
              >
                <div class="col-start-1 row-start-1 w-6 h-6 rounded-[5px] border border-[#E0E0E0] bg-[#FAFAFA] flex items-center justify-center shrink-0">
                  <template v-if="field.key === 'xiaohongshu'">
                    <span class="text-[#FF2442] text-[9px] font-black leading-none">小</span>
                  </template>
                  <template v-else-if="field.key === 'wechat'">
                    <span class="text-[#07C160] text-[9px] font-black leading-none">微</span>
                  </template>
                  <template v-else>
                    <svg class="w-3 h-3 text-[#7F8C8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="field.iconPath" />
                    </svg>
                  </template>
                </div>
                <label :for="`contact-${field.key}`" class="col-start-2 row-start-1 flex items-baseline gap-2 whitespace-nowrap text-left min-w-0">
                  <span class="text-xs text-[#1A1A1A]">{{ field.labelFr }}</span>
                  <span class="text-xs text-[#7F8C8D]">{{ field.labelZh }}</span>
                </label>
                <input
                  :id="`contact-${field.key}`"
                  v-model="form.contact[field.key]"
                  type="text"
                  :placeholder="field.placeholder"
                  class="col-start-2 row-start-2 w-full px-3 py-2.5 rounded-[8px] border border-[#E0E0E0] text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none focus:border-[#C0392B] transition-colors text-left"
                />
              </div>
            </div>
          </section>

          <!-- ── 代理画廊 ────────────────────────────────────────────── -->
          <section aria-labelledby="edit-gallery" class="border-t border-[#E0E0E0] pt-8">
            <div class="mb-5 flex items-baseline gap-2 whitespace-nowrap">
              <h2 id="edit-gallery" class="text-sm font-semibold text-[#1A1A1A]">Galeries</h2>
              <span class="text-xs text-[#7F8C8D]">代理画廊</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="(gallery, idx) in form.galleries"
                :key="idx"
                class="flex items-center gap-3"
              >
                <div class="w-7 h-7 rounded-[6px] border border-[#E0E0E0] bg-white overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    v-if="gallery.logo"
                    :src="gallery.logo"
                    :alt="`${gallery.name || '画廊'} logo`"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-[9px] font-semibold text-[#7F8C8D] leading-none">{{ getGalleryInitials(gallery.name) }}</span>
                </div>
                <input
                  v-model="gallery.name"
                  type="text"
                  placeholder="画廊名称"
                  class="flex-1 px-3 py-2.5 rounded-[8px] border border-[#E0E0E0] text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none focus:border-[#C0392B] transition-colors"
                />
                <input
                  v-model="gallery.location"
                  type="text"
                  placeholder="城市，国家"
                  class="w-[180px] px-3 py-2.5 rounded-[8px] border border-[#E0E0E0] text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none focus:border-[#C0392B] transition-colors"
                />
                <button
                  type="button"
                  class="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#7F8C8D] hover:text-[#C0392B] hover:bg-[#C0392B]/8 transition-colors shrink-0"
                  :aria-label="`Supprimer la galerie ${gallery.name}`"
                  @click="removeGallery(idx)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] border border-dashed border-[#E0E0E0] text-sm text-[#7F8C8D] hover:border-[#C0392B] hover:text-[#C0392B] transition-colors"
                @click="addGallery"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
                <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                  <span>Ajouter une galerie</span>
                  <span class="text-xs opacity-60">添加画廊</span>
                </span>
              </button>
            </div>
          </section>

          <!-- ── 回答问题 ────────────────────────────────────────────── -->
          <section aria-labelledby="edit-quotes" class="border-t border-[#E0E0E0] pt-8">
            <div class="mb-5 flex items-baseline gap-2 whitespace-nowrap">
              <h2 id="edit-quotes" class="text-sm font-semibold text-[#1A1A1A]">Répondre aux questions</h2>
              <span class="text-xs text-[#7F8C8D]">回答问题</span>
            </div>

            <div
              v-if="form.quoteParagraphs.length"
              class="rounded-[10px] border border-[#E0E0E0] p-4 space-y-3 bg-[#FAFAFA]"
            >
              <select
                v-model="form.quoteParagraphs[0].questionId"
                class="w-full px-3 py-2.5 rounded-[8px] border border-[#E0E0E0] text-sm text-[#1A1A1A] bg-white focus:outline-none focus:border-[#C0392B] transition-colors"
              >
                <option :value="0" disabled>请选择问题…</option>
                <option v-for="q in questions" :key="q.id" :value="q.id">
                  {{ q.contentFr }} / {{ q.contentZh }}
                </option>
              </select>
              <textarea
                v-model="form.quoteParagraphs[0].answer"
                rows="5"
                placeholder="请填写您的回答（不限语种，可留空）…"
                class="w-full px-3 py-2.5 rounded-[8px] border border-[#E0E0E0] text-sm text-[#1A1A1A] bg-white placeholder-[#BEBEBE] focus:outline-none focus:border-[#C0392B] transition-colors resize-none"
              />
            </div>
          </section>

          <!-- ── 资料上传 ────────────────────────────────────────────── -->
          <section aria-labelledby="edit-documents" class="border-t border-[#E0E0E0] pt-8">
            <div class="mb-2 flex items-baseline gap-2 whitespace-nowrap">
              <h2 id="edit-documents" class="text-sm font-semibold text-[#1A1A1A]">Documents déposés</h2>
              <span class="text-xs text-[#7F8C8D]">资料上传</span>
            </div>
            <p class="text-xs text-[#7F8C8D] mb-5">
              支持 PNG、JPG、JPEG、PDF，单个文件不超过 10MB
            </p>

            <p
              v-if="saveSuccess"
              class="mb-4 px-3 py-2 rounded-[8px] bg-green-50 text-sm text-green-700 border border-green-200"
              role="status"
            >
              保存成功
            </p>

            <p
              v-if="uploadError"
              class="mb-4 px-3 py-2 rounded-[8px] bg-[#C0392B]/8 text-sm text-[#C0392B]"
              role="alert"
            >
              {{ uploadError }}
            </p>

            <div class="rounded-[12px] border border-[#E0E0E0] overflow-hidden divide-y divide-[#F5F5F5]">
              <div
                v-for="category in documentCategories"
                :key="category.key"
                class="px-5 py-4"
              >
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div class="flex items-baseline gap-2 whitespace-nowrap">
                    <p class="text-sm font-medium text-[#1A1A1A]">{{ category.nameFr }}</p>
                    <p class="text-xs text-[#7F8C8D]">{{ category.nameZh }}</p>
                  </div>
                  <span class="text-xs text-[#7F8C8D] shrink-0">
                    {{ form.documents[category.key].length }} 个文件
                  </span>
                </div>

                <!-- 已上传文件列表 -->
                <ul v-if="form.documents[category.key].length" class="space-y-2 mb-3" role="list">
                  <li
                    v-for="file in form.documents[category.key]"
                    :key="file.id"
                    class="flex items-center gap-3 px-3 py-2 rounded-[8px] bg-[#FAFAFA] border border-[#F0F0F0] cursor-pointer hover:border-[#C0392B]/30 transition-colors"
                    role="button"
                    tabindex="0"
                    :aria-label="`预览 ${file.name}`"
                    @click="openPreview(file)"
                    @keydown.enter="openPreview(file)"
                  >
                    <div
                      class="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0"
                      :class="file.type === 'application/pdf' ? 'bg-[#F5F5F5]' : 'bg-[#F5F0E8]'"
                    >
                      <svg
                        class="w-4 h-4"
                        :class="file.type === 'application/pdf' ? 'text-[#7F8C8D]' : 'text-[#D4A373]'"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          :d="file.type === 'application/pdf' ? docIconPath.pdf : docIconPath.image"
                        />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-[#1A1A1A] truncate">{{ file.name }}</p>
                      <p class="text-[11px] text-[#7F8C8D]">{{ formatFileSize(file.size) }}</p>
                    </div>
                    <button
                      type="button"
                      class="text-xs text-[#7F8C8D] hover:text-[#C0392B] transition-colors shrink-0"
                      :aria-label="`Supprimer ${file.name}`"
                      @click.stop="removeFile(category.key, file.id)"
                    >
                      <span class="inline-flex items-baseline gap-1 whitespace-nowrap">
                        <span>Supprimer</span>
                        <span class="opacity-70">删除</span>
                      </span>
                    </button>
                  </li>
                </ul>

                <!-- 上传区域 -->
                <input
                  :id="`upload-${category.key}`"
                  type="file"
                  class="hidden"
                  accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                  multiple
                  @change="handleFileSelect(category.key, $event)"
                />
                <label
                  :for="`upload-${category.key}`"
                  class="w-full border-2 border-dashed border-[#E0E0E0] rounded-[8px] py-3 flex items-center justify-center gap-2 text-[#7F8C8D] hover:border-[#C0392B]/40 hover:text-[#C0392B] transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                  </svg>
                  <span class="text-sm font-medium inline-flex items-baseline gap-1.5 whitespace-nowrap">
                    <span>Téléverser un fichier</span>
                    <span class="text-xs opacity-70">上传文件</span>
                  </span>
                </label>
              </div>
            </div>
          </section>

          <!-- 底部操作 -->
          <div class="border-t border-[#E0E0E0] pt-8 pb-4 flex gap-3 justify-end">
            <button
              type="button"
              class="px-6 py-2.5 rounded-[8px] text-sm text-[#7F8C8D] border border-[#E0E0E0] hover:border-[#C0392B] hover:text-[#C0392B] transition-colors"
              @click="handleCancel"
            >
              <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Annuler</span>
                <span class="text-xs opacity-60">取消</span>
              </span>
            </button>
            <button
              type="button"
              class="px-6 py-2.5 rounded-[8px] text-sm font-medium bg-[#C0392B] text-white hover:bg-[#a93226] transition-colors disabled:opacity-50"
              :disabled="saving"
              @click="handleSave"
            >
              <span v-if="saving" class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Enregistrement…</span>
                <span class="text-xs text-white/70">保存中…</span>
              </span>
              <span v-else class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span>Enregistrer</span>
                <span class="text-xs text-white/70">保存</span>
              </span>
            </button>
          </div>

        </div>
      </main>
    </div>
    <footer class="py-4 text-center text-[11px] text-[#BEBEBE]">
      Copyright &copy; 2026 巴黎臻藏 · ZHEN Collection Paris. 版权所有。
    </footer>

    <!-- ── 文件预览 Dialog ─────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        ref="dialogRef"
        v-if="previewFile"
        tabindex="-1"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 outline-none"
        role="dialog"
        aria-modal="true"
        :aria-label="`预览 ${previewFile.name}`"
        @click.self="closePreview"
        @keydown.esc="closePreview"
      >
        <div class="relative max-w-[90vw] max-h-[90vh] bg-white rounded-[12px] overflow-hidden shadow-2xl flex flex-col">
          <!-- 顶部标题栏 -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-[#E0E0E0] shrink-0">
            <p class="text-sm text-[#1A1A1A] font-medium truncate max-w-[60vw]">{{ previewFile.name }}</p>
            <button
              type="button"
              class="ml-4 w-7 h-7 rounded-[6px] flex items-center justify-center text-[#7F8C8D] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors shrink-0"
              aria-label="关闭预览"
              @click="closePreview"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <!-- 内容区 -->
          <div class="flex-1 overflow-auto flex items-center justify-center p-4">
            <img
              v-if="previewFile.type !== 'application/pdf'"
              :src="previewFile.url"
              :alt="previewFile.name"
              class="max-w-full max-h-[75vh] object-contain rounded-[4px]"
              loading="eager"
            />
            <div v-else class="flex flex-col items-center gap-3 py-8 px-12 text-center">
              <svg class="w-12 h-12 text-[#7F8C8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
              </svg>
              <p class="text-sm text-[#1A1A1A] font-medium">{{ previewFile.name }}</p>
              <a
                :href="previewFile.url"
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getProfile, updateProfile, uploadAvatar } from '@/api/profile'
import { listDocuments, uploadDocument, deleteDocument } from '@/api/documents'
import { listQuestions } from '@/api/questions'
import type { QuestionItem } from '@/api/questions'
import {
  profileNavItems, documentCategories, isAllowedFile, formatFileSize,
  getGalleryInitials, MAX_FILE_SIZE,
  type DocumentCategoryKey,
} from './shared'

const router = useRouter()
const authStore = useAuthStore()
const saving = ref(false)
const saveSuccess = ref(false)
let successTimer: ReturnType<typeof setTimeout> | null = null
const uploadError = ref('')
const profileId = ref<number | null>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const avatarUploading = ref(false)
const avatarError = ref('')
const questions = ref<QuestionItem[]>([])

// ── 文件预览 ──────────────────────────────────────────────────────────────
const previewFile = ref<{ name: string; type: string; url: string } | null>(null)
const dialogRef = ref<HTMLElement | null>(null)

async function openPreview(file: { name: string; type: string; url: string }) {
  previewFile.value = file
  await nextTick()
  dialogRef.value?.focus()
}
function closePreview() {
  previewFile.value = null
}

interface UploadedFile {
  id: string        // 已存库文件的 id；待上传时为临时 uuid
  name: string
  size: number
  type: string
  url: string       // 已存库文件的访问 url；待上传时为 blob URL（预览用）
  pending?: File    // 存在则表示尚未上传，保存时才提交
}

type DocumentFiles = Record<DocumentCategoryKey, UploadedFile[]>

const docIconPath = {
  pdf: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  image: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
}

const navItems = profileNavItems

// ── Personal Fields ───────────────────────────────────────────────────────
const personalFields = [
  { key: 'firstName',  labelFr: 'Prénom', labelZh: '名', placeholder: '如：Yannick',
    iconPath: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { key: 'lastName',   labelFr: 'Nom', labelZh: '姓', placeholder: '如：Dupont',
    iconPath: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { key: 'nationality', labelFr: 'Nationalité', labelZh: '国籍', placeholder: '如：Française',
    iconPath: 'M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5' },
  { key: 'birthYear',  labelFr: 'Date de naissance', labelZh: '出生年月', placeholder: '如：1965',
    iconPath: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  { key: 'birthPlace', labelFr: 'Lieu de naissance', labelZh: '出生地',   placeholder: '如：Nantes, France',
    iconPath: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
  { key: 'residence',  labelFr: 'Résidence actuelle', labelZh: '现居地',   placeholder: '如：Rennes, France',
    iconPath: 'm2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
  { key: 'studyAbroad',labelFr: 'Expérience à l\'étranger', labelZh: '留学经历', placeholder: '留空表示无',
    iconPath: 'M6 12 3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12zm0 0h7.5' },
  { key: 'education',  labelFr: 'Formation', labelZh: '学历',     placeholder: '如：École des Beaux-Arts',
    iconPath: 'M4.26 10.147a60.438 60.438 0 0014.72 0M6.375 17.625a48.012 48.012 0 0112.747 0M4.26 8.583a51.47 51.47 0 0115.479 0M19.5 8.583v7.2a1.8 1.8 0 01-1.35 1.743l-3.6.9a4.499 4.499 0 01-8.1 0l-3.6-.9A1.8 1.8 0 014.5 15.783V8.583' },
]

// ── Contact Fields ────────────────────────────────────────────────────────
const contactFields = [
  { key: 'website',      labelFr: 'Site web', labelZh: '网站',   placeholder: 'https://...',
    iconPath: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' },
  { key: 'instagram',    labelFr: 'Instagram', labelZh: 'Instagram', placeholder: '@username',
    iconPath: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' },
  { key: 'xiaohongshu',  labelFr: 'Xiaohongshu', labelZh: '小红书',   placeholder: '@账号' },
  { key: 'wechat',       labelFr: 'WeChat', labelZh: '微信',     placeholder: '微信号' },
  { key: 'email',        labelFr: 'E-mail', labelZh: '邮箱',     placeholder: 'email@example.com',
    iconPath: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
  { key: 'phone',        labelFr: 'Téléphone', labelZh: '电话',     placeholder: '+33 6 00 00 00 00',
    iconPath: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z' },
]

// ── Form State ────────────────────────────────────────────────────────────
const form = reactive({
  displayName: '' as string,
  title: '' as string,
  nationality: '' as string,
  city: '' as string,
  avatarUrl: '' as string,
  personal: {
    firstName:   '',
    lastName:    '',
    nationality: '',
    birthYear:   '',
    birthPlace:  '',
    residence:   '',
    studyAbroad: '',
    education:   '',
  } as Record<string, string>,
  contact: {
    website:     '',
    instagram:   '',
    xiaohongshu: '',
    wechat:      '',
    email:       '',
    phone:       '',
  } as Record<string, string>,
  galleries: [] as Array<{ name: string; location: string; logo: string }>,
  quoteParagraphs: [] as Array<{ questionId: number; answer: string }>,
  documents: {
    portrait: [],
    studio: [],
    cv: [],
    portfolio: [],
    media: [],
  } as DocumentFiles,
})

onMounted(async () => {
  const questionsRes = await listQuestions()
  if (questionsRes.code === 0 && questionsRes.data) {
    questions.value = questionsRes.data
  }
  // 无论问题列表是否加载成功，都保证表单有一条初始条目可见
  if (form.quoteParagraphs.length === 0) {
    form.quoteParagraphs = [{ questionId: questions.value[0]?.id ?? 0, answer: '' }]
  }

  if (!authStore.token) return
  const res = await getProfile(authStore.token)
  if (res.code === 0 && res.data) {
    const p = res.data
    profileId.value = p.id
    form.displayName = p.displayName || ''
    form.title = p.title || ''
    form.nationality = p.nationality || ''
    form.city = p.city || ''
    form.avatarUrl = p.avatarUrl || ''
    form.personal.firstName = p.personal?.firstName || ''
    form.personal.lastName = p.personal?.lastName || ''
    form.personal.nationality = p.personal?.nationality || p.nationality || ''
    form.personal.birthYear = p.personal?.birthYear || ''
    form.personal.birthPlace = p.personal?.birthPlace || ''
    form.personal.residence = p.personal?.residence || ''
    form.personal.studyAbroad = p.personal?.studyAbroad || ''
    form.personal.education = p.personal?.education || ''
    form.contact.website = p.contact?.website || ''
    form.contact.instagram = p.contact?.instagram || ''
    form.contact.xiaohongshu = p.contact?.xiaohongshu || ''
    form.contact.wechat = p.contact?.wechat || ''
    form.contact.email = p.contact?.email || ''
    form.contact.phone = p.contact?.phone || ''
    form.galleries = (p.galleries || []).map((g) => ({
      name: g.name || '',
      location: g.location || '',
      logo: '',
    }))

    // 兼容性加载：只加载新格式 {questionId, answer}，旧格式 {fr, zh} 忽略；只取第一条
    if (Array.isArray(p.quoteParagraphs)) {
      const loaded = (p.quoteParagraphs as Array<Record<string, unknown>>)
        .filter((q) => typeof q.questionId === 'number' && typeof q.answer === 'string')
        .map((q) => ({ questionId: q.questionId as number, answer: q.answer as string }))
      form.quoteParagraphs = loaded.length ? [loaded[0]] : [{ questionId: questions.value[0]?.id ?? 0, answer: '' }]
    }

    if (profileId.value) {
      const docRes = await listDocuments(authStore.token, profileId.value)
      if (docRes.code === 0 && docRes.data) {
        for (const doc of docRes.data) {
          const cat = doc.category as DocumentCategoryKey
          if (form.documents[cat]) {
            form.documents[cat].push({
              id: String(doc.id),
              name: doc.fileName,
              size: doc.fileSize,
              type: doc.mimeType,
              url: doc.url,
            })
          }
        }
      }
    }
  }
})

onUnmounted(() => {
  if (successTimer) clearTimeout(successTimer)
  // 释放所有未提交文件的 blob URL
  for (const files of Object.values(form.documents)) {
    for (const f of files) {
      if (f.pending) URL.revokeObjectURL(f.url)
    }
  }
})

async function handleAvatarSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  avatarError.value = ''
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    avatarError.value = '仅支持 JPG、PNG、WebP 格式'
    input.value = ''
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    avatarError.value = '文件不能超过 5MB'
    input.value = ''
    return
  }
  if (!authStore.token) {
    avatarError.value = '登录状态已过期，请重新登录'
    return
  }

  avatarUploading.value = true
  try {
    const res = await uploadAvatar(authStore.token, file)
    if (res.code === 0 && res.data) {
      form.avatarUrl = res.data.avatarUrl
    } else {
      avatarError.value = res.message || '上传失败'
    }
  } catch {
    avatarError.value = '上传失败，请稍后重试'
  } finally {
    avatarUploading.value = false
    input.value = ''
  }
}

function handleFileSelect(categoryKey: DocumentCategoryKey, event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  uploadError.value = ''

  const newItems: UploadedFile[] = []

  for (const file of Array.from(files)) {
    if (!isAllowedFile(file)) {
      uploadError.value = `「${file.name}」格式不支持，仅支持 PNG、JPG、JPEG、PDF`
      continue
    }
    if (file.size > MAX_FILE_SIZE) {
      uploadError.value = `「${file.name}」超过 10MB 大小限制`
      continue
    }
    newItems.push({
      id: `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      pending: file,
    })
  }

  if (newItems.length) {
    const target = form.documents[categoryKey]
    if (Array.isArray(target)) {
      target.push(...newItems)
    }
  }

  input.value = ''
}

async function removeFile(categoryKey: DocumentCategoryKey, fileId: string) {
  const idx = form.documents[categoryKey].findIndex(f => f.id === fileId)
  if (idx === -1) return

  const file = form.documents[categoryKey][idx]

  // 待上传文件：直接从内存移除，释放 blob URL
  if (file.pending) {
    URL.revokeObjectURL(file.url)
    form.documents[categoryKey].splice(idx, 1)
    return
  }

  // 已存库文件：调 API 删除
  if (!authStore.token) return
  try {
    const res = await deleteDocument(authStore.token, Number(fileId))
    if (res.code === 0) {
      form.documents[categoryKey].splice(idx, 1)
    } else {
      uploadError.value = res.message || '删除失败'
    }
  } catch {
    uploadError.value = '删除失败，请稍后重试'
  }
}

function addGallery() {
  form.galleries.push({ name: '', location: '', logo: '' })
}

function removeGallery(idx: number) {
  form.galleries.splice(idx, 1)
}

function handleCancel() {
  router.push('/profile')
}

async function handleSave() {
  if (!authStore.token) return
  // profileId 未加载时，有待上传文件则提示等待
  const hasPending = Object.values(form.documents).some(files => files.some(f => f.pending))
  if (hasPending && !profileId.value) {
    uploadError.value = '档案信息尚未加载，请稍后重试'
    return
  }
  saving.value = true
  try {
    // 先批量上传所有待上传文件
    if (profileId.value) {
      for (const categoryKey of Object.keys(form.documents) as DocumentCategoryKey[]) {
        const pending = form.documents[categoryKey].filter(f => f.pending)
        for (const item of pending) {
          try {
            const res = await uploadDocument(authStore.token, profileId.value, categoryKey, item.pending!)
            if (res.code === 0 && res.data) {
              const idx = form.documents[categoryKey].findIndex(f => f.id === item.id)
              if (idx !== -1) {
                URL.revokeObjectURL(item.url)
                form.documents[categoryKey][idx] = {
                  id: String(res.data.id),
                  name: res.data.fileName,
                  size: res.data.fileSize,
                  type: res.data.mimeType,
                  url: res.data.url,
                }
              }
            } else {
              uploadError.value = res.message || `「${item.name}」上传失败`
              return
            }
          } catch {
            uploadError.value = `「${item.name}」上传失败，请稍后重试`
            return
          }
        }
      }
    }

    const res = await updateProfile(authStore.token, {
      displayName: form.displayName || null,
      title: form.title || null,
      nationality: form.nationality || null,
      city: form.city || null,
      avatarUrl: form.avatarUrl || null,
      personal: {
        firstName: form.personal.firstName || null,
        lastName: form.personal.lastName || null,
        nationality: form.personal.nationality || null,
        birthYear: form.personal.birthYear || null,
        birthPlace: form.personal.birthPlace || null,
        residence: form.personal.residence || null,
        studyAbroad: form.personal.studyAbroad || null,
        education: form.personal.education || null,
      },
      contact: {
        website: form.contact.website || null,
        instagram: form.contact.instagram || null,
        xiaohongshu: form.contact.xiaohongshu || null,
        wechat: form.contact.wechat || null,
        email: form.contact.email || null,
        phone: form.contact.phone || null,
      },
      galleries: form.galleries.map((g) => ({
        name: g.name || null,
        location: g.location || null,
        logoUrl: null,
      })),
      quoteParagraphs: form.quoteParagraphs.filter((q) => q.questionId > 0 && q.answer.trim() !== ''),
    })
    if (res.code === 0) {
      if (successTimer) clearTimeout(successTimer)
      saveSuccess.value = true
      successTimer = setTimeout(() => {
        saveSuccess.value = false
        router.push('/profile')
      }, 1200)
    } else {
      uploadError.value = res.message || '保存失败'
    }
  } catch {
    uploadError.value = '网络异常，请稍后重试'
  } finally {
    saving.value = false
  }
}
</script>
