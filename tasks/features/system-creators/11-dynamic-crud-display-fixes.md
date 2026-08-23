# System Creators — Dynamic CRUD Display Fixes

## Overview

Perbaikan masalah tampilan dan data flow pada Dynamic CRUD (generated modules). Masalah utama:

1. **select-relation** tidak tampil di tabel (shows "-")
2. **image** tidak tampil di tabel (shows "-")
3. **multiple-select-relation** menampilkan raw JSON
4. **select-relation** di form tidak punya opsi pilih field mana yang ditampilkan
5. **Data inconsistency**: field name antara form (`category`), DTO (`category_id`), dan response API (`category`) tidak sinkron

---

## Root Cause Analysis

### Masalah 1: select-relation tidak tampil di tabel

**File**: `DynamicTableRenderer.vue:31-48`

```typescript
// Table reads: row[field.name] → row.category
// But API response has:
//   - many-to-one: row.category = undefined (relation not loaded!)
//   - many-to-many: row.tags = [{ id, name, ... }] (loaded via leftJoinAndSelect)
```

**Root cause**: Generator service hanya generate `leftJoinAndSelect` untuk `many-to-many` relations, **tidak** untuk `many-to-one`.

```typescript
// sc-generator.service.ts — genService()
const relationFields = config.relations?.filter(
  (r) => r.type === 'many-to-many' || r.type === 'one-to-many', // ← many-to-one MISSING!
) || [];
```

**Impact**: API mengembalikan `category_id: 2` saja, bukan `category: { id: 2, name: "Electronics" }`.

### Masalah 2: image tidak tampil di tabel

**File**: `DynamicTableRenderer.vue:63`

```typescript
case 'image':
  return h('img', { src: val, ... })  // val = "image.webp" (filename only)
```

**Root cause**: Service menyimpan filename saja (e.g., `image.webp`), bukan full URL. Table renderer perlu construct full URL.

### Masalah 3: multiple-select-relation menampilkan raw JSON

**File**: `DynamicTableRenderer.vue:50-54`

```typescript
case 'multiple-select-relation': {
  if (!val || !Array.isArray(val)) return h(NText, { depth: 3 }, () => '-')
  return h(NSpace, { size: 4 }, () =>
    val.map((id: number) => h(NTag, { size: 'small', bordered: false, key: id }, () => `#${id}`))
  )
}
```

**Root cause**: Table assume value is `number[]` (array of IDs). Tapi karena `many-to-many` di-load via `leftJoinAndSelect`, value sebenarnya adalah `Tag[]` (array of objects). Code tidak handle object array.

### Masalah 4: Field name inconsistency (category vs category_id)

**Flow saat ini**:
```
Wizard config:     field.name = "category"
DTO generated:     category_id: number  ← different name!
Form sends:        category: 2          ← matches config
Server rejects:    "property category should not exist"
```

**Root cause**: `dtoFieldName()` mengubah `category` → `category_id` di DTO. Tapi form tetap mengirim `category`. DynamicFormRenderer sudah di-fix untuk mengirim `category_id`, tapi ini membuat workflow tidak konsisten.

**Solusi yang lebih baik**: Gunakan nama field yang KONSISTEN — gunakan `category` di semua layer:
- Entity column: `category_id` (database, handled by `@JoinColumn`)
- DTO: `category` (user-facing)
- Form: `category`
- API response: `category: { id, name, ... }` (full relation object)

---

## Implementation Plan

### Phase 1: Server — Fix Generator Templates

**File**: `server/src/modules/system-creators/services/sc-generator.service.ts`

#### 1.1 Hapus `dtoFieldName()` — gunakan nama field asli

```typescript
// SEBELUM
function dtoFieldName(field: ScFieldConfigDto): string {
  return field.type === 'select-relation' ? `${field.name}_id` : field.name;
}

// SESUDAH — hapus fungsi ini, gunakan f.name langsung
```

#### 1.2 Entity — tetap generate `category_id` column (database column)

Bagian entity sudah benar: generate `category_id` column + `@ManyToOne` + `@JoinColumn`. Tidak perlu diubah.

#### 1.3 DTO — gunakan nama field asli (`category`, bukan `category_id`)

```typescript
// genCreateDto() — SEBELUM
const fieldName = dtoFieldName(f);  // → "category_id"
fields.push(`  ${fieldName}${nullable}: ${tsType};`);

