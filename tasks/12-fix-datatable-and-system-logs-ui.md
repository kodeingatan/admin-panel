# Task 11: Perbaikan DataTable & System Logs UI

## Overview

Perbaikan dan peningkatan UI untuk DataTable component dan halaman System Logs. Ada 3 masalah utama:
1. **DataTable tidak konsisten** — System Logs belum menggunakan DataTable component
2. **Search input terlalu pendek** — Input search tidak terlihat jelas
3. **System Logs UI kurang lengkap** — Perlu peningkatan dengan fitur log detail, code link, statistik

---

## Current State Analysis

### DataTable Component (`client/src/components/common/DataTable/DataTable.vue`)
- Sudah memiliki: search input, field-specific search, column visibility toggle, pagination, reset filters
- **Missing**: localStorage persistence untuk column visibility, refresh/reload button built-in, min-width 320px pada search input
- Search input menggunakan `flex-1` pada container `flex-1 max-w-md` — max-width terbatas

### ActivityLogsPage (`client/src/views/ActivityLogsPage.vue`)
- Sudah menggunakan DataTable component
- **Missing**: `@search-field-change` handler, `@sort-change` handler
- Filter (action, entity, level) sudah ada di card header

### SystemLogsPage (`client/src/views/SystemLogsPage.vue`)
- **TIDAK menggunakan DataTable** — menggunakan raw `NDataTable` + `NPagination` terpisah
- Missing: global search, field-specific search, column visibility, proper sorting
- Pagination menggunakan offset-based (mismatch dengan DataTable yang page-based)
- Level badge hanya 5 level (INFO, WARN, ERROR, DEBUG, TRACE) — design system spec 9 level
- Tidak ada: log detail drawer, code link action, statistics bar yang lengkap

### Server System Logs (`server/src/modules/system-logs/`)
- Pagination offset-based — perlu konversi ke page-based untuk DataTable
- Log format: `[timestamp] [level] [context] message`
- Tidak ada stack trace parsing

---

## Implementation Plan

### Phase 1: Fix DataTable Component

**File**: `client/src/components/common/DataTable/DataTable.vue`

#### 1.1 Search Input Min-Width
- Ubah container search dari `flex-1 max-w-md` menjadi `flex-1` dengan `min-w-[320px]`
- Pastikan input memiliki min-width 320px

```diff
- <div class="flex items-center gap-3 flex-1 max-w-md">
+ <div class="flex items-center gap-3 flex-1 min-w-[320px]">
```

#### 1.2 localStorage Persistence untuk Column Visibility
- Simpan `hiddenColumns` ke `localStorage` dengan key `datatable-hidden-columns`
- Load dari `localStorage` saat component mount
- Update `localStorage` saat toggle column

```typescript
const STORAGE_KEY = 'datatable-hidden-columns'

// Load
const hiddenColumns = ref<Set<string>>(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
})

// Save (watch)
watch(hiddenColumns, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...val]))
}, { deep: true })
```

#### 1.3 Refresh Button
- Tambahkan `#toolbar` slot default berisi refresh button
- Atau tambahkan prop `showRefresh` dengan emit `refresh`
- **Decision**: Tambahkan emit `refresh` dan biarkan parent handle via `#toolbar` slot (sudah ada pattern ini di UserTable)

#### 1.4 Pagination Text
- Tambahkan text "Showing X-Y of Z" di bawah table

---

### Phase 2: Fix ActivityLogsPage

**File**: `client/src/views/ActivityLogsPage.vue`

#### 2.1 Wire Up Missing Events
- Tambahkan `@search-field-change` handler
- Tambahkan `@sort-change` handler
- Kirim `searchField` dan `sortBy`/`sortOrder` ke API

