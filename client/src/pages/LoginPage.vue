<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, NAlert } from 'naive-ui'
import AuthForm from '../components/AuthForm/AuthForm.vue'
import FormField from '../components/FormField/FormField.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.message || 'Login failed')
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

      <NButton type="primary" block :loading="loading" attr-type="submit" class="mt-2">
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
