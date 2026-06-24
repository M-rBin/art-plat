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

// ==================== 组织管理：部门 / 用户 / 岗位 ====================
import {
  getDepartmentTreeMock,
  getDepartmentListMock,
  addDepartmentMock,
  updateDepartmentMock,
  updateDepartmentStatusMock,
  deleteDepartmentMock,
  getUserListMock,
  getUserDetailMock,
  addUserMock,
  updateUserMock,
  deleteUserMock,
  batchDeleteUsersMock,
  updateUserStatusMock,
  moveUserMock
} from './organization'

import {
  getPositionListMock,
  addPositionMock,
  updatePositionMock,
  deletePositionMock
} from './position'

// 部门
mockRoute('GET', '/admin/sys/department/tree', ({ params }) => getDepartmentTreeMock(params))
mockRoute('GET', '/admin/sys/department/list', ({ params }) => getDepartmentListMock(params))
mockRoute('POST', '/admin/sys/department/add', ({ data }) => addDepartmentMock(data))
mockRoute('PUT', '/admin/sys/department/update', ({ data }) => updateDepartmentMock(data.id, data))
mockRoute('PUT', '/admin/sys/department/update-status', ({ data }) => updateDepartmentStatusMock(data.id, data.status))
mockRoute('DELETE', '/admin/sys/department/delete/:id', ({ url }) => {
  deleteDepartmentMock(extractId(url))
  return {}
})

// 用户
mockRoute('GET', '/admin/sys/user/list', ({ params }) => getUserListMock(params))
mockRoute('GET', '/admin/sys/user/detail/:id', ({ url }) => getUserDetailMock(extractId(url)))
mockRoute('POST', '/admin/sys/user/add', ({ data }) => addUserMock(data))
mockRoute('PUT', '/admin/sys/user/update', ({ data }) => updateUserMock(data.id, data))
mockRoute('PUT', '/admin/sys/user/update-status', ({ data }) => updateUserStatusMock(data.id, data.status))
mockRoute('POST', '/admin/sys/user/batch-delete', ({ data }) => batchDeleteUsersMock(data?.ids))
mockRoute('POST', '/admin/sys/user/move', ({ data }) => moveUserMock(data.userId, data.departmentId))
mockRoute('DELETE', '/admin/sys/user/delete/:id', ({ url }) => {
  deleteUserMock(extractId(url))
  return {}
})

// 岗位
mockRoute('GET', '/admin/sys/position/list', ({ params }) => getPositionListMock(params))
mockRoute('POST', '/admin/sys/position/add', ({ data }) => addPositionMock(data))
mockRoute('PUT', '/admin/sys/position/update', ({ data }) => updatePositionMock(data.id, data))
mockRoute('DELETE', '/admin/sys/position/delete/:id', ({ url }) => {
  deletePositionMock(extractId(url))
  return {}
})

// ==================== 艺术家管理：问题库 / 艺术家账号 ====================
import {
  getQuestionListMock,
  addQuestionMock,
  updateQuestionMock,
  updateQuestionStatusMock,
  deleteQuestionMock,
  getArtistAccountListMock,
  updateArtistAccountStatusMock,
  resetArtistPasswordMock,
  getAdminArtistProfileMock,
  updateAdminArtistProfileMock,
  getAdminArtistDocumentsMock,
  deleteAdminArtistDocumentMock,
} from './artist'

// 问题库
mockRoute('GET', '/admin/artist/questions', ({ params }) => getQuestionListMock(params))
mockRoute('POST', '/admin/artist/questions', ({ data }) => addQuestionMock(data))
mockRoute('PUT', '/admin/artist/questions/:id', ({ url, data }) => updateQuestionMock(extractId(url), data))
mockRoute('PUT', '/admin/artist/questions/:id/status', ({ url, data }) => {
  const parts = url.split('/')
  const id = Number(parts[parts.length - 2])
  return updateQuestionStatusMock(id, data?.status)
})
mockRoute('DELETE', '/admin/artist/questions/:id', ({ url }) => {
  deleteQuestionMock(extractId(url))
  return {}
})

