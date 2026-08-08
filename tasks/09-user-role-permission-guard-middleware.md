# Task 09: User-Role-Permission-Guard Middleware Implementation

## Overview

Implement comprehensive RBAC middleware untuk server dan client-side authorization. Task ini mencakup:
1. Server: Middleware validasi user, role, permission, guard
2. Client: Alert/redirect untuk unauthorized access
3. Seeders: Lebih banyak data test

---

## Part A: Server — RBAC Middleware Enhancement

### Current State

- `JwtAuthGuard` — Validates JWT token (works correctly)
- `RbacGuard` — Checks roles, permissions, guard URL rules (exists but needs enhancement)
- No `@Roles()` or `@Permissions()` decorators used on controller endpoints yet

### A1: Add @Roles() and @Permissions() Decorators to Controllers

**Files to modify:**

#### `server/src/modules/users/controllers/users.controller.ts`

```typescript
@Get()
@Permissions('User Management', 'Full Access')
@Roles('Admin', 'Super Admin')
findAll(@Query() query: QueryUserDto) { ... }

@Get(':id')
@Permissions('User Management', 'Full Access')
@Roles('Admin', 'Super Admin')
findOne(@Param('id') id: string) { ... }

@Post()
@Permissions('User Management', 'Full Access')
@Roles('Admin', 'Super Admin')
create(@Body() createUserDto: CreateUserDto) { ... }

@Put(':id')
@Permissions('User Management', 'Full Access')
@Roles('Admin', 'Super Admin')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) { ... }

@Delete(':id')
@Permissions('User Management', 'Full Access')
@Roles('Admin', 'Super Admin')
remove(@Param('id') id: string) { ... }
```

#### `server/src/modules/roles/controllers/roles.controller.ts`

```typescript
@Get()
@Permissions('Role Management', 'Full Access')
@Roles('Admin', 'Super Admin')
findAll(@Query() query: QueryRoleDto) { ... }

// Same pattern for GET :id, POST, PUT, DELETE
```

#### `server/src/modules/permissions/controllers/permissions.controller.ts`

```typescript
@Get()
@Permissions('Permission Management', 'Full Access')
@Roles('Admin', 'Super Admin')
findAll(@Query() query: QueryPermissionDto) { ... }

// Same pattern for GET :id, POST, PUT, DELETE
```

#### `server/src/modules/guards/controllers/guards.controller.ts`

```typescript
@Get()
@Permissions('Guard Management', 'Full Access')
@Roles('Admin', 'Super Admin')
findAll(@Query() query: QueryGuardDto) { ... }

// Same pattern for GET :id, POST, PUT, DELETE
```

### A2: Enhance RbacGuard Logic

**File:** `server/src/common/guards/rbac.guard.ts`

Current logic needs improvement:

```typescript
// Current (simplified)
async canActivate(context: ExecutionContext) {
  // 1. Check @Public()
  // 2. Check @Roles() metadata
  // 3. Check @Permissions() metadata
  // 4. If neither set, allow
  // 5. Load user with relations
  // 6. Check role match
  // 7. Check permission match
  // 8. Check guard URL rules
  // 9. Check permission method+URL rules
}
```

**Enhanced logic:**

```typescript
async canActivate(context: ExecutionContext) {
  // 1. Check @Public() → allow immediately
  // 2. Get required roles from @Roles() metadata
  // 3. Get required permissions from @Permissions() metadata
  // 4. If neither @Roles nor @Permissions → allow (any authenticated user)
  // 5. Load user with full relations via UsersService.findOneWithRoles()
  // 6. Role check: If @Roles() set, user must have at least one matching role
  // 7. Permission check: If @Permissions() set, user must have at least one matching permission
  // 8. Guard URL enforcement (per role → per guard):
  //    - deny URLs: if match → DENY (continue next guard)
  //    - allow URLs: if match → ALLOW
  // 9. Permission method+URL enforcement (per role → per permission):
  //    - method matches (or * wildcard)
  //    - URL matches permission urls
  // 10. If no combination grants access → 403 Forbidden
}
```

