// 全局 mock 开关 — 联调阶段关闭，走真实后端接口
export const MOCK_ENABLED = false

interface MockUser {
  id: number
  email: string
  password: string
  name: string
  avatar: string
  role: string
  verified: boolean
}

interface PendingUser {
  email: string
  password: string
  token: string
  expiresAt: number
}

const users: MockUser[] = [
  // TODO: 后端实现时必须使用 bcrypt 哈希存储密码，禁止明文
  {
    id: 1,
    email: 'demo@zhen.art',
    password: 'Zhen1234',
    name: 'Demo User',
    avatar: '',
    role: 'artist',
    verified: true,
  },
]

interface MockDocument {
  id: number
  category: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
}

interface MockProfile {
  id: number
  userId: number
  displayName: string | null
  title: string | null
  nationality: string | null
  city: string | null
  avatarUrl: string | null
  personal: Record<string, string | null>
  contact: Record<string, string | null>
  quoteParagraphs: null
  galleries: Array<{ name: string | null; location: string | null; logoUrl: string | null }>
}

const mockProfiles: MockProfile[] = [
  {
    id: 1, userId: 1, displayName: 'Demo User', title: 'Artiste peintre',
    nationality: 'Française', city: 'Paris',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    personal: { firstName: null, lastName: null, nationality: null, birthYear: null, birthPlace: null, residence: null, studyAbroad: null, education: null },
    contact: { website: null, instagram: null, xiaohongshu: null, wechat: null, email: 'demo@zhen.art', phone: null },
    quoteParagraphs: null, galleries: [],
  },
]

const mockDocuments: MockDocument[] = []
let nextDocId = 1

const pendingUsers = new Map<string, PendingUser>()
let nextUserId = 2

function createResponse(data: unknown, code = 0, message = 'success') {
  return { code, data, message }
}

function parseUrl(input: RequestInfo | URL): { pathname: string; searchParams: URLSearchParams } {
  const raw = typeof input === 'string'
    ? input
    : input instanceof URL
      ? input.href
      : (input as Request).url

  const url = raw.startsWith('http') ? new URL(raw) : new URL(raw, window.location.origin)
  return { pathname: url.pathname, searchParams: url.searchParams }
}

function generateToken() {
  return `mock-verify-token-${crypto.randomUUID()}`
}

function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

function findPendingByEmail(email: string) {
  const normalized = email.toLowerCase()
  for (const pending of pendingUsers.values()) {
    if (pending.email.toLowerCase() === normalized) {
      return pending
    }
  }
  return undefined
}

function purgeExpiredPendingUsers() {
  const now = Date.now()
  for (const [token, pending] of pendingUsers) {
    if (now > pending.expiresAt) {
      pendingUsers.delete(token)
    }
  }
}

function extractBearerToken(init?: RequestInit): string {
  const headers = init?.headers
  if (!headers) return ''

  let authValue = ''
  if (headers instanceof Headers) {
    authValue = headers.get('Authorization') ?? ''
  } else if (Array.isArray(headers)) {
    const entry = headers.find(([key]) => key.toLowerCase() === 'authorization')
    authValue = entry?.[1] ?? ''
  } else {
    authValue = String((headers as Record<string, string>).Authorization ?? '')
  }

  return authValue.replace(/^Bearer\s+/i, '')
}

