<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, NAlert, NIcon } from 'naive-ui'
import { UserAvatar } from '@vicons/carbon'
import AuthForm from '@/components/common/AuthForm/AuthForm.vue'
import FormField from '@/components/common/FormField/FormField.vue'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.message || 'Registration failed')
    }

    localStorage.setItem('accessToken', json.accessToken)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthForm title="Create Account" subtitle="Get started with your free account">
    <NAlert v-if="error" type="error" class="mb-4">
      {{ error }}
    </NAlert>

    <form @submit.prevent="handleRegister">
      <div class="grid grid-cols-2 gap-4">
        <FormField label="First Name" required>
          <NInput v-model:value="form.firstName" placeholder="First name" />
        </FormField>
        <FormField label="Last Name" required>
          <NInput v-model:value="form.lastName" placeholder="Last name" />
        </FormField>
      </div>

      <FormField label="Username" required>
        <NInput v-model:value="form.username" placeholder="Choose a username" />
      </FormField>

      <FormField label="Email" required>
        <NInput v-model:value="form.email" type="text" placeholder="Enter your email" />
      </FormField>

      <FormField label="Password" required>
        <NInput
          v-model:value="form.password"
          type="password"
          show-password-on="click"
          placeholder="Min 8 characters"
        />
      </FormField>

      <FormField label="Confirm Password" required>
        <NInput
          v-model:value="form.confirmPassword"
          type="password"
          show-password-on="click"
          placeholder="Confirm your password"
        />
      </FormField>

      <NButton
        type="primary"
        block
        :loading="loading"
        attr-type="submit"
        class="mt-2"
      >
        <template #icon>
          <NIcon><UserAvatar /></NIcon>
        </template>
        Create Account
      </NButton>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      Already have an account?
      <RouterLink to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">
        Sign in
      </RouterLink>
    </p>
  </AuthForm>
</template>
