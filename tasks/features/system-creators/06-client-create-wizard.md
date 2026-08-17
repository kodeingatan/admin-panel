# 06 — Client: Create Wizard

## Goal

Buat multi-step wizard (5 steps) untuk membuat module baru di System Creators.

## Files to Create

### 1. Wizard Page

**File**: `client/src/views/SystemCreatorWizardPage.vue`

Layout:
```
AppLayout
├── NCard
│   ├── Step Indicator (5 steps with progress)
│   ├── Step Content (dynamic component)
│   └── Footer (Back / Next / Generate buttons)
```

State:
- `currentStep: ref(1)` — 1 to 5
- `moduleConfig` — reactive object accumulating all step data
- `generating: ref(false)` — loading state during generation

Step navigation:
- Step 1: Only "Next" (validate basic info)
- Step 2-4: "Back" + "Next" (validate current step)
- Step 5: "Back" + "Generate" (calls API, shows loading, redirects on success)

Step components (dynamic `<component :is>`):
- Step 1 → `ScWizardStep1Basic`
- Step 2 → `ScWizardStep2Fields`
- Step 3 → `ScWizardStep3Relations`
- Step 4 → `ScWizardStep4Access`
- Step 5 → `ScWizardStep5Review`

### 2. Step 1: Basic Info

**File**: `client/src/features/system-creators/components/ScWizardStep1Basic.vue`

Fields:
| Field | Component | Validation |
|-------|-----------|------------|
| Module Name | NInput | required, regex `^[a-z][a-z0-9_]*$`, unique (check via API) |
| Label | NInput | required, auto-generate from name |
| Menu Label | NInput | required, auto-generate from label + "s" |
| Description | NInput textarea | optional |

Auto-generation logic:
- Name: `product` (user types)
- Label: auto `Product` (capitalize first letter)
- Menu Label: auto `Products` (add "s")

### 3. Step 2: Field Definitions

**File**: `client/src/features/system-creators/components/ScWizardStep2Fields.vue`

Dynamic form that allows adding/removing/reordering fields.

Each field row:
```
┌─────────────────────────────────────────────────────────────────────┐
│ [Drag handle] [Field Name] [Label] [Type ▼] [Required] [Unique]   │
│ [Searchable] [Sortable] [Visible] [Delete]                        │
│ └── Options (if type=select): [Add Option] [+ Label = Value]      │
└─────────────────────────────────────────────────────────────────────┘
```

- "Add Field" button at bottom
- Each field has expandable options section
- Drag-to-reorder (optional, can be implemented with simple up/down buttons)
- Field name validation: snake_case, no duplicates

Field type dropdown options:
```typescript
const FIELD_TYPES = [
  { label: 'Text', value: 'text' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Rich Text', value: 'rich-text' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Date', value: 'date' },
  { label: 'Datetime', value: 'datetime' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'URL', value: 'url' },
  { label: 'Password', value: 'password' },
  { label: 'Color', value: 'color' },
  { label: 'Select', value: 'select' },
  { label: 'JSON', value: 'json' },
  { label: 'File', value: 'file' },
  { label: 'Image', value: 'image' },
]
```

### 4. Step 3: Relations (Optional)

**File**: `client/src/features/system-creators/components/ScWizardStep3Relations.vue`

Allows adding relationships to other generated modules.

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Relation Type ▼] [Target Module ▼] [Field Name] [Join Table]     │
│ [Delete]                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

- Target Module dropdown shows existing registered modules
- If no modules yet, show info message "No other modules to relate to"
- "Add Relation" button
- Relation type affects:
  - `many-to-one`: FK on this entity
  - `many-to-many`: Junction table
  - `one-to-many`: FK on target entity (skip for now, complex)

### 5. Step 4: Access Control

**File**: `client/src/features/system-creators/components/ScWizardStep4Access.vue`

```
┌─────────────────────────────────────────────────────────────────────┐
│ Access Level:                                                      │
│ ○ Public (no auth required)                                        │
│ ○ Admin Only (Admin + Super Admin)                                 │
│ ○ Granular (custom permissions)                                    │
│                                                                     │
│ [If Granular]:                                                     │
│ Roles: [NSelect multi — Admin, Super Admin, User, ...]            │
│ Auto-create Permission: [✓] "Product Management" + "Full Access"  │
│ Auto-create Guard: [✓] "Product Access" with allow URLs           │
└─────────────────────────────────────────────────────────────────────┘
```

### 6. Step 5: Review & Generate

**File**: `client/src/features/system-creators/components/ScWizardStep5Review.vue`

Summary view:
```
Module Info:
  Name: product
  Label: Product
  Route: /dashboard/products

Fields (6):
  title — Text, required, searchable, sortable
  description — Textarea
  price — Number, required
  isActive — Boolean, default: true
  category — Select [Electronics, Clothing, Other]
  image — Image

Relations (1):
  many-to-one → category

Access: Admin Only
```

"Generate Module" button → calls `store.generate(config)` → shows loading spinner → on success: redirect to `/dashboard/sc/{name}`

## Files to Modify

(none — wizard page and components are new files)

## Verification

- [ ] Wizard shows 5 steps with progress indicator
- [ ] Step 1 validates module name format and uniqueness
- [ ] Step 2 allows adding/removing/reordering fields
- [ ] Step 2 shows appropriate options per field type
- [ ] Step 3 shows existing modules as relation targets
- [ ] Step 4 shows correct RBAC options per access level
- [ ] Step 5 shows accurate summary of all config
- [ ] Back/Next buttons navigate correctly
- [ ] Generate button calls API and shows loading
- [ ] On success, redirects to generated CRUD page
- [ ] On error, shows error message
