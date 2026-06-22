export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

const REQUEST_TIMEOUT_MS = 10_000

function notifyIfUnauthorized<T>(data: ApiResponse<T>, notifyUnauthorized?: boolean) {
  if (data.code === 401 && notifyUnauthorized) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
  }
  return data
}

export async function request<T>(
  url: string,
  init?: RequestInit,
  options?: { notifyUnauthorized?: boolean },
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    let data: ApiResponse<T>

    if (!res.ok) {
      try {
        data = (await res.json()) as ApiResponse<T>
      } catch {
        return { code: res.status, data: null as unknown as T, message: `HTTP ${res.status}` }
      }
      return notifyIfUnauthorized(data, options?.notifyUnauthorized)
    }

    data = (await res.json()) as ApiResponse<T>
    return notifyIfUnauthorized(data, options?.notifyUnauthorized)
  } catch (err) {
    const message = err instanceof Error && err.name === 'AbortError'
      ? '请求超时，请稍后重试'
      : '网络异常，请检查网络连接'
    return { code: -1, data: null as unknown as T, message }
  } finally {
    clearTimeout(timeoutId)
  }
}

export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` }
}
