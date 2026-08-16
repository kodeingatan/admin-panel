# Task 15: Profile Edit — Update Profil & Ganti Password

## Problem

Dropdown "Profile" di AppLayout tidak ada handler. User tidak bisa mengedit profil atau mengganti password dari UI.

## Goal

User bisa klik "Profile" di dropdown → halaman edit profil (firstName, lastName, email, username) + section ganti password (current password → newPassword + confirmPassword).

## Architecture

### Server — 2 Endpoint Baru di Auth Module

Endpoint ini **self-service** (user edit data sendiri), bukan admin endpoint. Tidak perlu `@Roles` / `@Permissions` — cukup pastikan user hanya bisa edit data sendiri.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/api/auth/profile` | Bearer | Update profil (firstName, lastName, email, username) |
| PATCH | `/api/auth/password` | Bearer | Ganti password (currentPassword, newPassword, confirmPassword) |

**Kenapa di Auth module, bukan Users module?**
- Users module endpoint pakai `@Permissions('User Management', 'Full Access')` + `@Roles('Admin')` — user biasa tidak punya akses
- Auth module sudah handle JWT dan `req.user.sub` — natural untuk self-service
- Pisahkan concerns: admin management vs self-service profile

### Client — ProfilePage.vue

Satu halaman dengan 2 form section:
1. **Profile Info** — firstName, lastName, email, username (pre-filled dari auth store)
2. **Change Password** — currentPassword, newPassword, confirmPassword

---

## Implementation Steps

### Server

#### 1. Buat DTO

**File baru**: `server/src/modules/auth/dto/update-profile.dto.ts`

```typescript
export class UpdateProfileDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100)
  firstName?: string;

  @IsOptional() @IsString() @MinLength(1) @MaxLength(100)
  lastName?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString() @MinLength(3) @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username?: string;
}
```

**File baru**: `server/src/modules/auth/dto/change-password.dto.ts`

```typescript
export class ChangePasswordDto {
  @IsString() @MinLength(1)
  currentPassword: string;

  @IsString() @MinLength(8) @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
```

#### 2. Tambah Method di AuthService

**File**: `server/src/modules/auth/services/auth.service.ts`

Tambah 2 method:

```typescript
async updateProfile(userId: number, dto: UpdateProfileDto, req?: any) {
  const user = await this.usersRepository.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  // Check uniqueness untuk email dan username
  if (dto.email && dto.email !== user.email) {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');
  }
  if (dto.username && dto.username !== user.username) {
    const existing = await this.usersRepository.findOne({ where: { username: dto.username } });
    if (existing) throw new ConflictException('Username already taken');
  }

  Object.assign(user, dto);
  await this.usersRepository.save(user);

  // Log activity
  await this.activityLogsService.log({
    userId,
    action: 'UPDATE',
    entity: 'Auth',
    entityId: user.id,
    description: `Profile updated: ${user.username}`,
    metadata: { username: user.username, email: user.email },
    ipAddress: req?.ip,
    userAgent: req?.headers?.['user-agent'],
  });

  const { password, ...result } = user as any;
  return result;
}

async changePassword(userId: number, dto: ChangePasswordDto, req?: any) {
  const user = await this.usersRepository.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  if (dto.newPassword !== dto.confirmPassword) {
    throw new ConflictException('Passwords do not match');
  }

  const isCurrentValid = await bcrypt.compare(dto.currentPassword, user.password);
  if (!isCurrentValid) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  user.password = await bcrypt.hash(dto.newPassword, 10);
  await this.usersRepository.save(user);

  await this.activityLogsService.log({
    userId,
    action: 'UPDATE',
    entity: 'Auth',
    entityId: user.id,
    description: `Password changed: ${user.username}`,
    metadata: { username: user.username },
    ipAddress: req?.ip,
    userAgent: req?.headers?.['user-agent'],
  });

  return { message: 'Password changed successfully' };
}
```

#### 3. Tambah Endpoint di Auth Controller

**File**: `server/src/modules/auth/controllers/auth.controller.ts`

```typescript
@Patch('profile')
updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
  return this.authService.updateProfile(req.user.sub, dto, req);
}

@Patch('password')
changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
  return this.authService.changePassword(req.user.sub, dto, req);
}
```

#### 4. Import DTOs di Auth Module

**File**: `server/src/modules/auth/auth.module.ts` — tidak perlu perubahan (TypeORM sudah inject User)

---

### Client

#### 5. Tambah API Methods

**File**: `client/src/services/api.ts`

Tambah methods di axios instance atau buat file baru `client/src/services/auth.service.ts`:

```typescript
// Di auth.service.ts
import api from './api'

