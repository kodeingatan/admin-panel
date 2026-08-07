# Implementation Tasks: PRD & Database

## Overview

Implementasi RBAC (Role-Based Access Control) system untuk admin panel berdasarkan `docs/PRD.md` dan `docs/database.md`.

**Tidak ada coding** — hanya struktur file dan task list.

---

## Phase 1: Database Entities

### 1.1 Update User Entity
- [ ] Tambah relasi `@ManyToMany` ke `Role` via `users_roles`
- [ ] Tambah `@JoinTable` untuk junction table

**File**: `server/src/modules/users/entities/user.entity.ts`

### 1.2 Create Role Entity
- [ ] Buat `role.entity.ts` dengan fields: `id`, `roleName`, `description`, `createdAt`, `updatedAt`
- [ ] Tambah relasi `@ManyToMany` ke `User`
- [ ] Tambah relasi `@ManyToMany` ke `Guard`
- [ ] Tambah relasi `@ManyToMany` ke `Permission`

**File**: `server/src/modules/roles/entities/role.entity.ts`

### 1.3 Create Permission Entity
- [ ] Buat `permission.entity.ts` dengan fields: `id`, `permissionName`, `description`, `createdAt`, `updatedAt`
- [ ] Tambah relasi `@ManyToMany` ke `Role`
- [ ] Tambah relasi `@OneToMany` ke `PermissionMethod`
- [ ] Tambah relasi `@OneToMany` ke `PermissionUrl`

**File**: `server/src/modules/permissions/entities/permission.entity.ts`

### 1.4 Create Guard Entity
- [ ] Buat `guard.entity.ts` dengan fields: `id`, `guardName`, `description`, `createdAt`, `updatedAt`
- [ ] Tambah relasi `@ManyToMany` ke `Role`
- [ ] Tambah relasi `@OneToMany` ke `GuardUrl`

**File**: `server/src/modules/guards/entities/guard.entity.ts`

### 1.5 Create Junction Entities
- [ ] Buat `user-role.entity.ts` (junction: users ↔ roles)
- [ ] Buat `role-guard.entity.ts` (junction: roles ↔ guards)
- [ ] Buat `role-permission.entity.ts` (junction: roles ↔ permissions)
- [ ] Buat `guard-url.entity.ts` (junction: guards → urls, type: allow/deny)
- [ ] Buat `permission-method.entity.ts` (junction: permissions → methods)
- [ ] Buat `permission-url.entity.ts` (junction: permissions → urls)

**Files**:
- `server/src/modules/roles/entities/user-role.entity.ts`
- `server/src/modules/roles/entities/role-guard.entity.ts`
- `server/src/modules/roles/entities/role-permission.entity.ts`
- `server/src/modules/guards/entities/guard-url.entity.ts`
- `server/src/modules/permissions/entities/permission-method.entity.ts`
- `server/src/modules/permissions/entities/permission-url.entity.ts`

---

## Phase 2: Modules Setup

### 2.1 Create Roles Module
- [ ] Buat `roles.module.ts`
- [ ] Register entities: Role, UserRole, RoleGuard, RolePermission
- [ ] Export RolesService

**File**: `server/src/modules/roles/roles.module.ts`

### 2.2 Create Permissions Module
- [ ] Buat `permissions.module.ts`
- [ ] Register entities: Permission, PermissionMethod, PermissionUrl
- [ ] Export PermissionsService

**File**: `server/src/modules/permissions/permissions.module.ts`

### 2.3 Create Guards Module
- [ ] Buat `guards.module.ts`
- [ ] Register entities: Guard, GuardUrl
- [ ] Export GuardsService

**File**: `server/src/modules/guards/guards.module.ts`

### 2.4 Update Users Module
- [ ] Import RolesModule
- [ ] Register User entity

**File**: `server/src/modules/users/users.module.ts`

### 2.5 Update App Module
- [ ] Import RolesModule, PermissionsModule, GuardsModule
- [ ] Tambah entities ke TypeORM config

**File**: `server/src/app.module.ts`

---

## Phase 3: DTOs

### 3.1 User DTOs
- [ ] Buat `create-user.dto.ts` (firstName, lastName, username, email, password, confirmPassword, roleIds?)
- [ ] Buat `update-user.dto.ts` (semua optional kecuali id)
- [ ] Buat `query-user.dto.ts` (pagination, search, filter)

**File**: `server/src/modules/users/dto/`

