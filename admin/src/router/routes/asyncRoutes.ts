// 权限文档：https://www.artd.pro/docs/zh/guide/in-depth/permission.html
import { AppRouteRecord } from '@/types/router'
import { routeModules } from '../modules'

/**
 * 动态路由（需要权限才能访问的路由）
 * 用于渲染菜单以及根据菜单权限动态加载路由，如果没有权限无法访问
 */
export const asyncRoutes: AppRouteRecord[] = routeModules

/**
 * 详情页固定路由
 * 从列表页跳转的二级详情页，不出现在菜单树，但所有权限模式下都必须注册。
 * 在 router/index.ts 中无论 frontend/backend/mock 模式均会 addRoute。
 */
export const detailRoutes: AppRouteRecord[] = [
  {
    path: '/artist/accounts/:id/profile',
    name: 'ArtistAccountProfile',
    component: () => import('@/views/artist/accounts/profile.vue'),
    meta: {
      title: 'menus.artist.profile',
      keepAlive: false,
      isHide: true,
    },
  },
  {
    path: '/artist/accounts/:id/documents',
    name: 'ArtistAccountDocuments',
    component: () => import('@/views/artist/accounts/documents.vue'),
    meta: {
      title: 'menus.artist.documents',
      keepAlive: false,
      isHide: true,
    },
  },
]
