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

**Fitur baru** yang memungkinkan Super Admin membuat module CRUD baru secara dinamis.

#### 3.7.1 System Creators List Page

**Halaman utama** yang menampilkan semua module yang sudah dibuat.

**Route**: `/dashboard/system-creators`
**Access**: Super Admin only

#### Tabel Module
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| ID | Number | Auto-increment |
| Name | String | Module name (snake_case, unique) |
| Label | String | Display name |
| Fields Count | Number | Jumlah field |
| Access Level | Enum | public / admin / granular |
| Status | Boolean | Active / Inactive |
| Created At | Date | Timestamp otomatis |
| Updated At | Date | Timestamp otomatis |

#### Aksi
- **Create** — Buka wizard untuk buat module baru
- **View** — Lihat detail konfigurasi module
- **Toggle** — Aktifkan/nonaktifkan module
- **Delete** — Hapus module (mark inactive, tidak hapus file)

#### 3.7.2 Create Module Wizard

Multi-step wizard untuk membuat module baru.

**Route**: `/dashboard/system-creators/create`
**Access**: Super Admin only

##### Step 1: Basic Info
| Field | Component | Validation | Description |
|-------|-----------|------------|-------------|
| Module Name | NInput | required, snake_case, unique | Nama module (e.g., `product`) |
| Label | NInput | required | Display name (e.g., `Product`) |
| Menu Label | NInput | required | Sidebar menu text (e.g., `Products`) |
| Description | NInput textarea | optional | Deskripsi module |

##### Step 2: Field Definitions
| Field | Component | Description |
|-------|-----------|-------------|
| Field Name | NInput | Column name (snake_case) |
| Field Label | NInput | Display label |
| Field Type | NSelect | Type selection (see supported types) |
| Required | NSwitch | Wajib diisi |
| Unique | NSwitch | Unique constraint |
| Searchable | NSwitch | Include in search |
| Sortable | NSwitch | Allow sorting |
| Visible in Table | NSwitch | Show in table by default |
| Default Value | NInput | Optional default |
| Max Length | NInputNumber | For text fields |
| Min Length | NInputNumber | For text fields |
| Min Value | NInputNumber | For number fields |
| Max Value | NInputNumber | For number fields |
| Options | Dynamic list | For select type (label + value pairs) |

##### Step 3: Relationships (Optional)
| Field | Component | Description |
|-------|-----------|-------------|
| Relation Type | NSelect | many-to-one, many-to-many, one-to-many |
| Target Module | NSelect | Pilih module yang sudah ada |
| Field Name | NInput | Nama field untuk relation |
| Join Table | NInput | Nama junction table (untuk many-to-many) |

##### Step 4: Access Control
| Field | Component | Options |
|-------|-----------|---------|
| Access Level | NRadioGroup | public, admin, granular |
| Roles | NSelect (if granular) | Assign ke role tertentu |
| Auto-create Permission | NSwitch (if granular) | Buat permission otomatis |
| Auto-create Guard | NSwitch (if granular) | Buat guard otomatis |

##### Step 5: Review & Generate
- Tampilkan ringkasan konfigurasi
- Preview field table
- Tombol "Generate Module"
- Loading state saat server generate + restart

#### 3.7.3 Dynamic CRUD Page

Halaman CRUD yang di-render secara dinamis berdasarkan konfigurasi module.

**Route**: `/dashboard/sc/:moduleName`
**Access**: Based on access level config

**Features**:
- **Table View** — DataTable dengan kolom dari field config
- **Create Form** — DynamicFormRenderer dengan field types yang sesuai
- **Edit Form** — Form yang sama dengan pre-filled data
- **Detail Drawer** — Detail view dengan field rendering yang sesuai
- **Delete** — Konfirmasi + hapus
- **File Upload** — Untuk field type file/image, upload ke `server/storage/generated/{module}/`

#### 3.7.4 Field Types

| Type | DB Column Type | Form Component | Table Display |
|------|---------------|----------------|---------------|
| `text` | VARCHAR(255) | NInput | Plain text |
| `textarea` | TEXT | NInput textarea | Truncated text |
| `rich-text` | TEXT | Tiptap/NInput textarea | Stripped HTML |
| `number` | INTEGER | NInputNumber | Formatted number |
| `boolean` | INTEGER (0/1) | NSwitch | NTag Yes/No |
| `date` | DATE | NDatePicker | Formatted date |
| `datetime` | DATETIME | NDatePicker datetime | Formatted datetime |
| `email` | VARCHAR(255) | NInput email | Plain text |
| `phone` | VARCHAR(50) | NInput | Plain text |
| `url` | VARCHAR(500) | NInput | Clickable link |
| `password` | VARCHAR(255) | NInput password | `****` masked |
| `color` | VARCHAR(7) | NColorPicker | Color swatch |
| `select` | VARCHAR(255) | NSelect | NTag with color |
| `json` | TEXT | NInput textarea (JSON) | Truncated preview |
| `file` | VARCHAR(500) | NUpload | File link |
| `image` | VARCHAR(500) | NUpload image | Thumbnail |

#### 3.7.5 Relationship Types

| Type | TypeORM | Description |
|------|---------|-------------|
| `many-to-one` | `@ManyToOne` + `@JoinColumn` | FK pada entity ini → reference module |
| `many-to-many` | `@ManyToMany` + `@JoinTable` | Junction table otomatis |
| `one-to-many` | `@OneToMany` | FK pada entity lain → reference module |

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

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/system-creators/registry` | List semua registered modules | Bearer (Super Admin) |
| GET | `/api/system-creators/registry/:id` | Detail module config | Bearer (Super Admin) |
| GET | `/api/system-creators/registry/by-name/:name` | Get by name | Bearer (Super Admin) |
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
Generated Modules (group, dynamic)
    ├── {Module Label 1}         → /dashboard/sc/{name1}
    └── {Module Label 2}         → /dashboard/sc/{name2}
```

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

### Architecture

```
[Client Wizard] → [POST /api/system-creators/generate] → [Server writes .ts files]
     ↓                                                         ↓
[Server compiles TS→JS] → [Updates registry DB + JSON] → [Auto-restart server]
     ↓
[Client re-fetches registry] → [Dynamic route + menu] → [CRUD rendered]
```

### File Generation

Server generates TypeScript files following NestJS conventions:

```
server/src/modules/generated/sc_{name}/
├── entities/{name}.entity.ts
├── controllers/{name}.controller.ts
├── services/{name}.service.ts
├── dto/create-{name}.dto.ts
├── dto/update-{name}.dto.ts
├── dto/query-{name}.dto.ts
└── {name}.module.ts
```

### Registry

Module metadata stored in:
1. **Database** — `sc_modules` table (primary)
2. **JSON backup** — `server/src/modules/generated/sc-modules-registry.json` (fallback)

### Dynamic Loading

At startup, server reads registry, compiles .ts → .js via `ts.transpileModule()`, and dynamically imports modules. TypeORM `synchronize: true` auto-creates tables from entity metadata.
