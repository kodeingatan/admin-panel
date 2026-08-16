import api from './api'
import type { UpdateProfile, ChangePassword } from '@/types/auth'

export const authService = {
  updateProfile(data: UpdateProfile) {
    return api.patch('/auth/profile', data)
  },
  changePassword(data: ChangePassword) {
    return api.patch('/auth/password', data)
  },
}
