# Implementation Tasks: Table Browse Component

> **Status**: ✅ COMPLETED

## Overview

Membuat komponen table browse yang reusable dengan fitur lengkap: column visibility toggle, server-side sorting, search per-column atau global, dan fix NaN display. Server API perlu diupdate untuk mendukung sort/filter. Response format perlu disesuaikan antara server dan client.

**Fokus**: `./client` + `./server` — komponen table reusable + API enhancements.

---

## Current State Analysis

### Critical Bug: NaN Display
Server returns `{ data, meta: { total, page, limit, totalPages } }` tapi client expects `{ data, total, page, limit, totalPages }` (flat). Ini menyebabkan `total.value = undefined` → `Math.ceil(undefined / undefined)` = **NaN**.

### Missing Features
| Feature | Server | Client | Status |
|---------|--------|--------|--------|
| Pagination | `page`, `limit` params | NDataTable remote | ✅ Works |
| Global Search | `search` param | NInput debounce | ✅ Works |
| Sorting | Hardcoded `id DESC` | `sorter: true` (cosmetic only) | ❌ Missing |
| Column Visibility | N/A | N/A | ❌ Missing |
| Column-specific Search | N/A | N/A | ❌ Missing |
| Response Format | `{ data, meta }` | Expects `{ data, total }` | ❌ Mismatch |

---

## Target State

### Server Response Format (FIXED)
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### Server Query Parameters (ENHANCED)
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `search` | string | undefined | Global search (across all fields) |
| `searchField` | string | undefined | Search specific field only |
| `sortBy` | string | 'id' | Sort column (whitelisted) |
| `sortOrder` | string | 'DESC' | Sort direction: ASC or DESC |

### Client Component: `DataTable.vue`
Reusable component dengan fitur:
- Column visibility toggle (NCheckbox group)
- Server-side sort (click column header)
- Global search + optional field-specific search
- Pagination with page size selector
- Loading/error states

---

## Phase 1: Fix Server Response Format

### 1.1 Create Shared Query DTO
- [ ] Buat `server/src/common/dto/query.dto.ts`
- [ ] Define `QueryDto` with: `page`, `limit`, `search`, `searchField`, `sortBy`, `sortOrder`
- [ ] Add validation: `@IsInt`, `@Min(1)`, `@IsIn` for sortOrder
- [ ] Add whitelist of sortable fields per entity

**File**: `server/src/common/dto/query.dto.ts`

```typescript
import { IsInt, Min, IsString, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  searchField?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
```

### 1.2 Update All Query DTOs to Extend Shared DTO
- [ ] Update `query-user.dto.ts` to extend `QueryDto`
- [ ] Update `query-role.dto.ts` to extend `QueryDto`
- [ ] Update `query-permission.dto.ts` to extend `QueryDto`
- [ ] Update `query-guard.dto.ts` to extend `QueryDto`

### 1.3 Update All Services to Use New Query Params
- [ ] Update `users.service.ts` findAll:
  - Add `searchField` support (search specific field or all)
  - Add `sortBy` + `sortOrder` support with whitelist
  - Fix response format: return flat `{ data, total, page, limit, totalPages }`
- [ ] Update `roles.service.ts` findAll (same pattern)
- [ ] Update `permissions.service.ts` findAll (same pattern)
- [ ] Update `guards.service.ts` findAll (same pattern)

### 1.4 Sortable Fields Whitelist per Entity
| Entity | Sortable Fields |
|--------|----------------|
| User | `id`, `firstName`, `lastName`, `username`, `email`, `createdAt`, `updatedAt` |
| Role | `id`, `roleName`, `description`, `createdAt`, `updatedAt` |
| Permission | `id`, `permissionName`, `description`, `createdAt`, `updatedAt` |
| Guard | `id`, `guardName`, `description`, `createdAt`, `updatedAt` |

---

## Phase 2: Fix Client Types & Response Handling

