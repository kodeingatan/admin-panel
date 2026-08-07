# Register & Login Implementation Plan

## Overview

Implementasi halaman Register, Login, dan Dashboard menggunakan Vue 3 + Naive UI + Tailwind CSS dengan integrasi Storybook stories & tests, serta API auth di server NestJS.

---

## 1. New Components

### 1.1 `client/src/components/AuthForm/AuthForm.vue`

Reusable auth form wrapper component.

```vue
<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}
defineProps<Props>()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 text-gray-600">{{ subtitle }}</p>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <slot />
      </div>
    </div>
  </div>
</template>
```

**Props:**
- `title: string` — judul form
- `subtitle?: string` — subjudul (opsional)

### 1.2 `client/src/components/FormField/FormField.vue`

Reusable form field wrapper.

```vue
<script setup lang="ts">
interface Props {
  label: string
  error?: string
  required?: boolean
}
withDefaults(defineProps<Props>(), {
  error: '',
  required: false,
})
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
```

### 1.3 `client/src/components/AppLayout/AppLayout.vue`

Layout dashboard dengan header, sidebar, content area, dan footer.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sidebarCollapsed = ref(false)

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

defineProps<{ user: User }>()

function logout() {
  localStorage.removeItem('accessToken')
  router.push('/login')
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-gray-100 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="text-xl font-bold text-indigo-600"> MyApp </span>
      </div>

      <div class="relative group">
        <button class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition">
          <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm">
            {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
          </div>
          <span class="text-sm font-medium text-gray-700">{{ user.firstName }}</span>
        </button>
        <!-- Dropdown menu (hidden by default, show on group-hover) -->
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
          <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside
        :class="[
          'bg-white border-r border-gray-200 transition-all duration-300 shrink-0 flex flex-col',
          sidebarCollapsed ? 'w-16' : 'w-64'
        ]"
      >
        <nav class="flex-1 py-4">
          <router-link
            to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span v-if="!sidebarCollapsed" class="text-sm font-medium">Dashboard</span>
          </router-link>

          <router-link
            to="/dashboard/users"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span v-if="!sidebarCollapsed" class="text-sm font-medium">User Management</span>
          </router-link>
        </nav>
      </aside>

      <!-- Content Area -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500 shrink-0">
      &copy; 2026 MyApp. All rights reserved.
    </footer>
  </div>
</template>
```

---

## 2. Updated Pages

### 2.1 `client/src/pages/LoginPage.vue` (rewrite)

Menggunakan `AuthForm` dan `FormField` components + Naive UI `NInput`, `NButton`.

```vue
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
        <NInput
          v-model:value="email"
          type="text"
          placeholder="Enter your email"
        />
      </FormField>

      <FormField label="Password" required>
        <NInput
          v-model:value="password"
          type="password"
          show-password-on="click"
          placeholder="Enter your password"
        />
      </FormField>

      <NButton
        type="primary"
        block
        :loading="loading"
        attr-type="submit"
        class="mt-2"
      >
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
```

### 2.2 `client/src/pages/RegisterPage.vue` (rewrite)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, NAlert } from 'naive-ui'
import AuthForm from '../components/AuthForm/AuthForm.vue'
import FormField from '../components/FormField/FormField.vue'

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
```

### 2.3 `client/src/pages/DashboardPage.vue` (rewrite)

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NSpin } from 'naive-ui'
import AppLayout from '../components/AppLayout/AppLayout.vue'

const router = useRouter()

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

const user = ref<User | null>(null)
const loading = ref(true)

onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      throw new Error('Unauthorized')
    }

    user.value = await res.json()
  } catch {
    localStorage.removeItem('accessToken')
    router.push('/login')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppLayout v-if="user" :user="user">
    <div v-if="loading" class="flex justify-center py-12">
      <NSpin size="large" />
    </div>

    <div v-else-if="user" class="max-w-4xl">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        Welcome, {{ user.firstName }} {{ user.lastName }}!
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm text-gray-500">Username</dt>
              <dd class="text-sm font-medium text-gray-900">{{ user.username }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-500">Email</dt>
              <dd class="text-sm font-medium text-gray-900">{{ user.email }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <router-link
              to="/dashboard/users"
              class="block w-full text-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
            >
              Manage Users
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
```

---

## 3. Storybook Stories

### 3.1 `client/src/components/AuthForm/AuthForm.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { within, expect } from 'storybook/test'
import AuthForm from './AuthForm.vue'

const meta: Meta<typeof AuthForm> = {
  title: 'Components/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your account',
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { AuthForm },
    setup: () => ({ args }),
    template: `
      <AuthForm v-bind="args">
        <p>Form content goes here</p>
      </AuthForm>
    `,
  }),
}

export const WithoutSubtitle: Story = {
  args: {
    title: 'Sign Up',
    subtitle: undefined,
  },
  render: (args) => ({
    components: { AuthForm },
    setup: () => ({ args }),
    template: `
      <AuthForm v-bind="args">
        <p>Form content goes here</p>
      </AuthForm>
    `,
  }),
}
```

### 3.2 `client/src/components/FormField/FormField.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FormField from './FormField.vue'

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Email',
    error: '',
    required: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { FormField },
    setup: () => ({ args }),
    template: `
      <FormField v-bind="args">
        <input type="text" placeholder="Enter value" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </FormField>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: 'Password',
    error: 'Password is required',
    required: true,
  },
  render: (args) => ({
    components: { FormField },
    setup: () => ({ args }),
    template: `
      <FormField v-bind="args">
        <input type="password" class="w-full px-3 py-2 border border-red-500 rounded-lg text-sm" />
      </FormField>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: 'Username',
    required: true,
  },
  render: (args) => ({
    components: { FormField },
    setup: () => ({ args }),
    template: `
      <FormField v-bind="args">
        <input type="text" placeholder="Enter username" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </FormField>
    `,
  }),
}
```

### 3.3 `client/src/components/AppLayout/AppLayout.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import AppLayout from './AppLayout.vue'

