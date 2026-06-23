import { request, authHeaders } from './request'
import type { ApiResponse } from './request'

export type { ApiResponse }

export interface AuthUser {
  id: number
  name: string
  email: string
  avatar: string
  role: string
}

export interface LoginResult {
  token: string
  user: AuthUser
}

export interface RegisterResult {}

export async function login(email: string, password: string): Promise<ApiResponse<LoginResult | null>> {
  return request<LoginResult | null>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function register(email: string, password: string): Promise<ApiResponse<RegisterResult | null>> {
  return request<RegisterResult | null>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function verifyEmail(token: string): Promise<ApiResponse<null>> {
  return request<null>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
}

export async function logout(token: string): Promise<ApiResponse<null>> {
  return request<null>('/api/auth/logout', {
    method: 'POST',
    headers: authHeaders(token),
  })
}

export async function getMe(
  token: string,
  options?: { notifyUnauthorized?: boolean },
): Promise<ApiResponse<AuthUser | null>> {
  return request<AuthUser | null>(
    '/api/auth/me',
    { headers: authHeaders(token) },
    { notifyUnauthorized: options?.notifyUnauthorized ?? true },
  )
}
