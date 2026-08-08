import api from '@/services/api'
import type { PaginatedResponse } from '@/types/api'
import type { Role, CreateRole, UpdateRole, QueryRole } from '@/types/role'

export const rolesService = {
  getAll(query?: QueryRole) {
    return api.get<PaginatedResponse<Role>>('/roles', { params: query })
  },

  getById(id: number) {
    return api.get<Role>(`/roles/${id}`)
  },

  create(data: CreateRole) {
    return api.post<Role>('/roles', data)
  },

  update(id: number, data: UpdateRole) {
    return api.put<Role>(`/roles/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/roles/${id}`)
  },
}
