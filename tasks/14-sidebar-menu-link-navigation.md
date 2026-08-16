# Task 14: Sidebar Menu — Ubah dari Button ke Link (`<a>`)

## Problem

Menu item sidebar saat ini menggunakan Naive UI `NMenu` yang merender item sebagai `<div role="menuitem">` (bukan `<a>`). Akibatnya:
- Klik kanan → tidak ada opsi "Open link in new tab"
- Klik tengah tidak berfungsi
- User tidak bisa membuka halaman di tab baru

## Goal

Setiap menu item (leaf node) harus merender `<a href="...">` sehingga browser memperlakukannya sebagai link natif. Klik kiri tetap SPA navigation via Vue Router.

## Approach

Gunakan **`label` sebagai render function** pada `MenuOption` untuk merender `<a>` tag dengan `href` yang sesuai.

### Mechanism

```typescript
// MenuOption label sebagai render function
label: () =>
  h(
    'a',
    {
      href: '/dashboard/users',
      onClick: (e: MouseEvent) => {
        e.preventDefault() // SPA navigation, bukan full page reload
        router.push('/dashboard/users')
      },
      style: 'text-decoration: none; color: inherit;',
    },
    'User'
  )
```

- `<a href="/dashboard/users">` → browser bisa open in new tab (Ctrl+Klik, Klik Kanan)
- `e.preventDefault()` + `router.push()` → klik kiri tetap SPA navigation
- Submenu group labels tetap string biasa (bukan link)

## Implementation Steps

### 1. Modifikasi `AppLayout.vue`

**File**: `client/src/components/layout/AppLayout/AppLayout.vue`

**Perubahan**:

1. Tambahkan helper `renderMenuLabel(label: string, routePath: string)`:
   ```typescript
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
         label
       )
   }
   ```

2. Ubah `menuOptions` — setiap leaf node gunakan `renderMenuLabel`:
   ```typescript
   // Dashboard (single item, bukan submenu)
   {
     label: renderMenuLabel('Dashboard', '/dashboard'),
     key: 'dashboard',
     icon: renderIcon(Grid),
   }

   // User Management submenu children
   {
     label: renderMenuLabel('User', '/dashboard/users'),
     key: 'users',
     icon: renderIcon(User),
   },
   // ... dst untuk guards, roles, permissions, activity-logs, system-logs
   ```

3. Submenu group labels tetap string biasa:
   ```typescript
   {
     label: 'User Management',  // string, bukan link
     key: 'user-management',
     icon: renderIcon(UserMultiple),
     children: [...],
   }
   ```

### 2. Handle Collapsed State

Saat sidebar collapsed, tooltip muncul saat hover. `<a>` tag tetap berfungsi — tooltip dari NMenu tetap work karena NMenu membungkus content di dalam `n-menu-item-content`.

**Tidak perlu perubahan tambahan** — NMenu sudah handle collapsed tooltip.

### 3. Handle Active State

`activeKey` dan `routeKeyMap` sudah ada dan berfungsi. `<a>` tag tidak mengubah mekanisme active state NMenu karena active state dikontrol oleh `value` prop, bukan oleh DOM element type.

**Tidak perlu perubahan** — active state sudah benar.

### 4. Handle External Links (Opsional, untuk masa depan)

Jika ada menu item yang link ke URL eksternal, render function bisa dibedakan:

```typescript
function renderMenuLabel(label: string, routePath: string, external = false) {
  return () =>
    h(
      'a',
      {
        href: routePath,
        ...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : { onClick: (e: MouseEvent) => { e.preventDefault(); router.push(routePath) } }),
        style: 'text-decoration: none; color: inherit;',
      },
      label
    )
}
```

Saat ini tidak ada menu item eksternal, tapi code sudah siap untuk扩展.

## Files Affected

| File | Change |
|------|--------|
| `client/src/components/layout/AppLayout/AppLayout.vue` | Tambah `renderMenuLabel()`, ubah label pada menuOptions |

## Verification

1. `npm run build` — pasti tidak ada type error
2. `npm run dev` — test manual:
   - Klik kanan pada menu item → ada opsi "Open link in new tab"
   - Klik kiri → navigasi SPA (tidak full reload)
   - Ctrl+Klik → buka di tab baru
   - Klik tengah → buka di tab baru
   - Sidebar collapsed → tooltip tetap muncul
   - Active state menu tetap benar
3. `npm run storybook` — cek AppLayout story

## Design System Update

Tambahkan section **Sidebar Navigation** di `docs/design-system.md`:

```markdown
## Sidebar Navigation

### Menu Item Link Behavior

Setiap menu item (leaf node) dirender sebagai `<a>` tag dengan atribut `href`, bukan `<button>` atau `<div>`.

| Behavior | Implementation |
|----------|---------------|
| Left click | SPA navigation via `router.push()` (preventDefault) |
| Right click | Browser native "Open link in new tab" |
| Ctrl+Click | Browser native open in new tab |
| Middle click | Browser native open in new tab |
| Submenu group | String label (bukan link) |

### Render Pattern

```typescript
// Leaf menu item (punya route)
label: () =>
  h('a', {
    href: '/dashboard/users',
    onClick: (e) => { e.preventDefault(); router.push('/dashboard/users') },
    style: 'text-decoration: none; color: inherit;',
  }, 'User')

// Group submenu (tidak punya route sendiri)
label: 'User Management'  // plain string
```

### Design Rationale

- `<a>` tag memberikan UX browser native (right-click menu, middle-click, Ctrl+click)
- `e.preventDefault()` + `router.push()` mempertahankan SPA behavior untuk left click
- `href` tetap di-set agar URL addressable dan shareable
```
