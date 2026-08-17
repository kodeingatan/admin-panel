# 05 — Client: System Creators List Page

## Goal

Buat halaman list System Creators yang menampilkan semua registered modules dalam tabel.

## Files to Create

### 1. Table Component

**File**: `client/src/features/system-creators/components/ScTable.vue`

Pattern: Same as `UserTable.vue` — uses `DataTable` component.

Columns:
| Key | Title | Sortable | Width | Render |
|-----|-------|----------|-------|--------|
| `id` | ID | Yes | 60px | — |
| `name` | Name | Yes | — | Mono text |
| `label` | Label | Yes | — | — |
| `fieldsConfig` | Fields | No | 80px | Count badge |
| `accessLevel` | Access | Yes | 100px | NTag (public=green, admin=blue, granular=purple) |
| `isActive` | Status | Yes | 80px | NTag (Active=green, Inactive=gray) |
| `createdAt` | Created | Yes | 140px | Formatted date |
| `actions` | Actions | No | 160px | View / Toggle / Delete buttons |

Action buttons:
- **View** → emits `detail` event
- **Toggle** → calls `store.toggleActive(id)`, success message
- **Delete** → NPopconfirm → calls `store.remove(id)`, success message

Toolbar: "Create Module" button → emits `create` event

### 2. List Page

**File**: `client/src/views/SystemCreatorsPage.vue`

Pattern: Same as `UsersPage.vue`.

```vue
<script setup>
// AppLayout + ScTable + detail drawer
// onMounted: authStore.fetchProfile(), store.fetchAll()
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <ScTable @create="handleCreate" @detail="handleDetail" />
    <ScDetailDrawer v-model:visible="showDetail" :module-id="selectedModule?.id ?? null" />
  </AppLayout>
</template>
```

- `handleCreate()` → router.push('/dashboard/system-creators/create')
- `handleDetail(module)` → opens detail drawer
- Detail drawer shows full module config (fields, relations, access level)

### 3. Barrel Export

**File**: `client/src/features/system-creators/index.ts`

```typescript
export { default as ScTable } from './components/ScTable.vue'
export { default as ScWizardStep1Basic } from './components/ScWizardStep1Basic.vue'
export { default as ScWizardStep2Fields } from './components/ScWizardStep2Fields.vue'
export { default as ScWizardStep3Relations } from './components/ScWizardStep3Relations.vue'
export { default as ScWizardStep4Access } from './components/ScWizardStep4Access.vue'
export { default as ScWizardStep5Review } from './components/ScWizardStep5Review.vue'
```

## Files to Modify

### 4. `client/src/router/index.ts`

Add routes:
```typescript
{
  path: '/dashboard/system-creators',
  name: 'SystemCreators',
  component: () => import('@/views/SystemCreatorsPage.vue'),
  meta: {
    requiresAuth: true,
    requiredRoles: ['Super Admin'],
  },
},
{
  path: '/dashboard/system-creators/create',
  name: 'SystemCreatorCreate',
  component: () => import('@/views/SystemCreatorWizardPage.vue'),
  meta: {
    requiresAuth: true,
    requiredRoles: ['Super Admin'],
  },
},
```

## Verification

- [ ] Table shows all modules with correct columns
- [ ] Search, sort, pagination work
- [ ] Create button navigates to wizard
- [ ] Toggle button activates/deactivates module
- [ ] Delete button shows confirmation, then deletes
- [ ] Only visible to Super Admin (route guard works)
- [ ] Page follows design system patterns
