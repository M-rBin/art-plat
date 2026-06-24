<template>
  <!-- 问题库管理页面：列表 + 新增/编辑弹窗 -->
  <div class="artist-questions">
    <!-- 筛选卡片 -->
    <ElCard shadow="never" class="filter-card">
      <ElForm :inline="true" :model="filterForm" class="filter-form">
        <ElFormItem label="问题内容">
          <ElInput
            v-model="filterForm.keyword"
            placeholder="输入法文或中文内容"
            clearable
            class="filter-input"
          />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="filterForm.status" placeholder="请选择" clearable class="filter-select">
            <ElOption label="启用" :value="1" />
            <ElOption label="禁用" :value="0" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" :icon="Search" @click="handleSearch">搜索</ElButton>
          <ElButton :icon="Refresh" @click="handleReset">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 表格卡片 -->
    <ElCard shadow="never" class="table-card">
      <div class="table-header">
        <ElButton type="primary" :icon="Plus" @click="handleAdd">新增问题</ElButton>
      </div>

      <div class="table-container">
        <ElTable
          v-loading="loading"
          :data="tableData"
          border
          stripe
          height="100%"
          style="width: 100%"
          empty-text="暂无问题数据"
        >
          <ElTableColumn prop="id" label="ID" width="70" align="center" />
          <ElTableColumn prop="contentFr" label="法文问题" min-width="260" show-overflow-tooltip />
          <ElTableColumn prop="contentZh" label="中文问题" min-width="200" show-overflow-tooltip />
          <ElTableColumn prop="sortOrder" label="排序" width="80" align="center" />
          <ElTableColumn label="状态" width="90" align="center">
            <template #default="{ row }">
              <ElSwitch
                v-model="(row as QuestionItem).status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row as QuestionItem)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="createTime" label="创建时间" width="180" />
          <ElTableColumn label="操作" width="140" align="center" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="handleEdit(row as QuestionItem)">编辑</ElButton>
              <ElButton link type="danger" @click="handleDelete(row as QuestionItem)">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>

      <div class="pagination-container">
        <ElPagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="fetchList"
        />
      </div>
    </ElCard>

    <!-- 新增/编辑弹窗 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="560px"
      @closed="resetForm"
    >
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <ElFormItem label="法文问题" prop="contentFr">
          <ElInput
            v-model="form.contentFr"
            type="textarea"
            :rows="3"
            :maxlength="500"
            show-word-limit
            placeholder="请输入法文问题内容"
          />
        </ElFormItem>
        <ElFormItem label="中文问题" prop="contentZh">
          <ElInput
            v-model="form.contentZh"
            type="textarea"
            :rows="3"
            :maxlength="500"
            show-word-limit
            placeholder="请输入中文问题内容"
          />
        </ElFormItem>
        <ElFormItem label="排序号" prop="sortOrder">
          <ElInputNumber
            v-model="form.sortOrder"
            :min="0"
            :max="9999"
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="form.status" style="width: 100%">
            <ElOption label="启用" :value="1" />
            <ElOption label="禁用" :value="0" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
// 问题库管理：列表分页查询、新增/编辑弹窗、状态切换、删除确认
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  getQuestionList,
  addQuestion,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion,
} from '@/api/artist'
import type { QuestionItem } from '@/api/artist'

// ── 列表状态 ──────────────────────────────────────────────────────────────
const loading = ref(false)
const tableData = ref<QuestionItem[]>([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const filterForm = reactive<{ keyword: string; status: number | string }>({
  keyword: '',
  status: '',
})

async function fetchList() {
  loading.value = true
  try {
    const res = await getQuestionList({
      keyword: filterForm.keyword || undefined,
      status: filterForm.status !== '' ? filterForm.status : undefined,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = res.data?.list ?? []
    pagination.total = res.data?.pagination?.total ?? 0
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchList()
}

function handleReset() {
  filterForm.keyword = ''
  filterForm.status = ''
  pagination.page = 1
  fetchList()
}

function handleSizeChange() {
  pagination.page = 1
  fetchList()
}

// ── 状态切换 ──────────────────────────────────────────────────────────────
async function handleStatusChange(row: QuestionItem) {
  const originalStatus = row.status === 1 ? 0 : 1
  try {
    await updateQuestionStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch {
    row.status = originalStatus
  }
}

// ── 删除 ──────────────────────────────────────────────────────────────────
async function handleDelete(row: QuestionItem) {
  try {
    await ElMessageBox.confirm('确定删除该问题？', '提示', { type: 'warning' })
    await deleteQuestion(row.id)
    ElMessage.success('删除成功')
    if (tableData.value.length === 1 && pagination.page > 1) {
      pagination.page--
    }
    fetchList()
  } catch {
    // 取消或请求失败，静默处理
  }
}

// ── 新增/编辑弹窗 ─────────────────────────────────────────────────────────
const dialogVisible = ref(false)
const dialogTitle = ref('新增问题')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const editingId = ref<number | null>(null)

const form = reactive({
  contentFr: '',
  contentZh: '',
  sortOrder: 0,
  status: 1,
})

const formRules: FormRules = {
  contentFr: [{ required: true, message: '请输入法文问题内容', trigger: 'blur' }],
  contentZh: [{ required: true, message: '请输入中文问题内容', trigger: 'blur' }],
}

function handleAdd() {
  editingId.value = null
  dialogTitle.value = '新增问题'
  dialogVisible.value = true
}

function handleEdit(row: QuestionItem) {
  editingId.value = row.id
  dialogTitle.value = '编辑问题'
  Object.assign(form, {
    contentFr: row.contentFr,
    contentZh: row.contentZh,
    sortOrder: row.sortOrder,
    status: row.status,
  })
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.resetFields()
  Object.assign(form, { contentFr: '', contentZh: '', sortOrder: 0, status: 1 })
  editingId.value = null
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitLoading.value = true
  try {
    if (editingId.value !== null) {
      await updateQuestion(editingId.value, { ...form })
      ElMessage.success('编辑成功')
    } else {
      await addQuestion({ ...form })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally {
    submitLoading.value = false
  }
}

onMounted(fetchList)
</script>

<style scoped lang="scss">
.artist-questions {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  :deep(.el-card) {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
  }

  .filter-card {
    flex-shrink: 0;

    :deep(.el-card__body) {
      padding: 12px 20px;
    }

    .filter-form {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 4px;
    }

    .filter-input {
      width: 220px;
    }

    .filter-select {
      width: 140px;
    }
  }

  .table-card {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      padding: 16px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .table-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .table-container {
      flex: 1;
      overflow: hidden;
    }

    .pagination-container {
      flex-shrink: 0;
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
}
</style>