const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john@example.com',
}

const meta: Meta<typeof AppLayout> = {
  title: 'Components/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
  args: {
    user: mockUser,
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { AppLayout },
    setup: () => ({ args }),
    template: `
      <AppLayout v-bind="args">
        <div class="p-6">
          <h1 class="text-2xl font-bold">Dashboard Content</h1>
          <p class="mt-2 text-gray-600">This is the main content area.</p>
        </div>
      </AppLayout>
    `,
  }),
}
```

### 3.4 `client/src/stories/LoginPage.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { within, expect, userEvent } from 'storybook/test'
import LoginPage from '../pages/LoginPage.vue'

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Login page with email and password form. Uses Naive UI components.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    // Attempt login with empty fields to trigger validation
    const submitButton = canvas.getByRole('button', { name: /sign in/i })
    await userEvent.click(submitButton)
  },
}
```

### 3.5 `client/src/stories/RegisterPage.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { within, expect, userEvent } from 'storybook/test'
import RegisterPage from '../pages/RegisterPage.vue'

const meta: Meta<typeof RegisterPage> = {
  title: 'Pages/RegisterPage',
  component: RegisterPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Registration page with first name, last name, username, email, password, and confirm password fields.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PasswordMismatch: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    // Test password mismatch scenario
    const passwordInputs = canvas.getAllByLabelText(/password/i)
    if (passwordInputs.length >= 2) {
      await userEvent.type(passwordInputs[0], 'password123')
      await userEvent.type(passwordInputs[1], 'differentpassword')
    }
  },
}
```

### 3.6 `client/src/stories/DashboardPage.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DashboardPage from '../pages/DashboardPage.vue'

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/DashboardPage',
  component: DashboardPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

---

## 4. Storybook Tests

### 4.1 `client/src/components/AuthForm/AuthForm.test.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { within, expect } from 'storybook/test'
import AuthForm from './AuthForm.vue'

const meta: Meta<typeof AuthForm> = {
  title: 'Components/AuthForm/Tests',
  component: AuthForm,
  args: {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const RendersTitle: Story = {
  render: (args) => ({
    components: { AuthForm },
    setup: () => ({ args }),
    template: `
      <AuthForm v-bind="args">
        <p>Content</p>
      </AuthForm>
    `,
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Test Title')).toBeInTheDocument()
  },
}

export const RendersSubtitle: Story = {
  render: (args) => ({
    components: { AuthForm },
    setup: () => ({ args }),
    template: `
      <AuthForm v-bind="args">
        <p>Content</p>
      </AuthForm>
    `,
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Test Subtitle')).toBeInTheDocument()
  },
}

export const RendersChildren: Story = {
  render: (args) => ({
    components: { AuthForm },
    setup: () => ({ args }),
    template: `
      <AuthForm v-bind="args">
        <form><input type="text" /></form>
      </AuthForm>
    `,
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox')).toBeInTheDocument()
  },
}
```

### 4.2 `client/src/components/FormField/FormField.test.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { within, expect } from 'storybook/test'
import FormField from './FormField.vue'

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField/Tests',
  component: FormField,
}

export default meta
type Story = StoryObj<typeof meta>

export const RendersLabel: Story = {
  args: { label: 'Email' },
  render: (args) => ({
    components: { FormField },
    setup: () => ({ args }),
    template: `<FormField v-bind="args"><input /></FormField>`,
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Email')).toBeInTheDocument()
  },
}

export const ShowsRequiredIndicator: Story = {
  args: { label: 'Password', required: true },
  render: (args) => ({
    components: { FormField },
    setup: () => ({ args }),
    template: `<FormField v-bind="args"><input /></FormField>`,
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('*')).toBeInTheDocument()
  },
}

export const ShowsError: Story = {
  args: { label: 'Email', error: 'Email is required' },
  render: (args) => ({
    components: { FormField },
    setup: () => ({ args }),
    template: `<FormField v-bind="args"><input /></FormField>`,
  }),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Email is required')).toBeInTheDocument()
  },
}
```

### 4.3 `client/src/stories/LoginPage.test.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { within, expect, userEvent, mockChannel } from 'storybook/test'
import LoginPage from '../pages/LoginPage.vue'

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/LoginPage/Tests',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const RendersLoginForm: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Welcome Back')).toBeInTheDocument()
    await expect(canvas.getByLabelText(/email/i)).toBeInTheDocument()
    await expect(canvas.getByLabelText(/password/i)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  },
}

export const HasRegisterLink: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Register')).toBeInTheDocument()
  },
}