### A3: Enhance UsersService.findOneWithRoles()

**File:** `server/src/modules/users/services/users.service.ts`

Ensure deep loading of all RBAC relations:

```typescript
async findOneWithRoles(id: number): Promise<User> {
  return this.userRepository.findOne({
    where: { id },
    relations: [
      'roles',
      'roles.guards',
      'roles.guards.urls',
      'roles.permissions',
      'roles.permissions.methods',
      'roles.permissions.urls',
    ],
  })
}
```

### A4: Add URL Pattern Matching Utility

**File:** `server/src/common/utils/url-matcher.ts` (new file)

```typescript
export function matchUrlPattern(pattern: string, url: string): boolean {
  // /* matches everything
  if (pattern === '/*') return true
  
  // /* suffix: prefix match (e.g., /api/* matches /api/users)
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2)
    return url.startsWith(prefix)
  }
  
  // Exact match (strip trailing slashes and query strings)
  const cleanPattern = pattern.split('?')[0].replace(/\/$/, '')
  const cleanUrl = url.split('?')[0].replace(/\/$/, '')
  return cleanPattern === cleanUrl
}
```

---

## Part B: Client — Authorization Composable & UI

### B1: Create useAuthorization Composable

**File:** `client/src/composables/useAuthorization.ts` (new file)

```typescript
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { matchUrlPattern } from '@/utils/url-matcher'

export function useAuthorization() {
  const authStore = useAuthStore()

  const userRoles = computed(() => 
    authStore.user?.roles?.map(r => r.roleName) || []
  )

  const userPermissions = computed(() => {
    const perms = new Set<string>()
    authStore.user?.roles?.forEach(role => {
      role.permissions?.forEach(p => perms.add(p.permissionName))
    })
    return Array.from(perms)
  })

  const userGuardUrls = computed(() => {
    const urls: { pattern: string; type: 'allow' | 'deny' }[] = []
    authStore.user?.roles?.forEach(role => {
      role.guards?.forEach(guard => {
        guard.urls?.forEach(u => urls.push({ pattern: u.url, type: u.type }))
      })
    })
    return urls
  })

  function hasRole(roleName: string): boolean {
    return userRoles.value.includes(roleName)
  }

  function hasAnyRole(roles: string[]): boolean {
    return roles.some(r => userRoles.value.includes(r))
  }

  function hasPermission(permissionName: string): boolean {
    return userPermissions.value.includes(permissionName)
  }

  function hasAnyPermission(perms: string[]): boolean {
    return perms.some(p => userPermissions.value.includes(p))
  }

  function canAccessUrl(url: string, method: string = 'GET'): boolean {
    // Check deny URLs first
    const denyMatch = userGuardUrls.value
      .filter(u => u.type === 'deny')
      .some(u => matchUrlPattern(u.pattern, url))
    if (denyMatch) return false

    // Check allow URLs
    const allowMatch = userGuardUrls.value
      .filter(u => u.type === 'allow')
      .some(u => matchUrlPattern(u.pattern, url))
    return allowMatch
  }

  return {
    userRoles,
    userPermissions,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    canAccessUrl,
  }
}
```

### B2: Create URL Matcher Utility

**File:** `client/src/utils/url-matcher.ts` (new file)

```typescript
export function matchUrlPattern(pattern: string, url: string): boolean {
  if (pattern === '/*') return true
  if (pattern.endsWith('/*')) {
    return url.startsWith(pattern.slice(0, -2))
  }
  const cleanPattern = pattern.split('?')[0].replace(/\/$/, '')
  const cleanUrl = url.split('?')[0].replace(/\/$/, '')
  return cleanPattern === cleanUrl
}
```

### B3: Update Axios Interceptor for 403

