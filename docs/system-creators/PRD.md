# System Creators — PRD (Product Requirements Document)

## 1. Overview

**Fitur**: System Creators (CRUD Generator)
**Tujuan**: Memungkinkan Super Admin membuat module CRUD baru secara dinamis tanpa menulis kode manual.
**Target User**: Super Admin

---

## 2. Fitur

### 2.1 System Creators List Page

**Route**: `/dashboard/system-creators`
**Access**: Super Admin only

Halaman utama yang menampilkan semua module yang sudah di-generate. Data di-scan langsung dari folder generated modules (bukan dari database).

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

#### Aksi
- **Create** — Buka wizard untuk buat module baru
- **View** — Lihat detail konfigurasi module
- **Toggle** — Aktifkan/nonaktifkan module
- **Delete** — Hapus module (mark inactive + hapus file)

---

### 2.2 Create Module Wizard

**Route**: `/dashboard/system-creators/create`
**Access**: Super Admin only

Multi-step wizard untuk membuat module baru.

#### Step 1: Basic Info
| Field | Component | Validation | Description |
|-------|-----------|------------|-------------|
| Module Name | NInput | required, snake_case, unique | Nama module (e.g., `product`) |
| Label | NInput | required | Display name (e.g., `Product`) |
| Menu Label | NInput | required | Sidebar menu text (e.g., `Products` atau `inventory_Products`) |
| Description | NInput textarea | optional | Deskripsi module |

**Menu Label Rules**:
- `{name}` → Top-level menu item
- `{group}_{name}` → Inside group
- `{group1}_{group2}_{name}` → Nested groups

#### Step 2: Field Definitions
| Field | Component | Description |
|-------|-----------|-------------|
| Field Name | NInput | Column name (snake_case) |
| Field Label | NInput | Display label |
| Field Type | NSelect | Type selection (18 types) |
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
| Placeholder | NInput | Input placeholder |
| Help Text | NInput | Help text below field |

**Supported Field Types** (18 types):
`text`, `textarea`, `rich-text`, `number`, `boolean`, `date`, `datetime`, `email`, `phone`, `url`, `password`, `color`, `select`, `select-relation`, `multiple-select-relation`, `json`, `file`, `image`

**New Types (v2)**:
- `select-relation`: Pick one record from related module (FK stored)
- `multiple-select-relation`: Pick multiple records from related module (JSON array of IDs stored)

#### Step 3: Relationships (Optional)
| Field | Component | Description |
|-------|-----------|-------------|
| Relation Type | NSelect | many-to-one, many-to-many, one-to-many |
| Target Module | NSelect | Pilih module yang sudah ada |
| Field Name | NInput | Nama field untuk relation |
| Join Table | NInput | Nama junction table (untuk many-to-many) |

#### Step 4: Access Control
| Field | Component | Options |
|-------|-----------|---------|
| Access Level | NRadioGroup | public, admin, granular |
| Roles | NSelect (if granular) | Assign ke role tertentu |
| Auto-create Permission | NSwitch (if granular) | Buat permission otomatis |
| Auto-create Guard | NSwitch (if granular) | Buat guard otomatis |

#### Step 5: Layout Configuration

**Browse Layout** (Table):
| Field | Component | Description |
|-------|-----------|-------------|
| Column Order | Drag list | Urutan kolom di tabel |
| Column Widths | Input per field | Lebar kolom (px atau %) |

**Create Form Layout**:
| Field | Component | Description |
|-------|-----------|-------------|
| Layout Type | NSelect | flex / grid |
| Columns | NInputNumber (if grid) | Jumlah kolom form |
| Sections | Dynamic list | Group fields dalam section |

**Update Form Layout**:
| Field | Component | Description |
|-------|-----------|-------------|
| Layout Type | NSelect | flex / grid |
| Columns | NInputNumber (if grid) | Jumlah kolom form |
| Sections | Dynamic list | Group fields dalam section |

