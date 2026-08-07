const API_BASE = 'http://localhost:3000/api'

interface FetchOptions {
  method?: string
  body?: any
  token?: string
}

export async function useApi<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || 'Request failed')
  }

  return json
}
