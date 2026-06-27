import { AppRouteRecord } from '@/types/router'

/**
 * 艺术家管理路由
 * 包含：问题库管理、艺术家账号列表
 * 注：档案/文件详情页（accounts/:id/profile、accounts/:id/documents）为独立顶层路由，
 * 定义在 router/routes/asyncRoutes.ts 的 detailRoutes，所有权限模式下均静态注册。
 */
export const artistRoutes: AppRouteRecord = {
  path: '/artist',
  name: 'Artist',
  component: () => import('@/views/index/index.vue'),
  meta: {
    title: 'menus.artist.title',
    icon: 'User',
    isFirstLevel: true,
  },
  children: [
    {
      path: '',
      name: 'ArtistIndex',
      component: () => import('@/views/artist/questions/index.vue'),
      meta: {
        title: 'menus.artist.title',
        keepAlive: true,
        isHide: true,
      },
    },
    {
      path: 'questions',
      name: 'ArtistQuestions',
      component: () => import('@/views/artist/questions/index.vue'),
      meta: {
        title: 'menus.artist.questions',
        keepAlive: true,
      },
    },
    {
      path: 'accounts',
      name: 'ArtistAccounts',
      component: () => import('@/views/artist/accounts/index.vue'),
      meta: {
        title: 'menus.artist.accounts',
        keepAlive: true,
      },
    },
  ],
}
