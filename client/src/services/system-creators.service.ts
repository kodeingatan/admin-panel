import api from '@/services/api'
import type { PaginatedResponse } from '@/types/api'
import type { ScModule, CreateScModule, UpdateScModule, QueryScModule } from '@/types/system-creator'

export const systemCreatorsService = {
  getRegistry(query?: QueryScModule) {
    return api.get<PaginatedResponse<ScModule>>('/system-creators/registry', { params: query })
  },

  getById(id: number) {
    return api.get<ScModule>(`/system-creators/registry/${id}`)
  },

  getByName(name: string) {
    return api.get<ScModule>(`/system-creators/registry/by-name/${name}`)
  },

  generate(data: CreateScModule) {
    return api.post<ScModule>('/system-creators/generate', data)
  },

  update(id: number, data: UpdateScModule) {
    return api.put<ScModule>(`/system-creators/${id}`, data)
  },

  remove(id: number) {
    return api.delete(`/system-creators/${id}`)
  },

  toggleActive(id: number) {
    return api.post<ScModule>(`/system-creators/${id}/toggle`)
  },
}