### 2.1 Update Client Query Types
- [ ] Update `types/user.ts` QueryUser: add `searchField`, `sortBy`, `sortOrder`
- [ ] Update `types/role.ts` QueryRole: add same fields
- [ ] Update `types/permission.ts` QueryPermission: add same fields
- [ ] Update `types/guard.ts` QueryGuard: add same fields

### 2.2 Update All Stores to Handle Flat Response
- [ ] Update `stores/users.store.ts`: read `data.total`, `data.page`, `data.limit` directly
- [ ] Update `stores/roles.store.ts`: same
- [ ] Update `stores/permissions.store.ts`: same
- [ ] Update `stores/guards.store.ts`: same

### 2.3 Update All Services
- [ ] Update `services/users.service.ts`: pass `searchField`, `sortBy`, `sortOrder` params
- [ ] Update `services/roles.service.ts`: same
- [ ] Update `services/permissions.service.ts`: same
- [ ] Update `services/guards.service.ts`: same

---

## Phase 3: Create Reusable DataTable Component

### 3.1 Create DataTable Component
- [ ] Buat `src/components/common/DataTable/DataTable.vue`
- [ ] Props:
  - `columns: DataTableColumns<any>` — column definitions
  - `data: any[]` — table data
  - `loading: boolean`
  - `pagination: PaginationProps`
  - `sortableFields: string[]` — which fields can be sorted
  - `searchFields: { label: string; value: string }[]` — available search fields
- [ ] Emits:
  - `update:page` — page change
  - `update:pageSize` — page size change
  - `update:search` — search text change
  - `update:searchField` — search field change
  - `update:sort` — sort change `{ by: string, order: 'ASC' | 'DESC' }`
  - `refresh` — manual refresh

### 3.2 DataTable Features
- [ ] **Toolbar**:
  - Global search NInput with debounce
  - Search field selector (NSelect) — "All Fields" or specific field
  - Column visibility toggle (NDropdown with NCheckbox list)
  - Refresh button
- [ ] **Table**:
  - NDataTable with `remote` prop
  - Sort indicators on sortable columns
  - Click column header to toggle sort (ASC → DESC → none)
- [ ] **Pagination**:
  - NPagination with page/size selectors
  - "Showing X-Y of Z" text
- [ ] **States**:
  - Loading overlay (NSpin)
  - Empty state (NEmpty)
  - Error state (NAlert)

### 3.3 Create useDataTable Composable
- [ ] Buat `src/composables/useDataTable.ts`
- [ ] Replaces unused `useCrudTable.ts`
- [ ] State: `data`, `total`, `page`, `limit`, `search`, `searchField`, `sortBy`, `sortOrder`, `loading`, `error`
- [ ] Actions: `fetchData()`, `setPage()`, `setLimit()`, `setSearch()`, `setSort()`, `refresh()`
- [ ] Integrates with any Pinia store that has `fetchAll(params)` method

### 3.4 Column Visibility Utility
- [ ] Buat `src/utils/columns.ts`
- [ ] `getDefaultVisibleColumns(columns)` — returns all column keys
- [ ] `filterVisibleColumns(columns, visibleKeys)` — filters columns by visibility

---

## Phase 4: Update Existing Table Components

### 4.1 Update UserTable.vue
- [ ] Replace inline table logic with `DataTable` component
- [ ] Pass column definitions with sortable flags
- [ ] Wire up sort/search/pagination events to store
- [ ] Add column visibility dropdown

### 4.2 Update RoleTable.vue
- [ ] Same pattern as UserTable

### 4.3 Update PermissionTable.vue
- [ ] Same pattern as UserTable

### 4.4 Update GuardTable.vue
- [ ] Same pattern as UserTable

---

## Phase 5: Fix NaN Display

### 5.1 Fix Response Format in Stores
The NaN is caused by server returning `{ data, meta: { total } }` but client reading `data.total` (undefined).

- [ ] Option A: Update server to return flat format (recommended)
- [ ] Option B: Update client to read `data.meta.total`
- [ ] Choose Option A for cleaner API

### 5.2 Add Fallback Values
- [ ] In all stores: `total.value = data.total ?? 0`
- [ ] In all stores: `page.value = data.page ?? 1`
- [ ] In all stores: `limit.value = data.limit ?? 20`

