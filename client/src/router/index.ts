import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import UsersPage from '@/views/UsersPage.vue'
import RolesPage from '@/views/RolesPage.vue'
import PermissionsPage from '@/views/PermissionsPage.vue'
import GuardsPage from '@/views/GuardsPage.vue'
import ActivityLogsPage from '@/views/ActivityLogsPage.vue'
import SystemLogsPage from '@/views/SystemLogsPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/users',
    name: 'Users',
    component: UsersPage,
    meta: {
      requiresAuth: true,
      requiredRoles: ['Admin', 'Super Admin'],
      requiredPermission: 'User Management',
    },
  },
  {
    path: '/dashboard/roles',
    name: 'Roles',
    component: RolesPage,
    meta: {
      requiresAuth: true,
      requiredRoles: ['Admin', 'Super Admin'],
      requiredPermission: 'Role Management',
    },
  },
  {
    path: '/dashboard/permissions',
    name: 'Permissions',
    component: PermissionsPage,
    meta: {
      requiresAuth: true,
      requiredRoles: ['Admin', 'Super Admin'],
      requiredPermission: 'Permission Management',
    },
  },
  {
    path: '/dashboard/guards',
    name: 'Guards',
    component: GuardsPage,
    meta: {
      requiresAuth: true,
      requiredRoles: ['Admin', 'Super Admin'],
      requiredPermission: 'Guard Management',
    },
  },
  {
    path: '/dashboard/activity-logs',
    name: 'ActivityLogs',
    component: ActivityLogsPage,
    meta: {
      requiresAuth: true,
      requiredRoles: ['Admin', 'Super Admin'],
      requiredPermission: 'Activity Logs',
    },
  },
  {
    path: '/dashboard/system-logs',
    name: 'SystemLogs',
    component: SystemLogsPage,
    meta: {
      requiresAuth: true,
      requiredRoles: ['Admin', 'Super Admin'],
      requiredPermission: 'System Logs',
    },
  },
  {
    path: '/',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('accessToken')

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.meta.guest && token) {
    return next('/dashboard')
  }

  if (to.meta.requiredRoles && token) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userRoles = user.roles?.map((r: { roleName: string }) => r.roleName) || []
      const hasRole = (to.meta.requiredRoles as string[]).some((r: string) =>
        userRoles.includes(r),
      )
      if (!hasRole) {
        window.dispatchEvent(
          new CustomEvent('rbac-denied', {
            detail: {
              message: `You need one of these roles: ${(to.meta.requiredRoles as string[]).join(', ')}`,
            },
          }),
        )
        return next('/dashboard')
      }
    } catch {
      // If user data is corrupted, allow navigation (server will enforce)
    }
  }

  next()
})

export default router
