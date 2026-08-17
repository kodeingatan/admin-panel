# Database Structure

## Overview

- **Database Engine**: SQLite (via `better-sqlite3`)
- **ORM**: TypeORM
- **Database File**: `server/db.sqlite`
- **Migrations**: Auto-sync via `synchronize: true` (development)

---

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │   users_roles    │       │    roles     │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ user_id (FK)     │    ┌──│ id (PK)      │
│ firstName    │  └───>│ role_id (FK)     │<───┘  │ roleName     │
│ lastName     │       └──────────────────┘       │ description  │
│ username     │                                  │ createdAt    │
│ email        │       ┌──────────────────┐       │ updatedAt    │
│ password     │       │  roles_guards    │       └──────────────┘
│ createdAt    │       ├──────────────────┤            │    │
│ updatedAt    │       │ role_id (FK)     │       ┌────┘    └────┐
└──────────────┘       │ guard_id (FK)    │       │              │
                       └──────────────────┘       │              │
                              │    │              │              │
┌──────────────┐              │    │         ┌────┴────┐   ┌────┴────────┐
│   guards     │<─────────────┘    └────────>│guards_  │   │roles_       │
├──────────────┤                             │urls     │   │permissions  │
│ id (PK)      │       ┌──────────────────┐  ├─────────┤   ├─────────────┤
│ guardName    │       │ guard_urls       │  │guard_id │   │role_id (FK) │
│ description  │       ├──────────────────┤  │(FK)     │   │permission_id│
│ createdAt    │       │ id (PK)          │  │url      │   │(FK)         │
│ updatedAt    │       │ guard_id (FK)    │  │type     │   └─────────────┘
└──────────────┘       │ url              │  └─────────┘        │    │
                       │ type (allow/deny)│                      │    │
                       │ createdAt        │                      │    │
                       └──────────────────┘               ┌──────┘    └──────┐
                                                          │                 │
┌──────────────┐       ┌──────────────────┐          ┌────┴─────┐    ┌──────┴────────┐
│ permissions  │       │permission_methods│          │permission│    │               │
├──────────────┤       ├──────────────────┤          │_methods  │    │permission_urls│
│ id (PK)      │──┐    │ id (PK)          │          ├──────────┤    ├───────────────┤
│ permissionNam│  └───>│ permission_id    │          │id (PK)   │    │id (PK)        │
│ description  │       │ method           │          │perm_id   │    │permission_id  │
│ createdAt    │       │ createdAt        │          │(FK)      │    │(FK)           │
│ updatedAt    │       └──────────────────┘          │method    │    │url            │
└──────────────┘                                    │createdAt │    │createdAt      │
                                                    └──────────┘    └───────────────┘

┌──────────────┐       ┌──────────────────┐
│ sc_modules   │       │ (JSON backup)    │
├──────────────┤       │ sc-modules-      │
│ id (PK)      │       │ registry.json    │
│ name         │       └──────────────────┘
│ label        │
│ routePath    │
│ menuLabel    │
│ accessLevel  │
│ accessRoles  │  (JSON array)
│ accessPerms  │  (JSON array)
│ isActive     │
│ fieldsConfig │  (JSON — field definitions)
│ relationsConf│  (JSON — relation definitions)
│ createdAt    │
│ updatedAt    │
└──────────────┘
```

---

## Entity Details

### 1. users

Tabel utama untuk data user.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik user |
| `firstName` | VARCHAR(100) | NOT NULL | Nama depan |
| `lastName` | VARCHAR(100) | NOT NULL | Nama belakang |
| `username` | VARCHAR(30) | NOT NULL, UNIQUE | Username unik |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email unik |
| `password` | VARCHAR(255) | NOT NULL | Password terhash (bcrypt) |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |
| `updatedAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

---

### 2. roles

Tabel untuk role/level akses.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik role |
| `roleName` | VARCHAR(100) | NOT NULL, UNIQUE | Nama role unik |
| `description` | TEXT | NULLABLE | Deskripsi role |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |
| `updatedAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

---

### 3. permissions

Tabel untuk permission/izin akses.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik permission |
| `permissionName` | VARCHAR(100) | NOT NULL, UNIQUE | Nama permission unik |
| `description` | TEXT | NULLABLE | Deskripsi permission |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |
| `updatedAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

---

### 4. guards

