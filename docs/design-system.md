# Design System

## Overview

Design system menggunakan **Naive UI** sebagai komponen utama dengan Tailwind CSS sebagai pelengkap untuk spacing/utility classes. Semua token didefinisikan melalui Naive UI `GlobalThemeOverrides`.

---

## Color Palette

### Primary

| Token           | Hex         | Usage                  |
| --------------- | ----------- | ---------------------- |
| Primary 50      | `#EFF6FF`   | Background hover/light |
| Primary 100     | `#DBEAFE`   | Soft background        |
| Primary 200     | `#BFDBFE`   | Border light           |
| Primary 300     | `#93C5FD`   | Disabled state         |
| Primary 400     | `#60A5FA`   | Secondary button       |
| **Primary 500** | **`#3B82F6`** | **Main Brand Color** |
| Primary 600     | `#2563EB`   | Button Hover           |
| Primary 700     | `#1D4ED8`   | Active                 |
| Primary 800     | `#1E40AF`   | Strong emphasis        |
| Primary 900     | `#1E3A8A`   | Dark Mode              |

### Natural (Gray)

| Token    | Hex       |
| -------- | --------- |
| Gray 50  | `#F9FAFB` |
| Gray 100 | `#F3F4F6` |
| Gray 200 | `#E5E7EB` |
| Gray 300 | `#D1D5DB` |
| Gray 400 | `#9CA3AF` |
| Gray 500 | `#6B7280` |
| Gray 600 | `#4B5563` |
| Gray 700 | `#374151` |
| Gray 800 | `#1F2937` |
| Gray 900 | `#111827` |

### Semantic Colors

| Token   | Hex       | Usage       |
| ------- | --------- | ----------- |
| Success | `#22C55E` | Success     |
| Warning | `#F59E0B` | Warning     |
| Error   | `#EF4444` | Error       |
| Info    | `#0EA5E9` | Information |

### Background

| Token      | Hex       |
| ---------- | --------- |
| Background | `#FFFFFF` |
| Surface    | `#F8FAFC` |
| Card       | `#FFFFFF` |
| Sidebar    | `#F9FAFB` |

### Border

| Token   | Hex       |
| ------- | --------- |
| Default | `#E5E7EB` |
| Focus   | `#3B82F6` |
| Divider | `#F3F4F6` |

---

## Typography

| Token   | Size | Line Height | Weight   |
| ------- | ---- | ----------- | -------- |
| Display | 32px | 40px        | Bold     |
| H1      | 28px | 36px        | Bold     |
| H2      | 24px | 32px        | Bold     |
| H3      | 20px | 28px        | Semibold |
| H4      | 18px | 26px        | Semibold |
| H5      | 16px | 24px        | Medium   |
| H6      | 14px | 20px        | Medium   |
| Body    | 14px | 20px        | Regular  |
| Small   | 13px | 18px        | Regular  |
| Caption | 12px | 16px        | Regular  |

---

## Spacing

| Token | Value |
| ----- | ----- |
| xs    | 2px   |
| sm    | 4px   |
| md    | 8px   |
| lg    | 12px  |
| xl    | 16px  |
| 2xl   | 24px  |
| 3xl   | 32px  |

---

## Border Radius

| Token | Value  |
| ----- | ------ |
| xs    | 2px    |
| sm    | 4px    |
| md    | 6px    |
| lg    | 8px    |
| xl    | 12px   |
| Full  | 9999px |

---

## Component Dimensions

### Component Height

| Component      | Height |
| -------------- | ------ |
| Button Small   | 28px   |
| Button Default | 32px   |
| Button Large   | 36px   |
| Input          | 32px   |
| Select         | 32px   |
| Badge          | 20px   |
| Tag            | 20px   |
| Switch         | 18px   |
| Checkbox       | 16px   |
| Radio          | 16px   |

### Button Padding

| Size    | Padding  |
| ------- | -------- |
| Small   | `0 10px` |
| Default | `0 12px` |
| Large   | `0 16px` |

### Icon Size

| Token | Size |
| ----- | ---- |
| xs    | 12px |
| sm    | 14px |
| md    | 16px |
| lg    | 20px |
| xl    | 24px |

---

