# Task 05: Update Design System — Icons & Animations

## Objective

Update `docs/design-system.md` dengan section baru untuk **Icons** dan **Animations**, lalu buatkan rancangan implementasi untuk menambahkan icon pada semua button/menu item serta animasi pada pages dan components.

**Note**: Skill `animejs-base-practices` tidak tersedia. Alternatif: gunakan CSS transitions, Vue `<Transition>`, atau install `anime.js` sebagai animation library.

---

## Current State

### Icons
- Hanya `AppLayout.vue` yang menggunakan icon (`@vicons/carbon`)
- 7 view files menggunakan `NButton` **tanpa icon**
- Tidak ada icon pada login form, register form, atau quick actions buttons

### Animations
- Tidak ada Vue `<Transition>` atau `<transition-group>` di seluruh codebase
- Hanya 1 CSS transition (background-color pada user menu hover)
- Tidak ada animation library yang ter-install

### Components That Need Icons
| Component | File | Current State |
|-----------|------|---------------|
| Login Button | `LoginPage.vue` | `NButton` tanpa icon |
| Register Button | `RegisterPage.vue` | `NButton` tanpa icon |
| Dashboard Quick Actions (4 buttons) | `DashboardPage.vue` | `NButton` tanpa icon |
| Add User Button | `UsersPage.vue` | `NButton` tanpa icon |
| Add Role Button | `RolesPage.vue` | `NButton` tanpa icon |
| Add Permission Button | `PermissionsPage.vue` | `NButton` tanpa icon |
| Add Guard Button | `GuardsPage.vue` | `NButton` tanpa icon |
| Sidebar Menu (6 items) | `AppLayout.vue` | Sudah ada icon ✅ |
| User Dropdown (2 items) | `AppLayout.vue` | Sudah ada icon ✅ |

---

## Phase 1: Update `docs/design-system.md`

### 1.1 Add Icon System Section
Tambahkan section baru setelah "Component Dimensions":

```markdown
## Icons

### Icon Library
- **Library**: `@vicons/carbon` (Carbon Design System)
- **Wrapper**: Naive UI `NIcon`
- **Render Pattern**: `h(NIcon, null, { default: () => h(IconName) })`

### Icon Sizes (mapped to component context)

| Context | Size | Icon Token |
|---------|------|------------|
| Button Small | 14px | sm |
| Button Default | 16px | md |
| Button Large | 20px | lg |
| Menu Item | 16px | md |
| Dropdown Item | 16px | md |
| Input Prefix | 16px | md |
| Card Header | 20px | lg |

### Button Icons (Standard Mapping)

| Button Action | Icon | Import |
|---------------|------|--------|
| Sign In / Login | `Login` | `@vicons/carbon` |
| Sign Up / Register | `UserAvatar` | `@vicons/carbon` |
| Add / Create | `Add` | `@vicons/carbon` |
| Edit | `Edit` | `@vicons/carbon` |
| Delete | `TrashCan` | `@vicons/carbon` |
| Search | `Search` | `@vicons/carbon` |
| Refresh | `Refresh` | `@vicons/carbon` |
| Export / Download | `Download` | `@vicons/carbon` |
| Import / Upload | `Upload` | `@vicons/carbon` |
| Settings | `Settings` | `@vicons/carbon` |
| Back / Arrow Left | `ArrowLeft` | `@vicons/carbon` |
| Forward / Arrow Right | `ArrowRight` | `@vicons/carbon` |
| Close | `Close` | `@vicons/carbon` |
| Check / Confirm | `Checkmark` | `@vicons/carbon` |

### Menu Item Icons (Current Mapping)

| Menu Item | Icon | Import |
|-----------|------|--------|
| Dashboard | `Grid` | `@vicons/carbon` |
| User Management | `UserMultiple` | `@vicons/carbon` |
| User | `User` | `@vicons/carbon` |
| Guard | `Security` | `@vicons/carbon` |
| Role | `Rule` | `@vicons/carbon` |
| Permissions | `Document` | `@vicons/carbon` |
| Profile | `UserAvatar` | `@vicons/carbon` |
| Logout | `Logout` | `@vicons/carbon` |
```

