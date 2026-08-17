# Task 17: Fitur Settings

## Goal
Menambahkan fitur Settings pada admin panel untuk mengatur: favicon, nama aplikasi, dan background login/register.

## Current State
- Sidebar "Sistem" group: Activity Logs, System Logs
- App title "MyApp" hardcoded di `AppLayout.vue:199-201`
- Favicon static `/favicon.svg` di `client/public/`
- HTML title hardcoded "vue-ui" di `index.html`
- Login/register background hardcoded di `AuthLayout.vue`
- Tidak ada settings module atau entity

## Target State

### Settings Fields
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `app_name` | string | `MyApp` | Nama aplikasi (title + sidebar) |
| `app_favicon` | string (URL) | `/favicon.svg` | Favicon URL |
| `login_bg_gradient` | string | `#1e40af,#3b82f6,#6366f1` | Gradient colors login/register bg |

### Layout
```
/dashboard/settings
┌─────────────────────────────────────┐
│  Settings                           │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ App Name                      │  │
│  │ [MyApp                    ]   │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Favicon URL                   │  │
│  │ [/favicon.svg             ]   │  │
│  │ [Preview: ⚡]                  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Login Background              │  │
│  │ [Color 1] [Color 2] [Color 3]│  │
│  │ [Preview gradient]            │  │
│  └───────────────────────────────┘  │
│  [Simpan Perubahan]                 │
└─────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: Server - Settings Entity
**File baru**: `server/src/modules/settings/entities/setting.entity.ts`

```typescript
@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn() id: number
  @Column({ unique: true }) key: string
  @Column({ type: 'text' }) value: string
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
}
```

### Phase 2: Server - Settings Module
**File baru**: `server/src/modules/settings/`
```
settings/
├── settings.module.ts
├── controllers/
│   └── settings.controller.ts
├── services/
│   └── settings.service.ts
└── dto/
    └── update-setting.dto.ts
```

**API Endpoints**:
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/settings` | Get all settings | Bearer |
| GET | `/api/settings/:key` | Get setting by key | Bearer |
| PUT | `/api/settings` | Update multiple settings | Bearer + Roles |

### Phase 3: Server - Seeder
**Edit**: `server/src/common/services/seeder.service.ts`

Tambah `seedSettings()` method:
```typescript
const defaultSettings = [
  { key: 'app_name', value: 'MyApp' },
  { key: 'app_favicon', value: '/favicon.svg' },
  { key: 'login_bg_gradient', value: '#1e40af,#3b82f6,#6366f1' },
]
```

### Phase 4: Server - Register Module
**Edit**: `server/src/app.module.ts`
- Import `SettingsModule`
- Add `Setting` entity to `TypeOrmModule.forRoot({ entities: [...] })`

### Phase 5: Client - Settings Page
**File baru**: `client/src/views/SettingsPage.vue`

Components:
- NCard dengan form
- NInput untuk app_name
- NInput + img preview untuk favicon
- 3 NColorPicker untuk gradient colors
- Gradient preview
- NButton "Simpan Perubahan"

### Phase 6: Client - Router
**Edit**: `client/src/router/index.ts`

Tambah route:
```typescript
{
  path: '/dashboard/settings',
  name: 'Settings',
  component: SettingsPage,
  meta: {
    requiresAuth: true,
    requiredRoles: ['Admin', 'Super Admin'],
    requiredPermission: 'Settings',
  },
}
```

### Phase 7: Client - Sidebar Menu
**Edit**: `client/src/components/layout/AppLayout/AppLayout.vue`

Tambah child di "Sistem" group:
```typescript
{
  label: renderMenuLabel('Settings', '/dashboard/settings'),
  key: 'settings',
  icon: renderIcon(Settings),
}
```

Tambah entry di `routeKeyMap`:
```typescript
'settings': '/dashboard/settings',
```

### Phase 8: Client - Dynamic App Name
**Edit**: `client/src/components/layout/AppLayout/AppLayout.vue`

Ganti hardcoded "MyApp" dengan value dari settings store:
```html
<span v-if="!collapsed">{{ settings.app_name }}</span>
<span v-else>{{ settings.app_name?.charAt(0) }}</span>
```

### Phase 9: Client - Dynamic HTML Title
**Edit**: `client/src/main.ts` atau buat composable

Update `document.title` saat settings berubah:
```typescript
document.title = settings.app_name || 'vue-ui'
```

### Phase 10: Client - Dynamic Favicon
**Edit**: `client/src/main.ts` atau buat composable

Update favicon:
```typescript
const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
if (link) link.href = settings.app_favicon || '/favicon.svg'
```

### Phase 11: Client - Dynamic Login Background
**Edit**: `client/src/components/common/AuthLayout/AuthLayout.vue`

Gunakan gradient dari settings:
```css
background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)
```

### Phase 12: Update Docs
- `docs/architecture.md` - Tambah Settings module section
- `docs/database.md` - Tambah settings table
- `docs/PRD.md` - Tambah Settings feature
- `docs/design-system.md` - Tambah Settings page design
- `AGENTS.md` - Tambah Settings route & module

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `server/src/modules/settings/entities/setting.entity.ts` | CREATE | Setting entity |
| `server/src/modules/settings/settings.module.ts` | CREATE | Settings module |
| `server/src/modules/settings/controllers/settings.controller.ts` | CREATE | Settings controller |
| `server/src/modules/settings/services/settings.service.ts` | CREATE | Settings service |
| `server/src/modules/settings/dto/update-setting.dto.ts` | CREATE | Update DTO |
| `server/src/common/services/seeder.service.ts` | EDIT | Seed default settings |
| `server/src/app.module.ts` | EDIT | Register SettingsModule |
| `client/src/views/SettingsPage.vue` | CREATE | Settings page |
| `client/src/router/index.ts` | EDIT | Add settings route |
| `client/src/components/layout/AppLayout/AppLayout.vue` | EDIT | Add menu item + dynamic title |
| `client/src/components/common/AuthLayout/AuthLayout.vue` | EDIT | Dynamic background |
| `client/src/main.ts` | EDIT | Dynamic title + favicon |
| `docs/architecture.md` | EDIT | Add settings section |
| `docs/database.md` | EDIT | Add settings table |
| `docs/PRD.md` | EDIT | Add settings feature |
| `docs/design-system.md` | EDIT | Add settings page |
| `AGENTS.md` | EDIT | Add settings route |

## Settings Store (Client)
**File baru**: `client/src/stores/settings.store.ts`

```typescript
interface SettingsState {
  app_name: string
  app_favicon: string
  login_bg_gradient: string
}
```

Methods:
- `fetchSettings()` - GET `/api/settings`
- `updateSettings(data)` - PUT `/api/settings`

## Dependencies
- Tidak perlu dependency baru
- Naive UI components sudah ada (NInput, NColorPicker, NCard)
- TypeORM sudah ada

## Testing
1. Server: CRUD settings via API
2. Client: Settings page tampil dengan data default
3. Client: Update settings → favicon, title, sidebar berubah
4. Client: Login background berubah sesuai gradient
5. Responsive: Settings page mobile-friendly

## Estimated Effort
- Server module: ~150 baris
- Client page: ~100 baris
- Client store: ~50 baris
- Client integration: ~30 baris
- Docs: ~100 baris
- Total: ~430 baris
