# Task 13: Update Design Read Detail — Vertical Label-Value Layout

## Goal

Standardisasi semua tampilan **read detail** (drawer + inline) menggunakan layout vertikal `label → value` yang konsisten, menggantikan `NDescriptions` (table) dan Tailwind ad-hoc.

## Reference: Target Pattern

```html
<div class="detail-view">
  <div class="detail-field">
    <span class="detail-label">{LABEL}</span>
    <span class="detail-value">{VALUE}</span>
  </div>
  ...
</div>
```

CSS tokens (scoped):
- `.detail-view` — `display: flex; flex-direction: column;`
- `.detail-field` — `padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.06);` (last-child: none)
- `.detail-label` — `11px, uppercase, letter-spacing 0.05em, color #94a3b8, font-weight 600`
- `.detail-value` — `14px, color #1e293b, font-weight 500, word-break: break-word`
- `.detail-value--text` — `font-weight 400, color #334155`
- `.detail-value--mono` — `font-family: SF Mono/Fira Code/Menlo/Consolas, 13px`
- `.detail-value--code` — `bg #f8fafc, border 1px solid #e2e8f0, border-radius 8px, padding 12px`

---

## Inventory

| # | File | Current Style | Status | Has Action Button? |
|---|------|---------------|--------|-------------------|
| 1 | `views/ActivityLogsPage.vue` | detail-view (inline) | **DONE** | No |
| 2 | `features/users/components/UserDetailDrawer.vue` | detail-view | **DONE** | Edit button ✓ |
| 3 | `features/users/components/RoleDetailDrawer.vue` | detail-view | **DONE** | Edit button ✓ |
| 4 | `features/users/components/PermissionDetailDrawer.vue` | detail-view | **DONE** | Edit button ✓ |
| 5 | `features/users/components/GuardDetailDrawer.vue` | detail-view | **DONE** | Edit button ✓ |
| 6 | `views/DashboardPage.vue` | **NDescriptions (OLD)** | **TODO** | No |
| 7 | `features/logging/components/LogDetailDrawer.vue` | **Tailwind (hybrid)** | **TODO** | Code actions ✓ |

---

## Changes Required

### 1. `views/DashboardPage.vue` — Profile Information

**Current**: `NDescriptions` with `NDescriptionsItem` (table layout, bordered, label-placement="left")

**Fields**:
- Username
- Email

**Plan**:
- Remove `NDescriptions`, `NDescriptionsItem` from import
- Replace `<NDescriptions>` block with `<div class="detail-view">` containing two `.detail-field` divs
- Add `<style scoped>` with the `.detail-view` CSS tokens
- Keep NCard wrapper and all other structure unchanged

**Before**:
```vue
<NDescriptions label-placement="left" bordered :column="1">
  <NDescriptionsItem label="Username">{{ authStore.user.username }}</NDescriptionsItem>
  <NDescriptionsItem label="Email">{{ authStore.user.email }}</NDescriptionsItem>
</NDescriptions>
```

**After**:
```vue
<div class="detail-view">
  <div class="detail-field">
    <span class="detail-label">Username</span>
    <span class="detail-value detail-value--mono">{{ authStore.user.username }}</span>
  </div>
  <div class="detail-field">
    <span class="detail-label">Email</span>
    <span class="detail-value">{{ authStore.user.email }}</span>
  </div>
</div>
```

---

### 2. `features/logging/components/LogDetailDrawer.vue` — System Log Detail

**Current**: Tailwind utility classes (`text-xs font-medium text-gray-400 uppercase tracking-wider mb-1` for labels, ad-hoc containers for values)

**Fields**:
- Level (LogLevelBadge component)
- Timestamp (mono)
- Context (NTag)
- Message (preformatted text block)
- Stack Trace (NCode block, conditional)
- Raw Line (NCode block, conditional)
- Source Code Path + Line (with action buttons: Open in VS Code, Copy Path, Line)

**Plan**:
- Replace Tailwind label classes with `.detail-label` class
- Wrap each field section in `.detail-field` div
- Replace ad-hoc value containers with `.detail-value` classes
- Keep all action buttons (Open in VS Code, Copy Path, Line) — do NOT remove
- Add `<style scoped>` with the `.detail-view` CSS tokens
- Keep NCode blocks with dark background styling (stack trace, raw line)

**Before** (label pattern):
```html
<div class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Context</div>
```

**After**:
```html
<div class="detail-field">
  <span class="detail-label">Context</span>
  <span class="detail-value">...</span>
</div>
```

**Preserved elements**:
- `LogLevelBadge` component (stays as-is inside `.detail-value`)
- `NCode` blocks for stack trace / raw line (stays with dark bg, wrapped in `.detail-field`)
- Action buttons section (Open in VS Code, Copy Path, Line) — keep full functionality

---

## Implementation Steps

1. **Edit `DashboardPage.vue`**
   - Remove `NDescriptions`, `NDescriptionsItem` from import
   - Replace template block
   - Add `<style scoped>` section

2. **Edit `LogDetailDrawer.vue`**
   - Replace Tailwind label/value classes with `.detail-view` pattern
   - Add `<style scoped>` section
   - Preserve all action buttons and NCode blocks

3. **Update `docs/design-system.md`**
   - Add new section: **"Detail View (Read Detail)"**
   - Document the `.detail-view` CSS pattern as the standard
   - Specify: all detail drawers and inline detail views MUST use this pattern
   - Include CSS token reference table
   - Include the label/value HTML structure
   - Note about preserving action buttons in footer/inline

---

## Files to Modify

| File | Action |
|------|--------|
| `client/src/views/DashboardPage.vue` | Convert NDescriptions → detail-view |
| `client/src/features/logging/components/LogDetailDrawer.vue` | Convert Tailwind → detail-view |
| `docs/design-system.md` | Add Detail View section |

---

## Verification

1. Run `vue-tsc -b --noEmit` in `client/` to verify no type errors
2. Visually verify Dashboard Profile Information card renders correctly
3. Visually verify System Log Detail drawer renders with all fields + action buttons
4. Confirm all existing action buttons (Edit, Open in VS Code, Copy Path, Line) are preserved
