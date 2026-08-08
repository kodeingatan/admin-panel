# Implementation Tasks: User Management Feature

## Overview

Implementasi fitur User Management di client (Vue 3) untuk 4 modul: User, Guard, Role, Permission. Server API sudah lengkap dengan CRUD endpoints. Client perlu dibangun dari awal: types, services, stores, composables, dan UI components.

**Fokus**: `./client` — semua implementasi client-side.

---

## Current State

### Server (Sudah Lengkap)
- 4 modul CRUD: Users, Roles, Permissions, Guards
- 23 API endpoints (3 auth + 5×4 RBAC)
- DTOs dengan validasi (class-validator)
- Pagination support (page, limit, search)
- RBAC guards (JwtAuthGuard + RbacGuard)

### Client (Sangat Kosong)
- **Views**: Shell pages dengan `NDataTable` kosong (data `ref([])`)
- **Services**: `src/services/` kosong
- **Stores**: `src/stores/` kosong (Pinia belum setup)
- **Types**: Hanya `User`, `LoginPayload`, `RegisterPayload`, `AuthResponse`
- **Features**: Direktori kosong (`auth/`, `dashboard/`, `users/`)
- **Composables**: `useApi` dan `useAuth` ada tapi unused (dead code)
- **API URLs**: Hardcoded `http://localhost:3000` di semua views

---

## Target State

### Architecture

```
client/src/
├── types/
│   ├── api.ts              # PaginatedResponse<T>, ApiResponse<T>
│   ├── user.ts             # User, CreateUser, UpdateUser, QueryUser
│   ├── role.ts             # Role, CreateRole, UpdateRole, QueryRole
│   ├── permission.ts       # Permission, CreatePermission, UpdatePermission
│   ├── guard.ts            # Guard, CreateGuard, UpdateGuard
│   └── index.ts            # Barrel exports
│
├── services/
│   ├── api.ts              # Axios instance (baseURL, token interceptor)
│   ├── users.service.ts    # getAll, getById, create, update, delete
│   ├── roles.service.ts    # getAll, getById, create, update, delete
│   ├── permissions.service.ts # getAll, getById, create, update, delete
│   └── guards.service.ts   # getAll, getById, create, update, delete
│
├── stores/
│   ├── auth.store.ts       # token, user, login, logout
│   ├── users.store.ts      # users, total, loading, fetchAll, create, update, delete
│   ├── roles.store.ts      # roles, total, loading, fetchAll, create, update, delete
│   ├── permissions.store.ts # permissions, total, loading, fetchAll, create, update, delete
│   └── guards.store.ts     # guards, total, loading, fetchAll, create, update, delete
│
├── composables/
│   └── useCrudTable.ts     # Reusable: pagination, search, sorting, column toggle
│
├── features/
│   └── users/
│       ├── components/
│       │   ├── UserTable.vue          # DataTable + toolbar
│       │   ├── UserFormModal.vue      # Create/Edit form
│       │   ├── UserDetailDrawer.vue   # Detail view
│       │   ├── GuardTable.vue
│       │   ├── GuardFormModal.vue
│       │   ├── GuardDetailDrawer.vue
│       │   ├── RoleTable.vue
│       │   ├── RoleFormModal.vue
│       │   ├── RoleDetailDrawer.vue
│       │   ├── PermissionTable.vue
│       │   ├── PermissionFormModal.vue
│       │   └── PermissionDetailDrawer.vue
│       └── index.ts
│
└── views/
    ├── UsersPage.vue        # Updated: use features/users/components
    ├── RolesPage.vue
    ├── PermissionsPage.vue
    └── GuardsPage.vue
```

---

## Phase 1: TypeScript Types

### 1.1 Create API Response Types
- [ ] Buat `src/types/api.ts`
- [ ] Define `PaginatedResponse<T>` interface
- [ ] Define `ApiResponse<T>` interface

**File**: `client/src/types/api.ts`

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

### 1.2 Create RBAC Types
- [ ] Buat `src/types/user.ts` (update existing)
- [ ] Buat `src/types/role.ts`
- [ ] Buat `src/types/permission.ts`
- [ ] Buat `src/types/guard.ts`
- [ ] Update `src/types/index.ts` (barrel exports)

**File**: `client/src/types/user.ts`
```typescript
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleIds?: number[];
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  roleIds?: number[];
}

export interface QueryUser {
  page?: number;
  limit?: number;
  search?: string;
}
```

