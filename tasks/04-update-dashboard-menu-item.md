# Implementation Tasks: Update Dashboard Menu Items

## Overview

Update sidebar menu di `AppLayout.vue` untuk menambahkan submenu User Management dengan 4 child items (User, Guard, Role, Permissions).

**Fokus**: `./client` — update menu dashboard sidebar.

---

## Current State

### AppLayout.vue (saat ini)
- Sidebar menu hardcoded sebagai flat array `menuOptions`
- 2 items: Dashboard, User Management
- `handleMenuUpdate(key)` menangani navigasi
- `activeKey` ref untuk highlight menu aktif
- Navigasi langsung via `router.push()`

### Router (saat ini)
- 3 routes: `/login`, `/register`, `/dashboard`
- **Missing**: `/dashboard/users`, `/dashboard/roles`, `/dashboard/permissions`, `/dashboard/guards`

### Views (saat ini)
- 3 views: LoginPage, RegisterPage, DashboardPage
- **Missing**: UsersPage, RolesPage, PermissionsPage, GuardsPage

---

## Target State

### Sidebar Menu Structure
```
Dashboard                    → /dashboard
User Management (group)
    ├── User                 → /dashboard/users
    ├── Guard                → /dashboard/guards
    ├── Role                 → /dashboard/roles
    └── Permissions          → /dashboard/permissions
```

### Naive UI NMenu Support
Naive UI `NMenu` mendukung nested menu via `children` property pada `MenuOption`:
```typescript
{
  label: 'User Management',
  key: 'user-management',
  icon: renderIcon(UserMultiple),
  children: [
    { label: 'User', key: 'users', icon: renderIcon(User) },
    { label: 'Guard', key: 'guards', icon: renderIcon(Guard) },
    { label: 'Role', key: 'roles', icon: renderIcon(Role) },
    { label: 'Permissions', key: 'permissions', icon: renderIcon(Permission) },
  ]
}
```

---

## Phase 1: Create View Components

### 1.1 Create UsersPage.vue
- [ ] Buat `src/views/UsersPage.vue`
- [ ] Wrap dengan `AppLayout`
- [ ] Placeholder content: "User Management"

**File**: `client/src/views/UsersPage.vue`

### 1.2 Create RolesPage.vue
- [ ] Buat `src/views/RolesPage.vue`
- [ ] Wrap dengan `AppLayout`
- [ ] Placeholder content: "Role Management"

**File**: `client/src/views/RolesPage.vue`

### 1.3 Create PermissionsPage.vue
- [ ] Buat `src/views/PermissionsPage.vue`
- [ ] Wrap dengan `AppLayout`
- [ ] Placeholder content: "Permission Management"

**File**: `client/src/views/PermissionsPage.vue`

### 1.4 Create GuardsPage.vue
- [ ] Buat `src/views/GuardsPage.vue`
- [ ] Wrap dengan `AppLayout`
- [ ] Placeholder content: "Guard Management"

**File**: `client/src/views/GuardsPage.vue`

---

## Phase 2: Update Router

### 2.1 Add Routes
- [ ] Import 4 view baru
- [ ] Tambah routes:
  - `/dashboard/users` → UsersPage
  - `/dashboard/roles` → RolesPage
  - `/dashboard/permissions` → PermissionsPage
  - `/dashboard/guards` → GuardsPage
- [ ] Semua routes punya `meta: { requiresAuth: true }`

**File**: `client/src/router/index.ts`

---

## Phase 3: Update AppLayout Sidebar Menu

### 3.1 Update menuOptions
- [ ] Import icons tambahan dari `@vicons/carbon`:
  - `UserSingle` (untuk User)
  - `Rule` atau `Security` (untuk Guard)
  - `Role` atau `UserMultiple` (untuk Role)
  - `Permissions` atau `Document` (untuk Permissions)
- [ ] Ubah flat menu jadi nested menu dengan `children`
- [ ] Pastikan icon tersedia di `@vicons/carbon`, fallback ke icon yang ada

### 3.2 Update handleMenuUpdate
- [ ] Handle navigasi untuk semua child keys:
  - `users` → `/dashboard/users`
  - `guards` → `/dashboard/guards`
  - `roles` → `/dashboard/roles`
  - `permissions` → `/dashboard/permissions`
  - `dashboard` → `/dashboard`
- [ ] Sync `activeKey` dengan route saat ini (gunakan `useRoute()`)

### 3.3 Sync activeKey with Route
- [ ] Import `useRoute` dari `vue-router`
- [ ] Watch `route.path` untuk update `activeKey` secara otomatis
- [ ] Handle direct URL navigation (user langsung ke `/dashboard/users`)

**File**: `client/src/components/layout/AppLayout/AppLayout.vue`

---

## Phase 4: Update DashboardPage

### 4.1 Fix Quick Actions
- [ ] Pastikan tombol "Manage Users" navigasi ke `/dashboard/users`
- [ ] Tambahkan link ke halaman lain (Roles, Permissions, Guards) jika perlu

**File**: `client/src/views/DashboardPage.vue`

---

## Files to Create

```
client/src/
├── views/
│   ├── UsersPage.vue
│   ├── RolesPage.vue
│   ├── PermissionsPage.vue
│   └── GuardsPage.vue
```

## Files to Modify

```
client/src/
├── router/index.ts                              # Add 4 new routes
├── components/layout/AppLayout/AppLayout.vue    # Nested menu + route sync
└── views/DashboardPage.vue                      # Fix quick actions link
```

---

## Implementation Order

1. **Phase 1** — Create 4 view components (placeholder)
2. **Phase 2** — Add routes to router
3. **Phase 3** — Update AppLayout sidebar menu (nested + route sync)
4. **Phase 4** — Update DashboardPage quick actions

**Dependencies**:
- Phase 2 depends on Phase 1 (routes need view components)
- Phase 3 depends on Phase 2 (menu needs routes to navigate to)
- Phase 4 is independent

---

## Icon Availability Check

`@vicons/carbon` icons yang mungkin tersedia:
- `Grid` — Dashboard ✅ (sudah dipakai)
- `UserMultiple` — User Management ✅ (sudah dipakai)
- `User` — User child menu
- `Security` — Guard child menu
- `Role` — Role child menu
- `Document` — Permissions child menu

Jika icon tidak tersedia, gunakan alternatif dari `@vicons/carbon` yang sudah ada.

---

## Verification

1. `npm run build` — pastikan tidak ada TypeScript error
2. `npm run dev` — pastikan sidebar menu muncul dengan nested items
3. Klik setiap menu item — pastikan navigasi ke route yang benar
4. Direct URL navigation — pastikan menu highlight sesuai
5. Collapsed sidebar — pastikan nested menu tetap berfungsi
