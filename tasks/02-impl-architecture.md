# Task 02: Implement Architecture

## Objective

Restructure the project to follow Vue 3 + NestJS best practices architecture based on `docs/architecture.md`.

---

## Phase 1: Client — Create Missing Directories

- [ ] Create `src/components/base/`
- [ ] Create `src/components/common/`
- [ ] Create `src/components/layout/`
- [ ] Create `src/composables/`
- [ ] Create `src/constants/`
- [ ] Create `src/directives/`
- [ ] Create `src/features/auth/`
- [ ] Create `src/features/dashboard/`
- [ ] Create `src/features/users/`
- [ ] Create `src/layouts/`
- [ ] Create `src/plugins/`
- [ ] Create `src/router/`
- [ ] Create `src/services/`
- [ ] Create `src/stores/`
- [ ] Create `src/types/`
- [ ] Create `src/utils/`
- [ ] Create `src/views/`
- [ ] Create `src/assets/images/`
- [ ] Create `src/assets/icons/`
- [ ] Create `src/assets/styles/`

---

## Phase 2: Client — Move & Rename Files

### 2.1 Move Components

- [ ] Move `src/components/AppLayout/` → `src/components/layout/AppLayout/`
- [ ] Move `src/components/AuthForm/` → `src/components/common/AuthForm/`
- [ ] Move `src/components/FormField/` → `src/components/common/FormField/`
- [ ] Move `src/components/Button/` → `src/components/base/Button/`

### 2.2 Rename Pages to Views

- [ ] Create `src/views/` directory
- [ ] Move `src/pages/LoginPage.vue` → `src/views/LoginPage.vue`
- [ ] Move `src/pages/RegisterPage.vue` → `src/views/RegisterPage.vue`
- [ ] Move `src/pages/DashboardPage.vue` → `src/views/DashboardPage.vue`
- [ ] Delete `src/pages/` directory

### 2.3 Move Styles

- [ ] Move `src/style.css` → `src/assets/styles/main.css`

### 2.4 Move Router

- [ ] Move `src/router.ts` → `src/router/index.ts`

### 2.5 Move Stories to Root

- [ ] Move `src/stories/` → `stories/` (project root level)

---

## Phase 3: Client — Create Composables

- [ ] Create `src/composables/useAuth.ts` — Extract auth logic (login, register, logout, getProfile)
- [ ] Create `src/composables/useApi.ts` — Extract fetch logic with base URL & headers

---

## Phase 4: Client — Create Types

- [ ] Create `src/types/index.ts` — Export all types
- [ ] Create `src/types/user.ts` — User interface
- [ ] Create `src/types/auth.ts` — Auth-related types (LoginPayload, RegisterPayload, AuthResponse)

---

## Phase 5: Client — Update Imports

- [ ] Update `src/main.ts` — Import from `src/assets/styles/main.css`
- [ ] Update `src/views/LoginPage.vue` — Import from `src/components/common/`
- [ ] Update `src/views/RegisterPage.vue` — Import from `src/components/common/`
- [ ] Update `src/views/DashboardPage.vue` — Import from `src/components/layout/`
- [ ] Update `src/router/index.ts` — Import from `src/views/`
- [ ] Update all Storybook stories — Update import paths

---

## Phase 6: Server — Create Missing Directories

- [ ] Create `src/common/`
- [ ] Create `src/common/dto/`
- [ ] Create `src/common/guards/`
- [ ] Create `src/common/interceptors/`
- [ ] Create `src/common/filters/`
- [ ] Create `src/common/pipes/`
- [ ] Create `src/common/types/`
- [ ] Create `src/config/`
- [ ] Create `src/modules/`
- [ ] Create `src/modules/auth/controllers/`
- [ ] Create `src/modules/auth/services/`
- [ ] Create `src/modules/auth/dto/`
- [ ] Create `src/modules/auth/entities/`
- [ ] Create `src/modules/auth/strategies/`
- [ ] Create `src/modules/auth/guards/`
- [ ] Create `src/modules/users/`
- [ ] Create `src/modules/users/controllers/`
- [ ] Create `src/modules/users/services/`
- [ ] Create `src/modules/users/dto/`
- [ ] Create `src/modules/users/entities/`
- [ ] Create `src/modules/users/repositories/`
- [ ] Create `src/shared/`
- [ ] Create `src/shared/cache/`
- [ ] Create `src/shared/mail/`
- [ ] Create `src/shared/logger/`

---

## Phase 7: Server — Move Files

### 7.1 Move Auth Module

- [ ] Move `src/auth/auth.module.ts` → `src/modules/auth/auth.module.ts`
- [ ] Move `src/auth/auth.controller.ts` → `src/modules/auth/controllers/auth.controller.ts`
- [ ] Move `src/auth/auth.service.ts` → `src/modules/auth/services/auth.service.ts`
- [ ] Move `src/auth/jwt.strategy.ts` → `src/modules/auth/strategies/jwt.strategy.ts`
- [ ] Move `src/auth/jwt-auth.guard.ts` → `src/modules/auth/guards/jwt-auth.guard.ts`
- [ ] Move `src/auth/dto/register.dto.ts` → `src/modules/auth/dto/register.dto.ts`
- [ ] Move `src/auth/dto/login.dto.ts` → `src/modules/auth/dto/login.dto.ts`

### 7.2 Move User Entity

- [ ] Move `src/user.entity.ts` → `src/modules/users/entities/user.entity.ts`

### 7.3 Delete Old Directories

- [ ] Delete `src/auth/` directory

---

## Phase 8: Server — Update Imports

- [ ] Update `src/app.module.ts` — Import from new locations
- [ ] Update `src/modules/auth/auth.module.ts` — Import from relative paths
- [ ] Update `src/modules/auth/controllers/auth.controller.ts` — Import from relative paths
- [ ] Update `src/modules/auth/services/auth.service.ts` — Import from relative paths
- [ ] Update `src/modules/auth/strategies/jwt.strategy.ts` — Import from relative paths
- [ ] Update `src/modules/auth/guards/jwt-auth.guard.ts` — Import from relative paths

---

## Phase 9: Documentation & Final

- [ ] Update `AGENTS.md` with new structure
- [ ] Verify all imports work correctly
- [ ] Run `npm run build` on client
- [ ] Run `npm run build` on server
- [ ] Test all functionality

---

## Notes

- Keep existing functionality working after each phase
- Test after each major change
- Commit after each phase completion
- Do NOT skip phases — follow order
