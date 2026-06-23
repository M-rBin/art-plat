import { request, authHeaders } from './request'
import type { ApiResponse } from './request'

export interface GalleryItem {
  id?: number
  name: string | null
  location: string | null
  logoUrl: string | null
  sortOrder?: number
}

export interface ProfileData {
  id: number
  displayName: string | null
  title: string | null
  nationality: string | null
  city: string | null
  avatarUrl: string | null
  personal: {
    firstName: string | null
    lastName: string | null
    nationality: string | null
    birthYear: string | null
    birthPlace: string | null
    residence: string | null
    studyAbroad: string | null
    education: string | null
  }
  contact: {
    website: string | null
    instagram: string | null
    xiaohongshu: string | null
    wechat: string | null
    email: string | null
    phone: string | null
  }
  quoteParagraphs: Array<{ questionId: number; answer: string }> | null
  galleries: GalleryItem[]
}

export async function getProfile(token: string): Promise<ApiResponse<ProfileData | null>> {
  return request<ProfileData | null>('/api/profile', {
    headers: authHeaders(token),
  })
}

export async function updateProfile(token: string, data: Partial<ProfileData>): Promise<ApiResponse<ProfileData | null>> {
  return request<ProfileData | null>('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(data),
  })
}

export async function uploadAvatar(token: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
  const formData = new FormData()
  formData.append('file', file)
  return request<{ avatarUrl: string }>('/api/profile/avatar', {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  })
}