```typescript
const searchField = ref('')
const sortBy = ref('id')
const sortOrder = ref<'ASC' | 'DESC'>('DESC')

function handleSearchField(field: string) {
  searchField.value = field
  page.value = 1
  fetchLogs()
}

function handleSortChange(sorter: { columnKey: string; order: 'ascend' | 'descend' | false }) {
  if (!sorter.order) {
    sortBy.value = 'id'
    sortOrder.value = 'DESC'
  } else {
    sortBy.value = sorter.columnKey
    sortOrder.value = sorter.order === 'ascend' ? 'ASC' : 'DESC'
  }
  page.value = 1
  fetchLogs()
}
```

#### 2.2 Update fetchLogs params
```typescript
const params: any = {
  page: page.value,
  limit: limit.value,
}
if (search.value) params.search = search.value
if (searchField.value) params.searchField = searchField.value
if (sortBy.value) params.sortBy = sortBy.value
if (sortOrder.value) params.sortOrder = sortOrder.value
// ... existing filter params
```

#### 2.3 Add searchableFields to DataTable
- Tambahkan prop `searchable-fields` yang sudah didefinisikan tapi belum di-pass

---

### Phase 3: Type Definitions Update

**File**: `client/src/types/system-log.ts`

#### 3.1 Extend LogEntry Interface
```typescript
export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'FATAL' | 'EMERGENCY'

export interface LogStackFrame {
  file: string
  line: number
  column?: number
  function?: string
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  context: string
  message: string
  stackTrace?: string
  metadata?: Record<string, any>
  rawLine: string
  // Parsed from stack trace
  codePath?: string
  codeLine?: number
}
```

#### 3.2 Update QuerySystemLog
```typescript
export interface QuerySystemLog {
  level?: string
  search?: string
  searchField?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}
```

#### 3.3 Add Log Detail Type
```typescript
export interface LogDetail extends LogEntry {
  id: number
  stackFrames?: LogStackFrame[]
}
```

---

### Phase 4: Server System Logs Enhancement

**File**: `server/src/modules/system-logs/services/system-logs.service.ts`

#### 4.1 Add Page-Based Pagination Support
Ubah `getLogContent` untuk mendukung `page` + `limit` (selain `offset` + `limit` yang sudah ada):

```typescript
async getLogContent(filename: string, query: {
  level?: string
  search?: string
  searchField?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}): Promise<{ lines: LogEntry[]; total: number; page: number; limit: number }> {
  // ... existing parse & filter logic

  // Sorting
  if (query.sortBy) {
    filtered.sort((a, b) => {
      const valA = a[query.sortBy!] || ''
      const valB = b[query.sortBy!] || ''
      const cmp = String(valA).localeCompare(String(valB))
      return query.sortOrder === 'DESC' ? -cmp : cmp
    })
  }

  // Pagination (page-based)
  const page = query.page || 1
  const limit = query.limit || 100
  const offset = (page - 1) * limit
  const lines = filtered.slice(offset, offset + limit)

  return { lines, total: filtered.length, page, limit }
}
```

#### 4.2 Add Stack Trace Parsing
Tambahkan parsing untuk mendeteksi stack trace dalam log message:

```typescript
private parseStackTrace(message: string): { cleanMessage: string; stackTrace?: string; codePath?: string; codeLine?: number } {
  const stackTraceRegex = /(?:Error|Exception|at\s+).*(?:\n\s+at\s+.+)*/s
  const match = message.match(stackTraceRegex)

  if (match) {
    const stackTrace = match[0]
    const cleanMessage = message.replace(stackTrace, '').trim()

    // Extract first file path from stack trace
    const fileRegex = /at\s+(?:(?:\S+\s+\()?(\/[^\s:]+):(\d+):\d+\)?)|(?:at\s+(\/[^\s:]+):(\d+))/
    const fileMatch = stackTrace.match(fileRegex)
    const codePath = fileMatch?.[1] || fileMatch?.[3]
    const codeLine = fileMatch?.[2] ? parseInt(fileMatch[2]) : fileMatch?.[4] ? parseInt(fileMatch[4]) : undefined

    return { cleanMessage, stackTrace, codePath, codeLine }
  }

  return { cleanMessage: message }
}
```