export const ShowsLoadingState: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    const emailInput = canvas.getByLabelText(/email/i)
    const passwordInput = canvas.getByLabelText(/password/i)
    const submitButton = canvas.getByRole('button', { name: /sign in/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    // Button should show loading state
    await expect(submitButton).toBeDisabled()
  },
}
```

### 4.4 `client/src/stories/RegisterPage.test.ts`

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { within, expect, userEvent } from 'storybook/test'
import RegisterPage from '../pages/RegisterPage.vue'

const meta: Meta<typeof RegisterPage> = {
  title: 'Pages/RegisterPage/Tests',
  component: RegisterPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const RendersRegisterForm: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Create Account')).toBeInTheDocument()
    await expect(canvas.getByLabelText(/first name/i)).toBeInTheDocument()
    await expect(canvas.getByLabelText(/last name/i)).toBeInTheDocument()
    await expect(canvas.getByLabelText(/username/i)).toBeInTheDocument()
    await expect(canvas.getByLabelText(/email/i)).toBeInTheDocument()
    await expect(canvas.getByLabelText(/password/i)).toBeInTheDocument()
    await expect(canvas.getByLabelText(/confirm password/i)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  },
}

export const HasLoginLink: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sign in')).toBeInTheDocument()
  },
}

export const PasswordMismatchError: Story = {
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement)
    const firstName = canvas.getByLabelText(/first name/i)
    const lastName = canvas.getByLabelText(/last name/i)
    const username = canvas.getByLabelText(/username/i)
    const email = canvas.getByLabelText(/email/i)
    const password = canvas.getByLabelText(/^password/i)
    const confirmPassword = canvas.getByLabelText(/confirm password/i)
    const submitButton = canvas.getByRole('button', { name: /create account/i })

    await userEvent.type(firstName, 'John')
    await userEvent.type(lastName, 'Doe')
    await userEvent.type(username, 'johndoe')
    await userEvent.type(email, 'john@example.com')
    await userEvent.type(password, 'password123')
    await userEvent.type(confirmPassword, 'differentpassword')
    await userEvent.click(submitButton)

    await expect(canvas.getByText('Passwords do not match')).toBeInTheDocument()
  },
}
```

---

## 5. Server API (No Changes Needed)

Server auth API sudah lengkap:

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get profile | Bearer |

File yang sudah ada:
- `server/src/auth/auth.service.ts` — register, login, getProfile
- `server/src/auth/auth.controller.ts` — endpoints
- `server/src/auth/dto/register.dto.ts` — validation
- `server/src/auth/dto/login.dto.ts` — validation
- `server/src/user.entity.ts` — User entity

---

## 6. Files to Create/Modify

### Create:
| File | Description |
|------|-------------|
| `client/src/components/AuthForm/AuthForm.vue` | Auth form wrapper |
| `client/src/components/AuthForm/AuthForm.stories.ts` | AuthForm stories |
| `client/src/components/AuthForm/AuthForm.test.ts` | AuthForm tests |
| `client/src/components/FormField/FormField.vue` | Form field wrapper |
| `client/src/components/FormField/FormField.stories.ts` | FormField stories |
| `client/src/components/FormField/FormField.test.ts` | FormField tests |
| `client/src/components/AppLayout/AppLayout.vue` | Dashboard layout |
| `client/src/components/AppLayout/AppLayout.stories.ts` | AppLayout stories |
| `client/src/stories/LoginPage.stories.ts` | Login page stories |
| `client/src/stories/LoginPage.test.ts` | Login page tests |
| `client/src/stories/RegisterPage.stories.ts` | Register page stories |
| `client/src/stories/RegisterPage.test.ts` | Register page tests |
| `client/src/stories/DashboardPage.stories.ts` | Dashboard page stories |

### Modify:
| File | Description |
|------|-------------|
| `client/src/pages/LoginPage.vue` | Rewrite with Naive UI + AuthForm |
| `client/src/pages/RegisterPage.vue` | Rewrite with Naive UI + AuthForm |
| `client/src/pages/DashboardPage.vue` | Rewrite with AppLayout |

---

## 7. Implementation Order

1. Create `AuthForm` component + stories + tests
2. Create `FormField` component + stories + tests
3. Create `AppLayout` component + stories
4. Rewrite `LoginPage.vue` + stories + tests
5. Rewrite `RegisterPage.vue` + stories + tests
6. Rewrite `DashboardPage.vue` + stories
7. Run `npm run build` to verify type checking
8. Run `npm run storybook` to verify stories work

---

## 8. Dependencies (Already Installed)

- `naive-ui` — UI component library
- `tailwindcss` — Utility-first CSS
- `vue-router` — Routing
- `@storybook/vue3-vite` — Storybook
- `@storybook/addon-vitest` — Testing in Storybook
