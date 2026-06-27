import avatar1 from '@/assets/img/avatar/avatar1.webp'

/**
 * Mock 登录数据
 * 用于产品经理前端演示，无需后端 API
 */

// Mock 用户数据
export const MOCK_USERS = [
  {
    username: 'admin',
    password: '123456',
    userInfo: {
      id: 1,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2025-01-06 10:00:00',
      createBy: null,
      updateBy: null,
      username: 'admin',
      nickname: '超级管理员',
      email: '1144837984@qq.com',
      phone: '13800138000',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2025-01-06 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '系统超级管理员',
      departmentId: 1,
      department: {
        id: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: null,
        updateBy: null,
        departmentName: '总经办',
        departmentCode: 'CEO_OFFICE',
        parentId: null,
        type: 'company',
        companyId: 1,
        status: 1,
        sort: 1,
        managerId: 1,
        managerName: '超级管理员',
        phone: '13800138000',
        email: '1144837984@qq.com'
      },
      roles: [
        {
          id: 1,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: null,
          updateBy: null,
          name: '超级管理员',
          code: 'R_SUPER',
          description: '拥有系统全部权限',
          permissions: null,
          status: 1,
          sort: 1,
          isSystem: 1
        }
      ],
      buttons: ['user:add', 'user:edit', 'user:delete', 'role:add', 'role:edit', 'role:delete']
    }
  },
  {
    username: 'user',
    password: '123456',
    userInfo: {
      id: 2,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2025-01-06 10:00:00',
      createBy: 1,
      updateBy: null,
      username: 'user',
      nickname: '普通用户',
      email: 'user@example.com',
      phone: '13800138001',
      avatar: avatar1,
      status: 1,
      lastLoginTime: '2025-01-06 10:00:00',
      lastLoginIp: '127.0.0.1',
      remark: '普通用户账号',
      departmentId: 2,
      department: {
        id: 2,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00',
        createBy: 1,
        updateBy: null,
        departmentName: '产品部',
        departmentCode: 'PRODUCT',
        parentId: null,
        type: 'department',
        companyId: 1,
        status: 1,
        sort: 2,
        managerId: 2,
        managerName: '普通用户',
        phone: '13800138001',
        email: 'user@example.com'
      },
      roles: [
        {
          id: 3,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          createBy: 1,
          updateBy: null,
          name: '普通用户',
          code: 'R_USER',
          description: '拥有系统普通权限',
          permissions: null,
          status: 1,
          sort: 3,
          isSystem: 0
        }
      ],
      buttons: ['user:view']
    }
  }
]

/**
 * Mock 登录函数
 * @param username 用户名
 * @param password 密码
 * @returns 登录响应数据
 */
export function mockLogin(username: string, password: string) {
  const user = MOCK_USERS.find((u) => u.username === username && u.password === password)

  if (!user) {
    throw new Error('用户名或密码错误')
  }

  const token = `mock_token_${username}_${Date.now()}`
  const refreshToken = `mock_refresh_token_${username}_${Date.now()}`

  return {
    token,
    refreshToken,
    expire: 7200
  }
}

/**
 * Mock 获取用户信息
 * @param token Token
 * @returns 用户信息
 */
export function mockGetUserInfo(token: string) {
  // 从 token 中提取用户名
  const match = token.match(/mock_token_(\w+)_/)
  if (!match) {
    return null
  }

  const username = match[1]
  const user = MOCK_USERS.find((u) => u.username === username)

  return user ? user.userInfo : null
}

/**
 * Mock 菜单树数据（frontend 权限模式下的动态路由来源）
 * 结构与后端 MenuService.getUserMenuTree 返回格式保持一致：
 * - 目录(type=0)：component='/index/index'，path 为完整路由前缀
 * - 菜单(type=1)：component 为路由路径，path 为末段片段（由 menuDataToRouter 拼接还原完整路径）
 */
