import { AppRouteRecord } from '@/types/router'

/**
 * 艺术家管理路由
 * 包含：问题库管理、艺术家账号列表（及档案/文件子页）
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
    {
      path: 'accounts/:id/profile',
      name: 'ArtistAccountProfile',
      component: () => import('@/views/artist/accounts/profile.vue'),
      meta: {
        title: 'menus.artist.profile',
        keepAlive: false,
        isHide: true,
      },
    },
    {
      path: 'accounts/:id/documents',
      name: 'ArtistAccountDocuments',
      component: () => import('@/views/artist/accounts/documents.vue'),
      meta: {
        title: 'menus.artist.documents',
        keepAlive: false,
        isHide: true,
      },
    },
  ],
}