### 1.2 Add Animation System Section
Tambahkan section baru setelah "Icons":

```markdown
## Animations

### Library
- **Primary**: CSS Transitions & Vue `<Transition>`
- **Optional**: `anime.js` (lightweight, ~17KB gzipped)

### Animation Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| Fast | 150ms | ease-out | Hover effects, button states |
| Normal | 250ms | ease-in-out | Page transitions, card reveals |
| Slow | 350ms | ease-in-out | Modal/drawer enter/leave |
| Bounce | 400ms | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Emphasis, notifications |

### Page Transitions

| Transition | Enter | Leave | Usage |
|------------|-------|-------|-------|
| Fade | opacity 0→1 | opacity 1→0 | Default page transition |
| Slide-Up | translateY(20px)→0 + opacity | reverse | Dashboard content |
| Slide-Left | translateX(20px)→0 + opacity | reverse | Sidebar content |
| Scale | scale(0.95)→1 + opacity | reverse | Cards, modals |

### Micro-Interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Button | hover | scale(1.02) + shadow increase |
| Button | click | scale(0.98) then scale(1) |
| Card | mount | slideUp 250ms staggered |
| Menu Item | hover | background-color 150ms |
| Menu Item | active | border-left 250ms |
| Input | focus | border-color 200ms |
| Alert | mount | slideDown 250ms + fade |
| Dropdown | enter | scale(0.95)→1 + opacity |
| Toast | enter | slideInRight 300ms |
| Toast | leave | slideOutRight 200ms |

### Vue Transition Classes

```css
/* Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 250ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Slide-Up */
.slide-up-enter-active, .slide-up-leave-active { transition: all 250ms ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-10px); }

/* Slide-Left */
.slide-left-enter-active, .slide-left-leave-active { transition: all 250ms ease; }
.slide-left-enter-from { opacity: 0; transform: translateX(20px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-10px); }

/* Scale */
.scale-enter-active, .scale-leave-active { transition: all 250ms ease; }
.scale-enter-from { opacity: 0; transform: scale(0.95); }
.scale-leave-to { opacity: 0; transform: scale(0.95); }
```

### Stagger Animation Pattern
Untuk list items (table rows, menu items, cards):
```css
.stagger-item { animation: slideUp 250ms ease backwards; }
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 50ms; }
.stagger-item:nth-child(3) { animation-delay: 100ms; }
/* ... dst */
```

### Reduced Motion
Semua animasi harus menghormati `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
```

---

## Phase 2: Implementation Plan — Icons

### 2.1 Create Icon Helper Utility
Buat reusable icon render function:
- **File**: `client/src/utils/icons.ts`
- **Export**: `renderIcon(icon)` — wraps icon in NIcon
- **Export**: `iconMap` — mapping action names to icon components

### 2.2 Add Icons to Buttons

#### LoginPage.vue
- Import `Login` from `@vicons/carbon`
- Add `<template #icon><NIcon><Login /></NIcon></template>` ke Sign In button

#### RegisterPage.vue
- Import `UserAvatar` from `@vicons/carbon`
- Add icon ke Sign Up button

#### DashboardPage.vue
- Import `UserMultiple`, `Role`, `Document`, `Security` dari `@vicons/carbon`
- Add icons ke 4 Quick Actions buttons:
  - Manage Users → `UserMultiple`
  - Manage Roles → `Role`
  - Manage Permissions → `Document`
  - Manage Guards → `Security`

#### UsersPage.vue
- Import `Add` from `@vicons/carbon`
- Add icon ke "Add User" button

#### RolesPage.vue
- Import `Add` from `@vicons/carbon`
- Add icon ke "Add Role" button

#### PermissionsPage.vue
- Import `Add` from `@vicons/carbon`
- Add icon ke "Add Permission" button

#### GuardsPage.vue
- Import `Add` from `@vicons/carbon`
- Add icon ke "Add Guard" button