// SESUDAH — gunakan f.name langsung
fields.push(`  ${f.name}${nullable}: ${tsType};`);
```

#### 1.4 Service — gunakan nama field asli

```typescript
// genService() — createFields
// SEBELUM
const fn = dtoFieldName(f);
return `      ${fn}: dto.${fn},`;

// SESUDAH — gunakan f.name langsung
return `      ${f.name}: dto.${f.name},`;
```

Untuk `select-relation`, service assign ke relation property:
```typescript
// select-relation: TypeORM maps relation property → join column automatically
if (f.type === 'select-relation') {
  return `      ${f.name}: dto.${f.name},`;  // TypeORM handles category → category_id
}
```

Untuk `many-to-one` relations, `mod.category = dto.category` akan TypeORM map ke `category_id` column.

#### 1.5 Service — load many-to-one relations di findAll

```typescript
// genService() — findAll
// SEBELUM
const relationFields = config.relations?.filter(
  (r) => r.type === 'many-to-many' || r.type === 'one-to-many',
) || [];

// SESUDAH — tambahkan many-to-one
const relationFields = config.relations || [];
```

Ini akan generate:
```typescript
qb.leftJoinAndSelect('product.category', 'category');
qb.leftJoinAndSelect('product.tags', 'tags');
```

#### 1.6 Service — findOne load all relations

```typescript
// findOne — SEBELUM
relations: { tags: true }

// SESUDAH — load semua relations
relations: { category: true, tags: true }
```

### Phase 2: Client — Fix Table Display

**File**: `client/src/components/common/DynamicTableRenderer.vue`

#### 2.1 Fix select-relation display

```typescript
case 'select-relation': {
  // row.category = { id: 2, name: "Electronics" } (loaded from API)
  const relationObj = row[field.name]
  if (!relationObj) return h(NText, { depth: 3 }, () => '-')
  const displayField = field.relationLabel || 'name'
  const displayVal = relationObj[displayField] || relationObj.id || `#${relationObj.id}`
  return h(NTag, { size: 'small', bordered: false }, () => String(displayVal))
}
```

#### 2.2 Fix multiple-select-relation display

```typescript
case 'multiple-select-relation': {
  // row.tags = [{ id: 4, name: "Sale" }, { id: 5, name: "New" }]
  const arr = row[field.name]
  if (!arr || !Array.isArray(arr) || arr.length === 0) return h(NText, { depth: 3 }, () => '-')
  const displayField = field.relationLabel || 'name'
  return h(NSpace, { size: 4 }, () =>
    arr.map((item: any) => {
      const label = typeof item === 'object' ? (item[displayField] || item.name || `#${item.id}`) : `#${item}`
      return h(NTag, { size: 'small', bordered: false, key: item.id || item }, () => String(label))
    })
  )
}
```

#### 2.3 Fix image display

```typescript
case 'image': {
  if (!val) return h(NText, { depth: 3 }, () => '-')
  // Construct full URL if relative
  const src = val.startsWith('http') ? val : `/api/storage/general/${val}`
  return h('img', { src, style: 'width:32px;height:32px;border-radius:4px;object-fit:cover;', onError: (e: Event) => { (e.target as HTMLImageElement).style.display = 'none' } })
}
```

### Phase 3: Client — Fix Form Component

**File**: `client/src/components/common/DynamicFormRenderer.vue`

#### 3.1 Revert handleSubmit — kirim nama field asli

```typescript
// SEBELUM (transform category → category_id)
if (field.type === 'select-relation') {
  payload[`${field.name}_id`] = value
}

