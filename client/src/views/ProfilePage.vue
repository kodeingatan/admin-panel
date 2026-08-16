<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NCard,
  NInput,
  NButton,
  NIcon,
  NAlert,
  NSpace,
  useMessage,
} from 'naive-ui'
import { Save, UserAvatar } from '@vicons/carbon'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import FormField from '@/components/common/FormField/FormField.vue'
import { useAuthStore } from '@/stores/auth.store'

const message = useMessage()
const authStore = useAuthStore()

const profileForm = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const profileError = ref('')
const passwordError = ref('')
const savingProfile = ref(false)
const savingPassword = ref(false)

onMounted(async () => {
  await authStore.fetchProfile()
  if (authStore.user) {
    profileForm.value.firstName = authStore.user.firstName
    profileForm.value.lastName = authStore.user.lastName
    profileForm.value.username = authStore.user.username
    profileForm.value.email = authStore.user.email
  }
})

async function handleSaveProfile() {
  profileError.value = ''
  savingProfile.value = true
  try {
    await authStore.updateProfile(profileForm.value)
    message.success('Profile updated successfully')
  } catch (e: any) {
    profileError.value = e.response?.data?.message || e.message || 'Failed to update profile'
  } finally {
    savingProfile.value = false
  }
}

async function handleChangePassword() {
  passwordError.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
    return
  }

  savingPassword.value = true
  try {
    await authStore.changePassword(passwordForm.value)
    message.success('Password changed successfully')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e: any) {
    passwordError.value = e.response?.data?.message || e.message || 'Failed to change password'
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <div class="max-w-2xl">
      <NCard title="Profile Information" class="mb-4">
        <NAlert v-if="profileError" type="error" class="mb-4">
          {{ profileError }}
        </NAlert>

        <form @submit.prevent="handleSaveProfile">
          <div class="grid grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <NInput v-model:value="profileForm.firstName" placeholder="First name" />
            </FormField>
            <FormField label="Last Name" required>
              <NInput v-model:value="profileForm.lastName" placeholder="Last name" />
            </FormField>
          </div>

          <FormField label="Username" required>
            <NInput v-model:value="profileForm.username" placeholder="Username" />
          </FormField>

          <FormField label="Email" required>
            <NInput v-model:value="profileForm.email" placeholder="Email" />
          </FormField>

          <NSpace justify="end" class="mt-4">
            <NButton
              type="primary"
              :loading="savingProfile"
              attr-type="submit"
            >
              <template #icon>
                <NIcon><Save /></NIcon>
              </template>
              Save Changes
            </NButton>
          </NSpace>
        </form>
      </NCard>

      <NCard title="Change Password">
        <NAlert v-if="passwordError" type="error" class="mb-4">
          {{ passwordError }}
        </NAlert>

        <form @submit.prevent="handleChangePassword">
          <FormField label="Current Password" required>
            <NInput
              v-model:value="passwordForm.currentPassword"
              type="password"
              show-password-on="click"
              placeholder="Enter current password"
            />
          </FormField>

          <FormField label="New Password" required>
            <NInput
              v-model:value="passwordForm.newPassword"
              type="password"
              show-password-on="click"
              placeholder="Min 8 characters"
            />
          </FormField>

          <FormField label="Confirm New Password" required>
            <NInput
              v-model:value="passwordForm.confirmPassword"
              type="password"
              show-password-on="click"
              placeholder="Confirm new password"
            />
          </FormField>

          <NSpace justify="end" class="mt-4">
            <NButton
              type="warning"
              :loading="savingPassword"
              attr-type="submit"
            >
              <template #icon>
                <NIcon><UserAvatar /></NIcon>
              </template>
              Change Password
            </NButton>
          </NSpace>
        </form>
      </NCard>
    </div>
  </AppLayout>
</template>
