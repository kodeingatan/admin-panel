# Product Requirements Document (PRD)

## 1. Overview

**Nama Project**: Component Stories — Admin Panel User Management System

**Tujuan**: Membangun admin panel untuk manajemen user dengan sistem role-based access control (RBAC) yang memungkinkan admin mengelola user, role, permission, dan guard secara terpusat. **System Creators** memungkinkan Super Admin membuat module CRUD baru secara dinamis melalui UI wizard.

**Tech Stack**:
- Frontend: Vue 3 + TypeScript + Vite + Naive UI + Tailwind CSS v4
- Backend: NestJS + TypeORM + SQLite
- Auth: JWT (JSON Web Token)

---

## 2. Tujuan Aplikasi

Admin panel untuk **User Management System** yang menyediakan:

1. **Dashboard** — Ringkasan data user, role, permission, guard
2. **User Management** — CRUD user dengan assignment role
3. **Role Management** — CRUD role dengan assignment guard dan permission
4. **Permission Management** — CRUD permission dengan method dan URL rules
5. **Guard Management** — CRUD guard dengan URL allow/deny rules
6. **Authorization System** — Sistem otorisasi berbasis JWT → User → Role → Permission → Guard
7. **System Creators** — CRUD Generator untuk membuat module baru secara dinamis

---

## 3. Daftar Fitur

### 3.1 Dashboard

**Halaman utama admin panel** yang menampilkan:

#### Sidebar Menu

```
Dashboard
User Management
    ├── User
    ├── Guard
    ├── Role
    └── Permissions
Sistem
    ├── Activity Logs
    ├── System Logs
    └── Settings
Admin (Super Admin only)
    └── System Creators
Generated Modules (dynamic)
    ├── {Module Label 1}
    └── {Module Label 2}
```

| Menu Item | Route | Deskripsi |
|-----------|-------|-----------|
| Dashboard | `/dashboard` | Ringkasan data |
| User Management > User | `/dashboard/users` | Kelola user |
| User Management > Guard | `/dashboard/guards` | Kelola guard |
| User Management > Role | `/dashboard/roles` | Kelola role |
| User Management > Permissions | `/dashboard/permissions` | Kelola permission |
| Admin > System Creators | `/dashboard/system-creators` | CRUD Generator |
| Generated > {Name} | `/dashboard/sc/{name}` | Dynamic CRUD page |

---

### 3.2 User Management

**Halaman kelola user** dengan fitur:

#### Tabel User
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| ID | Number | Auto-increment |
| First Name | String | 1-100 karakter |
| Last Name | String | 1-100 karakter |
| Email | String | Unique, valid email |
| Username | String | Unique, 3-30 karakter, alphanumeric + underscore |
| Roles | Relation | Multiple select dari daftar role |
| Created At | Date | Timestamp otomatis |
| Updated At | Date | Timestamp otomatis |

#### Form Create/Edit User
- First Name (text input, required)
- Last Name (text input, required)
- Email (email input, required, unique)
- Username (text input, required, unique, 3-30 chars, alphanumeric + underscore)
- Password (password input, required saat create, optional saat edit)
  - Minimal 8 karakter
  - Harus ada uppercase, lowercase, dan angka
- Confirm Password (password input, required saat create)
- Role (multi-select, optional)

#### Aksi
- **Create** — Tambah user baru
- **Edit** — Ubah data user (kecuali password kecuali diisi)
- **Delete** — Hapus user (dengan konfirmasi)
- **View** — Lihat detail user

---

### 3.3 Role Management

**Halaman kelola role** dengan fitur:

#### Tabel Role
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| ID | Number | Auto-increment |
| Role Name | String | Unique |
| Description | String | Deskripsi role |
| Guards | Relation | Multiple select dari daftar guard |
| Permissions | Relation | Multiple select dari daftar permission |
| Created At | Date | Timestamp otomatis |
| Updated At | Date | Timestamp otomatis |

---

### 3.4 Permission Management

**Halaman kelola permission** dengan fitur:

#### Tabel Permission
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| ID | Number | Auto-increment |
| Permission Name | String | Unique |
| Description | String | Deskripsi permission |
| Allow Methods | Array | GET, POST, PUT, DELETE, PATCH, OPTIONS, atau * |
| Allow URLs | Array | URL patterns (exact atau wildcard) |
| Created At | Date | Timestamp otomatis |
| Updated At | Date | Timestamp otomatis |

---

### 3.5 Guard Management

**Halaman kelola guard** dengan fitur:

#### Tabel Guard
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| ID | Number | Auto-increment |
| Guard Name | String | Unique |
| Description | String | Deskripsi guard |
| Allow URLs | Array | URL patterns yang diizinkan |
| Deny URLs | Array | URL patterns yang ditolak |
| Created At | Date | Timestamp otomatis |
| Updated At | Date | Timestamp otomatis |

---

### 3.6 Table Browse Features

Semua halaman tabel menggunakan komponen **DataTable** yang reusable dengan fitur:

