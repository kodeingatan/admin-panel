import api from '@/services/api'
import type { PaginatedResponse } from '@/types/api'
import type { Guard, CreateGuard, UpdateGuard, QueryGuard } from '@/types/guard'

export const guardsService = {
  getAll(query?: QueryGuard) {
    return api.get<PaginatedResponse<Guard>>('/guards', { params: query })
  },

  getById(id: number) {
    return api.get<Guard>(`/guards/${id}`)
  },

  create(data: CreateGuard) {
    return api.post<Guard>('/guards', data)
  },

  update(id: number, data: UpdateGuard) {
    return api.put<Guard>(`/guards/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/guards/${id}`)
  },
}
