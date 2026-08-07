import type { User } from './user'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}