---

## Phase 6: Update Documentation

### 6.1 Update docs/architecture.md
- [ ] Add DataTable component to client structure
- [ ] Update API query parameters (add sortBy, sortOrder, searchField)
- [ ] Update response format documentation

### 6.2 Update docs/PRD.md
- [ ] Add Table Browse Features section
- [ ] Document column visibility, sorting, search features
- [ ] Update API endpoints with new query params

### 6.3 Update docs/design-system.md
- [ ] Add Table Interaction Patterns section
- [ ] Document sort indicator styles
- [ ] Document column visibility dropdown styles

### 6.4 Update AGENTS.md
- [ ] Add DataTable component to directory structure
- [ ] Update conventions for table components

---

## Files to Create

```
server/src/common/
├── dto/
│   └── query.dto.ts              # Shared base query DTO

client/src/
├── components/
│   └── common/
│       └── DataTable/
│           └── DataTable.vue     # Reusable table component
├── composables/
│   └── useDataTable.ts           # Replaces useCrudTable.ts
└── utils/
    └── columns.ts                # Column visibility utilities

tasks/
└── 07-table-browse-components.md # This file
```

## Files to Modify

```
server/src/modules/
├── users/
│   ├── dto/query-user.dto.ts     # Extend QueryDto
│   └── services/users.service.ts # Add sort/searchField, fix response
├── roles/
│   ├── dto/query-role.dto.ts
│   └── services/roles.service.ts
├── permissions/
│   ├── dto/query-permission.dto.ts
│   └── services/permissions.service.ts
└── guards/
    ├── dto/query-guard.dto.ts
    └── services/guards.service.ts

client/src/
├── types/
│   ├── user.ts                   # Add sortBy, sortOrder, searchField
│   ├── role.ts
│   ├── permission.ts
│   └── guard.ts
├── stores/
│   ├── users.store.ts            # Fix response handling, add sort
│   ├── roles.store.ts
│   ├── permissions.store.ts
│   └── guards.store.ts
├── services/
│   ├── users.service.ts          # Pass new params
│   ├── roles.service.ts
│   ├── permissions.service.ts
│   └── guards.service.ts
├── features/users/components/
│   ├── UserTable.vue             # Use DataTable component
│   ├── RoleTable.vue
│   ├── PermissionTable.vue
│   └── GuardTable.vue
├── composables/
│   └── useCrudTable.ts           # Delete (replaced by useDataTable)

docs/
├── architecture.md               # Update table & API docs
├── PRD.md                        # Add table browse features
├── design-system.md              # Add table interaction patterns

AGENTS.md                         # Update directory & conventions
```

---

## Implementation Order

### Wave 1: Server (Phase 1)
1. Create shared Query DTO
2. Update all module DTOs to extend it
3. Update all services with sort/searchField support
4. Fix response format to flat structure

### Wave 2: Client Types & Stores (Phase 2 + 5)
5. Update client query types
6. Update stores to handle flat response
7. Update services to pass new params

### Wave 3: DataTable Component (Phase 3)
8. Create DataTable.vue component
9. Create useDataTable composable
10. Create columns utility

### Wave 4: Refactor Tables (Phase 4)
11. Update all 4 table components to use DataTable
12. Delete old useCrudTable.ts

### Wave 5: Documentation (Phase 6)
13. Update all docs

---

## Verification

1. `cd server && npm run build` — no TypeScript errors
2. `cd client && npm run build` — no TypeScript errors
3. Test API with curl:
   - `GET /api/users?page=1&limit=10&sortBy=firstName&sortOrder=ASC`
   - `GET /api/users?search=admin&searchField=email`
   - `GET /api/roles?sortBy=roleName&sortOrder=DESC`
4. Test client:
   - All 4 table pages load without NaN
   - Click column header to sort (ASC → DESC → none)
   - Toggle column visibility
   - Search with field selector
   - Pagination works correctly
5. Responsive: tables work on mobile and desktop
