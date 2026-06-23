import { request } from './request'
import type { ApiResponse } from './request'

export interface QuestionItem {
  id: number
  contentFr: string
  contentZh: string
}

/** GET /api/questions — 获取启用的问题列表（无需鉴权） */
export async function listQuestions(): Promise<ApiResponse<QuestionItem[]>> {
  return request<QuestionItem[]>('/api/questions')
}