Tabel untuk guard/pengaman URL.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik guard |
| `guardName` | VARCHAR(100) | NOT NULL, UNIQUE | Nama guard unik |
| `description` | TEXT | NULLABLE | Deskripsi guard |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |
| `updatedAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

---

### 5. users_roles (Junction Table)

Tabel penghubung antara `users` dan `roles` (many-to-many).

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `userId` | INTEGER | FK → users.id, PK | ID user |
| `roleId` | INTEGER | FK → roles.id, PK | ID role |

**Constraints**:
- `PRIMARY KEY (userId, roleId)`
- `FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE`
- `FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE`

---

### 6. roles_guards (Junction Table)

Tabel penghubung antara `roles` dan `guards` (many-to-many).

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `roleId` | INTEGER | FK → roles.id, PK | ID role |
| `guardId` | INTEGER | FK → guards.id, PK | ID guard |

**Constraints**:
- `PRIMARY KEY (roleId, guardId)`
- `FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE`
- `FOREIGN KEY (guardId) REFERENCES guards(id) ON DELETE CASCADE`

---

### 7. roles_permissions (Junction Table)

Tabel penghubung antara `roles` dan `permissions` (many-to-many).

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `roleId` | INTEGER | FK → roles.id, PK | ID role |
| `permissionId` | INTEGER | FK → permissions.id, PK | ID permission |

**Constraints**:
- `PRIMARY KEY (roleId, permissionId)`
- `FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE`
- `FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE`

---

### 8. guard_urls (Junction Table)

Tabel untuk menyimpan URL patterns yang diizinkan/ditolak oleh guard.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik |
| `guardId` | INTEGER | FK → guards.id | ID guard |
| `url` | VARCHAR(500) | NOT NULL | URL pattern |
| `type` | ENUM('allow', 'deny') | NOT NULL | Tipe URL |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |

**Constraints**:
- `FOREIGN KEY (guardId) REFERENCES guards(id) ON DELETE CASCADE`

---

### 9. permission_methods (Junction Table)

Tabel untuk menyimpan HTTP methods yang diizinkan oleh permission.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik |
| `permissionId` | INTEGER | FK → permissions.id | ID permission |
| `method` | VARCHAR(10) | NOT NULL | HTTP method |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |

**Constraints**:
- `FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE`

---

### 10. permission_urls (Junction Table)

Tabel untuk menyimpan URL patterns yang diizinkan oleh permission.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik |
| `permissionId` | INTEGER | FK → permissions.id | ID permission |
| `url` | VARCHAR(500) | NOT NULL | URL pattern |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |

**Constraints**:
- `FOREIGN KEY (permissionId) REFERENCES permissions(id) ON DELETE CASCADE`

---

### 11. activity_logs

Tabel untuk mencatat semua aktivitas user (audit trail).

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik log |
| `userId` | INTEGER | NULLABLE, FK → users.id ON DELETE SET NULL | ID user |
| `action` | VARCHAR | NOT NULL | Jenis aksi |
| `entity` | VARCHAR | NOT NULL | Entity yang terpengaruh |
| `entityId` | INTEGER | NULLABLE | ID entity |
| `description` | TEXT | NULLABLE | Deskripsi aktivitas |
| `metadata` | TEXT | NULLABLE | JSON data tambahan |
| `ipAddress` | VARCHAR | NULLABLE | IP address |
| `userAgent` | VARCHAR | NULLABLE | User agent |
| `level` | VARCHAR(20) | DEFAULT 'INFO' | Level log |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pencatatan |

---

### 12. settings

Tabel untuk menyimpan pengaturan aplikasi (key-value store).

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik setting |
| `key` | VARCHAR(100) | NOT NULL, UNIQUE | Key unik |
| `value` | TEXT | NOT NULL | Value setting |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |
| `updatedAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

---

### 13. sc_modules (System Creators Registry)