Per section:
| Field | Component | Description |
|-------|-----------|-------------|
| Section Label | NInput | Label section |
| Fields | NSelect multiple | Pilih field untuk section ini |
| Field Width | Select per field | full / half / third / quarter |

#### Step 6: Review & Generate
- Tampilkan ringkasan konfigurasi
- Preview field table
- Preview layout config
- Tombol "Generate Module"
- Loading state saat server generate + restart

---

### 2.3 Dynamic CRUD Page

**Route**: `/dashboard/sc/:moduleName`
**Access**: Based on access level config

Halaman CRUD yang di-render secara dinamis berdasarkan konfigurasi module.

**Features**:
- **Table View** — DataTable dengan kolom dari field config + layout config
- **Create Form** — DynamicFormRenderer dengan field types yang sesuai + layout
- **Edit Form** — Form yang sama dengan pre-filled data + layout
- **Detail Drawer** — Detail view dengan field rendering yang sesuai
- **Delete** — Konfirmasi + hapus
- **File Upload** — Untuk field type file/image

**Bug Fix**: DynamicCrudPage harus mengambil config dari `useDynamicModules` composable (yang sudah di-load di AppLayout), bukan dari API call langsung. Ini menghindari masalah 403 untuk non-Super Admin users.

---

## 3. Field Types Reference

| Type | DB Column | Form Component | Table Display | Notes |
|------|-----------|----------------|---------------|-------|
| `text` | VARCHAR(255) | NInput | Plain text | |
| `textarea` | TEXT | NInput textarea | Truncated text | |
| `rich-text` | TEXT | Tiptap/NInput | Stripped HTML | |
| `number` | INTEGER | NInputNumber | Formatted number | |
| `boolean` | INTEGER (0/1) | NSwitch | NTag Yes/No | |
| `date` | DATE | NDatePicker | Formatted date | |
| `datetime` | DATETIME | NDatePicker datetime | Formatted datetime | |
| `email` | VARCHAR(255) | NInput email | Plain text | |
| `phone` | VARCHAR(50) | NInput | Plain text | |
| `url` | VARCHAR(500) | NInput | Clickable link | |
| `password` | VARCHAR(255) | NInput password | `****` masked | |
| `color` | VARCHAR(7) | NColorPicker | Color swatch | |
| `select` | VARCHAR(255) | NSelect | NTag with color | Static options |
| `select-relation` | INTEGER (FK) | NSelect (async) | Related label | Dynamic from related module |
| `multiple-select-relation` | TEXT (JSON) | NSelect multiple | Tags | Dynamic, multiple |
| `json` | TEXT | NInput textarea | Truncated preview | |
| `file` | VARCHAR(500) | NUpload | File link | |
| `image` | VARCHAR(500) | NUpload image | Thumbnail | |

---

## 4. Layout Configuration

### Browse Layout

```typescript
interface BrowseLayoutConfig {
  columnOrder: string[]           // Field names in display order
  columnWidths: Record<string, string>  // Field name → width (e.g., "200px", "20%")
}
```

### Form Layout (Create/Update)

```typescript
interface FormLayoutConfig {
  layout: 'flex' | 'grid'
  columns?: number  // For grid layout (default: 2)
  sections: FormSectionConfig[]
}

interface FormSectionConfig {
  label: string          // Section header text
  fields: FormFieldLayout[]
}

interface FormFieldLayout {
  name: string           // Field name
  width: 'full' | 'half' | 'third' | 'quarter' | string  // e.g., "300px"
  placeholder?: string   // Custom placeholder
}
```

---

## 5. Non-Functional Requirements

### Security
- System Creators hanya bisa diakses Super Admin
- Generated modules RBAC enforced via auto-created permissions/guards
- Input validation pada wizard (class-validator)

### Performance
- Registry loaded from JSON file (fast read)
- Server restart required after generation (~2-3 seconds downtime)

### UX
- Multi-step wizard dengan progress indicator
- Dynamic form rendering berdasarkan field type
- Loading states pada semua aksi
- Konfirmasi sebelum delete
- Access denied alert untuk unauthorized access
