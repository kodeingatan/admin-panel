import api from '@/services/api'
import type { PaginatedResponse } from '@/types/api'
import type { Permission, CreatePermission, UpdatePermission, QueryPermission } from '@/types/permission'

export const permissionsService = {
  getAll(query?: QueryPermission) {
    return api.get<PaginatedResponse<Permission>>('/permissions', { params: query })
  },

  getById(id: number) {
    return api.get<Permission>(`/permissions/${id}`)
  },

  create(data: CreatePermission) {
    return api.post<Permission>('/permissions', data)
  },

  update(id: number, data: UpdatePermission) {
    return api.put<Permission>(`/permissions/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/permissions/${id}`)
  },
}
