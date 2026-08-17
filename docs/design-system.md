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

## Detail View (Read Detail)

Standar layout untuk semua tampilan **read detail** (drawer sidebar, inline card). Menggantikan `NDescriptions` (table layout) dengan format vertikal **label → value** yang lebih mudah dibaca.

### Pattern

```html
<div class="detail-view">
  <div class="detail-field">
    <span class="detail-label">{LABEL}</span>
    <span class="detail-value">{VALUE}</span>
  </div>
</div>
```

### CSS Tokens (Scoped)

| Class | Property | Value |
|-------|----------|-------|
| `.detail-view` | display | `flex` |
| `.detail-view` | flex-direction | `column` |
| `.detail-field` | padding | `12px 0` |
| `.detail-field` | border-bottom | `1px solid rgba(0,0,0,0.06)` |
| `.detail-field:last-child` | border-bottom | `none` |
| `.detail-label` | display | `block` |
| `.detail-label` | font-size | `11px` |
| `.detail-label` | font-weight | `600` |
| `.detail-label` | text-transform | `uppercase` |
| `.detail-label` | letter-spacing | `0.05em` |
| `.detail-label` | color | `#94a3b8` |
| `.detail-label` | margin-bottom | `4px` |
| `.detail-value` | display | `block` |
| `.detail-value` | font-size | `14px` |
| `.detail-value` | font-weight | `500` |
| `.detail-value` | color | `#1e293b` |
| `.detail-value` | line-height | `1.5` |
| `.detail-value` | word-break | `break-word` |

### Modifiers

| Class | Usage |
|-------|-------|
| `.detail-value--text` | Long text content. `font-weight: 400; color: #334155` |
| `.detail-value--mono` | IDs, timestamps, IPs, code paths. `font-family: SF Mono/Fira Code/Menlo/Consolas; font-size: 13px` |
| `.detail-value--code` | JSON metadata, raw content. `bg: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px` |
| `.detail-value--dark` | Stack traces, dark code blocks. `bg: #1e293b; border: #334155; pre color: #e2e8f0` |

### Implementation Checklist

Semua detail views **WAJIB** menggunakan pola ini:

| Component | File | Status |
|-----------|------|--------|
| Activity Log Detail | `views/ActivityLogsPage.vue` | Done |
| User Detail | `features/users/components/UserDetailDrawer.vue` | Done |
| Role Detail | `features/users/components/RoleDetailDrawer.vue` | Done |
| Permission Detail | `features/users/components/PermissionDetailDrawer.vue` | Done |
| Guard Detail | `features/users/components/GuardDetailDrawer.vue` | Done |
| Profile Info | `views/DashboardPage.vue` | Done |
| System Log Detail | `features/logging/components/LogDetailDrawer.vue` | Done |
| Dynamic Detail | `components/common/DynamicDetailDrawer.vue` | Planned |

**Larangan**: Gunakan `NDescriptions` / `NDescriptionsItem` untuk detail views. Gunakan pola `.detail-view` di atas.

---

## Table

### Dimensions

| Item          | Value |
| ------------- | ----- |
| Row Height    | 36px  |
| Cell Padding  | 8px   |
| Header Height | 40px  |

### Required Features

Semua tabel di sistem **WAJIB** memiliki fitur berikut:

| Feature | Description | Component |
|---------|-------------|-----------|
| **Global Search** | Pencarian global across semua kolom. Input harus lebar minimal `320px`. | `NInput` with prefix icon `Search` |
| **Field-Specific Search** | Dropdown untuk memilih kolom tertentu. Default: "All Fields". | `NSelect` (filterable, width: `160px`) |
| **Column Visibility** | Toggle show/hide kolom. Persist ke localStorage. | `NPopover` + `NCheckbox` items |
| **Sorting** | Klik header kolom untuk sort ASC/DESC. | `NDataTable` sorter prop |
| **Pagination** | Navigasi halaman dengan page selector. | `NDataTable` built-in pagination |
| **Page Size** | Pilihan: 10, 20, 50, 100. Default: 20. | `NDataTable` page-sizes |
| **Refresh/Reload** | Tombol refresh untuk fetch ulang data. | `NButton` with `Restart` icon |

### Search Input Specification

| Property | Value | Description |
|----------|-------|-------------|
| Min Width | `320px` | Agar placeholder dan input terlihat jelas |
| Max Width | `flex-1` | Mengisi ruang yang tersedia |
| Height | `32px` | Sesuai standar Naive UI |
| Placeholder | `Search {entity}...` | Context-aware placeholder |
| Clearable | `true` | Tombol X untuk clear |
| Prefix Icon | `Search` (Carbon) | Icon di sebelah kiri input |
| Debounce | `300ms` | Delay sebelum fetch data |

---

## Wizard Pattern (System Creators)

### Multi-Step Wizard

Digunakan untuk create module baru di System Creators.

#### Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [1 Basic] ─── [2 Fields] ─── [3 Relations] ─── [4 Access] ─── [5 Review]  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │                    Step Content                         │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [← Back]                                    [Next →]        │
└──────────────────────────────────────────────────────────────┘
```

#### Step Indicator

| State | Style |
|-------|-------|
| Completed | Green circle with checkmark + green line |
| Current | Blue circle with number + blue line |
| Upcoming | Gray circle with number + gray line |

#### CSS Classes

```css
.wizard-step-indicator { display: flex; align-items: center; gap: 8px; }
.wizard-step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
.wizard-step-dot--completed { background: #22C55E; color: white; }
.wizard-step-dot--current { background: #3B82F6; color: white; }
.wizard-step-dot--upcoming { background: #E5E7EB; color: #6B7280; }
.wizard-step-line { height: 2px; flex: 1; }
.wizard-step-line--completed { background: #22C55E; }
.wizard-step-line--current { background: #3B82F6; }
.wizard-step-line--upcoming { background: #E5E7EB; }
```

---

## Dynamic Form Rendering

### Form Field Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Label (13px, semibold, gray-700)                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Input / Select / Datepicker / etc.                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Help text (12px, gray-400)                       *required  │
└─────────────────────────────────────────────────────────────┘
```

### Field Type → Component Mapping

| Field Type | Component | Width | Special |
|-----------|-----------|-------|---------|
| `text` | `NInput` | full | — |
| `textarea` | `NInput type="textarea"` | full | :rows="3" |
| `rich-text` | Tiptap or `NInput type="textarea"` | full | — |
| `number` | `NInputNumber` | full | — |
| `boolean` | `NSwitch` | auto | — |
| `date` | `NDatePicker type="date"` | full | — |
| `datetime` | `NDatePicker type="datetime"` | full | — |
| `email` | `NInput` | full | type="email" validation |
| `phone` | `NInput` | full | phone pattern validation |
| `url` | `NInput` | full | URL validation |
| `password` | `NInput type="password"` | full | show-password-on="click" |
| `color` | `NColorPicker` | 200px | — |
| `select` | `NSelect` | full | options from config |
| `json` | `NInput type="textarea"` | full | JSON validation |
| `file` | `NUpload` | full | action="/api/generated/{name}/upload" |
| `image` | `NUpload` | full | list-type="image-card" |

### Required Field Indicator

```vue
<NFormItem :label="field.label" :required="field.required" :path="field.name">
  <!-- component -->
</NFormItem>
```

---

## Dynamic Table Rendering

### Column Rendering by Type

| Field Type | Table Cell Display |
|-----------|-------------------|
| `text`, `email`, `phone` | Plain text |
| `url` | `<a>` link with `target="_blank"` |
| `boolean` | `NTag` (Yes=green / No=red) |
| `date` | `new Date(val).toLocaleDateString()` |
| `datetime` | `new Date(val).toLocaleString()` |
| `number` | `val.toLocaleString()` |
| `select` | `NTag` with color from options |
| `password` | `****` (masked) |
| `color` | Color swatch + hex code |
| `json` | Truncated `{...}` preview |
| `file` | File icon + name link |
| `image` | `<img>` thumbnail (32x32) |
| `rich-text` | Stripped HTML, truncated |
| `textarea` | Truncated text |

### Default Column Width

| Field Type | Width |
|-----------|-------|
| `id` | 60px |
| `boolean` | 80px |
| `date` | 120px |
| `datetime` | 160px |
| `select` | 120px |
| `color` | 80px |
| `image` | 64px |
| `file` | 120px |
| `actions` | 160px |
| others | auto |

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

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Authorization UI Patterns

### Access Denied Alert

| Element | Component | Usage |
|---------|-----------|-------|
| Access Denied Alert | `NAlert` type="error" | Shown when 403 returned from API |
| Alert Title | "Access Denied" | Bold heading |
| Alert Icon | `Locked` from `@vicons/carbon` | Left icon |
| Dismissable | `true` | Close button available |

### Conditional Rendering

```vue
<!-- Hide button if user lacks permission -->
<NButton v-if="hasPermission('User Management')" @click="createUser">
  Add User
</NButton>

<!-- Hide menu item if user lacks role -->
<NMenuItem v-if="hasAnyRole(['Admin', 'Super Admin'])" key="users">
  User Management
</NMenuItem>
```

### Error Response Handling

| HTTP Status | Client Action | UI Feedback |
|-------------|---------------|-------------|
| 401 | Clear token, redirect `/login` | "Session expired" message |
| 403 | Show access denied alert | "Access denied" NAlert |
| 404 | Show not found page | "Resource not found" |
| 500 | Show error alert | "Server error" NAlert |

---

## Icons

### Icon Library
- **Library**: `@vicons/carbon` (Carbon Design System)
- **Wrapper**: Naive UI `NIcon`

### Menu Item Icons (Current Mapping)

| Menu Item | Icon | Import |
|-----------|------|--------|
| Dashboard | `Grid` | `@vicons/carbon` |
| User Management | `UserMultiple` | `@vicons/carbon` |
| User | `User` | `@vicons/carbon` |
| Guard | `Security` | `@vicons/carbon` |
| Role | `UserRole` | `@vicons/carbon` |
| Permissions | `Document` | `@vicons/carbon` |
| Activity Logs | `Activity` | `@vicons/carbon` |
| System Logs | `Report` | `@vicons/carbon` |
| Settings | `Settings` | `@vicons/carbon` |
| System Creators | `Cube` | `@vicons/carbon` |
| Generated Modules | `CubeSpawn` | `@vicons/carbon` |

---

## Profile Page

### Endpoint

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/api/auth/profile` | Bearer | Update profil sendiri |
| PATCH | `/api/auth/password` | Bearer | Ganti password |

### Layout

```
AppLayout
├── NCard "Profile Information"
│   ├── NForm (firstName, lastName, email, username)
│   └── NButton "Save Changes"
│
└── NCard "Change Password"
    ├── NForm (currentPassword, newPassword, confirmPassword)
    └── NButton "Change Password"
```

---

## Implementation Notes

- **Naive UI** adalah komponen utama — gunakan `GlobalThemeOverrides` untuk customisasi tema
- **Tailwind CSS** hanya untuk utility classes (spacing, display, flexbox)
- Semua komponen harus dibungkus dengan `NConfigProvider`
- Gunakan direct import per komponen, jangan global import
- Gunakan `v-model:value` untuk form components
- Gunakan `on-update:*` pattern untuk event handlers
- Dynamic components (DynamicFormRenderer, DynamicTableRenderer) use `<component :is>` for field type switching