**File**: `client/src/types/role.ts`
```typescript
export interface Role {
  id: number;
  roleName: string;
  description: string | null;
  guards: Guard[];
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRole {
  roleName: string;
  description?: string;
  guardIds?: number[];
  permissionIds?: number[];
}

export interface UpdateRole {
  roleName?: string;
  description?: string;
  guardIds?: number[];
  permissionIds?: number[];
}

export interface QueryRole {
  page?: number;
  limit?: number;
  search?: string;
}
```

**File**: `client/src/types/permission.ts`
```typescript
export interface Permission {
  id: number;
  permissionName: string;
  description: string | null;
  methods: PermissionMethod[];
  urls: PermissionUrl[];
  createdAt: string;
  updatedAt: string;
}

export interface PermissionMethod {
  id: number;
  method: string;
}

export interface PermissionUrl {
  id: number;
  url: string;
}

export interface CreatePermission {
  permissionName: string;
  description?: string;
  methods?: string[];
  urls?: string[];
}

export interface UpdatePermission {
  permissionName?: string;
  description?: string;
  methods?: string[];
  urls?: string[];
}

export interface QueryPermission {
  page?: number;
  limit?: number;
  search?: string;
}
```

**File**: `client/src/types/guard.ts`
```typescript
export interface Guard {
  id: number;
  guardName: string;
  description: string | null;
  urls: GuardUrl[];
  createdAt: string;
  updatedAt: string;
}

export interface GuardUrl {
  id: number;
  url: string;
  type: 'allow' | 'deny';
}

export interface CreateGuard {
  guardName: string;
  description?: string;
  allowUrls?: string[];
  denyUrls?: string[];
}

export interface UpdateGuard {
  guardName?: string;
  description?: string;
  allowUrls?: string[];
  denyUrls?: string[];
}

export interface QueryGuard {
  page?: number;
  limit?: number;
  search?: string;
}
```

---

## Phase 2: API Service Layer

### 2.1 Create Axios Instance
- [ ] Install axios: `npm install axios`
- [ ] Buat `src/services/api.ts`
- [ ] Setup baseURL dari env variable
- [ ] Tambah request interceptor untuk attach Bearer token
- [ ] Tambah response interceptor untuk handle 401

**File**: `client/src/services/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2.2 Create Users Service
- [ ] Buat `src/services/users.service.ts`
- [ ] Implement: `getAll(query)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

**File**: `client/src/services/users.service.ts`

### 2.3 Create Roles Service
- [ ] Buat `src/services/roles.service.ts`
- [ ] Implement: `getAll(query)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

**File**: `client/src/services/roles.service.ts`

### 2.4 Create Permissions Service
- [ ] Buat `src/services/permissions.service.ts`
- [ ] Implement: `getAll(query)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

**File**: `client/src/services/permissions.service.ts`

