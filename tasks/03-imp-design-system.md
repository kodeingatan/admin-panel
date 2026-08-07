# Task 03: Implement Design System

## Objective

Initialize Naive UI theme configuration and design tokens in the client app based on `docs/design-system.md`.

---

## Phase 1: Create Theme Configuration

- [ ] Create `src/plugins/naiveui.ts` — NConfigProvider setup with theme overrides
- [ ] Define `GlobalThemeOverrides` with primary, error, warning, success colors
- [ ] Configure common theme tokens (borderRadius, fontFamily, fontSize)
- [ ] Export theme provider component for use in App.vue

---

## Phase 2: Update App Entry

- [ ] Update `src/main.ts` — wrap app with NConfigProvider
- [ ] Add `NGlobalStyle` for body style sync
- [ ] Add `NMessageProvider` for programmatic messages
- [ ] Add `NDialogProvider` for programmatic dialogs
- [ ] Add `NNotificationProvider` for notifications

---

## Phase 3: Global Styles

- [ ] Update `src/assets/styles/main.css` — add base resets if needed
- [ ] Ensure Tailwind CSS works alongside Naive UI (no preflight conflict)
- [ ] Add CSS custom properties for design tokens (optional, for Tailwind usage)

---

## Phase 4: Verify

- [ ] Run `npm run build` — type check passes
- [ ] Run `npm run storybook` — Storybook renders with themed components
- [ ] Verify Naive UI components render with correct primary color
- [ ] Verify form validation works with NConfigProvider

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/plugins/naiveui.ts` | Create | Theme config + provider component |
| `src/main.ts` | Modify | Wrap with providers |
| `src/assets/styles/main.css` | Modify | Global styles if needed |

---

## Reference

- `docs/design-system.md` — Design tokens
- `docs/architecture.md` — Architecture conventions
- `.opencode/skills/naiveui-practices/SKILL.md` — Naive UI best practices
