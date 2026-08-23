# System Creators — Database

## Overview

**Perubahan v2**: SC modules TIDAK disimpan di database. Registry disimpan HANYA dalam format JSON di `server/src/modules/managements/sc-modules-registry.json`.

Tabel `sc_modules` di database DIHAPUS. Generated modules membuat tabel sendiri secara otomatis via TypeORM `synchronize: true`.

---

## Registry Format (JSON)

File: `server/src/modules/managements/sc-modules-registry.json`

```json
[
  {
    "id": 1,
    "name": "product",
    "label": "Product",
    "routePath": "/dashboard/products",
    "menuLabel": "Products",
    "description": "Product catalog module",
    "accessLevel": "admin",
    "accessRoles": null,
    "accessPermissions": null,
    "isActive": true,
    "fieldsConfig": [
      {
        "name": "title",
        "label": "Title",
        "type": "text",
        "required": true,
        "unique": false,
        "searchable": true,
        "sortable": true,
        "visible": true,
        "maxLength": 255,
        "placeholder": "Enter product title"
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select-relation",
        "required": true,
        "targetModule": "category",
        "relationField": "name"
      }
    ],
    "relationsConfig": [
      {
        "name": "category",
        "type": "many-to-one",
        "targetModule": "category",
        "joinTable": null
      }
    ],
    "layoutConfig": {
      "browse": {
        "columnOrder": ["id", "title", "category", "price", "createdAt"],
        "columnWidths": {
          "id": "80px",
          "title": "200px",
          "category": "150px"
        }
      },
      "create": {
        "layout": "grid",
        "columns": 2,
        "sections": [
          {
            "label": "Basic Info",
            "fields": [
              { "name": "title", "width": "full", "placeholder": "Product name" },
              { "name": "description", "width": "full" }
            ]
          },
          {
            "label": "Pricing",
            "fields": [
              { "name": "price", "width": "half" },
              { "name": "stock", "width": "half" }
            ]
          }
        ]
      },
      "update": {
        "layout": "grid",
        "columns": 2,
        "sections": []
      }
    },
    "createdAt": "2026-08-23T10:00:00.000Z",
    "updatedAt": "2026-08-23T10:00:00.000Z"
  }
]
```

---

## Registry Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-increment ID |
| `name` | string | Module name (snake_case, unique) |
| `label` | string | Display name |
| `routePath` | string | Client route path (auto-generated) |
| `menuLabel` | string | Sidebar menu text |
| `description` | string? | Optional description |
| `accessLevel` | string | `public` / `admin` / `granular` |
| `accessRoles` | string[]? | Role names for granular access |
| `accessPermissions` | string[]? | Permission names for granular |
| `isActive` | boolean | Whether module is active |
| `fieldsConfig` | ScFieldConfig[] | Field definitions |
| `relationsConfig` | ScRelationConfig[]? | Relation definitions |
| `layoutConfig` | ScLayoutConfig? | Layout configuration |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |

### ScFieldConfig

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Column name (snake_case) |
| `label` | string | Display label |
| `type` | ScFieldType | One of 18 field types |
| `required` | boolean | Required validation |
| `unique` | boolean | Unique constraint |
| `searchable` | boolean | Include in search |
| `sortable` | boolean | Allow sorting |
| `visible` | boolean | Show in table by default |
| `defaultValue` | any? | Default value |
| `maxLength` | number? | Max length for text |
| `minLength` | number? | Min length for text |
| `min` | number? | Min value for number |
| `max` | number? | Max value for number |
| `options` | {label, value}[]? | For select type |
| `placeholder` | string? | Input placeholder |
| `helpText` | string? | Help text below field |
| `targetModule` | string? | For select-relation types |
| `relationField` | string? | Field to display from related module |

### ScRelationConfig

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Relation field name |
| `type` | ScRelationType | `many-to-one` / `many-to-many` / `one-to-many` |
| `targetModule` | string | Target module name |
| `joinTable` | string? | Junction table name (many-to-many) |

### ScLayoutConfig

| Field | Type | Description |
|-------|------|-------------|
| `browse` | BrowseLayout | Table layout config |
| `create` | FormLayout | Create form layout |
| `update` | FormLayout | Update form layout |

### BrowseLayout

| Field | Type | Description |
|-------|------|-------------|
| `columnOrder` | string[] | Field names in display order |
| `columnWidths` | Record<string, string> | Field name → width |

### FormLayout

| Field | Type | Description |
|-------|------|-------------|
| `layout` | `'flex'` \| `'grid'` | Layout type |
| `columns` | number? | Number of columns (grid only) |
| `sections` | FormSection[] | Form sections |

### FormSection

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Section header |
| `fields` | FormFieldLayout[] | Fields in section |

### FormFieldLayout

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Field name |
| `width` | `'full'` \| `'half'` \| `'third'` \| `'quarter'` \| string | Field width |
| `placeholder` | string? | Custom placeholder |

---

## Generated Module Tables

Each generated module creates its own table via TypeORM `synchronize: true`:

### Standard Columns (always present)

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment |
| `createdAt` | DATETIME | Create timestamp |
| `updatedAt` | DATETIME | Update timestamp |

### Field Columns (from fieldsConfig)

| Field Type | DB Column Type | Notes |
|-----------|---------------|-------|
| `text` | VARCHAR(255) | With optional maxLength |
| `textarea` | TEXT | |
| `rich-text` | TEXT | |
| `number` | INTEGER | |
| `boolean` | BOOLEAN | Default: false |
| `date` | DATE | |
| `datetime` | DATETIME | |
| `email` | VARCHAR(255) | |
| `phone` | VARCHAR(50) | |
| `url` | VARCHAR(500) | |
| `password` | VARCHAR(255) | |
| `color` | VARCHAR(7) | |
| `select` | VARCHAR(255) | |
| `select-relation` | INTEGER | FK to related table |
| `multiple-select-relation` | TEXT | JSON array of IDs |
| `json` | TEXT | |
| `file` | VARCHAR(500) | |
| `image` | VARCHAR(500) | |

### Relation Columns

| Relation Type | DB Setup |
|--------------|----------|
| `many-to-one` | FK column `{name}Id` on this table |
| `many-to-many` | Junction table `{source}_{target}` |
| `one-to-many` | FK on referenced table |

---

## Removed: sc_modules Table

The `sc_modules` table is no longer used. It was previously table #13 in the database. After this change, the database has **12 tables** (down from 13).

**Migration**: Drop `sc_modules` table if it exists.

---

## Database Total

**12 tables** (built-in only):

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

**Plus**: Dynamic tables created by generated modules (1 table per module + optional junction tables).
