# Task 10: Activity Logs & System Logs Implementation

## Overview

Menambahkan dua fitur logging baru:
1. **Activity Logs** — Audit trail untuk semua aktivitas user (CRUD, login, logout)
2. **System Logs** — Monitoring log sistem (TRACE, DEBUG, INFO, WARNING, ERROR, dll)

Kedua fitur terintegrasi dengan sistem RBAC yang ada, disimpan di sidebar menu "Sistem", dan mendukung fitur masa depan secara dinamis.

---

## Current State Analysis

### Yang Sudah Ada
- **Database**: SQLite + TypeORM, 10 tabel (users, roles, permissions, guards, + 6 junction tables)
- **RBAC**: Guard chain (JwtAuthGuard → RbacGuard) dengan `@Roles()` dan `@Permissions()` decorators
- **Sidebar**: Naive UI NMenu dengan role-based visibility
- **Logging**: Hanya NestJS built-in `Logger` di `SeederService`
- **Tidak ada**: File-based logging, activity audit trail, `server/logs/` directory

### Yang Perlu Dibuat
- Activity Log entity + module (server)
- System Log service (server) — read dari file
- Custom logger yang menulis ke file
- Client pages untuk kedua fitur
- Permission & guard rules untuk akses
- Sidebar menu "Sistem" dengan dua item

---

## Part A: Activity Logs (Server)

### A1: Entity — `activity_logs`

**File**: `server/src/modules/activity-logs/entities/activity-log.entity.ts`

```typescript
@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  action: string; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW, EXPORT

  @Column()
  entity: string; // User, Role, Permission, Guard, Auth, System

  @Column({ nullable: true })
  entityId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  metadata: string; // JSON: before/after snapshots, changes

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 20, default: 'INFO' })
  level: string; // INFO, WARNING, ERROR

  @CreateDateColumn()
  createdAt: Date;
}
```

### A2: Module Structure

```
server/src/modules/activity-logs/
├── activity-logs.module.ts
├── entities/
│   └── activity-log.entity.ts
├── services/
│   └── activity-logs.service.ts
├── controllers/
│   └── activity-logs.controller.ts
└── dto/
    └── query-activity-log.dto.ts
```

### A3: Service — `activity-logs.service.ts`

**Responsibilities**:
- `log(data: CreateActivityLogDto)` — Simpan activity log
- `findAll(query: QueryActivityLogDto)` — Query dengan filter, search, pagination
- `findOne(id: number)` — Detail activity log
- `getStats()` — Statistik (total, by action, by entity, by user)

**Key Methods**:
```typescript
async log(data: {
  userId?: number;
  action: string;
  entity: string;
  entityId?: number;
  description?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  level?: string;
}): Promise<ActivityLog>

async findAll(query: {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entity?: string;
  userId?: number;
  level?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ data: ActivityLog[]; total: number; page: number; limit: number }>
```

### A4: Controller — `activity-logs.controller.ts`

**Endpoint**:
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/activity-logs` | List all activity logs | Bearer + Permission |
| GET | `/api/activity-logs/stats` | Get statistics | Bearer + Permission |
| GET | `/api/activity-logs/:id` | Get detail | Bearer + Permission |

**Decorators**:
```typescript
@Get()
@Permissions('Activity Logs', 'Full Access')
@Roles('Admin', 'Super Admin')
findAll(@Query() query: QueryActivityLogDto) { ... }
```

### A5: DTO — `query-activity-log.dto.ts`

```typescript
export class QueryActivityLogDto {
  @IsOptional() @IsInt() page?: number = 1;
  @IsOptional() @IsInt() limit?: number = 20;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() action?: string;
  @IsOptional() @IsString() entity?: string;
  @IsOptional() @IsInt() userId?: number;
  @IsOptional() @IsString() level?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}