Tabel untuk menyimpan metadata module yang dibuat oleh System Creators.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unik module |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Module name (snake_case) |
| `label` | VARCHAR(100) | NOT NULL | Display name (e.g., "Product") |
| `routePath` | VARCHAR(255) | NOT NULL | Client route (e.g., "/dashboard/products") |
| `menuLabel` | VARCHAR(100) | NOT NULL | Sidebar menu text (e.g., "Products") |
| `accessLevel` | VARCHAR(20) | DEFAULT 'admin' | "public" / "admin" / "granular" |
| `accessRoles` | TEXT | NULLABLE | JSON array of role names (for granular) |
| `accessPermissions` | TEXT | NULLABLE | JSON array of permission names (for granular) |
| `isActive` | BOOLEAN | DEFAULT 1 | Module active status |
| `fieldsConfig` | TEXT | NOT NULL | JSON — full field definitions |
| `relationsConfig` | TEXT | NULLABLE | JSON — relation definitions |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |
| `updatedAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

**Indexes**:
- `PRIMARY KEY` on `id`
- `UNIQUE` on `name`

**JSON Schema — fieldsConfig**:
```json
[
  {
    "name": "title",
    "label": "Title",
    "type": "text",
    "required": true,
    "unique": false,
    "searchable": true,
    "sortable": true,
    "visible": true,
    "defaultValue": null,
    "maxLength": 255,
    "minLength": null,
    "placeholder": "Enter product title",
    "helpText": null,
    "options": null
  },
  {
    "name": "category",
    "label": "Category",
    "type": "select",
    "required": true,
    "unique": false,
    "searchable": true,
    "sortable": true,
    "visible": true,
    "defaultValue": null,
    "options": [
      { "label": "Electronics", "value": "electronics" },
      { "label": "Clothing", "value": "clothing" }
    ]
  }
]
```

**JSON Schema — relationsConfig**:
```json
[
  {
    "name": "category",
    "type": "many-to-one",
    "targetModule": "category",
    "joinTable": null
  },
  {
    "name": "tags",
    "type": "many-to-many",
    "targetModule": "tag",
    "joinTable": "product_tags"
  }
]
```

---

## Seed Data

### Users

| id | firstName | lastName | username | email | password (bcrypt) |
|----|-----------|----------|----------|-------|-------------------|
| 1 | Super | Admin | admin | admin@admin.com | `$2b$10$...` (P455w0rd!!!) |

### Roles

| id | roleName | description |
|----|----------|-------------|
| 1 | Super Admin | Akses penuh ke semua fitur |
| 2 | Admin | Akses admin terbatas |
| 3 | User | Akses dasar untuk user biasa |

### Guards

| id | guardName | description |
|----|-----------|-------------|
| 1 | Full Access | Izinkan semua URL |
| 2 | Web Access | Hanya akses API, tolak admin routes |
| 3 | API Only | Hanya akses API endpoints |

### Permissions

| id | permissionName | description |
|----|----------------|-------------|
| 1 | Full Access | Izinkan semua method dan URL |
| 2 | Read Only | Hanya izinkan GET dan OPTIONS |
| 3 | Read Write | Izinkan semua method CRUD |

---

## Relationships Summary

```
users ──────< users_roles >────── roles
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    v               v               v
              roles_guards    roles_permissions     │
                    │               │               │
                    v               v               v
                guards         permissions
                    │               │
                    v               v
              guard_urls    permission_methods
                            permission_urls

sc_modules ─── (fields stored as JSON in fieldsConfig)
               (relations stored as JSON in relationsConfig)
```

### Cardinality

| Relationship | Type | Description |
|-------------|------|-------------|
| User → Role | Many-to-Many | User bisa punya banyak role |
| Role → Guard | Many-to-Many | Role bisa punya banyak guard |
| Role → Permission | Many-to-Many | Role bisa punya banyak permission |
| Guard → GuardUrl | One-to-Many | Guard punya banyak URL rules |
| Permission → PermissionMethod | One-to-Many | Permission punya banyak method rules |
| Permission → PermissionUrl | One-to-Many | Permission punya banyak URL rules |
| User → ActivityLog | One-to-Many | User bisa punya banyak activity log (nullable) |

### Generated Module Relationships

| Relationship | TypeORM | Junction Table |
|-------------|---------|----------------|
| ManyToOne | `@ManyToOne` + `@JoinColumn` | None (FK on child entity) |
| ManyToMany | `@ManyToMany` + `@JoinTable` | Auto-created: `sc_{a}_sc_{b}` |
| OneToMany | `@OneToMany` | None (FK on referenced entity) |

---

## Database Total

**13 tables** (12 built-in + 1 system creators registry):

1. `users`
2. `roles`
3. `permissions`
4. `guards`
5. `users_roles` (junction)
6. `roles_guards` (junction)
7. `roles_permissions` (junction)
8. `guard_urls`
9. `permission_methods`
10. `permission_urls`
11. `activity_logs`
12. `settings`
13. `sc_modules` (System Creators)

**Note**: Generated modules create additional tables dynamically via TypeORM `synchronize: true`. Each generated module adds 1 entity table + optional junction tables for ManyToMany relations.