### 3.2 Role DTOs
- [ ] Buat `create-role.dto.ts` (roleName, description?, guardIds?, permissionIds?)
- [ ] Buat `update-role.dto.ts`
- [ ] Buat `query-role.dto.ts`

**File**: `server/src/modules/roles/dto/`

### 3.3 Permission DTOs
- [ ] Buat `create-permission.dto.ts` (permissionName, description?, methods?, urls?)
- [ ] Buat `update-permission.dto.ts`
- [ ] Buat `query-permission.dto.ts`

**File**: `server/src/modules/permissions/dto/`

### 3.4 Guard DTOs
- [ ] Buat `create-guard.dto.ts` (guardName, description?, allowUrls?, denyUrls?)
- [ ] Buat `update-guard.dto.ts`
- [ ] Buat `query-guard.dto.ts`

**File**: `server/src/modules/guards/dto/`

---

## Phase 4: Services

### 4.1 Users Service
- [ ] Implement `findAll()` — list users dengan role, pagination
- [ ] Implement `findOne(id)` — detail user dengan role
- [ ] Implement `create(dto)` — buat user + assign role
- [ ] Implement `update(id, dto)` — update user + role
- [ ] Implement `remove(id)` — soft delete user

**File**: `server/src/modules/users/services/users.service.ts`

### 4.2 Roles Service
- [ ] Implement `findAll()` — list roles dengan guard & permission
- [ ] Implement `findOne(id)` — detail role
- [ ] Implement `create(dto)` — buat role + assign guard & permission
- [ ] Implement `update(id, dto)` — update role
- [ ] Implement `remove(id)` — delete role (cek apakah masih digunakan)

**File**: `server/src/modules/roles/services/roles.service.ts`

### 4.3 Permissions Service
- [ ] Implement `findAll()` — list permissions dengan method & url
- [ ] Implement `findOne(id)` — detail permission
- [ ] Implement `create(dto)` — buat permission + method & url
- [ ] Implement `update(id, dto)` — update permission
- [ ] Implement `remove(id)` — delete permission

**File**: `server/src/modules/permissions/services/permissions.service.ts`

### 4.4 Guards Service
- [ ] Implement `findAll()` — list guards dengan url rules
- [ ] Implement `findOne(id)` — detail guard
- [ ] Implement `create(dto)` — buat guard + url rules
- [ ] Implement `update(id, dto)` — update guard
- [ ] Implement `remove(id)` — delete guard

**File**: `server/src/modules/guards/services/guards.service.ts`

---

## Phase 5: Controllers

### 5.1 Users Controller
- [ ] `GET /api/users` — list users (paginated, search, filter)
- [ ] `GET /api/users/:id` — get user detail
- [ ] `POST /api/users` — create user (with role assignment)
- [ ] `PUT /api/users/:id` — update user
- [ ] `DELETE /api/users/:id` — delete user

**File**: `server/src/modules/users/controllers/users.controller.ts`

### 5.2 Roles Controller
- [ ] `GET /api/roles` — list roles
- [ ] `GET /api/roles/:id` — get role detail
- [ ] `POST /api/roles` — create role
- [ ] `PUT /api/roles/:id` — update role
- [ ] `DELETE /api/roles/:id` — delete role

**File**: `server/src/modules/roles/controllers/roles.controller.ts`

### 5.3 Permissions Controller
- [ ] `GET /api/permissions` — list permissions
- [ ] `GET /api/permissions/:id` — get permission detail
- [ ] `POST /api/permissions` — create permission
- [ ] `PUT /api/permissions/:id` — update permission
- [ ] `DELETE /api/permissions/:id` — delete permission

**File**: `server/src/modules/permissions/controllers/permissions.controller.ts`

### 5.4 Guards Controller
- [ ] `GET /api/guards` — list guards
- [ ] `GET /api/guards/:id` — get guard detail
- [ ] `POST /api/guards` — create guard
- [ ] `PUT /api/guards/:id` — update guard
- [ ] `DELETE /api/guards/:id` — delete guard

**File**: `server/src/modules/guards/controllers/guards.controller.ts`

---

## Phase 6: Seeders

### 6.1 Create Seeder Service
- [ ] Buat `seeder.service.ts` — logic untuk seed data
- [ ] Seed Users (admin)
- [ ] Seed Roles (Super Admin, Admin, User)
- [ ] Seed Guards (Full Access, Web Access, API Only)
- [ ] Seed Permissions (Full Access, Read Only, Read Write)
- [ ] Seed Junction Tables

**File**: `server/src/common/services/seeder.service.ts`

