<script setup lang="ts">
import { h, ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
import {
  Grid,
  UserMultiple,
  User,
  Security,
  Rule,
  Document,
  ChevronDown,
  UserAvatar,
  Logout,
  Activity,
  Report,
  Settings,
  Cube,
  Add,
} from '@vicons/carbon'

import { useAuthStore } from '@/stores/auth.store'
import { useAuthorization } from '@/composables/useAuthorization'
import { useSettingsStore } from '@/stores/settings.store'
import { useDynamicModules } from '@/composables/useDynamicModules'
import type { ScModule } from '@/types/system-creator'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { hasAnyRole } = useAuthorization()
const settingsStore = useSettingsStore()
const { registeredModules, loadModules } = useDynamicModules()
const collapsed = ref(false)

interface User_ {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

const props = defineProps<{ user: User_ }>()

function logout() {
  authStore.logout()
  router.push('/login')
}

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function renderMenuLabel(label: string, routePath: string) {
  return () =>
    h(
      'a',
      {
        href: routePath,
        onClick: (e: MouseEvent) => {
          e.preventDefault()
          router.push(routePath)
        },
        style: 'text-decoration: none; color: inherit;',
      },
      label,
    )
}

function parseMenuLabel(menuLabel: string): { groups: string[]; label: string } {
  const parts = menuLabel.split('_')
  if (parts.length === 1) {
    return { groups: [], label: parts[0] }
  }
  return {
    groups: parts.slice(0, -1),
    label: parts[parts.length - 1],
  }
}

function buildDynamicMenu(modules: ScModule[]): MenuOption[] {
  const topLevel: MenuOption[] = []
  const groupMap: Record<string, MenuOption> = {}

  for (const m of modules) {
    const { groups, label } = parseMenuLabel(m.menuLabel)

    if (groups.length === 0) {
      topLevel.push({
        label: renderMenuLabel(label, m.routePath),
        key: `sc-${m.name}`,
      })
    } else {
      let currentLevel = topLevel
      for (const group of groups) {
        if (!groupMap[group]) {
          const groupOption: MenuOption = {
            label: group.charAt(0).toUpperCase() + group.slice(1),
            key: `group-${group}`,
            children: [],
          }
          groupMap[group] = groupOption
          currentLevel.push(groupOption)
        }
        currentLevel = groupMap[group].children!
      }
      currentLevel.push({
        label: renderMenuLabel(label, m.routePath),
        key: `sc-${m.name}`,
      })
    }
  }

  return topLevel
}

const menuOptions = computed<MenuOption[]>(() => {
  const options: MenuOption[] = [
    {
      label: renderMenuLabel('Dashboard', '/dashboard'),
      key: 'dashboard',
      icon: renderIcon(Grid),
    },
  ]

  if (hasAnyRole(['Admin', 'Super Admin'])) {
    options.push({
      label: 'User Management',
      key: 'user-management',
      icon: renderIcon(UserMultiple),
      children: [
        {
          label: renderMenuLabel('User', '/dashboard/users'),
          key: 'users',
          icon: renderIcon(User),
        },
        {
          label: renderMenuLabel('Guard', '/dashboard/guards'),
          key: 'guards',
          icon: renderIcon(Security),
        },
        {
          label: renderMenuLabel('Role', '/dashboard/roles'),
          key: 'roles',
          icon: renderIcon(Rule),
        },
        {
          label: renderMenuLabel('Permissions', '/dashboard/permissions'),
          key: 'permissions',
          icon: renderIcon(Document),
        },
      ],
    })

    options.push({
      label: 'Sistem',
      key: 'sistem',
      icon: renderIcon(Settings),
      children: [
        {
          label: renderMenuLabel('Activity Logs', '/dashboard/activity-logs'),
          key: 'activity-logs',
          icon: renderIcon(Activity),
        },
        {
          label: renderMenuLabel('System Logs', '/dashboard/system-logs'),
          key: 'system-logs',
          icon: renderIcon(Report),
        },
        {
          label: renderMenuLabel('Settings', '/dashboard/settings'),
          key: 'settings',
          icon: renderIcon(Settings),
        },
      ],
    })
  }

  if (hasAnyRole(['Super Admin'])) {
    options.push({
      label: 'Admin',
      key: 'admin',
      icon: renderIcon(Cube),
      children: [
        {
          label: renderMenuLabel('System Creators', '/dashboard/system-creators'),
          key: 'system-creators',
          icon: renderIcon(Add),
        },
      ],
    })
  }

  const dynamicItems = buildDynamicMenu(registeredModules.value)
  options.push(...dynamicItems)

  return options
})

const routeKeyMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/dashboard/users': 'users',
    '/dashboard/guards': 'guards',
    '/dashboard/roles': 'roles',
    '/dashboard/permissions': 'permissions',
    '/dashboard/activity-logs': 'activity-logs',
    '/dashboard/system-logs': 'system-logs',
    '/dashboard/settings': 'settings',
    '/dashboard/system-creators': 'system-creators',
  }
  for (const m of registeredModules.value) {
    map[m.routePath] = `sc-${m.name}`
  }
  return map
})

const activeKey = ref('dashboard')

watch(
  () => route.path,
  (path) => {
    activeKey.value = routeKeyMap.value[path] || 'dashboard'
  },
  { immediate: true },
)

function handleMenuUpdate(key: string) {
  activeKey.value = key
}

onMounted(async () => {
  await loadModules()
})

const avatarLabel = computed(() => `${props.user.firstName.charAt(0)}${props.user.lastName.charAt(0)}`)

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
  if (key === 'profile') {
    router.push('/dashboard/profile')
  } else if (key === 'logout') {
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
        <span v-if="!collapsed">{{ settingsStore.appName }}</span>
        <span v-else>{{ settingsStore.appName?.charAt(0) }}</span>
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
        &copy; 2026 {{ settingsStore.appName }}. All rights reserved.
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
