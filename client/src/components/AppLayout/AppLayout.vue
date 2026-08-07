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
import { Grid, UserMultiple, ChevronDown, UserAvatar, Logout } from '@vicons/carbon'

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

function renderDropdownLabel(label: string, icon: any) {
  return () => h('div', { class: 'flex items-center gap-2' }, [
    h(NIcon, { size: 16, class: 'text-gray-500' }, { default: () => h(icon) }),
    h('span', null, label),
  ])
}

const dropdownOptions = [
  {
    key: 'profile',
    label: 'Profile',
    icon: renderIcon(UserAvatar),
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: renderIcon(Logout),
  },
]

function handleDropdownSelect(key: string) {
  if (key === 'logout') {
    logout()
  }
}
</script>

<template>
  <n-layout has-sider class="h-screen">
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
      <div class="flex items-center justify-center h-14 font-bold text-lg text-indigo-500">
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
      <n-layout-header bordered class="h-14 flex items-center justify-end px-6">
        <n-dropdown
          :options="dropdownOptions"
          @select="handleDropdownSelect"
          trigger="click"
          placement="bottom-end"
        >
          <div class="user-menu">
            <n-avatar round :size="36" class="bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold text-sm shrink-0">
              {{ avatarLabel }}
            </n-avatar>
            <div class="flex flex-col text-left leading-tight">
              <span class="text-sm font-medium text-gray-800">{{ user.firstName }}</span>
              <span class="text-xs text-gray-400">{{ user.email }}</span>
            </div>
            <n-icon :size="16" class="text-gray-400 shrink-0">
              <ChevronDown />
            </n-icon>
          </div>
        </n-dropdown>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;" :native-scrollbar="false">
        <slot />
      </n-layout-content>
      <n-layout-footer bordered class="h-12 flex items-center justify-center text-xs text-gray-400">
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
  transition: background-color 0.2s ease;
}

.user-menu:hover {
  background-color: #f3f4f6;
}
</style>
