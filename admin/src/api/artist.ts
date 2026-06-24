import request from '@/utils/http'

// ==================== 问题库接口 ====================

export interface QuestionItem {
  id: number
  contentFr: string
  contentZh: string
  sortOrder: number
  status: number
  createTime: string
  updateTime: string
}

export interface QuestionListParams {
  keyword?: string
  status?: number | string
  page?: number
  pageSize?: number
}

export interface QuestionForm {
  contentFr: string
  contentZh: string
  sortOrder: number
  status: number
}

/**
 * GET /admin/artist/questions — 分页查询问题列表
 */
export function getQuestionList(params?: QuestionListParams) {
  return request.get<{ list: QuestionItem[]; pagination: { page: number; pageSize: number; total: number } }>({
    url: '/admin/artist/questions',
    params,
  })
}

/**
 * POST /admin/artist/questions — 新增问题
 */
export function addQuestion(data: QuestionForm) {
  return request.post<QuestionItem>({
    url: '/admin/artist/questions',
    data,
  })
}

/**
 * PUT /admin/artist/questions/:id — 编辑问题
 */
export function updateQuestion(id: number, data: Partial<QuestionForm>) {
  return request.put<QuestionItem>({
    url: `/admin/artist/questions/${id}`,
    data,
  })
}

/**
 * PUT /admin/artist/questions/:id/status — 切换问题状态
 */
export function updateQuestionStatus(id: number, status: number) {
  return request.put({
    url: `/admin/artist/questions/${id}/status`,
    data: { status },
  })
}

/**
 * DELETE /admin/artist/questions/:id — 删除问题
 */
export function deleteQuestion(id: number) {
  return request.del({
    url: `/admin/artist/questions/${id}`,
  })
}

// ==================== 艺术家账号接口 ====================

export interface ArtistAccountItem {
  id: number
  email: string
  name: string | null
  avatarUrl: string | null
  nationality: string | null
  artistType: string | null
  status: number
  emailVerified: boolean
  createTime: string
  updateTime: string
}

export interface ArtistAccountListParams {
  keyword?: string
  status?: number | string
  page?: number
  pageSize?: number
}

/**
 * GET /admin/artist/accounts — 分页查询艺术家账号列表
 */
export function getArtistAccountList(params?: ArtistAccountListParams) {
  return request.get<{ list: ArtistAccountItem[]; pagination: { page: number; pageSize: number; total: number } }>({
    url: '/admin/artist/accounts',
    params,
  })
}

/**
 * PUT /admin/artist/accounts/:id/status — 切换账号状态
 */
export function updateArtistAccountStatus(id: number, status: number) {
  return request.put({
    url: `/admin/artist/accounts/${id}/status`,
    data: { status },
  })
}

/**
 * POST /admin/artist/accounts/:id/reset-password — 重置密码
 */
export function resetArtistPassword(id: number) {
  return request.post<{ id: number; tempPassword: string }>({
    url: `/admin/artist/accounts/${id}/reset-password`,
  })
}

// ==================== 艺术家档案（admin 管理端）====================

export interface AdminProfileData {
  id: number
  displayName: string | null
  title: string | null
  nationality: string | null
  city: string | null
  avatarUrl: string | null
  personal: {
    firstName: string | null
    lastName: string | null
    nationality: string | null
    birthYear: string | null
    birthPlace: string | null
    residence: string | null
    studyAbroad: string | null
    education: string | null
  }
  contact: {
    website: string | null
    instagram: string | null
    xiaohongshu: string | null
    wechat: string | null
    email: string | null
    phone: string | null
  }
  quoteParagraphs: Array<{ questionId: number; answer: string }>
  galleries: Array<{ name: string | null; location: string | null; logoUrl: string | null; sortOrder: number }>
}

/**
 * GET /admin/artist/accounts/:id/profile — 读取艺术家档案（管理端）
 */
export function getAdminArtistProfile(accountId: number) {
  return request.get<AdminProfileData>({
    url: `/admin/artist/accounts/${accountId}/profile`,
  })
}

/**
 * PUT /admin/artist/accounts/:id/profile — 更新艺术家档案（管理端）
 */
export function updateAdminArtistProfile(accountId: number, data: Partial<AdminProfileData>) {
  return request.put<AdminProfileData>({
    url: `/admin/artist/accounts/${accountId}/profile`,
    data,
  })
}

// ==================== 艺术家资料文件（admin 管理端）====================

export interface AdminDocumentItem {
  id: number
  accountId: number
  category: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  sortOrder: number
  createTime: string
}

/**
 * GET /admin/artist/accounts/:id/documents — 获取艺术家资料文件列表（管理端）
 */
export function getAdminArtistDocuments(accountId: number, category?: string) {
  return request.get<AdminDocumentItem[]>({
    url: `/admin/artist/accounts/${accountId}/documents`,
    params: category ? { category } : undefined,
  })
}

/**
 * DELETE /admin/artist/documents/:docId — 删除资料文件（管理端）
 */
export function deleteAdminArtistDocument(docId: number) {
  return request.del({
    url: `/admin/artist/documents/${docId}`,
  })
}