#### 4.3 Update LogEntry Interface (Server)
```typescript
export interface LogEntry {
  timestamp: string
  level: string
  context: string
  message: string
  stackTrace?: string
  metadata?: Record<string, any>
  rawLine: string
  codePath?: string
  codeLine?: number
}
```

#### 4.4 Update parseLogLine
```typescript
private parseLogLine(line: string): LogEntry | null {
  const match = line.match(
    /^\[([^\]]+)\]\s+\[([^\]]+)\]\s+\[([^\]]+)\]\s+(.*)$/,
  )
  if (!match) return null

  const { cleanMessage, stackTrace, codePath, codeLine } = this.parseStackTrace(match[4])

  return {
    timestamp: match[1],
    level: match[2],
    context: match[3],
    message: cleanMessage,
    stackTrace,
    rawLine: line,
    codePath,
    codeLine,
  }
}
```

#### 4.5 Update DTO
**File**: `server/src/modules/system-logs/dto/query-system-log.dto.ts`

```typescript
export class QuerySystemLogDto {
  @IsOptional() @IsString() level?: string
  @IsOptional() @IsString() search?: string
  @IsOptional() @IsString() searchField?: string
  @IsOptional() @IsDateString() startDate?: string
  @IsOptional() @IsDateString() endDate?: string
  @IsOptional() @Type(() => Number) @IsInt() page?: number = 1
  @IsOptional() @Type(() => Number) @IsInt() limit?: number = 100
  @IsOptional() @Type(() => Number) @IsInt() offset?: number
  @IsOptional() @IsString() sortBy?: string
  @IsOptional() @IsString() sortOrder?: 'ASC' | 'DESC'
}
```

---

### Phase 5: Client System Log Service Update

**File**: `client/src/services/system-log.service.ts`

```typescript
import api from './api'
import type { QuerySystemLog } from '@/types/system-log'

export const systemLogService = {
  getFiles() {
    return api.get('/system-logs/files')
  },
  getContent(filename: string, query: QuerySystemLog) {
    return api.get(`/system-logs/files/${filename}`, { params: query })
  },
  getStats(filename: string) {
    return api.get(`/system-logs/stats/${filename}`)
  },
}
```

---

### Phase 6: New Feature Components

#### 6.1 LogDetailDrawer
**File**: `client/src/features/logs/components/LogDetailDrawer.vue`

Komponen drawer untuk menampilkan detail log entry:
- Timestamp lengkap + relative time
- Level badge (NTag dengan warna sesuai level)
- Context (service name)
- Full message (no truncation)
- Stack trace (jika ada) — formatted code block
- Metadata — JSON viewer
- Raw line
- Code link buttons (Open in VS Code, Copy Path, Copy Line)