**File:** `client/src/services/api.ts`

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    if (error.response?.status === 403) {
      // Emit event for global alert handler
      window.dispatchEvent(new CustomEvent('rbac-denied', {
        detail: { 
          message: error.response?.data?.message || 'Access denied. You don\'t have permission to perform this action.' 
        }
      }))
    }
    return Promise.reject(error)
  }
)
```

### B4: Create Global Access Denied Alert Component

**File:** `client/src/components/common/AccessDeniedAlert.vue` (new file)

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { NAlert } from 'naive-ui'
import { LockClosed } from '@vicons/carbon'
import { h } from 'vue'

const visible = ref(false)
const message = ref('')

function handleDenied(event: CustomEvent) {
  message.value = event.detail.message
  visible.value = true
  setTimeout(() => { visible.value = false }, 5000)
}

onMounted(() => window.addEventListener('rbac-denied', handleDenied))
onUnmounted(() => window.removeEventListener('rbac-denied', handleDenied))
</script>

<template>
  <NAlert
    v-if="visible"
    type="error"
    :bordered="false"
    class="fixed top-4 right-4 z-50 shadow-lg max-w-md"
    @close="visible = false"
    closable
  >
    <template #icon>
      <NIcon><LockClosed /></NIcon>
    </template>
    <template #header>Access Denied</template>
    {{ message }}
  </NAlert>
</template>
```

### B5: Add AccessDeniedAlert to App.vue

**File:** `client/src/App.vue`

```vue
<script setup lang="ts">
import AccessDeniedAlert from '@/components/common/AccessDeniedAlert.vue'
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <AccessDeniedAlert />
    <RouterView />
  </NConfigProvider>
</template>
```

### B6: Update Router with Role/Permission Meta

**File:** `client/src/router/index.ts`

```typescript
const routes = [
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
  // ... same for permissions, guards
]

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('accessToken')

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.meta.guest && token) {
    return next('/dashboard')
  }

  // Role check
  if (to.meta.requiredRoles && token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userRoles = user.roles?.map((r: any) => r.roleName) || []
    const hasRole = to.meta.requiredRoles.some((r: string) => userRoles.includes(r))
    if (!hasRole) {
      window.dispatchEvent(new CustomEvent('rbac-denied', {
        detail: { message: `You need one of these roles: ${to.meta.requiredRoles.join(', ')}` }
      }))
      return next('/dashboard')
    }
  }

  next()
})
```

### B7: Conditionally Render Menu Items

**File:** `client/src/components/layout/AppLayout/AppLayout.vue`

```vue
<script setup lang="ts">
import { useAuthorization } from '@/composables/useAuthorization'

const { hasAnyRole } = useAuthorization()

const menuOptions = computed(() => {
  const options = [
    { label: 'Dashboard', key: 'dashboard', icon: renderIcon(Grid) },
  ]

  if (hasAnyRole(['Admin', 'Super Admin'])) {
    options.push({
      label: 'User Management',
      key: 'user-management',
      icon: renderIcon(UserMultiple),
      children: [
        { label: 'User', key: 'users', icon: renderIcon(User) },
        { label: 'Guard', key: 'guards', icon: renderIcon(Security) },
        { label: 'Role', key: 'roles', icon: renderIcon(Rule) },
        { label: 'Permissions', key: 'permissions', icon: renderIcon(Document) },
      ],
    })
  }

  return options
})
</script>
```

---

## Part C: Enhanced Seeders

### C1: Update SeederService

**File:** `server/src/common/services/seeder.service.ts`

Add more seed data:

