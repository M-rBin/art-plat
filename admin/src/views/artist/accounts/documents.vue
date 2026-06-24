<template>
  <!-- 艺术家资料文件管理：管理员查看/删除任意艺术家五类资料文件 -->
  <div class="artist-documents-manage">
    <!-- 顶部操作栏 -->
    <ElCard shadow="never" class="header-card">
      <div class="header-content">
        <div class="header-title">
          <ElButton :icon="ArrowLeft" text @click="handleBack">返回账号列表</ElButton>
          <span class="divider">|</span>
          <span class="title-text">资料文件 — {{ accountEmail }}</span>
        </div>
      </div>
    </ElCard>

    <!-- 文件列表 -->
    <div v-loading="loading" class="categories-area">
      <ElCard
        v-for="cat in DOC_CATEGORIES"
        :key="cat.key"
        shadow="never"
        class="category-card"
      >
        <template #header>
          <div class="category-header">
            <div class="category-info">
              <span class="category-name">{{ cat.nameFr }}</span>
              <span class="category-name-zh">{{ cat.nameZh }}</span>
              <ElTag size="small" type="info">{{ docFiles[cat.key].length }} 个文件</ElTag>
            </div>
            <ElButton
              v-if="docFiles[cat.key].length > 0"
              text
              size="small"
              @click="toggleExpand(cat.key)"
            >
              {{ expandedKeys.has(cat.key) ? '收起' : '展开' }}
            </ElButton>
          </div>
        </template>

        <!-- 空状态 -->
        <div v-if="docFiles[cat.key].length === 0" class="empty-hint">暂无文件</div>

        <!-- 文件列表 -->
        <ul v-else-if="expandedKeys.has(cat.key)" class="file-list" role="list">
          <li
            v-for="file in docFiles[cat.key]"
            :key="file.id"
            class="file-item"
          >
            <div class="file-icon" :class="file.mimeType === 'application/pdf' ? 'pdf' : 'image'">
              <ElIcon size="16">
                <Document v-if="file.mimeType === 'application/pdf'" />
                <Picture v-else />
              </ElIcon>
            </div>
            <div class="file-info">
              <span class="file-name">{{ file.fileName }}</span>
              <span class="file-size">{{ formatFileSize(file.fileSize) }}</span>
            </div>
            <div class="file-actions">
              <ElButton
                link
                type="primary"
                size="small"
                @click="handlePreview(file)"
              >预览</ElButton>
              <ElButton
                link
                type="danger"
                size="small"
                @click="handleDelete(file, cat.key)"
              >删除</ElButton>
            </div>
          </li>
        </ul>
      </ElCard>
    </div>

    <!-- 预览弹窗 -->
    <ElDialog
      v-model="previewVisible"
      :title="previewFile?.fileName ?? ''"
      width="800px"
      @closed="previewFile = null"
    >
      <div class="preview-content">
        <img
          v-if="previewFile && previewFile.mimeType !== 'application/pdf'"
          :src="previewFile.url"
          :alt="previewFile.fileName"
          class="preview-image"
          loading="eager"
        />
        <div v-else class="pdf-hint">
          <ElIcon size="48" color="var(--el-text-color-placeholder)"><Document /></ElIcon>
          <p>{{ previewFile?.fileName }}</p>
          <ElButton
            type="primary"
            plain
            @click="openInNewTab(previewFile?.url)"
          >在新标签页打开 PDF</ElButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
// 艺术家资料文件管理（admin 端）：查看/删除任意艺术家的五类资料文件
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Document, Picture } from '@element-plus/icons-vue'
import { getAdminArtistDocuments, deleteAdminArtistDocument } from '@/api/artist'
import type { AdminDocumentItem } from '@/api/artist'

const route = useRoute()
const router = useRouter()

const accountId = Number(route.params.id)
const accountEmail = ref(typeof route.query.email === 'string' ? route.query.email : '')
const loading = ref(false)

// ── 分类定义 ──────────────────────────────────────────────────────────────
type DocCategoryKey = 'portrait' | 'studio' | 'cv' | 'portfolio' | 'media'