```vue
<script setup lang="ts">
import { computed } from 'vue'
import {
  NDrawer, NDrawerContent, NTag, NDescriptions, NDescriptionsItem,
  NCode, NButton, NSpace, NIcon, NTooltip, NJsonEditor,
} from 'naive-ui'
import { Launch, Copy, Document } from '@vicons/carbon'
import type { LogEntry } from '@/types/system-log'

const props = defineProps<{
  visible: boolean
  entry: LogEntry | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

// Log level color mapping
const levelColorMap: Record<string, string> = {
  TRACE: '#6b7280',
  DEBUG: '#3b82f6',
  INFO: '#10b981',
  NOTICE: '#38bdf8',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  CRITICAL: '#dc2626',
  FATAL: '#991b1b',
  EMERGENCY: '#7f1d1d',
}

const levelTagType = computed(() => {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    TRACE: 'default',
    DEBUG: 'default',
    INFO: 'info',
    NOTICE: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'error',
    FATAL: 'error',
    EMERGENCY: 'error',
  }
  return map[props.entry?.level || ''] || 'default'
})

function openInVSCode(path?: string, line?: number) {
  if (!path) return
  const uri = line ? `vscode://file/${path}:${line}` : `vscode://file/${path}`
  window.open(uri, '_blank')
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <NDrawer :show="visible" @update:show="emit('update:visible', $event)" :width="520" placement="right">
    <NDrawerContent title="Log Detail">
      <template v-if="entry">
        <NDescriptions :column="1" bordered label-placement="left">
          <NDescriptionsItem label="Timestamp">
            {{ entry.timestamp }}
          </NDescriptionsItem>
          <NDescriptionsItem label="Level">
            <NTag :type="levelTagType" size="small">{{ entry.level }}</NTag>
          </NDescriptionsItem>
          <NDescriptionsItem label="Context">
            {{ entry.context }}
          </NDescriptionsItem>
          <NDescriptions-item label="Message">
            <div style="white-space: pre-wrap; word-break: break-all;">{{ entry.message }}</div>
          </NDescriptions-item>
          <NDescriptionsItem v-if="entry.stackTrace" label="Stack Trace">
            <NCode :code="entry.stackTrace" language="typescript" />
          </NDescriptionsItem>
          <NDescriptionsItem v-if="entry.rawLine" label="Raw Line">
            <NCode :code="entry.rawLine" />
          </NDescriptionsItem>
        </NDescriptions>

        <NSpace v-if="entry.codePath" style="margin-top: 16px">
          <NButton size="small" @click="openInVSCode(entry.codePath, entry.codeLine)">
            <template #icon><NIcon><Launch /></NIcon></template>
            Open in VS Code
          </NButton>
          <NButton size="small" @click="copyToClipboard(entry.codePath!)">
            <template #icon><NIcon><Copy /></NIcon></template>
            Copy Path
          </NButton>
          <NButton v-if="entry.codeLine" size="small" @click="copyToClipboard(String(entry.codeLine!))">
            <template #icon><NIcon><Document /></NIcon></template>
            Copy Line {{ entry.codeLine }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
```

#### 6.2 LogLevelBadge
**File**: `client/src/features/logs/components/LogLevelBadge.vue`

Reusable badge component untuk log levels:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { NTag } from 'naive-ui'
import type { LogLevel } from '@/types/system-log'

const props = defineProps<{
  level: LogLevel | string
  size?: 'small' | 'medium' | 'large'
}>()

const tagType = computed(() => {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    TRACE: 'default',
    DEBUG: 'default',
    INFO: 'info',
    NOTICE: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'error',
    FATAL: 'error',
    EMERGENCY: 'error',
  }
  return map[props.level] || 'default'
})

const tagColor = computed(() => {
  const map: Record<string, string> = {
    TRACE: '#6b7280',
    DEBUG: '#3b82f6',
    INFO: '#10b981',
    NOTICE: '#38bdf8',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    CRITICAL: '#dc2626',
    FATAL: '#991b1b',
    EMERGENCY: '#7f1d1d',
  }
  return map[props.level]
})
</script>

<template>
  <NTag :type="tagType" :size="size || 'small'" :bordered="false">
    {{ level }}
  </NTag>
</template>
```

#### 6.3 CodeLinkButton
**File**: `client/src/features/logs/components/CodeLinkButton.vue`

```vue
<script setup lang="ts">
import { NButton, NIcon, NTooltip, NSpace } from 'naive-ui'
import { Launch, Copy } from '@vicons/carbon'

const props = defineProps<{
  path?: string
  line?: number
}>()

function openInVSCode() {
  if (!props.path) return
  const uri = props.line ? `vscode://file/${props.path}:${props.line}` : `vscode://file/${props.path}`
  window.open(uri, '_blank')
}

function copyPath() {
  if (props.path) navigator.clipboard.writeText(props.path)
}

function copyLine() {
  if (props.line) navigator.clipboard.writeText(String(props.line))
}
</script>

