import { AppRouteRecord } from '@/types/router'

/**
 * 权限管理路由
 * 包含：角色管理、菜单管理
 */
export const permissionTemplateRoutes: AppRouteRecord = {
  path: '/permission',
  name: 'Permission',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.permissionTemplate.title',
    icon: 'Lock',
    isFirstLevel: true
  },
  children: [
    {
      path: '',
      name: 'PermissionIndex',
      component: () => import('@/views/permission/role/index.vue'),
      meta: {
        title: 'menus.permissionTemplate.title',
        keepAlive: true,
        isHide: true
      }
    },
    {
      path: 'role',
      name: 'PermissionRole',
      component: () => import('@/views/permission/role/index.vue'),
      meta: {
        title: 'menus.permissionTemplate.role',
        keepAlive: true
      }
    },
    {
      path: 'menu',
      name: 'PermissionMenu',
      component: () => import('@/views/permission/menu/index.vue'),
      meta: {
        title: 'menus.permissionTemplate.menu',
        keepAlive: true
      }
    }
  ]
}
