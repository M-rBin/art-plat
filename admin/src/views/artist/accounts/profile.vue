<template>
  <!-- 艺术家档案管理：管理员读写任意艺术家档案 -->
  <div class="artist-profile-manage">
    <!-- 顶部操作栏 -->
    <ElCard shadow="never" class="header-card">
      <div class="header-content">
        <div class="header-title">
          <ElButton :icon="ArrowLeft" text @click="handleBack">返回账号列表</ElButton>
          <span class="divider">|</span>
          <span class="title-text">艺术家档案 — {{ accountEmail }}</span>
        </div>
        <div class="header-actions">
          <ElButton @click="handleBack">取消</ElButton>
          <ElButton type="primary" :loading="saving" @click="handleSave">保存</ElButton>
        </div>
      </div>
    </ElCard>

    <!-- 表单区域 -->
    <div v-loading="loading" class="form-area">
      <ElForm ref="formRef" :model="form" label-width="120px" class="profile-form">

        <!-- 基本信息 -->
        <ElCard shadow="never" class="section-card">
          <template #header><span class="section-title">基本信息</span></template>
          <ElRow :gutter="24">
            <ElCol :span="12">
              <ElFormItem label="显示姓名">
                <ElInput v-model="form.displayName" placeholder="艺术家展示名称" maxlength="200" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="职位">
                <ElInput v-model="form.title" placeholder="如：Artiste" maxlength="100" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="国籍">
                <ElInput v-model="form.nationality" placeholder="如：France" maxlength="100" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="所在城市">
                <ElInput v-model="form.city" placeholder="如：Paris" maxlength="100" />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElCard>

        <!-- 个人信息 -->
        <ElCard shadow="never" class="section-card">
          <template #header><span class="section-title">个人信息</span></template>
          <ElRow :gutter="24">
            <ElCol :span="12">
              <ElFormItem label="名（Prénom）">
                <ElInput v-model="form.personal.firstName" placeholder="如：Willy" maxlength="100" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="姓（Nom）">
                <ElInput v-model="form.personal.lastName" placeholder="如：Dupont" maxlength="100" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="出生年月">
                <ElInput v-model="form.personal.birthYear" placeholder="如：1965" maxlength="50" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="出生地">
                <ElInput v-model="form.personal.birthPlace" placeholder="如：Nantes, France" maxlength="200" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="现居地">
                <ElInput v-model="form.personal.residence" placeholder="如：Paris, France" maxlength="200" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="学历">
                <ElInput v-model="form.personal.education" placeholder="如：École des Beaux-Arts" maxlength="500" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="24">
              <ElFormItem label="留学经历">
                <ElInput v-model="form.personal.studyAbroad" placeholder="留空表示无" maxlength="500" />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElCard>

        <!-- 联系方式 -->
        <ElCard shadow="never" class="section-card">
          <template #header><span class="section-title">联系方式</span></template>
          <ElRow :gutter="24">
            <ElCol :span="12">
              <ElFormItem label="网站">
                <ElInput v-model="form.contact.website" placeholder="https://..." maxlength="500" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="Instagram">
                <ElInput v-model="form.contact.instagram" placeholder="@username" maxlength="200" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="小红书">
                <ElInput v-model="form.contact.xiaohongshu" placeholder="@账号" maxlength="200" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="微信">
                <ElInput v-model="form.contact.wechat" placeholder="微信号" maxlength="100" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="联系邮箱">
                <ElInput v-model="form.contact.email" placeholder="联系邮箱（非登录邮箱）" maxlength="200" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="电话">
                <ElInput v-model="form.contact.phone" placeholder="+33 6 00 00 00 00" maxlength="50" />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElCard>

        <!-- 代理画廊 -->
        <ElCard shadow="never" class="section-card">
          <template #header>
            <div class="section-header">
              <span class="section-title">代理画廊</span>
              <ElButton
                type="primary"
                plain
                size="small"
                :disabled="form.galleries.length >= 20"
                @click="addGallery"
              >添加画廊</ElButton>
            </div>
          </template>
          <div v-if="form.galleries.length === 0" class="empty-hint">暂无代理画廊</div>
          <div
            v-for="(gallery, idx) in form.galleries"
            :key="idx"
            class="gallery-row"
          >
            <ElInput
              v-model="gallery.name"
              placeholder="画廊名称"
              maxlength="200"
              class="gallery-name"
            />
            <ElInput
              v-model="gallery.location"
              placeholder="城市，国家"
              maxlength="200"
              class="gallery-location"
            />
            <ElButton
              type="danger"
              plain
              size="small"
              :icon="Delete"
              @click="removeGallery(idx)"
            />
          </div>
        </ElCard>

        <!-- 问题回答 -->
        <ElCard shadow="never" class="section-card">
          <template #header><span class="section-title">问题回答</span></template>
          <ElFormItem label="选择问题">
            <ElSelect v-model="quoteQuestionId" placeholder="请选择问题" clearable style="width: 100%">
              <ElOption
                v-for="q in questions"
                :key="q.id"
                :value="q.id"
                :label="`${q.contentFr} / ${q.contentZh}`"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="回答内容">
            <ElInput
              v-model="quoteAnswer"
              type="textarea"
              :rows="5"
              :maxlength="2000"
              show-word-limit
              placeholder="请输入艺术家回答（不限语种，可留空）"
            />
          </ElFormItem>
        </ElCard>

      </ElForm>
    </div>
  </div>