<template>
  <NSpace :size="4" v-if="path">
    <NTooltip>
      <template #trigger>
        <NButton size="tiny" quaternary @click="openInVSCode">
          <template #icon><NIcon><Launch /></NIcon></template>
        </NButton>
      </template>
      Open in VS Code
    </NTooltip>
    <NTooltip>
      <template #trigger>
        <NButton size="tiny" quaternary @click="copyPath">
          <template #icon><NIcon><Copy /></NIcon></template>
        </NButton>
      </template>
      Copy Path
    </NTooltip>
    <NTooltip v-if="line">
      <template #trigger>
        <NButton size="tiny" quaternary @click="copyLine">
          <template #icon><NIcon><Document /></NIcon></template>
        </NButton>
      </template>
      Copy Line {{ line }}
    </NTooltip>
  </NSpace>
</template>
```

#### 6.4 Index Export
**File**: `client/src/features/logs/index.ts`

```typescript
export { default as LogDetailDrawer } from './components/LogDetailDrawer.vue'
export { default as LogLevelBadge } from './components/LogLevelBadge.vue'
export { default as CodeLinkButton } from './components/CodeLinkButton.vue'
```

---

### Phase 7: Redesign SystemLogsPage

**File**: `client/src/views/SystemLogsPage.vue`

#### 7.1 Structure
Gunakan DataTable component dengan semua fitur yang diperlukan:

```vue
<script setup lang="ts">
import { ref, h, onMounted, computed } from 'vue'
import { NTag, NSpace, NSelect, NStatistic, NButton, NIcon } from 'naive-ui'
import { Restart } from '@vicons/carbon'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import DataTable from '@/components/common/DataTable/DataTable.vue'
import { LogDetailDrawer, LogLevelBadge } from '@/features/logs'
import { systemLogService } from '@/services/system-log.service'
import { useAuthStore } from '@/stores/auth.store'
import type { LogEntry, SystemLogFile, SystemLogStats, LogLevel } from '@/types/system-log'

const authStore = useAuthStore()
const files = ref<SystemLogFile[]>([])
const selectedFile = ref<string | null>(null)
const logEntries = ref<LogEntry[]>([])
const stats = ref<SystemLogStats | null>(null)
const loading = ref(false)
const page = ref(1)
const limit = ref(20)
const total = ref(0)
const search = ref('')
const searchField = ref('')
const sortBy = ref('timestamp')
const sortOrder = ref<'ASC' | 'DESC'>('DESC')
const filterLevel = ref<string | null>(null)

// Detail drawer
const showDetail = ref(false)
const selectedEntry = ref<LogEntry | null>(null)

const searchableFields = [
  { label: 'Message', value: 'message' },
  { label: 'Context', value: 'context' },
  { label: 'Level', value: 'level' },
]

const levelOptions = [
  { label: 'TRACE', value: 'TRACE' },
  { label: 'DEBUG', value: 'DEBUG' },
  { label: 'INFO', value: 'INFO' },
  { label: 'NOTICE', value: 'NOTICE' },
  { label: 'WARNING', value: 'WARNING' },
  { label: 'ERROR', value: 'ERROR' },
  { label: 'CRITICAL', value: 'CRITICAL' },
  { label: 'FATAL', value: 'FATAL' },
  { label: 'EMERGENCY', value: 'EMERGENCY' },
]

const columns = computed(() => [
  { title: 'Timestamp', key: 'timestamp', width: 200, sortable: true },
  {
    title: 'Level',
    key: 'level',
    width: 100,
    sortable: true,
    render(row: LogEntry) {
      return h(LogLevelBadge, { level: row.level, size: 'small' })
    },
  },
  { title: 'Context', key: 'context', width: 150, sortable: true },
  { title: 'Message', key: 'message', ellipsis: { tooltip: true } },
  {
    title: 'Actions',
    key: 'actions',
    width: 80,
    render(row: LogEntry) {
      return h(
        NTag,
        {
          size: 'small',
          style: 'cursor: pointer',
          onClick: () => {
            selectedEntry.value = row
            showDetail.value = true
          },
        },
        { default: () => 'View' },
      )
    },
  },
])