### 2.3 Button Icon Pattern
```vue
<NButton type="primary" @click="handleAdd">
  <template #icon>
    <NIcon><Add /></NIcon>
  </template>
  Add User
</NButton>
```

---

## Phase 3: Implementation Plan — Animations

### 3.1 Create Transition Components
Buat reusable transition wrapper:
- **File**: `client/src/components/common/AppTransition.vue`
- **Props**: `name` (fade|slide-up|slide-left|scale), `mode` (out-in|in-out)
- **Usage**: `<AppTransition name="fade"><RouterView /></AppTransition>`

### 3.2 Add Page Transitions
- **File**: `client/src/App.vue` (or `router/index.ts` via `<RouterView>`)
- Wrap `<RouterView>` dengan `<AppTransition name="fade">`
- Atau per-route transition dengan `<RouterView v-slot="{ Component }">`

### 3.3 Add Component Animations

#### Cards & Content
- **DashboardPage.vue**: Stagger animation on grid cards mount
- **UsersPage/RolesPage/PermissionsPage/GuardsPage**: Card enter animation

#### Buttons
- Add CSS hover/click micro-interactions:
  ```css
  .n-button { transition: transform 150ms ease, box-shadow 150ms ease; }
  .n-button:hover { transform: scale(1.02); }
  .n-button:active { transform: scale(0.98); }
  ```

#### Forms (Login/Register)
- Form field stagger entrance animation
- Alert slide-down on error

#### Sidebar
- Menu item hover border transition
- Collapse/expand animation (sudah ada di Naive UI)

### 3.4 Create Global Animation Styles
- **File**: `client/src/assets/styles/animations.css`
- Define all transition classes
- Add stagger keyframes
- Add prefers-reduced-motion

### 3.5 (Optional) Install anime.js
Jika diperlukan animasi lebih kompleks:
```bash
npm install animejs
```
- **File**: `client/src/composables/useAnimation.ts`
- Composable untuk animasi orchestrated (misal: sequential card reveal)

---

## Files to Create

| File | Description |
|------|-------------|
| `client/src/utils/icons.ts` | Icon render helper + icon map |
| `client/src/components/common/AppTransition.vue` | Reusable transition wrapper |
| `client/src/assets/styles/animations.css` | Global animation styles |

## Files to Modify

| File | Changes |
|------|---------|
| `docs/design-system.md` | Add Icons + Animations sections |
| `client/src/App.vue` | Add page transitions |
| `client/src/views/LoginPage.vue` | Add icon to login button |
| `client/src/views/RegisterPage.vue` | Add icon to register button |
| `client/src/views/DashboardPage.vue` | Add icons to quick actions + card animations |
| `client/src/views/UsersPage.vue` | Add icon to Add User button |
| `client/src/views/RolesPage.vue` | Add icon to Add Role button |
| `client/src/views/PermissionsPage.vue` | Add icon to Add Permission button |
| `client/src/views/GuardsPage.vue` | Add icon to Add Guard button |
| `client/src/assets/styles/main.css` | Import animations.css |

---

## Implementation Order

1. **Phase 1** — Update `docs/design-system.md` (add Icons + Animations sections)
2. **Phase 2** — Create icon utility + add icons to all buttons
3. **Phase 3** — Create animation styles + add transitions to pages
4. **Phase 4** — Verify (build + visual check)

**Dependencies**:
- Phase 2 depends on Phase 1 (design doc defines icon mappings)
- Phase 3 depends on Phase 1 (design doc defines animation tokens)
- Phase 2 & 3 are independent of each other

---

## Verification

1. `npm run build` — no TypeScript errors
2. `npm run dev` — all buttons display icons correctly
3. `npm run storybook` — Storybook renders with icons and animations
4. Visual check:
   - Login/Register buttons have icons
   - Dashboard quick actions have icons
   - CRUD pages (Users/Roles/Permissions/Guards) "Add" buttons have icons
   - Page transitions are smooth
   - Cards animate on mount
   - Reduced motion mode works
