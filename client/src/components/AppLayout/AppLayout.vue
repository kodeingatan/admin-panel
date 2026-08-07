<script setup lang="ts">
import { h, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  NLayoutFooter,
  NMenu,
  NAvatar,
  NIcon,
  NDropdown,
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { Grid, UserMultiple, Logout, ChevronDown } from '@vicons/carbon'

const router = useRouter()
const collapsed = ref(false)

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

const props = defineProps<{ user: User }>()

function logout() {
  localStorage.removeItem('accessToken')
  router.push('/login')
}

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: renderIcon(Grid),
  },
  {
    label: 'User Management',
    key: 'users',
    icon: renderIcon(UserMultiple),
  },
]

const activeKey = ref('dashboard')

function handleMenuUpdate(key: string) {
  activeKey.value = key
  if (key === 'users') {
    router.push('/dashboard/users')
  } else {
    router.push('/dashboard')
  }
}

const avatarLabel = computed(() => `${props.user.firstName.charAt(0)}${props.user.lastName.charAt(0)}`)

const dropdownOptions = [
  { label: 'Profile', key: 'profile' },
  { label: 'Logout', key: 'logout' },
]

function handleDropdownSelect(key: string) {
  if (key === 'logout') {
    logout()
  }
}
</script>

<template>
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div style="display: flex; align-items: center; justify-content: center; height: 56px; font-weight: bold; font-size: 18px; color: #6366f1;">
        <span v-if="!collapsed">MyApp</span>
        <span v-else>M</span>
      </div>
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuUpdate"
      />
    </n-layout-sider>
    <n-layout>
      <n-layout-header bordered style="height: 56px; display: flex; align-items: center; justify-content: flex-end; padding: 0 24px;">
        <n-dropdown :options="dropdownOptions" @select="handleDropdownSelect" trigger="click" placement="bottom-end">
          <div class="user-menu">
            <n-avatar round :size="36" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); font-weight: 600; font-size: 14px; flex-shrink: 0;">
              {{ avatarLabel }}
            </n-avatar>
            <div class="user-info">
              <span class="user-name">{{ user.firstName }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
            <n-icon :size="16" style="color: #999; flex-shrink: 0;">
              <ChevronDown />
            </n-icon>
          </div>
        </n-dropdown>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;" :native-scrollbar="false">
        <slot />
      </n-layout-content>
      <n-layout-footer bordered style="height: 48px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #999;">
        &copy; 2026 MyApp. All rights reserved.
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-menu:hover {
  background-color: #f5f5f5;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  text-align: left;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.user-email {
  font-size: 11px;
  color: #999;
}
</style>
