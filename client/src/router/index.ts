import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import UsersPage from '@/views/UsersPage.vue'
import RolesPage from '@/views/RolesPage.vue'
import PermissionsPage from '@/views/PermissionsPage.vue'
import GuardsPage from '@/views/GuardsPage.vue'

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
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/roles',
    name: 'Roles',
    component: RolesPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/permissions',
    name: 'Permissions',
    component: PermissionsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/guards',
    name: 'Guards',
    component: GuardsPage,
    meta: { requiresAuth: true },
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
    next('/login')
  } else if (to.meta.guest && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
