// @ts-nocheck
/**
 * 艺术家域 Mock 数据
 * 字段与页面消费保持一致：
 * - 问题：id/contentFr/contentZh/sortOrder/status/createTime
 * - 账号：id/email/name/status/emailVerified/createTime
 * - 列表统一返回 { list, pagination: { page, pageSize, total } }
 */

// ==================== 问题库数据 ====================

let nextQuestionId = 6

const mockQuestions = [
  {
    id: 1,
    contentFr: 'Pourquoi la Chine est-elle importante pour vous ?',
    contentZh: '为什么中国对您如此重要？',
    sortOrder: 0,
    status: 1,
    createTime: '2025-06-21 10:00:00',
    updateTime: '2025-06-21 10:00:00',
  },
  {
    id: 2,
    contentFr: 'Quel est votre rapport à la culture chinoise ?',
    contentZh: '您与中国文化的关系是什么？',
    sortOrder: 1,
    status: 1,
    createTime: '2025-06-21 10:00:00',
    updateTime: '2025-06-21 10:00:00',
  },
  {
    id: 3,
    contentFr: 'Qu\'est-ce qui vous a amené à travailler sur la scène artistique chinoise ?',
    contentZh: '是什么让您开始在中国艺术圈工作？',
    sortOrder: 2,
    status: 1,
    createTime: '2025-06-21 10:00:00',
    updateTime: '2025-06-21 10:00:00',
  },
  {
    id: 4,
    contentFr: 'Comment décririez-vous votre style artistique ?',
    contentZh: '您如何描述您的艺术风格？',
    sortOrder: 3,
    status: 1,
    createTime: '2025-06-22 10:00:00',
    updateTime: '2025-06-22 10:00:00',
  },
  {
    id: 5,
    contentFr: 'Quelles sont vos influences artistiques majeures ?',
    contentZh: '您最重要的艺术影响是什么？',
    sortOrder: 4,
    status: 0,
    createTime: '2025-06-22 10:00:00',
    updateTime: '2025-06-22 10:00:00',
  },
]

/**
 * GET /admin/artist/questions — 分页查询问题列表
 */
export function getQuestionListMock(params) {
  const { keyword, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockQuestions]

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      (q) =>
        q.contentFr.toLowerCase().includes(kw) ||
        q.contentZh.toLowerCase().includes(kw),
    )
  }

  if (status !== undefined && status !== '' && status !== null) {
    filtered = filtered.filter((q) => q.status === Number(status))
  }

  filtered.sort((a, b) => a.sortOrder - b.sortOrder)

  const total = filtered.length
  const list = filtered.slice((page - 1) * pageSize, page * pageSize)

  return { list, pagination: { page: Number(page), pageSize: Number(pageSize), total } }
}

/**
 * POST /admin/artist/questions — 新增问题
 */
export function addQuestionMock(data) {
  const item = {
    id: nextQuestionId++,
    contentFr: data.contentFr || '',
    contentZh: data.contentZh || '',
    sortOrder: data.sortOrder ?? 0,
    status: data.status ?? 1,
    createTime: new Date().toLocaleString('zh-CN', { hour12: false }),
    updateTime: new Date().toLocaleString('zh-CN', { hour12: false }),
  }
  mockQuestions.push(item)
  return item
}

/**
 * PUT /admin/artist/questions/:id — 编辑问题
 */
export function updateQuestionMock(id, data) {
  const idx = mockQuestions.findIndex((q) => q.id === Number(id))
  if (idx === -1) return null
  Object.assign(mockQuestions[idx], {
    contentFr: data.contentFr ?? mockQuestions[idx].contentFr,
    contentZh: data.contentZh ?? mockQuestions[idx].contentZh,
    sortOrder: data.sortOrder ?? mockQuestions[idx].sortOrder,
    status: data.status ?? mockQuestions[idx].status,
    updateTime: new Date().toLocaleString('zh-CN', { hour12: false }),
  })
  return mockQuestions[idx]
}