```typescript
// Guards (existing + new)
const guards = [
  // Existing
  { guardName: 'Full Access', allowUrls: ['/*'], denyUrls: [] },
  { guardName: 'Web Access', allowUrls: ['/api/*'], denyUrls: ['/api/admin/*'] },
  { guardName: 'API Only', allowUrls: ['/api/*'], denyUrls: [] },
  // New
  { guardName: 'Admin Only', allowUrls: ['/api/admin/*', '/api/users/*', '/api/roles/*'], denyUrls: [] },
  { guardName: 'Read Only Guard', allowUrls: ['/api/*'], denyUrls: ['/api/users', '/api/roles'] },
  { guardName: 'User Management Guard', allowUrls: ['/api/users/*'], denyUrls: [] },
  { guardName: 'Role Management Guard', allowUrls: ['/api/roles/*'], denyUrls: [] },
  { guardName: 'Dashboard Only', allowUrls: ['/api/auth/profile'], denyUrls: ['/api/users/*', '/api/roles/*', '/api/permissions/*', '/api/guards/*'] },
]

// Permissions (existing + new)
const permissions = [
  // Existing
  { permissionName: 'Full Access', methods: ['*'], urls: ['/*'] },
  { permissionName: 'Read Only', methods: ['GET', 'OPTIONS'], urls: ['/*'] },
  { permissionName: 'Read Write', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], urls: ['/*'] },
  // New
  { permissionName: 'User Management', methods: ['GET', 'POST', 'PUT', 'DELETE'], urls: ['/api/users/*'] },
  { permissionName: 'Role Management', methods: ['GET', 'POST', 'PUT', 'DELETE'], urls: ['/api/roles/*'] },
  { permissionName: 'Guard Management', methods: ['GET', 'POST', 'PUT', 'DELETE'], urls: ['/api/guards/*'] },
  { permissionName: 'Permission Management', methods: ['GET', 'POST', 'PUT', 'DELETE'], urls: ['/api/permissions/*'] },
  { permissionName: 'Dashboard Read', methods: ['GET'], urls: ['/api/auth/profile'] },
]

// Roles (existing + new)
const roles = [
  // Existing
  { roleName: 'Super Admin', guards: ['Full Access'], permissions: ['Full Access'] },
  { roleName: 'Admin', guards: ['Web Access'], permissions: ['Read Write'] },
  { roleName: 'User', guards: ['API Only'], permissions: ['Read Only'] },
  // New
  { roleName: 'Editor', guards: ['API Only'], permissions: ['Read Write', 'User Management'] },
  { roleName: 'Viewer', guards: ['Read Only Guard'], permissions: ['Read Only', 'Dashboard Read'] },
  { roleName: 'Manager', guards: ['Web Access', 'User Management Guard'], permissions: ['Read Write', 'User Management', 'Role Management'] },
  { roleName: 'Guest', guards: ['Dashboard Only'], permissions: ['Dashboard Read'] },
]

// Users (existing + new)
const users = [
  // Existing
  { username: 'admin', email: 'admin@admin.com', role: 'Super Admin' },
  // New
  { username: 'editor', email: 'editor@example.com', role: 'Editor' },
  { username: 'viewer', email: 'viewer@example.com', role: 'Viewer' },
  { username: 'manager', email: 'manager@example.com', role: 'Manager' },
  { username: 'guest', email: 'guest@example.com', role: 'Guest' },
]
```

---

## Implementation Order

| Step | Task | Files |
|------|------|-------|
| 1 | Create URL matcher utilities | `server/src/common/utils/url-matcher.ts`, `client/src/utils/url-matcher.ts` |
| 2 | Enhance RbacGuard | `server/src/common/guards/rbac.guard.ts` |
| 3 | Add decorators to controllers | All controller files in `server/src/modules/*/controllers/` |
| 4 | Create useAuthorization composable | `client/src/composables/useAuthorization.ts` |
| 5 | Update Axios interceptor | `client/src/services/api.ts` |
| 6 | Create AccessDeniedAlert component | `client/src/components/common/AccessDeniedAlert.vue` |
| 7 | Update App.vue | `client/src/App.vue` |
| 8 | Update router with meta | `client/src/router/index.ts` |
| 9 | Update AppLayout menu | `client/src/components/layout/AppLayout/AppLayout.vue` |
| 10 | Enhance seeders | `server/src/common/services/seeder.service.ts` |
| 11 | Update stores with user roles | `client/src/stores/auth.store.ts` |

---

## Verification

1. **Server**: Run `npm run start:dev` — verify no startup errors
2. **Client**: Run `npm run build` — verify no type errors
3. **Test RBAC**: 
   - Login as `admin` → should see all menu items, access all endpoints
   - Login as `viewer` → should only see Dashboard, get 403 on /api/users
   - Try accessing `/dashboard/users` as `guest` → should redirect with alert
4. **Test 403 handling**: Make API call without permission → verify NAlert appears