```

### A6: Integration — Logging Service

**File**: `server/src/common/services/activity-log.service.ts` (Global)

Service ini di-inject ke semua module yang perlu log aktivitas:
- `AuthService` → Log LOGIN, LOGOUT
- `UsersService` → Log CREATE, UPDATE, DELETE user
- `RolesService` → Log CREATE, UPDATE, DELETE role
- `PermissionsService` → Log CREATE, UPDATE, DELETE permission
- `GuardsService` → Log CREATE, UPDATE, DELETE guard

**Pola penggunaan**:
```typescript
// Di dalam service (misal UsersService):
constructor(private activityLogService: ActivityLogService) {}

async create(createUserDto: CreateUserDto, req: any) {
  const user = await this.usersRepo.save(createUserDto);
  await this.activityLogService.log({
    userId: req.user.sub,
    action: 'CREATE',
    entity: 'User',
    entityId: user.id,
    description: `Created user ${user.username}`,
    metadata: { username: user.username, email: user.email },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });
  return user;
}
```

### A7: Register in app.module.ts

```typescript
// Tambahkan entity:
entities: [
  User, Role, Permission, PermissionMethod, PermissionUrl,
  Guard, GuardUrl,
  ActivityLog,  // <-- tambah
],

// Tambahkan module:
imports: [
  ActivityLogsModule,
  // ... existing modules
],
```

---

## Part B: System Logs (Server)

### B1: Custom Logger — File Transport

**File**: `server/src/shared/logger/custom.logger.ts`

```typescript
import { ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class CustomLogger extends ConsoleLogger {
  private logsDir: string;

  constructor() {
    super();
    this.logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private writeToFile(level: string, message: string, context?: string) {
    const date = new Date();
    const filename = `${date.toISOString().split('T')[0]}.log`;
    const filepath = path.join(this.logsDir, filename);
    const timestamp = date.toISOString();
    const logEntry = `[${timestamp}] [${level}] [${context || 'Application'}] ${message}\n`;
    fs.appendFileSync(filepath, logEntry, 'utf8');
  }

  log(message: string, context?: string) {
    super.log(message, context);
    this.writeToFile('INFO', message, context);
  }

  error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.writeToFile('ERROR', `${message} ${stack || ''}`, context);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
    this.writeToFile('WARN', message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
    this.writeToFile('DEBUG', message, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
    this.writeToFile('TRACE', message, context);
  }
}
```

### B2: Update main.ts

```typescript
import { CustomLogger } from './shared/logger/custom.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),  // <-- tambah
  });
  // ... existing config
}
```

### B3: Create `server/logs/` Directory

- Buat directory `server/logs/`
- Tambahkan `server/logs/*.log` ke `.gitignore`

### B4: System Logs Module

**File**: `server/src/modules/system-logs/system-logs.module.ts`

```
server/src/modules/system-logs/
├── system-logs.module.ts
├── services/
│   └── system-logs.service.ts
├── controllers/
│   └── system-logs.controller.ts
└── dto/
    └── query-system-log.dto.ts
```

### B5: Service — `system-logs.service.ts`

**Responsibilities**:
- Baca file log dari `server/logs/`
- Parse log entries
- Filter by level, date, search
- List available log files
- Get log file content

**Key Methods**:
```typescript
async getLogFiles(): Promise<string[]> {
  // Return list of .log files in server/logs/
}

async getLogContent(filename: string, query: {
  level?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ lines: LogEntry[]; total: number }> {
  // Read and parse log file
}

async getLogStats(filename: string): Promise<{
  total: number;
  byLevel: Record<string, number>;
}> {
  // Count log entries by level
}
```

### B6: Controller — `system-logs.controller.ts`

**Endpoint**:
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/system-logs/files` | List log files | Bearer + Permission |
| GET | `/api/system-logs/files/:filename` | Get log content | Bearer + Permission |
| GET | `/api/system-logs/stats/:filename` | Get log statistics | Bearer + Permission |

**Decorators**:
```typescript
@Get('files')
@Permissions('System Logs', 'Full Access')
@Roles('Admin', 'Super Admin')
getLogFiles() { ... }
```

### B7: DTO — `query-system-log.dto.ts`

```typescript
export class QuerySystemLogDto {
  @IsOptional() @IsString() level?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsInt() limit?: number = 100;
  @IsOptional() @IsInt() offset?: number = 0;
}
```

---

## Part C: Permissions & Seed Data

### C1: New Permissions

| Permission Name | Description | Methods | URLs |
|----------------|-------------|---------|------|
| `Activity Logs` | Akses activity logs | GET | `/api/activity-logs/*` |
| `System Logs` | Akses system logs | GET | `/api/system-logs/*` |

### C2: Update Seeder

**File**: `server/src/common/services/seeder.service.ts`

Tambahkan di `seedPermissions()`:
```typescript
const activityLogs = this.permissionsRepo.create({
  permissionName: 'Activity Logs',
  description: 'Akses melihat activity logs',
});
await this.permissionsRepo.save(activityLogs);
await this.permissionMethodsRepo.save(
  this.permissionMethodsRepo.create({ method: 'GET', permission: activityLogs }),
);
await this.permissionUrlsRepo.save(
  this.permissionUrlsRepo.create({ url: '/api/activity-logs/*', permission: activityLogs }),
);

const systemLogs = this.permissionsRepo.create({
  permissionName: 'System Logs',
  description: 'Akses melihat system logs',
});
await this.permissionsRepo.save(systemLogs);
await this.permissionMethodsRepo.save(
  this.permissionMethodsRepo.create({ method: 'GET', permission: systemLogs }),
);
await this.permissionUrlsRepo.save(
  this.permissionUrlsRepo.create({ url: '/api/system-logs/*', permission: systemLogs }),
);
```

Update `seedRoles()` — assign ke Super Admin:
```typescript
const superAdmin = this.rolesRepo.create({
  roleName: 'Super Admin',
  description: 'Akses penuh ke semua fitur',
  guards: [guards[0]], // Full Access
  permissions: [permissions[0], activityLogs, systemLogs], // tambah permissions baru
});
```

### C3: Reset Database

Hapus `server/db.sqlite` dan restart server untuk re-seed.

---

## Part D: Client — Activity Logs Page

### D1: Page Component

**File**: `client/src/views/ActivityLogsPage.vue`

**Fitur**:
- DataTable dengan kolom: ID, User, Action, Entity, Description, Level, Created At
- Filter: action, entity, level, date range
- Search: by description, user
- Pagination
- Detail modal (klik baris)

**Menggunakan**: `DataTable` component yang sudah ada

### D2: Type Definition

**File**: `client/src/types/activity-log.ts`

```typescript
export interface ActivityLog {
  id: number;
  userId: number | null;
  user?: { id: number; firstName: string; lastName: string; username: string };
  action: string;
  entity: string;
  entityId: number | null;
  description: string;
  metadata: string;
  ipAddress: string;
  userAgent: string;
  level: string;
  createdAt: string;
}

export interface QueryActivityLog {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entity?: string;
  userId?: number;
  level?: string;
  startDate?: string;
  endDate?: string;
}
```

### D3: Service

**File**: `client/src/services/activity-log.service.ts`

```typescript
export const activityLogService = {
  findAll(query: QueryActivityLog) {
    return api.get('/activity-logs', { params: query });
  },
  findOne(id: number) {
    return api.get(`/activity-logs/${id}`);
  },
  getStats() {
    return api.get('/activity-logs/stats');
  },
};
```

---

## Part E: Client — System Logs Page

### E1: Page Component

**File**: `client/src/views/SystemLogsPage.vue`

**Fitur**:
- Dropdown select log file (list dari API)
- Log viewer dengan syntax highlighting (level colors)
- Filter: level (checkboxes), search, date range
- Auto-refresh toggle
- Download log file

### E2: Type Definition

**File**: `client/src/types/system-log.ts`

```typescript
export interface LogEntry {
  timestamp: string;
  level: string;
  context: string;
  message: string;
}

export interface SystemLogFile {
  filename: string;
  size: number;
  modified: string;
}

export interface QuerySystemLog {
  level?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
```

### E3: Service

**File**: `client/src/services/system-log.service.ts`

```typescript
export const systemLogService = {
  getFiles() {
    return api.get('/system-logs/files');
  },
  getContent(filename: string, query: QuerySystemLog) {
    return api.get(`/system-logs/files/${filename}`, { params: query });
  },
  getStats(filename: string) {
    return api.get(`/system-logs/stats/${filename}`);
  },
};
```

---

## Part F: Sidebar & Routing

### F1: Update AppLayout.vue

**File**: `client/src/components/layout/AppLayout/AppLayout.vue`

Tambahkan menu group "Sistem" setelah "User Management":

```typescript
import { Activity, Report } from '@vicons/carbon'

// Di dalam menuOptions computed:
if (hasAnyRole(['Admin', 'Super Admin'])) {
  // ... existing User Management group

  options.push({
    label: 'Sistem',
    key: 'sistem',
    icon: renderIcon(Settings), // atau icon lain
    children: [
      {
        label: 'Activity Logs',
        key: 'activity-logs',
        icon: renderIcon(Activity),
      },
      {
        label: 'System Logs',
        key: 'system-logs',
        icon: renderIcon(Report),
      },
    ],
  })
}
```

**Route mappings**:
```typescript
const routeKeyMap = {
  // ... existing
  '/dashboard/activity-logs': 'activity-logs',
  '/dashboard/system-logs': 'system-logs',
}

const menuRouteMap = {
  // ... existing
  'activity-logs': '/dashboard/activity-logs',
  'system-logs': '/dashboard/system-logs',
}
```

### F2: Update Router

**File**: `client/src/router/index.ts`

```typescript
{
  path: '/dashboard/activity-logs',
  name: 'ActivityLogs',
  component: () => import('@/views/ActivityLogsPage.vue'),
  meta: {
    requiresAuth: true,
    requiredRoles: ['Admin', 'Super Admin'],
    requiredPermission: 'Activity Logs',
  },
},
{
  path: '/dashboard/system-logs',
  name: 'SystemLogs',
  component: () => import('@/views/SystemLogsPage.vue'),
  meta: {
    requiresAuth: true,
    requiredRoles: ['Admin', 'Super Admin'],
    requiredPermission: 'System Logs',
  },
},
```

---

## Part G: Documentation Updates

### G1: Update `docs/database.md`

Tambahkan entity `activity_logs` ke ERD dan detail tabel.

### G2: Update `docs/PRD.md`

Tambahkan section:
- 3.7 Activity Logs
- 3.8 System Logs

### G3: Update `docs/architecture.md`

Tambahkan:
- Activity Logs module structure
- System Logs module structure
- Custom Logger setup

### G4: Update `AGENTS.md`

Tambahkan:
- Activity Logs & System Logs commands
- Sidebar menu updated
- New permissions

---

## File Checklist

### Server (New Files)
- [ ] `server/src/modules/activity-logs/activity-logs.module.ts`
- [ ] `server/src/modules/activity-logs/entities/activity-log.entity.ts`
- [ ] `server/src/modules/activity-logs/services/activity-logs.service.ts`
- [ ] `server/src/modules/activity-logs/controllers/activity-logs.controller.ts`
- [ ] `server/src/modules/activity-logs/dto/query-activity-log.dto.ts`
- [ ] `server/src/modules/system-logs/system-logs.module.ts`
- [ ] `server/src/modules/system-logs/services/system-logs.service.ts`
- [ ] `server/src/modules/system-logs/controllers/system-logs.controller.ts`
- [ ] `server/src/modules/system-logs/dto/query-system-log.dto.ts`
- [ ] `server/src/shared/logger/custom.logger.ts`
- [ ] `server/logs/` (directory)

### Server (Modified Files)
- [ ] `server/src/main.ts` — Use CustomLogger
- [ ] `server/src/app.module.ts` — Register ActivityLog entity + modules
- [ ] `server/src/common/services/seeder.service.ts` — Add new permissions
- [ ] `server/.gitignore` — Add `logs/*.log`

### Server (Integration Files)
- [ ] `server/src/modules/auth/services/auth.service.ts` — Log LOGIN/LOGOUT
- [ ] `server/src/modules/users/services/users.service.ts` — Log CRUD
- [ ] `server/src/modules/roles/services/roles.service.ts` — Log CRUD
- [ ] `server/src/modules/permissions/services/permissions.service.ts` — Log CRUD
- [ ] `server/src/modules/guards/services/guards.service.ts` — Log CRUD

### Client (New Files)
- [ ] `client/src/views/ActivityLogsPage.vue`
- [ ] `client/src/views/SystemLogsPage.vue`
- [ ] `client/src/types/activity-log.ts`
- [ ] `client/src/types/system-log.ts`
- [ ] `client/src/services/activity-log.service.ts`
- [ ] `client/src/services/system-log.service.ts`

### Client (Modified Files)
- [ ] `client/src/components/layout/AppLayout/AppLayout.vue` — Add Sistem menu group
- [ ] `client/src/router/index.ts` — Add new routes

### Documentation (Modified Files)
- [ ] `docs/database.md` — Add activity_logs entity
- [ ] `docs/PRD.md` — Add Activity Logs & System Logs sections
- [ ] `docs/architecture.md` — Add logging architecture
- [ ] `AGENTS.md` — Update sidebar, permissions, commands

---

## Implementation Order

### Phase 1: Server Foundation
1. Buat `server/logs/` directory
2. Update `.gitignore`
3. Buat `CustomLogger` class
4. Update `main.ts` untuk use CustomLogger
5. Test: restart server, cek file log terbuat

### Phase 2: Activity Logs Module
6. Buat ActivityLog entity
7. Buat ActivityLogs module, service, controller, DTO
8. Register di `app.module.ts`
9. Test: GET `/api/activity-logs` (belum ada data)

### Phase 3: System Logs Module
10. Buat SystemLogs module, service, controller, DTO
11. Register di `app.module.ts`
12. Test: GET `/api/system-logs/files`

### Phase 4: Integration
13. Update SeederService — tambah permissions baru
14. Inject ActivityLogService ke AuthService, UsersService, dll
15. Log aktivitas CRUD dan login/logout
16. Reset database (`rm server/db.sqlite`, restart)

### Phase 5: Client
17. Buat type definitions
18. Buat service files
19. Buat ActivityLogsPage.vue
20. Buat SystemLogsPage.vue
21. Update AppLayout.vue — tambah Sistem menu
22. Update router — tambah routes

### Phase 6: Documentation
23. Update `docs/database.md`
24. Update `docs/PRD.md`
25. Update `docs/architecture.md`
26. Update `AGENTS.md`

---

## Testing Checklist

- [ ] Server restart tanpa error
- [ ] Activity logs API berfungsi (GET list, GET detail, GET stats)
- [ ] System logs API berfungsi (GET files, GET content, GET stats)
- [ ] Login menghasilkan activity log
- [ ] CRUD user/role/permission/guard menghasilkan activity log
- [ ] System logs terisi di `server/logs/`
- [ ] Sidebar "Sistem" muncul untuk Admin/Super Admin
- [ ] Activity Logs page bisa diakses
- [ ] System Logs page bisa diakses
- [ ] Permission check bekerja (non-admin tidak bisa akses)
- [ ] Documentation terupdate