/**
 * PUT /admin/artist/questions/:id/status — 切换状态
 */
export function updateQuestionStatusMock(id, status) {
  const idx = mockQuestions.findIndex((q) => q.id === Number(id))
  if (idx === -1) return null
  mockQuestions[idx].status = Number(status)
  mockQuestions[idx].updateTime = new Date().toLocaleString('zh-CN', { hour12: false })
  return mockQuestions[idx]
}

/**
 * DELETE /admin/artist/questions/:id — 删除问题
 */
export function deleteQuestionMock(id) {
  const idx = mockQuestions.findIndex((q) => q.id === Number(id))
  if (idx !== -1) mockQuestions.splice(idx, 1)
}

// ==================== 艺术家账号数据 ====================

let nextAccountId = 6

export const mockArtistAccounts = [
  {
    id: 1,
    email: 'demo@zhen.art',
    name: 'Willy Le Nalbaut',
    avatarUrl: null,
    nationality: 'Française',
    artistType: '油画',
    status: 1,
    emailVerified: true,
    createTime: '2025-06-21 10:00:00',
    updateTime: '2025-06-21 10:00:00',
  },
  {
    id: 2,
    email: 'sophie.martin@example.com',
    name: 'Sophie Martin',
    avatarUrl: null,
    nationality: 'Française',
    artistType: '雕塑',
    status: 1,
    emailVerified: true,
    createTime: '2025-06-22 10:00:00',
    updateTime: '2025-06-22 10:00:00',
  },
  {
    id: 3,
    email: 'jean.dupont@example.com',
    name: 'Jean Dupont',
    avatarUrl: null,
    nationality: 'Française',
    artistType: '摄影',
    status: 0,
    emailVerified: true,
    createTime: '2025-06-22 14:00:00',
    updateTime: '2026-01-10 09:00:00',
  },
  {
    id: 4,
    email: 'marie.claire@example.com',
    name: 'Marie Claire',
    avatarUrl: null,
    nationality: null,
    artistType: null,
    status: 1,
    emailVerified: false,
    createTime: '2026-01-05 10:00:00',
    updateTime: '2026-01-05 10:00:00',
  },
  {
    id: 5,
    email: 'pierre.bernard@example.com',
    name: null,
    avatarUrl: null,
    nationality: null,
    artistType: null,
    status: 1,
    emailVerified: true,
    createTime: '2026-03-10 10:00:00',
    updateTime: '2026-03-10 10:00:00',
  },
]

/**
 * GET /admin/artist/accounts — 分页查询艺术家账号列表
 */
export function getArtistAccountListMock(params) {
  const { keyword, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockArtistAccounts]

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.email.toLowerCase().includes(kw) ||
        (a.name && a.name.toLowerCase().includes(kw)),
    )
  }

  if (status !== undefined && status !== '' && status !== null) {
    filtered = filtered.filter((a) => a.status === Number(status))
  }

  const total = filtered.length
  const list = filtered.slice((page - 1) * pageSize, page * pageSize)

  return { list, pagination: { page: Number(page), pageSize: Number(pageSize), total } }
}

/**
 * PUT /admin/artist/accounts/:id/status — 切换账号状态
 */
export function updateArtistAccountStatusMock(id, status) {
  const idx = mockArtistAccounts.findIndex((a) => a.id === Number(id))
  if (idx === -1) return null
  mockArtistAccounts[idx].status = Number(status)
  mockArtistAccounts[idx].updateTime = new Date().toLocaleString('zh-CN', { hour12: false })
  return mockArtistAccounts[idx]
}

/**
 * POST /admin/artist/accounts/:id/reset-password — 重置密码
 */
export function resetArtistPasswordMock(id) {
  const idx = mockArtistAccounts.findIndex((a) => a.id === Number(id))
  if (idx === -1) return null
  return { id: Number(id), tempPassword: 'Tmp@Mock001' }
}

// ==================== 艺术家档案（admin 管理端）====================