if (MOCK_ENABLED) {
  const mockRoutes: Record<string, Record<string, (body?: unknown, searchParams?: URLSearchParams, init?: RequestInit) => unknown>> = {
    POST: {
      '/api/auth/register': (body: unknown) => {
        const { email, password } = body as { email: string; password: string }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return createResponse(null, 400, '请输入有效的邮箱地址')
        }

        if (!password || password.length < 8) {
          return createResponse(null, 400, '密码至少需要 8 位')
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
          return createResponse(null, 400, '密码需至少 8 位，且包含字母和数字')
        }

        const existing = findUserByEmail(email)
        if (existing) {
          return createResponse(null, 409, '该邮箱已注册，请直接登录')
        }

        purgeExpiredPendingUsers()
        if (findPendingByEmail(email)) {
          return createResponse(null, 409, '该邮箱已提交注册，请查收确认邮件')
        }

        const token = generateToken()
        pendingUsers.set(token, {
          email,
          password,
          token,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })

        const verifyUrl = `${window.location.origin}/verify-email?token=${encodeURIComponent(token)}`

        return createResponse({ verifyUrl }, 0, '注册成功，请查收确认邮件')
      },

      '/api/auth/login': (body: unknown) => {
        const { email, password } = body as { email: string; password: string }

        if (!email || !password) {
          return createResponse(null, 400, '请输入邮箱和密码')
        }

        const user = findUserByEmail(email)
        if (!user) {
          return createResponse(null, 401, '邮箱或密码错误')
        }

        if (!user.verified) {
          return createResponse(null, 401, '邮箱或密码错误')
        }

        if (user.password !== password) {
          return createResponse(null, 401, '邮箱或密码错误')
        }

        // MOCK ONLY: 真实后端须使用不可预测的加密签名 token，禁止编码明文 user id
        return createResponse(
          {
            token: `mock-token-${user.id}-${Date.now()}`,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role,
            },
          },
          0,
          '登录成功',
        )
      },

      '/api/auth/logout': () => createResponse(null, 0, '已退出登录'),

      '/api/documents': (_body, searchParams, init) => {
        const token = extractBearerToken(init)
        if (!token.startsWith('mock-token-')) return createResponse(null, 401, '未登录')
        const profileId = Number(searchParams?.get('profileId'))
        const category = searchParams?.get('category') || ''
        if (!profileId || !category) return createResponse(null, 400, '缺少参数')

        const formData = init?.body
        if (!(formData instanceof FormData)) return createResponse(null, 400, '无效的上传数据')
        const file = formData.get('file') as File | null
        if (!file) return createResponse(null, 400, '未选择文件')

        const doc: MockDocument = {
          id: nextDocId++,
          category,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          url: URL.createObjectURL(file),
        }
        mockDocuments.push(doc)
        return createResponse(doc)
      },
    },

    PUT: {
      '/api/profile': (body, _searchParams, init) => {
        const token = extractBearerToken(init)
        const match = token.match(/^mock-token-(\d+)-/)
        if (!match) return createResponse(null, 401, '未登录')
        const userId = Number(match[1])
        const profile = mockProfiles.find((p) => p.userId === userId)
        if (!profile) return createResponse(null, 404, '档案不存在')

        const updates = body as Partial<MockProfile>
        if (updates.displayName !== undefined) profile.displayName = updates.displayName
        if (updates.title !== undefined) profile.title = updates.title
        if (updates.nationality !== undefined) profile.nationality = updates.nationality
        if (updates.city !== undefined) profile.city = updates.city
        if (updates.avatarUrl !== undefined) profile.avatarUrl = updates.avatarUrl
        if (updates.personal) Object.assign(profile.personal, updates.personal)
        if (updates.contact) Object.assign(profile.contact, updates.contact)
        if (updates.galleries) profile.galleries = updates.galleries
        return createResponse(profile)
      },
    },

    GET: {
      '/api/auth/verify-email': (_body, searchParams) => {
        const token = searchParams?.get('token') ?? ''

        if (!token) {
          return createResponse(null, 400, '确认链接无效')
        }

        const pending = pendingUsers.get(token)
        if (!pending) {
          return createResponse(null, 404, '确认链接无效或已过期')
        }

        if (Date.now() > pending.expiresAt) {
          pendingUsers.delete(token)
          return createResponse(null, 410, '确认链接已过期，请重新注册')
        }

        if (findUserByEmail(pending.email)) {
          pendingUsers.delete(token)
          return createResponse(null, 409, '该邮箱已完成确认，请直接登录')
        }

        users.push({
          id: nextUserId++,
          email: pending.email,
          password: pending.password,
          name: pending.email.split('@')[0] ?? 'User',
          avatar: '',
          role: 'artist',
          verified: true,
        })

        pendingUsers.delete(token)
        return createResponse(null, 0, '邮箱确认成功，现在可以登录了')
      },

      '/api/auth/me': (_body, _searchParams, init) => {
        const token = extractBearerToken(init)
        const match = token.match(/^mock-token-(\d+)-/)
        if (!match) {
          return createResponse(null, 401, '未登录或 token 无效')
        }

        const user = users.find((item) => item.id === Number(match[1]))
        if (!user) {
          return createResponse(null, 401, '未登录或 token 无效')
        }

        return createResponse({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        })
      },

      '/api/profile': (_body, _searchParams, init) => {
        const token = extractBearerToken(init)
        const match = token.match(/^mock-token-(\d+)-/)
        if (!match) return createResponse(null, 401, '未登录')
        const userId = Number(match[1])
        let profile = mockProfiles.find((p) => p.userId === userId)
        if (!profile) {
          const user = users.find((u) => u.id === userId)
          profile = {
            id: mockProfiles.length + 1, userId,
            displayName: user?.name || 'User',
            title: null, nationality: null, city: null,
            avatarUrl: user?.avatar || null,
            personal: { firstName: null, lastName: null, nationality: null, birthYear: null, birthPlace: null, residence: null, studyAbroad: null, education: null },
            contact: { website: null, instagram: null, xiaohongshu: null, wechat: null, email: user?.email || null, phone: null },
            quoteParagraphs: null, galleries: [],
          }
          mockProfiles.push(profile)
        }
        return createResponse(profile)
      },

      '/api/documents': (_body, searchParams, init) => {
        const token = extractBearerToken(init)
        if (!token.startsWith('mock-token-')) return createResponse(null, 401, '未登录')
        const profileId = Number(searchParams?.get('profileId'))
        if (!profileId) return createResponse([], 0)
        const category = searchParams?.get('category')
        const docs = mockDocuments.filter((d) =>
          category ? d.category === category : true
        )
        return createResponse(docs)
      },
    },
  }

  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const { pathname, searchParams } = parseUrl(input)
    const method = (init?.method || 'GET').toUpperCase()
    const handler = mockRoutes[method]?.[pathname]

    if (handler) {
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 200))
      let body: unknown
      if (init?.body) {
        try {
          body = JSON.parse(init.body as string)
        } catch {
          body = init.body
        }
      }
      const data = handler(body, searchParams, init)
      const businessCode = typeof data === 'object' && data !== null && 'code' in data
        ? Number((data as { code: number }).code)
        : 0
      const httpStatus = businessCode >= 400 && businessCode < 600 ? businessCode : 200

      return new Response(JSON.stringify(data), {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (method === 'DELETE' && pathname.startsWith('/api/documents/')) {
      const token = extractBearerToken(init)
      if (!token.startsWith('mock-token-')) {
        return new Response(JSON.stringify(createResponse(null, 401, '未登录')), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 100))
      const docId = Number(pathname.split('/').pop())
      const idx = mockDocuments.findIndex((d) => d.id === docId)
      if (idx !== -1) {
        URL.revokeObjectURL(mockDocuments[idx].url)
        mockDocuments.splice(idx, 1)
      }
      const data = createResponse(null)
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return originalFetch(input, init)
  }
}