const DOC_CATEGORIES: Array<{ key: DocCategoryKey; nameFr: string; nameZh: string }> = [
  { key: 'portrait', nameFr: 'Photos portrait', nameZh: '肖像照片' },
  { key: 'studio', nameFr: 'Photos atelier', nameZh: '工作室照片' },
  { key: 'cv', nameFr: 'CV', nameZh: '个人简历' },
  { key: 'portfolio', nameFr: 'Portfolio', nameZh: '作品集' },
  { key: 'media', nameFr: 'Couverture média', nameZh: '媒体报道' },
]

const docFiles = reactive<Record<DocCategoryKey, AdminDocumentItem[]>>({
  portrait: [], studio: [], cv: [], portfolio: [], media: [],
})

const expandedKeys = ref<Set<DocCategoryKey>>(new Set())

// ── 预览状态 ──────────────────────────────────────────────────────────────
const previewVisible = ref(false)
const previewFile = ref<AdminDocumentItem | null>(null)

// ── 加载数据 ──────────────────────────────────────────────────────────────
async function loadDocuments() {
  loading.value = true
  try {
    const res = await getAdminArtistDocuments(accountId)
    const docs = res.data ?? []
    for (const key of Object.keys(docFiles) as DocCategoryKey[]) {
      docFiles[key] = []
    }
    for (const doc of docs) {
      const key = doc.category as DocCategoryKey
      if (docFiles[key]) docFiles[key].push(doc)
    }
    // 有文件的分类默认展开
    for (const key of Object.keys(docFiles) as DocCategoryKey[]) {
      if (docFiles[key].length > 0) expandedKeys.value.add(key)
    }
  } finally {
    loading.value = false
  }
}

// ── 展开/收起 ─────────────────────────────────────────────────────────────
function toggleExpand(key: DocCategoryKey) {
  if (expandedKeys.value.has(key)) {
    expandedKeys.value.delete(key)
  } else {
    expandedKeys.value.add(key)
  }
}

// ── 预览 ──────────────────────────────────────────────────────────────────
function handlePreview(file: AdminDocumentItem) {
  previewFile.value = file
  previewVisible.value = true
}

function openInNewTab(url?: string) {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

// ── 删除 ──────────────────────────────────────────────────────────────────
async function handleDelete(file: AdminDocumentItem, categoryKey: DocCategoryKey) {
  try {
    await ElMessageBox.confirm('确定删除该文件？', '提示', { type: 'warning' })
    await deleteAdminArtistDocument(file.id)
    ElMessage.success('删除成功')
    docFiles[categoryKey] = docFiles[categoryKey].filter((f) => f.id !== file.id)
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败，请重试')
    }
  }
}

// ── 工具函数 ──────────────────────────────────────────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function handleBack() {
  router.push('/artist/accounts')
}

onMounted(loadDocuments)
</script>

<style scoped lang="scss">
.artist-documents-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;

  :deep(.el-card) {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .header-card {
    flex-shrink: 0;

    :deep(.el-card__body) {
      padding: 12px 20px;
    }

    .header-content {
      display: flex;
      align-items: center;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--el-text-color-regular);

      .divider { color: var(--el-border-color); }
      .title-text { font-weight: 500; }
    }
  }

  .categories-area {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .category-card {
    :deep(.el-card__header) {
      padding: 12px 20px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    :deep(.el-card__body) {
      padding: 12px 20px;
    }

    .category-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .category-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .category-name-zh {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .empty-hint {
    color: var(--el-text-color-placeholder);
    font-size: 13px;
    padding: 4px 0;
  }

  .file-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    background: var(--el-fill-color-light);

    .file-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.pdf { background: var(--el-fill-color); color: var(--el-text-color-secondary); }
      &.image { background: #f5f0e8; color: #d4a373; }
    }

    .file-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .file-name {
        font-size: 13px;
        color: var(--el-text-color-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-size {
        font-size: 11px;
        color: var(--el-text-color-placeholder);
      }
    }

    .file-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
  }

  .preview-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;

    .preview-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 4px;
    }

    .pdf-hint {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }
}
</style>
