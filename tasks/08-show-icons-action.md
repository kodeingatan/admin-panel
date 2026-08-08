# Task 08: Show Icon Button Actions

## Problem

Beberapa icon tidak tampil atau tidak menggunakan wrapper `NIcon` yang konsisten. Issue utama:

1. **`Refresh` icon tidak ada** di `@vicons/carbon` — harus diganti dengan `Restart`
2. **Inkonsistensi penggunaan NIcon wrapper** — beberapa komponen menggunakan icon langsung tanpa wrapper

## Audit Icon Usage

### Files yang perlu diperbaiki

| File | Issue | Fix |
|------|-------|-----|
| `client/src/components/common/DataTable/DataTable.vue` | `Refresh` tidak ada di @vicons/carbon | Ganti import `Refresh` → `Restart` |
| `client/src/features/users/components/UserTable.vue` | Icon button tanpa NIcon wrapper | Tambahkan `NIcon` wrapper pada action buttons |
| `client/src/features/users/components/RoleTable.vue` | Icon button tanpa NIcon wrapper | Tambahkan `NIcon` wrapper pada action buttons |
| `client/src/features/users/components/GuardTable.vue` | Icon button tanpa NIcon wrapper | Tambahkan `NIcon` wrapper pada action buttons |
| `client/src/features/users/components/PermissionTable.vue` | Icon button tanpa NIcon wrapper | Tambahkan `NIcon` wrapper pada action buttons |

### Icon Availability Check (from @vicons/carbon)

| Icon | Status |
|------|--------|
| Add | ✅ Available |
| TrashCan | ✅ Available |
| Edit | ✅ Available |
| View | ✅ Available |
| Login | ✅ Available |
| UserAvatar | ✅ Available |
| Search | ✅ Available |
| Reset | ✅ Available |
| Settings | ✅ Available |
| Grid | ✅ Available |
| UserMultiple | ✅ Available |
| User | ✅ Available |
| Security | ✅ Available |
| Rule | ✅ Available |
| Document | ✅ Available |
| ChevronDown | ✅ Available |
| Logout | ✅ Available |
| UserRole | ✅ Available |
| ArrowUp | ✅ Available |
| ArrowDown | ✅ Available |
| ViewOff | ✅ Available |
| **Refresh** | ❌ **MISSING** → Use `Restart` |
| Download | ✅ Available |
| Upload | ✅ Available |
| ArrowLeft | ✅ Available |
| ArrowRight | ✅ Available |
| Close | ✅ Available |
| Checkmark | ✅ Available |

## Implementation Plan

### Step 1: Fix DataTable.vue — Replace Refresh with Restart

**File**: `client/src/components/common/DataTable/DataTable.vue`

```typescript
// Before
import { Search, Reset, Settings } from '@vicons/carbon'

// After
import { Search, Reset, Settings, Restart } from '@vicons/carbon'
```

Update template reference if `Refresh` is used anywhere in template.

### Step 2: Add NIcon Wrapper to Table Action Buttons

**Files**: All `*Table.vue` in `client/src/features/users/components/`

Pattern to fix:
```typescript
// Before (icon direct)
h(NButton, { ... }, { default: () => h(View) })

// After (with NIcon wrapper)
h(NButton, { ... }, { 
  default: () => h(NIcon, null, { default: () => h(View) }) 
})
```

Need to import `NIcon` from naive-ui in each table component.

### Step 3: Update docs/design-system.md

Update Icon Library section with correct import mapping:
- Replace `Refresh` → `Restart` in documentation

## Icon Render Pattern (Reference)

```typescript
// Option 1: Direct in template
<NButton>
  <template #icon><NIcon><Add /></NIcon></template>
</NButton>

// Option 2: In render function (h())
h(NButton, { size: 'small', quaternary: true }, { 
  default: () => h(NIcon, null, { default: () => h(Edit) }) 
})
```

## Verification

1. Run `npm run build` in `client/` to verify no import errors
2. Run `npm run storybook` and verify icons display correctly
3. Check all action buttons in table rows show icons
