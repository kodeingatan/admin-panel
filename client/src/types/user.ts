import type { Role } from '@/types/role'

export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  roles: Role[]
  createdAt: string
  updatedAt: string
}

export interface CreateUser {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  roleIds?: number[]
}

export interface UpdateUser {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
  roleIds?: number[]
}

export interface QueryUser {
  page?: number
  limit?: number
  search?: string
}