## Container

| Token          | Value |
| -------------- | ----- |
| Card Padding   | 12px  |
| Modal Padding  | 16px  |
| Drawer Padding | 16px  |
| Form Gap       | 12px  |
| Section Gap    | 20px  |

---

## Table

| Item          | Value |
| ------------- | ----- |
| Row Height    | 36px  |
| Cell Padding  | 8px   |
| Header Height | 40px  |

### Table Interaction Patterns

#### Sort Indicators
- **Unsorted**: No indicator (column header text only)
- **Ascending**: ↑ arrow (Carbon `ArrowUp` icon, 14px, Primary 500 color)
- **Descending**: ↓ arrow (Carbon `ArrowDown` icon, 14px, Primary 500 color)
- **Transition**: 150ms ease-out color change on hover

#### Column Visibility Toggle
- **Trigger**: NDropdown with checkbox items
- **Icon**: Carbon `View` / `ViewOff` icon
- **Position**: Toolbar right side, next to refresh button
- **Behavior**: Toggle visibility immediately, persist in localStorage

#### Search Field Selector
- **Component**: NSelect (filterable, small size)
- **Default**: "All Fields" option
- **Position**: Toolbar left side, adjacent to search input
- **Width**: 160px fixed

#### Pagination Text
- **Format**: "Showing {from}-{to} of {total}"
- **Position**: Below table, left-aligned
- **Style**: `text-sm text-gray-500`

#### Loading State
- **Component**: NSpin with `show` prop
- **Overlay**: Semi-transparent white background
- **Position**: Absolute overlay on table

#### Empty State
- **Component**: NEmpty
- **Description**: "No {entity} found"
- **Position**: Centered in table body

#### Error State
- **Component**: NAlert
- **Type**: error
- **Position**: Above table, full width
- **Dismissable**: Yes (close button)

---

## Layout Dimensions

### Sidebar

| Item        | Value |
| ----------- | ----- |
| Width       | 220px |
| Collapse    | 72px  |
| Item Height | 36px  |

### Navbar

| Item   | Value |
| ------ | ----- |
| Height | 52px  |

---

## Responsive

### Device Reference

| Device           | Width       |
| ---------------- | ----------- |
| Mobile           | 320–639px   |
| Tablet Portrait  | 640–767px   |
| Tablet Landscape | 768–1023px  |
| Laptop           | 1024–1279px |
| Desktop          | 1280–1535px |
| Large Desktop    | ≥1536px     |

### Container Width

| Breakpoint | Max Width |
| ---------- | --------- |
| sm         | 640px     |
| md         | 768px     |
| lg         | 1024px    |
| xl         | 1280px    |
| 2xl        | 1536px    |

### Grid System

| Device  | Columns |
| ------- | ------- |
| Mobile  | 4       |
| Tablet  | 8       |
| Desktop | 12      |

### Container Padding

| Device  | Padding |
| ------- | ------- |
| Mobile  | 16px    |
| Tablet  | 24px    |
| Desktop | 32px    |

### Responsive Typography

| Token | Mobile | Tablet | Desktop |
| ----- | ------ | ------ | ------- |
| H1    | 32px   | 40px   | 48px    |
| H2    | 28px   | 32px   | 36px    |
| H3    | 24px   | 28px   | 30px    |
| H4    | 20px   | 24px   | 24px    |
| Body  | 14px   | 16px   | 16px    |
| Small | 12px   | 14px   | 14px    |

---

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
| Role | `UserRole` | `@vicons/carbon` |
| Permissions | `Document` | `@vicons/carbon` |
| Profile | `UserAvatar` | `@vicons/carbon` |
| Logout | `Logout` | `@vicons/carbon` |

---

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

---

## Implementation Notes

- **Naive UI** adalah komponen utama — gunakan `GlobalThemeOverrides` untuk customisasi tema
- **Tailwind CSS** hanya untuk utility classes (spacing, display, flexbox) yang tidak tersedia di Naive UI
- Semua komponen harus dibungkus dengan `NConfigProvider`
- Gunakan direct import per komponen, jangan global import
- Gunakan `v-model:value` untuk form components
- Gunakan `on-update:*` pattern untuk event handlers