export const MOCK_MENU_TREE = [
  {
    id: 1,
    name: 'Organization',
    path: '/organization',
    component: '/index/index',
    meta: {
      title: '组织管理',
      icon: 'OfficeBuilding',
      keepAlive: false,
      isHide: false
    },
    children: [
      {
        id: 2,
        name: 'OrganizationDepartment',
        path: 'department',
        component: '/organization/department',
        meta: {
          title: '部门管理',
          icon: 'Share',
          keepAlive: true,
          isHide: false
        }
      },
      {
        id: 3,
        name: 'OrganizationUser',
        path: 'user',
        component: '/organization/user',
        meta: {
          title: '人员管理',
          icon: 'User',
          keepAlive: true,
          isHide: false
        }
      },
      {
        id: 4,
        name: 'OrganizationPosition',
        path: 'position',
        component: '/organization/position',
        meta: {
          title: '岗位管理',
          icon: 'Postcard',
          keepAlive: true,
          isHide: false
        }
      }
    ]
  },
  {
    id: 5,
    name: 'Permission',
    path: '/permission',
    component: '/index/index',
    meta: {
      title: '权限管理',
      icon: 'Lock',
      keepAlive: false,
      isHide: false
    },
    children: [
      {
        id: 6,
        name: 'PermissionRole',
        path: 'role',
        component: '/permission/role',
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          keepAlive: true,
          isHide: false
        }
      },
      {
        id: 7,
        name: 'PermissionMenu',
        path: 'menu',
        component: '/permission/menu',
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          keepAlive: true,
          isHide: false
        }
      }
    ]
  },
  {
    id: 10,
    name: 'Artist',
    path: '/artist',
    component: '/index/index',
    meta: {
      title: '艺术家管理',
      icon: 'User',
      keepAlive: false,
      isHide: false
    },
    children: [
      {
        id: 11,
        name: 'ArtistQuestions',
        path: 'questions',
        component: '/artist/questions',
        meta: {
          title: '问题库管理',
          icon: 'QuestionFilled',
          keepAlive: true,
          isHide: false
        }
      },
      {
        id: 12,
        name: 'ArtistAccounts',
        path: 'accounts',
        component: '/artist/accounts',
        meta: {
          title: '艺术家账号',
          icon: 'Avatar',
          keepAlive: true,
          isHide: false
        }
      }
    ]
  }
]

/**
 * Mock 获取用户菜单树
 * @returns 菜单树数据
 */
export function mockGetUserMenuTree() {
  return MOCK_MENU_TREE
}

/**
 * Mock 获取验证码
 * @returns 验证码数据
 */
export function mockGetCaptcha() {
  // 生成一个简单的 Mock 验证码 ID
  const captchaId = `mock_captcha_${Date.now()}`

  // 返回一个简单的 Base64 图片（1x1 透明像素）
  // 在 Mock 模式下，验证码不做实际验证
  const captchaImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Nb2NrIOmqjOivgTwvdGV4dD48L3N2Zz4='

  return {
    captchaId,
    captchaImage
  }
}

/**
 * Mock 退出登录
 * @returns 退出结果（拦截层会包装为 { code: 200, data, message }）
 */
export function mockLogout() {
  return { success: true }
}

/**
 * Mock 获取权限标识列表
 * @returns 当前用户的按钮权限标识数组
 */
export function mockGetPerms() {
  // 演示环境固定返回超级管理员的权限标识
  return MOCK_USERS[0].userInfo.buttons || []
}

/**
 * Mock 刷新 token
 * @param refreshToken 刷新令牌
 * @returns 新的 token 与有效期
 */
export function mockRefreshToken(refreshToken?: string) {
  return {
    token: `mock_token_admin_${Date.now()}`,
    expire: 7200
  }
}

/**
 * Mock 校验验证码
 * @returns 校验结果（演示环境恒为通过）
 */
export function mockVerifyCaptcha() {
  return { valid: true }
}
