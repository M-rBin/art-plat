/**
 * Mock 路由统一注册
 * VITE_USE_MOCK=true 时由 main.ts 动态导入
 */

import { mockRoute, extractId } from '@/utils/http/mockRegistry'

// ==================== 认证 ====================
import {
  mockLogin,
  mockGetUserMenuTree,
  mockLogout,
  mockGetPerms,
  mockRefreshToken,
  mockVerifyCaptcha,
  MOCK_USERS
} from './auth'

mockRoute('POST', '/admin/open/login', ({ data }) => mockLogin(data?.username, data?.password))
mockRoute('GET', '/admin/open/person', () => MOCK_USERS[0].userInfo)
mockRoute('GET', '/admin/open/permmenu', () => mockGetUserMenuTree())
mockRoute('POST', '/admin/open/logout', () => mockLogout())
mockRoute('GET', '/admin/open/perms', () => mockGetPerms())
mockRoute('POST', '/admin/open/refreshToken', ({ data }) => mockRefreshToken(data?.refreshToken))
// 注：图形验证码（/api/captcha/image）在 api/captcha.ts 内部直接走 mock，不经此注册表
mockRoute('GET', '/api/captcha/verify', () => mockVerifyCaptcha())

// ==================== 组织管理：已联调，mock 已移除，请求走真实接口 /admin/sys/* ====================
// 接口由 server /admin/sys/department|user|position 提供，Vite proxy 转发至 http://127.0.0.1:9001

// ==================== 艺术家管理：已联调，mock 已移除，请求走真实接口 /admin/artist/* ====================
// 接口由 server /admin/artist/* 提供，Vite proxy 转发至 http://127.0.0.1:9001

// ==================== 权限管理：已联调，mock 已移除，请求走真实接口 /admin/sys/* ====================
// 接口由 server /admin/sys/role|menu 提供，Vite proxy 转发至 http://127.0.0.1:9001