### 2.5 Create Guards Service
- [ ] Buat `src/services/guards.service.ts`
- [ ] Implement: `getAll(query)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

**File**: `client/src/services/guards.service.ts`

---

## Phase 3: Pinia Stores

### 3.1 Setup Pinia
- [ ] Install: `npm install pinia`
- [ ] Add `createPinia()` di `src/main.ts`
- [ ] Pastikan order: `app.use(createPinia())` sebelum `app.use(router)`

**File**: `client/src/main.ts`

### 3.2 Create Auth Store
- [ ] Buat `src/stores/auth.store.ts`
- [ ] State: `token`, `user`, `loading`
- [ ] Actions: `login()`, `register()`, `logout()`, `fetchProfile()`
- [ ] Getters: `isAuthenticated`, `fullName`

### 3.3 Create Users Store
- [ ] Buat `src/stores/users.store.ts`
- [ ] State: `users`, `total`, `page`, `limit`, `search`, `loading`, `error`
- [ ] Actions: `fetchAll()`, `create()`, `update()`, `delete()`, `setPage()`, `setSearch()`

### 3.4 Create Roles Store
- [ ] Buat `src/stores/roles.store.ts`
- [ ] State: `roles`, `total`, `page`, `limit`, `search`, `loading`, `error`
- [ ] Actions: `fetchAll()`, `create()`, `update()`, `delete()`, `setPage()`, `setSearch()`

### 3.5 Create Permissions Store
- [ ] Buat `src/stores/permissions.store.ts`
- [ ] State: `permissions`, `total`, `page`, `limit`, `search`, `loading`, `error`
- [ ] Actions: `fetchAll()`, `create()`, `update()`, `delete()`, `setPage()`, `setSearch()`

### 3.6 Create Guards Store
- [ ] Buat `src/stores/guards.store.ts`
- [ ] State: `guards`, `total`, `page`, `limit`, `search`, `loading`, `error`
- [ ] Actions: `fetchAll()`, `create()`, `update()`, `delete()`, `setPage()`, `setSearch()`

---

## Phase 4: Composables

### 4.1 Create useCrudTable Composable
- [ ] Buat `src/composables/useCrudTable.ts`
- [ ] Reusable logic untuk semua table pages:
  - Pagination state & handlers
  - Global search with debounce
  - Column visibility toggle
  - Sort state
  - Row selection
  - Delete confirmation

**File**: `client/src/composables/useCrudTable.ts`

---

## Phase 5: User Module UI

### 5.1 UserTable Component
- [ ] Buat `src/features/users/components/UserTable.vue`
- [ ] Toolbar: search input, column toggle dropdown, "Add User" button
- [ ] `NDataTable` dengan columns:
  - ID (sortable)
  - First Name (sortable)
  - Last Name (sortable)
  - Username (sortable)
  - Email (sortable)
  - Roles (render as NTag list)
  - Created At (formatted date)
  - Actions (Detail, Edit, Delete buttons)
- [ ] Pagination: NPagination component
- [ ] Loading state: NSpin or skeleton
- [ ] Empty state: NEmpty with message
- [ ] Delete confirmation: NPopconfirm or NModal

### 5.2 UserFormModal Component
- [ ] Buat `src/features/users/components/UserFormModal.vue`
- [ ] Props: `visible`, `mode` ('create' | 'edit'), `user` (for edit)
- [ ] NModal with NCard
- [ ] NForm with fields:
  - First Name (NInput, required)
  - Last Name (NInput, required)
  - Username (NInput, required)
  - Email (NInput, type email, required)
  - Password (NInput type password, required for create, optional for edit)
  - Confirm Password (NInput type password, required if password filled)
  - Roles (NSelect multiple, options from roles store)
- [ ] Validation rules with NForm rules
- [ ] Submit handler: call users store create/update
- [ ] Close on success

### 5.3 UserDetailDrawer Component
- [ ] Buat `src/features/users/components/UserDetailDrawer.vue`
- [ ] Props: `visible`, `userId`
- [ ] NDrawer with NCard
- [ ] Display: ID, First Name, Last Name, Username, Email, Roles (as NTag), Created At, Updated At
- [ ] Edit button to switch to edit mode
- [ ] Close button

### 5.4 Update UsersPage
- [ ] Update `src/views/UsersPage.vue`
- [ ] Import and use UserTable, UserFormModal, UserDetailDrawer
- [ ] Wire up state management (show/hide modals, selected user)
- [ ] Remove hardcoded table data

---

## Phase 6: Guard Module UI

### 6.1 GuardTable Component
- [ ] Buat `src/features/users/components/GuardTable.vue`
- [ ] Columns: ID, Guard Name, Description, Allow URLs (count/badge), Deny URLs (count/badge), Created At, Actions
- [ ] Same features as UserTable (search, pagination, column toggle)

### 6.2 GuardFormModal Component
- [ ] Buat `src/features/users/components/GuardFormModal.vue`
- [ ] Fields:
  - Guard Name (NInput, required)
  - Description (NInput type textarea)
  - Allow URLs (NDynamicInput with pattern: `/example/*`)
  - Deny URLs (NDynamicInput with pattern: `/example/*`)
- [ ] URL pattern hint: "Use * for wildcard (e.g., /api/users/*)"

### 6.3 GuardDetailDrawer Component
- [ ] Buat `src/features/users/components/GuardDetailDrawer.vue`
- [ ] Display: ID, Guard Name, Description, Allow URLs list, Deny URLs list, Created At, Updated At

### 6.4 Update GuardsPage
- [ ] Update `src/views/GuardsPage.vue`
- [ ] Import and use GuardTable, GuardFormModal, GuardDetailDrawer
- [ ] Wire up state management

---

## Phase 7: Role Module UI

### 7.1 RoleTable Component
- [ ] Buat `src/features/users/components/RoleTable.vue`
- [ ] Columns: ID, Role Name, Description, Guards (count/badge), Permissions (count/badge), Created At, Actions

### 7.2 RoleFormModal Component
- [ ] Buat `src/features/users/components/RoleFormModal.vue`
- [ ] Fields:
  - Role Name (NInput, required)
  - Description (NInput type textarea)
  - Guards (NSelect multiple, options from guards store)
  - Permissions (NSelect multiple, options from permissions store)

### 7.3 RoleDetailDrawer Component
- [ ] Buat `src/features/users/components/RoleDetailDrawer.vue`
- [ ] Display: ID, Role Name, Description, Guards list (as NTag), Permissions list (as NTag), Created At, Updated At

### 7.4 Update RolesPage
- [ ] Update `src/views/RolesPage.vue`
- [ ] Import and use RoleTable, RoleFormModal, RoleDetailDrawer
- [ ] Wire up state management

---

## Phase 8: Permission Module UI

### 8.1 PermissionTable Component
- [ ] Buat `src/features/users/components/PermissionTable.vue`
- [ ] Columns: ID, Permission Name, Description, Methods (NTag: GET/POST/PUT/DELETE), URLs (count/badge), Created At, Actions

### 8.2 PermissionFormModal Component
- [ ] Buat `src/features/users/components/PermissionFormModal.vue`
- [ ] Fields:
  - Permission Name (NInput, required)
  - Description (NInput type textarea)
  - Methods (NSelect multiple with options: GET, POST, PUT, DELETE, PATCH, OPTIONS, or * for all)
  - URLs (NDynamicInput with pattern: `/api/*`)

### 8.3 PermissionDetailDrawer Component
- [ ] Buat `src/features/users/components/PermissionDetailDrawer.vue`
- [ ] Display: ID, Permission Name, Description, Methods list (as NTag), URLs list, Created At, Updated At

### 8.4 Update PermissionsPage
- [ ] Update `src/views/PermissionsPage.vue`
- [ ] Import and use PermissionTable, PermissionFormModal, PermissionDetailDrawer
- [ ] Wire up state management

---

## Phase 9: Refactor Auth & Cleanup

### 9.1 Refactor Auth to Use Store
- [ ] Update LoginPage to use `authStore.login()`
- [ ] Update RegisterPage to use `authStore.register()`
- [ ] Update AppLayout to use `authStore.user` and `authStore.logout()`
- [ ] Remove hardcoded API URLs from all views

### 9.2 Remove Dead Code
- [ ] Remove duplicate `User` interface from all views (use import from `@/types`)
- [ ] Remove duplicated profile-fetch logic from each view (use store)
- [ ] Delete unused `useApi` composable (replace with service layer)
- [ ] Delete unused `useAuth` composable (replace with store)

### 9.3 Create Feature Barrel Exports
- [ ] Buat `src/features/users/index.ts` — export all components
- [ ] Update views to import from `@/features/users`

---

## Phase 10: Storybook & Documentation

### 10.1 Storybook Stories
- [ ] Buat `stories/components/UserTable.stories.ts`
- [ ] Buat `stories/components/UserFormModal.stories.ts`
- [ ] Buat `stories/components/GuardTable.stories.ts`
- [ ] Buat `stories/components/GuardFormModal.stories.ts`
- [ ] Buat `stories/components/RoleTable.stories.ts`
- [ ] Buat `stories/components/RoleFormModal.stories.ts`
- [ ] Buat `stories/components/PermissionTable.stories.ts`
- [ ] Buat `stories/components/PermissionFormModal.stories.ts`

### 10.2 Update Documentation
- [ ] Update `docs/architecture.md` — client structure反映新代码

---

## Files to Create

```
client/src/
├── types/
│   ├── api.ts
│   ├── role.ts
│   ├── permission.ts
│   └── guard.ts
│
├── services/
│   ├── api.ts
│   ├── users.service.ts
│   ├── roles.service.ts
│   ├── permissions.service.ts
│   └── guards.service.ts
│
├── stores/
│   ├── auth.store.ts
│   ├── users.store.ts
│   ├── roles.store.ts
│   ├── permissions.store.ts
│   └── guards.store.ts
│
├── composables/
│   └── useCrudTable.ts
│
└── features/
    └── users/
        ├── components/
        │   ├── UserTable.vue
        │   ├── UserFormModal.vue
        │   ├── UserDetailDrawer.vue
        │   ├── GuardTable.vue
        │   ├── GuardFormModal.vue
        │   ├── GuardDetailDrawer.vue
        │   ├── RoleTable.vue
        │   ├── RoleFormModal.vue
        │   ├── RoleDetailDrawer.vue
        │   ├── PermissionTable.vue
        │   ├── PermissionFormModal.vue
        │   └── PermissionDetailDrawer.vue
        └── index.ts
```

## Files to Modify

```
client/src/
├── main.ts                    # Add createPinia()
├── types/index.ts             # Add RBAC type exports
├── views/
│   ├── UsersPage.vue          # Complete rewrite
│   ├── RolesPage.vue          # Complete rewrite
│   ├── PermissionsPage.vue    # Complete rewrite
│   ├── GuardsPage.vue         # Complete rewrite
│   ├── LoginPage.vue          # Use auth store
│   ├── RegisterPage.vue       # Use auth store
│   └── DashboardPage.vue      # Use auth store
├── components/
│   └── layout/AppLayout/
│       └── AppLayout.vue      # Use auth store for user data
└── composables/
    ├── useApi.ts              # Delete (replaced by services)
    └── useAuth.ts             # Delete (replaced by stores)
```

---

## Implementation Order

### Wave 1: Foundation (Phase 1-3)
1. **Phase 1** — TypeScript types (no dependencies)
2. **Phase 2** — API services (depends on types)
3. **Phase 3** — Pinia stores (depends on services)

### Wave 2: Reusable Logic (Phase 4)
4. **Phase 4** — Composables (depends on stores)

### Wave 3: UI Components (Phase 5-8)
5. **Phase 5** — User module UI (depends on Phase 1-4)
6. **Phase 6** — Guard module UI (depends on Phase 1-4)
7. **Phase 7** — Role module UI (depends on Phase 1-4, 6 for guards data)
8. **Phase 8** — Permission module UI (depends on Phase 1-4)

### Wave 4: Cleanup & Polish (Phase 9-10)
9. **Phase 9** — Refactor auth & cleanup (depends on Phase 3)
10. **Phase 10** — Storybook & docs (depends on Phase 5-8)

**Dependencies**:
- Phase 2 depends on Phase 1 (services use types)
- Phase 3 depends on Phase 2 (stores use services)
- Phase 4 depends on Phase 3 (composables use stores)
- Phase 5-8 depend on Phase 4 (components use composables)
- Phase 7 depends on Phase 6 (RoleForm needs Guards data)
- Phase 9 depends on Phase 3 (auth refactor uses auth store)
- Phase 10 depends on Phase 5-8 (stories need components)

---

## UI Specifications

### Table Features (All Modules)
| Feature | Implementation |
|---------|---------------|
| Global Search | NInput with debounced search (300ms) |
| Column Toggle | NDropdown with checkbox list |
| Pagination | NPagination with page/limit selectors |
| Row Count | Show "Showing X-Y of Z" text |
| Sort | Click column header to sort |
| Loading | NSpin overlay on table |
| Empty | NEmpty with "No data" message |
| Actions | NButton group: Detail, Edit, Delete |

### Form Modal Features
| Feature | Implementation |
|---------|---------------|
| Validation | NForm with rules (required, email, minLength) |
| Error Display | NAlert or inline error messages |
| Submit Loading | NButton with loading prop |
| Cancel | Close modal without saving |
| Multi-select | NSelect with filterable, multiple |

### Detail Drawer Features
| Feature | Implementation |
|---------|---------------|
| Display | NDescriptions with bordered |
| Tags | NTag for roles/methods |
| Edit Button | Navigate to edit mode |
| Close | NButton close |

---

## Verification

1. `npm run build` — no TypeScript errors
2. `npm run dev` — all 4 pages load and display data
3. User CRUD — create, read, update, delete user with role assignment
4. Guard CRUD — create, read, update, delete guard with URL patterns
5. Role CRUD — create, read, update, delete role with guard & permission assignment
6. Permission CRUD — create, read, update, delete permission with methods & URLs
7. Search — global search filters table data
8. Pagination — page through results, change page size
9. Column toggle — show/hide columns dynamically
10. Delete confirmation — confirm before delete
11. Form validation — required fields, email format, password match
12. Responsive — works on mobile and desktop
13. Storybook — all stories render correctly
