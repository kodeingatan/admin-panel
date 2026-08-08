<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NSpin,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NGrid,
  NGi,
  NSpace,
  NIcon,
} from 'naive-ui'
import { UserMultiple, UserRole, Document, Security } from '@vicons/carbon'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <NSpin :show="authStore.loading" class="w-full">
      <template #description>Loading...</template>

      <div v-if="!authStore.loading && authStore.user">
        <NCard title="Dashboard" class="mb-4">
          <template #header-extra>
            Welcome back!
          </template>
          <h2 class="text-xl font-semibold mb-2">
            Hello, {{ authStore.user.firstName }} {{ authStore.user.lastName }}!
          </h2>
          <p class="text-gray-500">Here's your account overview.</p>
        </NCard>

        <NGrid :cols="2" :x-gap="16" :y-gap="16">
          <NGi>
            <NCard title="Profile Information">
              <NDescriptions label-placement="left" bordered :column="1">
                <NDescriptionsItem label="Username">
                  {{ authStore.user.username }}
                </NDescriptionsItem>
                <NDescriptionsItem label="Email">
                  {{ authStore.user.email }}
                </NDescriptionsItem>
              </NDescriptions>
            </NCard>
          </NGi>
          <NGi>
            <NCard title="Quick Actions">
              <NSpace vertical>
                <NButton
                  type="primary"
                  block
                  @click="router.push('/dashboard/users')"
                >
                  <template #icon>
                    <NIcon><UserMultiple /></NIcon>
                  </template>
                  Manage Users
                </NButton>
                <NButton
                  type="info"
                  block
                  @click="router.push('/dashboard/roles')"
                >
                  <template #icon>
                    <NIcon><UserRole /></NIcon>
                  </template>
                  Manage Roles
                </NButton>
                <NButton
                  type="warning"
                  block
                  @click="router.push('/dashboard/permissions')"
                >
                  <template #icon>
                    <NIcon><Document /></NIcon>
                  </template>
                  Manage Permissions
                </NButton>
                <NButton
                  type="success"
                  block
                  @click="router.push('/dashboard/guards')"
                >
                  <template #icon>
                    <NIcon><Security /></NIcon>
                  </template>
                  Manage Guards
                </NButton>
              </NSpace>
            </NCard>
          </NGi>
        </NGrid>
      </div>
    </NSpin>
  </AppLayout>
</template>