export const authService = {
  updateProfile(data: UpdateProfile) {
    return api.patch('/auth/profile', data)
  },
  changePassword(data: ChangePassword) {
    return api.patch('/auth/password', data)
  },
}
```

#### 6. Tambah Types

**File**: `client/src/types/auth.ts`

Tambah:

```typescript
export interface UpdateProfile {
  firstName?: string
  lastName?: string
  email?: string
  username?: string
}

export interface ChangePassword {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
```

#### 7. Tambah Action di Auth Store

**File**: `client/src/stores/auth.store.ts`

Tambah actions:

```typescript
async function updateProfile(payload: UpdateProfile) {
  loading.value = true
  try {
    const { data } = await authService.updateProfile(payload)
    user.value = data  // update local state + localStorage
    localStorage.setItem('user', JSON.stringify(data))
    return data
  } finally {
    loading.value = false
  }
}

async function changePassword(payload: ChangePassword) {
  loading.value = true
  try {
    const { data } = await authService.changePassword(payload)
    return data
  } finally {
    loading.value = false
  }
}
```

#### 8. Buat ProfilePage.vue

**File baru**: `client/src/views/ProfilePage.vue`

Structure:
```
AppLayout(:user="authStore.user")
  ├── NCard title="Profile Information"
  │   ├── NForm (firstName, lastName, email, username)
  │   └── NButton "Save Changes" → authService.updateProfile()
  │
  └── NCard title="Change Password"
      ├── NForm (currentPassword, newPassword, confirmPassword)
      └── NButton "Change Password" → authService.changePassword()
```

- Prefill form dari `authStore.user`
- Success: `NMessage` sukses + update authStore user
- Error: `NMessage` error (validasi, duplikat email/username)
- Pattern: sama seperti halaman form lain (LoginPage, RegisterPage)

#### 9. Tambah Route

**File**: `client/src/router/index.ts`

```typescript
{
  path: '/dashboard/profile',
  name: 'Profile',
  component: () => import('@/views/ProfilePage.vue'),
  meta: { requiresAuth: true },
}
```

#### 10. Wire Up Profile Dropdown

**File**: `client/src/components/layout/AppLayout/AppLayout.vue`

Tambah handler di `handleDropdownSelect`:

```typescript
function handleDropdownSelect(key: string) {
  if (key === 'profile') {
    router.push('/dashboard/profile')
  } else if (key === 'logout') {
    logout()
  }
}
```

#### 11. Update Sidebar Menu (Opsional)

Tambah menu item "Profile" di sidebar? Atau cukup dari dropdown saja?

**Keputusan**: Cukup dari dropdown. Profile bukan halaman yang sering diakses. Jika ingin tambah nanti, tinggal tambah 1 menu item.

---

## Files Affected

| # | File | Change |
|---|------|--------|
| 1 | `server/src/modules/auth/dto/update-profile.dto.ts` | **Baru** |
| 2 | `server/src/modules/auth/dto/change-password.dto.ts` | **Baru** |
| 3 | `server/src/modules/auth/services/auth.service.ts` | Tambah `updateProfile()` + `changePassword()` |
| 4 | `server/src/modules/auth/controllers/auth.controller.ts` | Tambah 2 endpoint |
| 5 | `client/src/services/auth.service.ts` | **Baru** — API methods |
| 6 | `client/src/types/auth.ts` | Tambah `UpdateProfile` + `ChangePassword` types |
| 7 | `client/src/stores/auth.store.ts` | Tambah `updateProfile()` + `changePassword()` actions |
| 8 | `client/src/views/ProfilePage.vue` | **Baru** — halaman edit profil |
| 9 | `client/src/router/index.ts` | Tambah route `/dashboard/profile` |
| 10 | `client/src/components/layout/AppLayout/AppLayout.vue` | Wire up dropdown profile handler |

## Verification

1. **Server**: `npm run build` + `npm run test` — pasti tidak ada type error
2. **Client**: `npm run build` — pasti tidak ada type error
3. **Manual test**:
   - Klik "Profile" di dropdown → buka halaman Profile
   - Edit firstName, lastName, email, username → save → data update di UI + localStorage
   - Coba ganti email ke yang sudah dipakai → error message
   - Ganti password dengan current password salah → error message
   - Ganti password dengan benar → success message
   - Refresh halaman → data tetap benar (dari server)
4. **Activity Logs**: Cek `/api/activity-logs` — harus ada log "Profile updated" dan "Password changed"

## Docs Update

Update `docs/design-system.md` — tambah section **Profile Page** di bagian Layout/Components.