- **Column Visibility Toggle** — NDropdown dengan checkbox untuk show/hide kolom
- **Server-Side Sorting** — Klik header kolom untuk sort (ASC → DESC → none)
- **Global Search** — NInput dengan debounce 300ms
- **Field-Specific Search** — NSelect untuk memilih field tertentu
- **Pagination** — Server-side, page size: 10, 20, 50, 100
- **Refresh/Reload** — Tombol refresh untuk fetch ulang data

---

### 3.7 System Creators (CRUD Generator)

See `docs/system-creators/PRD.md` for full specification.

**Summary**: Fitur yang memungkinkan Super Admin membuat module CRUD baru secara dinamis melalui 6-step wizard. Module yang di-generate membuat REST API, TypeORM entities, dan dynamic CRUD pages.

**Key Changes (v2)**:
- SC modules stored in JSON only (no database)
- Menu label format determines sidebar grouping (`{group}_{name}`)
- New field types: `select-relation`, `multiple-select-relation`
- New wizard step: Layout Configuration (browse, create, update)
- Generated folder renamed: `generated` → `managements`

---

## 4. Alur Authorization

```
Request masuk
    ↓
JWT Token valid?
    ↓ (Ya)
Ambil User dari Token
    ↓
Ambil Roles User
    ↓
Untuk setiap Role:
    ↓
    Ambil Guards & Permissions
    ↓
    Method cocok? (dari Permission)
        ↓ (Ya)
    URL cocok? (dari Guard Allow URLs)
        ↓ (Ya)
    URL tidak di-deny? (dari Guard Deny URLs)
        ↓ (Ya)
    → ALLOW
        ↓
Response dikirim
```

---

## 5. API Endpoints (Existing + Planned)

### Auth API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user baru | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get profile user | Bearer |

### User Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List semua user (paginated) | Bearer + Permission |
| GET | `/api/users/:id` | Detail user | Bearer + Permission |
| POST | `/api/users` | Create user baru | Bearer + Permission |
| PUT | `/api/users/:id` | Update user | Bearer + Permission |
| DELETE | `/api/users/:id` | Hapus user | Bearer + Permission |

### Role Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/roles` | List semua role | Bearer + Permission |
| GET | `/api/roles/:id` | Detail role | Bearer + Permission |
| POST | `/api/roles` | Create role baru | Bearer + Permission |
| PUT | `/api/roles/:id` | Update role | Bearer + Permission |
| DELETE | `/api/roles/:id` | Hapus role | Bearer + Permission |

### Permission Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/permissions` | List semua permission | Bearer + Permission |
| GET | `/api/permissions/:id` | Detail permission | Bearer + Permission |
| POST | `/api/permissions` | Create permission baru | Bearer + Permission |
| PUT | `/api/permissions/:id` | Update permission | Bearer + Permission |
| DELETE | `/api/permissions/:id` | Hapus permission | Bearer + Permission |

### Guard Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/guards` | List semua guard | Bearer + Permission |
| GET | `/api/guards/:id` | Detail guard | Bearer + Permission |
| POST | `/api/guards` | Create guard baru | Bearer + Permission |
| PUT | `/api/guards/:id` | Update guard | Bearer + Permission |
| DELETE | `/api/guards/:id` | Hapus guard | Bearer + Permission |

### Activity Logs API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/activity-logs` | List semua activity logs (paginated, filterable) | Bearer + Permission |
| GET | `/api/activity-logs/stats` | Statistik activity logs | Bearer + Permission |
| GET | `/api/activity-logs/:id` | Detail activity log | Bearer + Permission |

### System Logs API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/system-logs/files` | List semua file log | Bearer + Permission |
| GET | `/api/system-logs/files/:filename` | Baca isi file log | Bearer + Permission |
| GET | `/api/system-logs/stats/:filename` | Statistik file log | Bearer + Permission |

### Settings API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/settings` | Get all settings | Public |
| GET | `/api/settings/:key` | Get setting by key | Public |
| PUT | `/api/settings` | Update multiple settings | Bearer + Permission |
| POST | `/api/settings/upload` | Upload file | Bearer + Permission |

### System Creators API

See `docs/system-creators/PRD.md` for full specification.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/system-creators/registry` | List semua registered modules | Bearer (Super Admin) |
| GET | `/api/system-creators/registry/:id` | Detail module config | Bearer (Super Admin) |
| GET | `/api/system-creators/registry/by-name/:name` | Get by name | Bearer (authenticated) |
| POST | `/api/system-creators/generate` | Generate module baru | Bearer (Super Admin) |
| PUT | `/api/system-creators/:id` | Update module config | Bearer (Super Admin) |
| DELETE | `/api/system-creators/:id` | Delete module | Bearer (Super Admin) |
| POST | `/api/system-creators/:id/toggle` | Toggle active/inactive | Bearer (Super Admin) |

### Generated Module API (Dynamic)

Per generated module, endpoints auto-created:

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/generated/{name}` | List records (paginated) | Bearer + RBAC |
| GET | `/api/generated/{name}/:id` | Get record detail | Bearer + RBAC |
| POST | `/api/generated/{name}` | Create record | Bearer + RBAC |
| PUT | `/api/generated/{name}/:id` | Update record | Bearer + RBAC |
| DELETE | `/api/generated/{name}/:id` | Delete record | Bearer + RBAC |
| POST | `/api/generated/{name}/upload` | File upload | Bearer + RBAC |

