import api from '@/services/api'
import type { PaginatedResponse } from '@/types/api'
import type { User, CreateUser, UpdateUser, QueryUser } from '@/types/user'

export const usersService = {
  getAll(query?: QueryUser) {
    return api.get<PaginatedResponse<User>>('/users', { params: query })
  },

  getById(id: number) {
    return api.get<User>(`/users/${id}`)
  },

  create(data: CreateUser) {
    return api.post<User>('/users', data)
  },

  update(id: number, data: UpdateUser) {
    return api.put<User>(`/users/${id}`, data)
  },

  delete(id: number) {
    return api.delete(`/users/${id}`)
  },
}