// Statistics bar computed
const statCounts = computed(() => {
  if (!stats.value) return null
  return {
    total: stats.value.total,
    TRACE: stats.value.byLevel['TRACE'] || 0,
    DEBUG: stats.value.byLevel['DEBUG'] || 0,
    INFO: stats.value.byLevel['INFO'] || 0,
    NOTICE: stats.value.byLevel['NOTICE'] || 0,
    WARNING: stats.value.byLevel['WARNING'] || 0,
    ERROR: stats.value.byLevel['ERROR'] || 0,
    CRITICAL: stats.value.byLevel['CRITICAL'] || 0,
    FATAL: stats.value.byLevel['FATAL'] || 0,
    EMERGENCY: stats.value.byLevel['EMERGENCY'] || 0,
  }
})

// Fetch functions
const fetchFiles = async () => { /* ... */ }
const fetchContent = async () => { /* ... */ }

// Event handlers
function handleSearch(value: string) {
  search.value = value
  page.value = 1
  fetchContent()
}

function handleSearchField(field: string) {
  searchField.value = field
  page.value = 1
  fetchContent()
}

function handlePageChange(p: number) {
  page.value = p
  fetchContent()
}

function handleLimitChange(l: number) {
  limit.value = l
  page.value = 1
  fetchContent()
}

function handleSortChange(sorter: { columnKey: string; order: 'ascend' | 'descend' | false }) {
  if (!sorter.order) {
    sortBy.value = 'timestamp'
    sortOrder.value = 'DESC'
  } else {
    sortBy.value = sorter.columnKey
    sortOrder.value = sorter.order === 'ascend' ? 'ASC' : 'DESC'
  }
  page.value = 1
  fetchContent()
}

function handleRefresh() {
  fetchContent()
}

onMounted(() => {
  fetchFiles()
})
</script>
```

#### 7.2 Template
```vue
<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <n-card title="System Logs">
      <template #header-extra>
        <n-space>
          <n-select
            v-model:value="selectedFile"
            placeholder="Select log file"
            :options="fileOptions"
            style="width: 300px"
            @update:value="handleFileChange"
          />
          <n-select
            v-model:value="filterLevel"
            placeholder="Level"
            clearable
            :options="levelOptions"
            style="width: 120px"
            @update:value="handleFilter"
          />
        </n-space>
      </template>

      <!-- Statistics Bar -->
      <n-space v-if="statCounts" style="margin-bottom: 16px" align="center">
        <n-statistic label="Total" :value="statCounts.total" />
        <n-statistic v-for="(count, level) in statCounts" :key="level" :label="String(level)" :value="count" />
      </n-space>

      <!-- DataTable -->
      <DataTable
        :columns="columns"
        :data="logEntries"
        :loading="loading"
        :page="page"
        :limit="limit"
        :total="total"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        search-placeholder="Search system logs..."
        :searchable-fields="searchableFields"
        @search="handleSearch"
        @search-field-change="handleSearchField"
        @update:page="handlePageChange"
        @update:limit="handleLimitChange"
        @sort-change="handleSortChange"
      >
        <template #toolbar>
          <NButton @click="handleRefresh" :loading="loading">
            <template #icon><NIcon><Restart /></NIcon></template>
            Refresh
          </NButton>
        </template>
      </DataTable>
    </n-card>

    <!-- Log Detail Drawer -->
    <LogDetailDrawer
      v-model:visible="showDetail"
      :entry="selectedEntry"
    />
  </AppLayout>