// 艺术家账号
mockRoute('GET', '/admin/artist/accounts', ({ params }) => getArtistAccountListMock(params))
mockRoute('PUT', '/admin/artist/accounts/:id/status', ({ url, data }) => {
  const parts = url.split('/')
  const id = Number(parts[parts.length - 2])
  return updateArtistAccountStatusMock(id, data?.status)
})
mockRoute('POST', '/admin/artist/accounts/:id/reset-password', ({ url }) => {
  const parts = url.split('/')
  const id = Number(parts[parts.length - 2])
  return resetArtistPasswordMock(id)
})

// 艺术家档案（管理端）
mockRoute('GET', '/admin/artist/accounts/:id/profile', ({ url }) => {
  const parts = url.split('/')
  const id = Number(parts[parts.length - 2])
  return getAdminArtistProfileMock(id)
})
mockRoute('PUT', '/admin/artist/accounts/:id/profile', ({ url, data }) => {
  const parts = url.split('/')
  const id = Number(parts[parts.length - 2])
  return updateAdminArtistProfileMock(id, data)
})

// 艺术家文件（管理端）
mockRoute('GET', '/admin/artist/accounts/:id/documents', ({ url, params }) => {
  const parts = url.split('?')[0].split('/')
  const id = Number(parts[parts.length - 2])
  return getAdminArtistDocumentsMock(id, params?.category)
})
mockRoute('DELETE', '/admin/artist/documents/:id', ({ url }) => {
  deleteAdminArtistDocumentMock(extractId(url))
  return {}
})

// ==================== 权限管理：角色 / 菜单 ====================
import {
  getRoleListMock,
  getRoleDetailMock,
  addRoleMock,
  updateRoleMock,
  deleteRoleMock,
  batchDeleteRolesMock,
  updateRoleStatusMock,
  getRoleMenusMock,
  setRoleMenusMock,
  getMenuTreeMock,
  getMenuListMock,
  addMenuMock,
  updateMenuMock,
  deleteMenuMock,
  updateMenuStatusMock
} from './permission'

// 角色
mockRoute('GET', '/admin/sys/role/list', ({ params }) => getRoleListMock(params))
mockRoute('GET', '/admin/sys/role/detail/:id', ({ url }) => getRoleDetailMock(extractId(url)))
mockRoute('POST', '/admin/sys/role/add', ({ data }) => addRoleMock(data))
mockRoute('PUT', '/admin/sys/role/update', ({ data }) => updateRoleMock(data.id, data))
mockRoute('PUT', '/admin/sys/role/update-status', ({ data }) => updateRoleStatusMock(data.id, data.status))
mockRoute('POST', '/admin/sys/role/batch-delete', ({ data }) => batchDeleteRolesMock(data?.ids))
mockRoute('GET', '/admin/sys/role/getMenus/:id', ({ url }) => getRoleMenusMock(extractId(url)))
mockRoute('POST', '/admin/sys/role/setMenus', ({ data }) => setRoleMenusMock(data.roleId, data.menuIds))
mockRoute('DELETE', '/admin/sys/role/delete/:id', ({ url }) => {
  deleteRoleMock(extractId(url))
  return {}
})

// 菜单
mockRoute('GET', '/admin/sys/menu/tree', () => getMenuTreeMock())
mockRoute('GET', '/admin/sys/menu/list', () => getMenuListMock())
mockRoute('POST', '/admin/sys/menu/add', ({ data }) => addMenuMock(data))
mockRoute('PUT', '/admin/sys/menu/update', ({ data }) => updateMenuMock(data.id, data))
mockRoute('PUT', '/admin/sys/menu/update-status', ({ data }) => updateMenuStatusMock(data.id, data.status))
mockRoute('DELETE', '/admin/sys/menu/delete/:id', ({ url }) => {
  deleteMenuMock(extractId(url))
  return {}
})