### 6.2 Run Seeders
- [ ] Jalankan seeder saat aplikasi pertama kali start
- [ ] Cek apakah data sudah ada (skip jika sudah)

---

## Phase 7: Authorization Guard

### 7.1 Create RBAC Guard
- [ ] Buat `rbac.guard.ts` — NestJS guard untuk otorisasi
- [ ] Implement JWT validation
- [ ] Implement user → role resolution
- [ ] Implement permission check (method + URL)
- [ ] Implement guard check (allow/deny URL)
- [ ] Return 403 jika tidak diizinkan

**File**: `server/src/common/guards/rbac.guard.ts`

### 7.2 Create RBAC Decorator
- [ ] Buat `@Roles()` decorator untuk controller methods
- [ ] Buat `@Permissions()` decorator

**File**: `server/src/common/decorators/`

### 7.3 Apply Guards
- [ ] Apply RBAC guard ke semua endpoint yang memerlukan otorisasi
- [ ] Test alur: Login → Get Token → Akses endpoint → Cek otorisasi

---

## Phase 8: Testing

### 8.1 Unit Tests
- [ ] Test Users Service
- [ ] Test Roles Service
- [ ] Test Permissions Service
- [ ] Test Guards Service
- [ ] Test RBAC Guard

### 8.2 Integration Tests
- [ ] Test CRUD operations untuk semua entity
- [ ] Test authorization flow
- [ ] Test edge cases (duplicate data, foreign key constraints)

### 8.3 E2E Tests
- [ ] Test full flow: Register → Login → Create Role → Assign → Akses endpoint

---

## Files to Create

```
server/src/
├── modules/
│   ├── roles/
│   │   ├── roles.module.ts
│   │   ├── controllers/
│   │   │   └── roles.controller.ts
│   │   ├── services/
│   │   │   └── roles.service.ts
│   │   ├── dto/
│   │   │   ├── create-role.dto.ts
│   │   │   ├── update-role.dto.ts
│   │   │   └── query-role.dto.ts
│   │   └── entities/
│   │       ├── role.entity.ts
│   │       ├── user-role.entity.ts
│   │       ├── role-guard.entity.ts
│   │       └── role-permission.entity.ts
│   ├── permissions/
│   │   ├── permissions.module.ts
│   │   ├── controllers/
│   │   │   └── permissions.controller.ts
│   │   ├── services/
│   │   │   └── permissions.service.ts
│   │   ├── dto/
│   │   │   ├── create-permission.dto.ts
│   │   │   ├── update-permission.dto.ts
│   │   │   └── query-permission.dto.ts
│   │   └── entities/
│   │       ├── permission.entity.ts
│   │       ├── permission-method.entity.ts
│   │       └── permission-url.entity.ts
│   └── guards/
│       ├── guards.module.ts
│       ├── controllers/
│       │   └── guards.controller.ts
│       ├── services/
│       │   └── guards.service.ts
│       ├── dto/
│       │   ├── create-guard.dto.ts
│       │   ├── update-guard.dto.ts
│       │   └── query-guard.dto.ts
│       └── entities/
│           ├── guard.entity.ts
│           └── guard-url.entity.ts
├── common/
│   ├── guards/
│   │   └── rbac.guard.ts
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── permissions.decorator.ts
│   └── services/
│       └── seeder.service.ts
```

## Files to Modify

```
server/src/
├── modules/users/
│   ├── entities/user.entity.ts          # Add ManyToMany relation to Role
│   ├── dto/                             # Add create/update/query DTOs
│   ├── services/users.service.ts        # Implement CRUD
│   ├── controllers/users.controller.ts  # Implement endpoints
│   └── users.module.ts                  # Import RolesModule
├── app.module.ts                        # Import new modules
└── main.ts                              # Run seeders on startup
```

---

## Implementation Order

1. **Phase 1** — Database Entities (foundation)
2. **Phase 2** — Modules Setup (wiring)
3. **Phase 3** — DTOs (validation)
4. **Phase 4** — Services (business logic)
5. **Phase 5** — Controllers (API endpoints)
6. **Phase 6** — Seeders (default data)
7. **Phase 7** — Authorization Guard (security)
8. **Phase 8** — Testing (verification)

**Dependencies**:
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 1
- Phase 4 depends on Phase 2 + Phase 3
- Phase 5 depends on Phase 4
- Phase 6 depends on Phase 4
- Phase 7 depends on Phase 4 + Phase 5
- Phase 8 depends on all previous phases