</template>
```

---

### Phase 8: Feature Index Update

**File**: `client/src/features/logs/index.ts`

```typescript
export { default as LogDetailDrawer } from './components/LogDetailDrawer.vue'
export { default as LogLevelBadge } from './components/LogLevelBadge.vue'
export { default as CodeLinkButton } from './components/CodeLinkButton.vue'
```

---

## File Checklist

### New Files
- [ ] `client/src/features/logs/index.ts`
- [ ] `client/src/features/logs/components/LogDetailDrawer.vue`
- [ ] `client/src/features/logs/components/LogLevelBadge.vue`
- [ ] `client/src/features/logs/components/CodeLinkButton.vue`

### Modified Files (Client)
- [ ] `client/src/components/common/DataTable/DataTable.vue` — Fix search width, localStorage columns
- [ ] `client/src/views/ActivityLogsPage.vue` — Wire up sort + search-field-change
- [ ] `client/src/views/SystemLogsPage.vue` — Complete redesign with DataTable
- [ ] `client/src/types/system-log.ts` — Extend with LogLevel, stack trace, code path
- [ ] `client/src/services/system-log.service.ts` — Update query params

### Modified Files (Server)
- [ ] `server/src/modules/system-logs/services/system-logs.service.ts` — Page-based pagination, stack trace parsing, sorting
- [ ] `server/src/modules/system-logs/dto/query-system-log.dto.ts` — Add page, sortBy, sortOrder, searchField

---

## Implementation Order

### Step 1: DataTable Component Fix
1. Fix search input min-width to 320px
2. Add localStorage persistence for column visibility
3. Add refresh button via emit (parent handles via #toolbar slot)

### Step 2: Type Definitions
4. Update `client/src/types/system-log.ts` with LogLevel, stack trace fields, code path

### Step 3: Server Enhancements
5. Update server DTO with page-based pagination + sorting params
6. Update server service with page-based pagination, sorting, stack trace parsing
7. Update parseLogLine to extract code path from stack traces

### Step 4: Client Service
8. Update `client/src/services/system-log.service.ts` with new query params

### Step 5: Feature Components
9. Create `client/src/features/logs/` directory
10. Create LogLevelBadge component
11. Create CodeLinkButton component
12. Create LogDetailDrawer component
13. Create index.ts export file

### Step 6: SystemLogsPage Redesign
14. Rewrite SystemLogsPage to use DataTable component
15. Add statistics bar with all 9 log levels
16. Wire up all DataTable events (search, sort, pagination)
17. Add log detail drawer integration
18. Add log file selector

### Step 7: ActivityLogsPage Fix
19. Wire up @search-field-change event
20. Wire up @sort-change event
21. Pass searchableFields to DataTable

### Step 8: Testing
22. Test DataTable search input visibility (min-width 320px)
23. Test column visibility persistence across page reload
24. Test ActivityLogsPage sort and field-specific search
25. Test SystemLogsPage with all log levels
26. Test log detail drawer opens correctly
27. Test code link opens VS Code at correct file:line
28. Test statistics bar shows correct counts
29. Test log file selector switches files

---

## Testing Checklist

- [ ] DataTable search input min-width 320px, visible and clearable
- [ ] Column visibility toggle persists to localStorage
- [ ] ActivityLogsPage: field-specific search works
- [ ] ActivityLogsPage: sorting works for all sortable columns
- [ ] SystemLogsPage: uses DataTable component (not raw NDataTable)
- [ ] SystemLogsPage: global search works with debounce 300ms
- [ ] SystemLogsPage: field-specific search selector works
- [ ] SystemLogsPage: column visibility toggle works
- [ ] SystemLogsPage: sorting works for Timestamp, Level, Context
- [ ] SystemLogsPage: pagination with page size selector (10, 20, 50, 100)
- [ ] SystemLogsPage: refresh button fetches without state reset
- [ ] SystemLogsPage: all 9 log levels displayed with correct colors
- [ ] SystemLogsPage: log detail drawer shows full info
- [ ] SystemLogsPage: code link opens VS Code at file:line
- [ ] SystemLogsPage: statistics bar shows correct counts per level
- [ ] SystemLogsPage: log file selector switches files correctly
- [ ] SystemLogsPage: default page size is 20