---

## 6. Client Routes

### Static Routes

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/login` | LoginPage | Guest only | Login form |
| `/register` | RegisterPage | Guest only | Registration form |
| `/dashboard` | DashboardPage | Required | Dashboard utama |
| `/dashboard/users` | UsersPage | Required | Manajemen user |
| `/dashboard/roles` | RolesPage | Required | Manajemen role |
| `/dashboard/permissions` | PermissionsPage | Required | Manajemen permission |
| `/dashboard/guards` | GuardsPage | Required | Manajemen guard |
| `/dashboard/activity-logs` | ActivityLogsPage | Required | Activity logs |
| `/dashboard/system-logs` | SystemLogsPage | Required | System logs |
| `/dashboard/settings` | SettingsPage | Required | Settings |
| `/dashboard/system-creators` | SystemCreatorsPage | Required (Super Admin) | CRUD Generator list |
| `/dashboard/system-creators/create` | SystemCreatorWizardPage | Required (Super Admin) | Create wizard |

### Dynamic Routes

| Path Pattern | Component | Auth | Description |
|-------------|-----------|------|-------------|
| `/dashboard/sc/:moduleName` | DynamicCrudPage | Required | Dynamic CRUD |

### Sidebar Menu Structure

```
Dashboard                         → /dashboard
User Management (group)
    ├── User                      → /dashboard/users
    ├── Guard                     → /dashboard/guards
    ├── Role                      → /dashboard/roles
    └── Permissions               → /dashboard/permissions
Sistem (group)
    ├── Activity Logs             → /dashboard/activity-logs
    ├── System Logs               → /dashboard/system-logs
    └── Settings                  → /dashboard/settings
Admin (group, Super Admin only)
    └── System Creators           → /dashboard/system-creators
{Dynamic generated modules}       → Based on menuLabel format
    ├── {Module without group}    → /dashboard/sc/{name} (top-level)
    └── {Group} (group)           → Nested group from menuLabel
        └── {Module in group}     → /dashboard/sc/{name}
```

**Menu Label Rules**: `{name}` = top-level, `{group}_{name}` = in group, `{g1}_{g2}_{name}` = nested groups.

---

## 7. Non-Functional Requirements

### Security
- Password di-hash dengan bcrypt (salt rounds: 10)
- JWT token expiry: 24 jam
- Endpoint sensitif memerlukan autentikasi + otorisasi
- Input validation menggunakan class-validator
- Whitelist DTO properties (tidak ada extra properties)
- System Creators hanya bisa diakses Super Admin
- Generated modules RBAC enforced via auto-created permissions/guards

### Performance
- Database: SQLite (cocok untuk admin panel skala kecil)
- Pagination pada list data (default: 20 item/halaman)
- Server restart required after module generation (brief downtime ~2-3 seconds)

### UX
- Responsive design (mobile-first)
- Loading states pada semua aksi
- Error handling dengan pesan yang jelas
- Konfirmasi sebelum delete
- Form validation real-time
- Access denied alert dengan animasi slide-in dari kanan
- Multi-step wizard dengan progress indicator untuk System Creators
- Dynamic form rendering berdasarkan field type

---

## 8. Seed Data Summary

### Users
| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@admin.com | P455w0rd!!! | Super Admin |
| editor | editor@example.com | P455w0rd!!! | Editor |
| viewer | viewer@example.com | P455w0rd!!! | Viewer |
| manager | manager@example.com | P455w0rd!!! | Manager |

### Roles
| Role Name | Guards | Permissions |
|-----------|--------|-------------|
| Super Admin | Full Access | Full Access |
| Admin | Web Access | Read Write |
| Editor | API Only | Read Write |
| Viewer | API Only | Read Only |
| Manager | Web Access | Read Write |

---

## 9. Client-Side Authorization

### Access Denied Handling

When server returns 403 Forbidden:

1. **Axios Interceptor** — Catches 403 response, shows global NAlert
2. **Route Guard** — Checks user roles/permissions before rendering protected components
3. **Menu Visibility** — Sidebar menu items hidden if user lacks required role/permission

### Menu Visibility Rules

| Menu Item | Required Role |
|-----------|---------------|
| Dashboard | Any authenticated |
| User Management | Admin, Super Admin |
| System Creators | Super Admin |
| Generated Modules | Based on module accessLevel config |

---

## 10. System Creators — Technical Overview

See `docs/system-creators/architecture.md` for full technical details.

### Architecture (Summary)

```
[Client Wizard] → [POST /api/system-creators/generate] → [Server writes .ts files]
     ↓                                                         ↓
[Server compiles TS→JS] → [Updates JSON registry] → [Auto-restart server]
     ↓
[Client re-fetches registry] → [Dynamic route + menu] → [CRUD rendered]
```

### Key Changes (v2)
- Registry stored in JSON only (no database table)
- Generated folder: `managements/` (renamed from `generated/`)
- Menu label format determines sidebar grouping
- New field types: `select-relation`, `multiple-select-relation`
- New wizard step: Layout Configuration