const mockAdminProfiles = [
  {
    id: 1,
    displayName: 'Willy Le Nalbaut',
    title: 'Artiste',
    nationality: 'France',
    city: 'Rennes',
    avatarUrl: null,
    personal: {
      firstName: 'Willy',
      lastName: 'Le Nalbaut',
      nationality: 'Française',
      birthYear: '1965',
      birthPlace: 'Nantes, France',
      residence: 'Rennes, France',
      studyAbroad: null,
      education: 'École des Beaux-Arts',
    },
    contact: {
      website: 'https://willy.art',
      instagram: '@willynalbaut',
      xiaohongshu: null,
      wechat: null,
      email: 'willy@example.com',
      phone: '+33 6 00 00 00 00',
    },
    quoteParagraphs: [{ questionId: 1, answer: 'La Chine est une source d\'inspiration inépuisable.' }],
    galleries: [
      { name: 'Galerie Z', location: 'Paris, France', logoUrl: null, sortOrder: 0 },
    ],
  },
]

/**
 * GET /admin/artist/accounts/:id/profile — 读取艺术家档案（管理端）
 */
export function getAdminArtistProfileMock(accountId) {
  const profile = mockAdminProfiles.find((p) => p.id === Number(accountId))
  if (!profile) {
    return {
      id: Number(accountId),
      displayName: null, title: null, nationality: null, city: null, avatarUrl: null,
      personal: { firstName: null, lastName: null, nationality: null, birthYear: null, birthPlace: null, residence: null, studyAbroad: null, education: null },
      contact: { website: null, instagram: null, xiaohongshu: null, wechat: null, email: null, phone: null },
      quoteParagraphs: [],
      galleries: [],
    }
  }
  return profile
}

/**
 * PUT /admin/artist/accounts/:id/profile — 更新艺术家档案（管理端）
 */
export function updateAdminArtistProfileMock(accountId, data) {
  const idx = mockAdminProfiles.findIndex((p) => p.id === Number(accountId))
  if (idx === -1) {
    const newProfile = { id: Number(accountId), ...data }
    mockAdminProfiles.push(newProfile)
    return newProfile
  }
  Object.assign(mockAdminProfiles[idx], data)
  return mockAdminProfiles[idx]
}

// ==================== 艺术家资料文件（admin 管理端）====================

const mockAdminDocuments = [
  {
    id: 1, accountId: 1, category: 'portrait',
    fileName: 'portrait_main.jpg', fileSize: 1245184, mimeType: 'image/jpeg',
    url: '/uploads/portrait/1/portrait_main.jpg', sortOrder: 0,
    createTime: '2026-06-22 10:00:00',
  },
  {
    id: 2, accountId: 1, category: 'cv',
    fileName: 'CV_Willy_2026.pdf', fileSize: 524288, mimeType: 'application/pdf',
    url: '/uploads/cv/1/CV_Willy_2026.pdf', sortOrder: 0,
    createTime: '2026-06-22 10:00:00',
  },
  {
    id: 3, accountId: 1, category: 'portfolio',
    fileName: 'portfolio_2026.pdf', fileSize: 8388608, mimeType: 'application/pdf',
    url: '/uploads/portfolio/1/portfolio_2026.pdf', sortOrder: 0,
    createTime: '2026-06-22 10:00:00',
  },
]

/**
 * GET /admin/artist/accounts/:id/documents — 获取艺术家资料文件列表（管理端）
 */
export function getAdminArtistDocumentsMock(accountId, category) {
  let docs = mockAdminDocuments.filter((d) => d.accountId === Number(accountId))
  if (category) docs = docs.filter((d) => d.category === category)
  return docs
}

/**
 * DELETE /admin/artist/documents/:docId — 删除资料文件（管理端）
 */
export function deleteAdminArtistDocumentMock(docId) {
  const idx = mockAdminDocuments.findIndex((d) => d.id === Number(docId))
  if (idx !== -1) mockAdminDocuments.splice(idx, 1)
}
