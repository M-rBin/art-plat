<template>
  <!-- 艺术家账号列表页面：列表 + 搜索/筛选 + 禁用启用 + 重置密码 + 跳转档案/文件 -->
  <div class="artist-accounts">
    <!-- 筛选卡片 -->
    <ElCard shadow="never" class="filter-card">
      <ElForm :inline="true" :model="filterForm" class="filter-form">
        <ElFormItem label="账号查询">
          <ElInput
            v-model="filterForm.keyword"
            placeholder="输入邮箱或姓名"
            clearable
            class="filter-input"
          />
        </ElFormItem>
        <ElFormItem label="账号状态">
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
      <div class="table-container">
        <ElTable
          v-loading="loading"
          :data="tableData"
          border
          stripe
          height="100%"
          style="width: 100%"
          empty-text="暂无艺术家账号"
        >
          <ElTableColumn prop="id" label="ID" width="70" align="center" />
          <ElTableColumn label="头像" width="70" align="center">
            <template #default="{ row }">
              <div class="avatar-cell">
                <img
                  v-if="(row as ArtistAccountItem).avatarUrl"
                  :src="(row as ArtistAccountItem).avatarUrl!"
                  :alt="(row as ArtistAccountItem).name ?? '头像'"
                  class="avatar-thumb"
                />
                <div v-else class="avatar-placeholder">
                  {{ ((row as ArtistAccountItem).name ?? (row as ArtistAccountItem).email).charAt(0).toUpperCase() }}
                </div>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
          <ElTableColumn label="姓名" min-width="130" show-overflow-tooltip>
            <template #default="{ row }">
              {{ (row as ArtistAccountItem).name || '—' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="国籍" width="110" show-overflow-tooltip>
            <template #default="{ row }">
              {{ (row as ArtistAccountItem).nationality || '—' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="艺术家类型" width="110" show-overflow-tooltip>
            <template #default="{ row }">
              {{ (row as ArtistAccountItem).artistType || '—' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="邮箱验证" width="100" align="center">
            <template #default="{ row }">
              <ElTag
                :type="(row as ArtistAccountItem).emailVerified ? 'success' : 'warning'"
                size="small"
              >
                {{ (row as ArtistAccountItem).emailVerified ? '已验证' : '待验证' }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="状态" width="90" align="center">
            <template #default="{ row }">
              <ElSwitch
                v-model="(row as ArtistAccountItem).status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row as ArtistAccountItem)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="createTime" label="创建时间" width="180" />
          <ElTableColumn label="操作" width="220" align="center" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="handleViewProfile(row as ArtistAccountItem)">档案</ElButton>
              <ElButton link type="primary" @click="handleViewDocuments(row as ArtistAccountItem)">文件</ElButton>
              <ElButton link type="warning" @click="handleResetPassword(row as ArtistAccountItem)">重置密码</ElButton>
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
  </div>
</template>

<script setup lang="ts">
// 艺术家账号列表：分页查询、状态切换、重置密码、跳转档案/文件
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getArtistAccountList,
  updateArtistAccountStatus,
  resetArtistPassword,
} from '@/api/artist'
import type { ArtistAccountItem } from '@/api/artist'

const router = useRouter()

// ── 列表状态 ──────────────────────────────────────────────────────────────
const loading = ref(false)
const tableData = ref<ArtistAccountItem[]>([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const filterForm = reactive<{ keyword: string; status: number | string }>({
  keyword: '',
  status: '',
})

async function fetchList() {
  loading.value = true
  try {
    const res = await getArtistAccountList({
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
async function handleStatusChange(row: ArtistAccountItem) {
  const originalStatus = row.status === 1 ? 0 : 1
  try {
    await updateArtistAccountStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch {
    row.status = originalStatus
  }
}

// ── 重置密码 ──────────────────────────────────────────────────────────────
async function handleResetPassword(row: ArtistAccountItem) {
  try {
    await ElMessageBox.confirm(
      `确定重置「${row.email}」的密码？重置后将生成临时密码。`,
      '提示',
      { type: 'warning' },
    )
    const res = await resetArtistPassword(row.id)
    const tempPassword = res.data?.tempPassword ?? ''
    ElMessageBox.alert(
      `临时密码：${tempPassword}\n请告知艺术家尽快修改密码。`,
      '重置成功',
      { type: 'success' },
    )
  } catch {
    // 取消或请求失败，静默处理
  }
}

// ── 跳转 ──────────────────────────────────────────────────────────────────
function handleViewProfile(row: ArtistAccountItem) {
  router.push({ path: `/artist/accounts/${row.id}/profile`, query: { email: row.email } })
}

function handleViewDocuments(row: ArtistAccountItem) {
  router.push({ path: `/artist/accounts/${row.id}/documents`, query: { email: row.email } })
}

onMounted(fetchList)
</script>

<style scoped lang="scss">
.artist-accounts {
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

  .avatar-cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .avatar-thumb {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--el-color-primary-light-8);
    color: var(--el-color-primary);
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
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
