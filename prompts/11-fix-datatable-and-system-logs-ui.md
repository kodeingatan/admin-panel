# Prompt: Perbaikan DataTable & System Logs UI

## Context

Sistem admin panel menggunakan Vue 3 + Naive UI + NestJS. Saat ini ada dua masalah utama:

1. **DataTable tidak konsisten** — Activity Logs dan System Logs belum menggunakan DataTable component yang sudah ada dengan fitur lengkap
2. **Search input terlalu pendek** — Input search pada DataTable tidak terlihat jelas (kendala: input tidak terlihat)
3. **System Logs UI kurang cantik** — Tampilan System Logs perlu diperbaiki dengan fitur lengkap

## Requirements

### 1. DataTable Standardization (Semua Table)

Semua table di sistem **WAJIB** menggunakan `DataTable` component (`src/components/common/DataTable/DataTable.vue`) dengan fitur:

| Feature | Status | Notes |
|---------|--------|-------|
| Global Search | Wajib | Min-width `320px`, clearable, debounced 300ms |
| Field-Specific Search | Wajib | NSelect "All Fields" default, width `160px` |
| Column Visibility | Wajib | NPopover + NCheckbox, persist localStorage |
| Sorting | Wajib | ASC/DESC per column via header click |
| Pagination | Wajib | Built-in NDataTable pagination |
| Page Size | Wajib | Options: 10, 20, 50, 100. Default: 20 |
| Refresh Button | Wajib | NButton with `Restart` icon, fetch without state reset |

### 2. Search Input Fix

**Kendala**: Input search terlalu pendek, input tidak terlihat.

**Solusi**:
- `NInput` harus memiliki min-width `320px` atau `flex-1` (sisa ruang)
- Placeholder harus jelas: `Search {entity}...`
- Harus ada prefix icon `Search` dari `@vicons/carbon`
- Harus ada clearable button (X)

### 3. System Logs UI Enhancement

**Current**: Tampilan sederhana, hanya menampilkan log entries.

**Required Enhancement**:

#### 3.1 Log Level Support
Sistem harus mendukung SEMUA log levels:
- `TRACE`, `DEBUG`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `CRITICAL`, `FATAL`, `EMERGENCY`

#### 3.2 Log Level Badge
Setiap level harus memiliki warna dan NTag type:
```
TRACE    → Gray, default
DEBUG    → Blue, default
INFO     → Green, info
NOTICE   → Sky, info
WARNING  → Amber, warning
ERROR    → Red, error
CRITICAL → Dark Red, error
FATAL    → Darkest Red, error
EMERGENCY→ Ultra Red, error
```

#### 3.3 Log Detail Drawer
Klik baris log → buka drawer dengan:
- Timestamp lengkap + relative time
- Level badge
- Context (service name)
- Full message (no truncation)
- Stack trace (jika ada) — formatted code block
- Metadata — JSON viewer
- Raw line

#### 3.4 Code Link Action
Tombol untuk buka kode sumber di VS Code:
- **Open in VS Code**: `vscode://file/{path}:{line}` URI scheme
- **Copy Path**: Salin path file ke clipboard
- **Copy Line**: Salin nomor baris

Pattern detection dari stack trace:
```regex
at\s+(?:(?:\S+\s+\()?(\/[^\s:]+):(\d+):\d+\)?)|(?:at\s+(\/[^\s:]+):(\d+))
```

#### 3.5 Log File Selector
- NSelect untuk pilih file log
- Display: `{filename} ({size} KB)`
- Default: file pertama

#### 3.6 Statistics Bar
Tampilan statistik di atas table:
```
Total: 1,234 | INFO: 800 | WARN: 200 | ERROR: 30 | DEBUG: 204
```

## Implementation Areas

### Files to Modify

1. **DataTable Component**: `client/src/components/common/DataTable/DataTable.vue`
   - Fix search input width (min-width `320px`)
   - Ensure all features work correctly

2. **Activity Logs Page**: `client/src/views/ActivityLogsPage.vue`
   - Use DataTable with all required features
   - Fix search input

3. **System Logs Page**: `client/src/views/SystemLogsPage.vue`
   - Complete redesign with all log levels
   - Add log detail drawer
   - Add code link actions
   - Add statistics bar
   - Add log file selector

4. **Type Definitions**: `client/src/types/system-log.ts`
   - Add all log level types
   - Add LogEntry interface with stack trace support

5. **System Logs Service**: `client/src/services/system-log.service.ts`
   - Add API calls for log detail
   - Add code path extraction

6. **Server System Logs Service**: `server/src/modules/system-logs/services/system-logs.service.ts`
   - Add stack trace parsing
   - Add file path extraction from logs

### New Files (if needed)

1. **LogDetailDrawer**: `client/src/features/logs/components/LogDetailDrawer.vue`
   - Drawer component for log detail view

2. **LogLevelBadge**: `client/src/features/logs/components/LogLevelBadge.vue`
   - Reusable badge component for log levels

3. **CodeLinkButton**: `client/src/features/logs/components/CodeLinkButton.vue`
   - Button to open code in VS Code

## Design References

- `docs/design-system.md` — Table section, System Logs Design section
- `docs/architecture.md` — System Logs API endpoints
- `AGENTS.md` — DataTable Requirements section

## Testing Checklist

- [ ] All tables use DataTable component with full features
- [ ] Search input is visible and functional (min-width 320px)
- [ ] Field-specific search works correctly
- [ ] Column visibility toggle persists to localStorage
- [ ] Sorting works for all sortable columns
- [ ] Pagination works with page size selector
- [ ] Refresh button fetches data without state reset
- [ ] System Logs shows all log levels with correct colors
- [ ] Log detail drawer shows full information
- [ ] Code link opens VS Code at correct file:line
- [ ] Statistics bar shows correct counts
- [ ] Log file selector works correctly

## Notes

- Ikuti pattern yang sudah ada di `UserTable.vue`, `RoleTable.vue` dll
- Gunakan `@vicons/carbon` untuk semua icons
- Ikuti design system di `docs/design-system.md`
- Semua komponen harus menggunakan `<script setup>` dengan TypeScript


# INSTRUKSI
jangan koding dulu, buatkan rancangan implementasi pada file taks/{sesuaikan nama}.md