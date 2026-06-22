export interface NavItem {
  labelZh: string
  labelFr: string
  iconPath: string
  active: boolean
  badge?: string
}

export const profileNavItems: NavItem[] = [
  { labelZh: '我的档案', labelFr: 'Mon profil', active: true,
    iconPath: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { labelZh: '对话', labelFr: 'Dialogues', active: false,
    iconPath: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' },
  { labelZh: '展览', labelFr: 'Expositions', active: false,
    iconPath: 'M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z' },
  { labelZh: '臻藏推荐', labelFr: 'Recommandations', active: false,
    iconPath: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
  { labelZh: '搜索', labelFr: 'Recherche', active: false,
    iconPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
  { labelZh: '关于我们', labelFr: 'À propos', active: false,
    iconPath: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z' },
  { labelZh: '联系我们', labelFr: 'Contact', active: false,
    iconPath: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'pdf']
export const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'application/pdf']

export function isAllowedFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (ALLOWED_EXTENSIONS.includes(ext)) return true
  return ALLOWED_MIME_TYPES.includes(file.type)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getGalleryInitials(name: string): string {
  const words = name.split(/\s+/).filter((w) => /[A-Za-zÀ-ÿ]/.test(w[0] ?? ''))
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'G'
}

export type DocumentCategoryKey = 'portrait' | 'studio' | 'cv' | 'portfolio' | 'media'

export interface DocumentCategory {
  key: DocumentCategoryKey
  nameFr: string
  nameZh: string
}

export const documentCategories: DocumentCategory[] = [
  { key: 'portrait', nameFr: 'Photos portrait', nameZh: '肖像照片' },
  { key: 'studio', nameFr: 'Photos atelier', nameZh: '工作室照片' },
  { key: 'cv', nameFr: 'CV', nameZh: '个人简历' },
  { key: 'portfolio', nameFr: 'Portfolio', nameZh: '作品集' },
  { key: 'media', nameFr: 'Couverture média', nameZh: '媒体报道' },
]