// SESUDAH — kirim nama field asli (category)
payload[field.name] = value
```

#### 3.2 Fix buildEmptyForm — handle both response formats

```typescript
// API response: row.category = { id: 2, name: "Electronics" } (relation object)
// Form needs: form.category = 2 (just the ID for NSelect)
if (field.type === 'select-relation') {
  const val = props.item[field.name]
  if (val && typeof val === 'object') {
    f[field.name] = val.id  // Extract ID from relation object
  } else {
    f[field.name] = val ?? null  // Already an ID or null
  }
}
```

#### 3.3 Fix loadRelationFields — gunakan API URL yang benar

Sudah benar: `api.get('/generated/${field.targetModule}')`.

### Phase 4: Client — Add relationLabel to Wizard

**File**: `client/src/features/system-creators/components/ScWizardStep2Fields.vue`

Sudah ada (line 239-246). Field `relationLabel` sudah tersedia di wizard.

**Tambahan kecil**: Tambahkan help text untuk menjelaskan fungsi relationLabel.

### Phase 5: Detail View Fix

**File**: `client/src/views/DynamicCrudPage.vue`

#### 5.1 Fix detail view — handle relation objects

```html
<!-- SEBELUM -->
<NText>{{ selectedItem[field.name] ?? '-' }}</NText>

<!-- SESUDAH — handle relation objects -->
<NText v-if="field.type === 'select-relation' && selectedItem[field.name]">
  {{ selectedItem[field.name][field.relationLabel || 'name'] ?? '-' }}
</NText>
<NText v-else-if="field.type === 'multiple-select-relation' && selectedItem[field.name]">
  {{ selectedItem[field.name].map(item => item[field.relationLabel || 'name']).join(', ') }}
</NText>
<NText v-else>{{ selectedItem[field.name] ?? '-' }}</NText>
```

---

## Data Flow Diagram (After Fix)

```
┌─────────────────────────────────────────────────────────┐
│                    WIZARD (Create Module)                 │
│  Field config: { name: "category", type: "select-relation", │
│                  targetModule: "category",                │
│                  relationLabel: "name" }                  │
└────────────────────────┬────────────────────────────────┘
                         │ generate()
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 GENERATED FILES                          │
│                                                          │
│  Entity:  @Column category_id + @ManyToOne category     │
│  DTO:     category: number  (field name as-is)          │
│  Service: dto.category → mod.category (TypeORM maps)    │
│           findAll: leftJoinAndSelect('product.category') │
└────────────────────────┬────────────────────────────────┘
                         │ API request
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   API RESPONSE                           │
│  {                                                       │
│    id: 1,                                                │
│    title: "TV Samsung",                                  │
│    category: { id: 2, name: "Electronics" }, ← full obj │
│    tags: [{ id: 4, name: "Sale" }, ...],    ← full objs│
│    image: "product.webp"                      ← filename │
│  }                                                       │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌──────────────────┐    ┌──────────────────────────┐
│  TABLE (browse)  │    │  FORM (create/edit)       │
│                  │    │                            │
│  select-rel:     │    │  NSelect:                  │
│  row.category    │    │  value = row.category.id   │
│    .name → "Elec"│    │  options from API           │
│                  │    │  sends: { category: 2 }    │
│  multi-rel:      │    │                            │
│  row.tags        │    │                            │
│    .map(name)    │    │                            │
│    → "Sale,New"  │    │                            │
│                  │    │                            │
│  image:          │    │  NUpload:                  │
│  /api/storage/   │    │  uploads file              │
│  general/img.webp│    │  sends filename            │
└──────────────────┘    └──────────────────────────┘
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `server/src/modules/system-creators/services/sc-generator.service.ts` | Remove `dtoFieldName()`, fix DTO/service templates, add many-to-one to findAll joins |
| `client/src/components/common/DynamicTableRenderer.vue` | Fix select-relation, multi-select-relation, image rendering |
| `client/src/components/common/DynamicFormRenderer.vue` | Revert payload transform, fix edit mode loading |
| `client/src/views/DynamicCrudPage.vue` | Fix detail view for relation objects |
| `client/src/types/system-creator.ts` | Add `relationLabel` to ScFieldConfig (already exists, verify) |

---

## Testing Checklist

- [ ] Generate product module with select-relation (category) and multiple-select-relation (tags)
- [ ] **Table**: category shows "Electronics" (not "-" or "#2")
- [ ] **Table**: tags show "Sale, New" (not JSON or "#4,#5")
- [ ] **Table**: image shows thumbnail (not "-")
- [ ] **Form create**: category dropdown loads and sends `{ category: 2 }`
- [ ] **Form edit**: category pre-selected from `row.category.id`
- [ ] **Detail view**: category shows name, tags show names
- [ ] **API**: `category` accepted (no "property should not exist" error)
- [ ] **findAll**: response includes full `category` object
- [ ] **findOne**: response includes full `category` and `tags` objects
