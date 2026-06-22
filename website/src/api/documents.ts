import { request, authHeaders } from './request'
import type { ApiResponse } from './request'

export interface DocumentItem {
  id: number
  category: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  sortOrder?: number
  createTime?: string
}

export async function listDocuments(
  token: string,
  profileId: number,
  category?: string,
): Promise<ApiResponse<DocumentItem[]>> {
  const params = new URLSearchParams({ profileId: String(profileId) })
  if (category) params.set('category', category)
  return request<DocumentItem[]>(`/api/documents?${params.toString()}`, {
    headers: authHeaders(token),
  })
}

export async function uploadDocument(
  token: string,
  profileId: number,
  category: string,
  file: File,
): Promise<ApiResponse<DocumentItem>> {
  const formData = new FormData()
  formData.append('file', file)

  const params = new URLSearchParams({
    profileId: String(profileId),
    category,
  })

  return request<DocumentItem>(`/api/documents?${params.toString()}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  })
}

export async function deleteDocument(token: string, docId: number): Promise<ApiResponse<null>> {
  return request<null>(`/api/documents/${docId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}
