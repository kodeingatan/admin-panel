<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, NAlert, NIcon } from 'naive-ui'
import { Login } from '@vicons/carbon'
import AuthForm from '@/components/common/AuthForm/AuthForm.vue'
import FormField from '@/components/common/FormField/FormField.vue'
import { useAuthStore } from '@/stores/auth.store'
import { getErrorMessage } from '@/utils/error'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''

  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (e: any) {
    error.value = getErrorMessage(e, 'Login gagal')
  }
}
</script>

<template>
  <AuthForm title="Welcome Back" subtitle="Sign in to your account">
    <NAlert v-if="error" type="error" class="mb-4">
      {{ error }}
    </NAlert>

    <form @submit.prevent="handleLogin">
      <FormField label="Email" required>
        <NInput class="px-none" v-model:value="email" type="text" placeholder="Enter your email" />
      </FormField>

      <FormField label="Password" required>
        <NInput v-model:value="password" type="password" show-password-on="click" placeholder="Enter your password" />
      </FormField>

      <NButton type="primary" block :loading="authStore.loading" attr-type="submit" class="mt-2">
        <template #icon>
          <NIcon><Login /></NIcon>
        </template>
        Sign In
      </NButton>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      Don't have an account?
      <RouterLink to="/register" class="text-indigo-600 hover:text-indigo-500 font-medium">
        Register
      </RouterLink>
    </p>
  </AuthForm>
</template>