</template>

<script setup lang="ts">
// 艺术家档案管理（admin 端）：读取/编辑任意艺术家档案，含代理画廊和问题回答
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Delete } from '@element-plus/icons-vue'
import {
  getAdminArtistProfile,
  updateAdminArtistProfile,
  getQuestionList,
  type AdminProfileData,
  type QuestionItem,
} from '@/api/artist'

const route = useRoute()
const router = useRouter()

const accountId = Number(route.params.id)
// email 由账号列表页跳转时通过 query 传入，避免再次发请求
const accountEmail = ref(typeof route.query.email === 'string' ? route.query.email : '')
const loading = ref(false)
const saving = ref(false)
const questions = ref<QuestionItem[]>([])

// ── 问题回答（单条）─────────────────────────────────────────────────────
const quoteQuestionId = ref<number | null>(null)
const quoteAnswer = ref('')

// ── 表单状态 ──────────────────────────────────────────────────────────────
const formRef = ref()
const form = reactive<Omit<AdminProfileData, 'id' | 'quoteParagraphs' | 'galleries'> & {
  galleries: Array<{ name: string | null; location: string | null; logoUrl: string | null; sortOrder: number }>
}>({
  displayName: null,
  title: null,
  nationality: null,
  city: null,
  avatarUrl: null,
  personal: {
    firstName: null, lastName: null, nationality: null,
    birthYear: null, birthPlace: null, residence: null,
    studyAbroad: null, education: null,
  },
  contact: {
    website: null, instagram: null, xiaohongshu: null,
    wechat: null, email: null, phone: null,
  },
  galleries: [],
})

// ── 初始化数据 ────────────────────────────────────────────────────────────
async function loadData() {
  loading.value = true
  try {
    const [profileRes, questionsRes] = await Promise.all([
      getAdminArtistProfile(accountId),
      getQuestionList({ status: 1, pageSize: 100 }),
    ])

    questions.value = questionsRes.data?.list ?? []

    if (profileRes.data) {
      const p = profileRes.data
      form.displayName = p.displayName
      form.title = p.title
      form.nationality = p.nationality
      form.city = p.city
      form.avatarUrl = p.avatarUrl
      Object.assign(form.personal, p.personal ?? {})
      Object.assign(form.contact, p.contact ?? {})
      form.galleries = (p.galleries ?? []).map((g) => ({
        name: g.name, location: g.location, logoUrl: g.logoUrl, sortOrder: g.sortOrder,
      }))
      const firstQuote = p.quoteParagraphs?.[0]
      if (firstQuote) {
        quoteQuestionId.value = firstQuote.questionId
        quoteAnswer.value = firstQuote.answer
      }
    }
  } finally {
    loading.value = false
  }
}

// ── 画廊操作 ──────────────────────────────────────────────────────────────
function addGallery() {
  if (form.galleries.length >= 20) return
  form.galleries.push({ name: null, location: null, logoUrl: null, sortOrder: form.galleries.length })
}

function removeGallery(idx: number) {
  form.galleries.splice(idx, 1)
}

// ── 保存 / 取消 ───────────────────────────────────────────────────────────
function handleBack() {
  router.push('/artist/accounts')
}

async function handleSave() {
  saving.value = true
  try {
    const quoteParagraphs =
      quoteQuestionId.value && quoteAnswer.value.trim()
        ? [{ questionId: quoteQuestionId.value, answer: quoteAnswer.value.trim() }]
        : []

    await updateAdminArtistProfile(accountId, {
      ...form,
      quoteParagraphs,
    })
    ElMessage.success('保存成功')
    router.push('/artist/accounts')
  } catch {
    ElMessage.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.artist-profile-manage {
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
      justify-content: space-between;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--el-text-color-regular);

      .divider {
        color: var(--el-border-color);
      }

      .title-text {
        font-weight: 500;
      }
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }

  .form-area {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .section-card {
    :deep(.el-card__header) {
      padding: 12px 20px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    :deep(.el-card__body) {
      padding: 20px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .gallery-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;

    .gallery-name {
      flex: 1;
    }

    .gallery-location {
      width: 200px;
    }
  }

  .empty-hint {
    color: var(--el-text-color-placeholder);
    font-size: 13px;
    padding: 8px 0;
  }
}
</style>
