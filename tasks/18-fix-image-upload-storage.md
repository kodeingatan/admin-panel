# Task 18: Fix Image Upload Storage & Serving

## Problem

1. **Upload directory** currently uses `server/uploads/` — should be `server/storage/`
2. **Image serving** is embedded in `SettingsController` — should be a dedicated module
3. **Client URL resolution** manually constructs absolute URLs using `VITE_API_BASE_URL` — fragile and breaks across environments
4. **Database stores relative paths** (`/api/settings/uploads/...`) — but client can't resolve them without knowing the server origin

## Current State

| Item | Current | Issue |
|------|---------|-------|
| Storage path | `server/uploads/` | Wrong directory name |
| Serve endpoint | `GET /api/settings/uploads/:filename` (in SettingsController) | Tight coupling, not reusable |
| Upload response | `{ url: "/api/settings/uploads/settings-..." }` | Relative, client must guess server origin |
| Client URL | `http://localhost:3000/api/settings/uploads/...` | Hardcoded base URL via `VITE_API_BASE_URL` |
| CORS | Only `http://localhost:5173` | Images served from server need CORS for `<img>` tags |

## Target State

| Item | Target |
|------|--------|
| Storage path | `server/storage/` |
| Serve endpoint | `GET /api/storage/:filename` (dedicated StorageController) |
| Upload response | `{ url: "/api/storage/settings-..." }` |
| Client URL | Store relative path in DB; resolve via `api.defaults.baseURL` origin |
| CORS | Already configured for `http://localhost:5173` |

## Implementation Plan

### Phase 1: Server — Storage Module

#### 1.1 Create `server/storage/` directory
- Create `server/storage/` directory
- Add `server/storage/.gitkeep` to track the directory
- Add `server/storage/` to `.gitignore` (ignore uploaded files, not the directory itself)

#### 1.2 Create `StorageModule`
- **File**: `server/src/modules/storage/storage.module.ts`
  - Standalone module, no database dependencies
  - Exports `StorageService`

#### 1.3 Create `StorageService`
- **File**: `server/src/modules/storage/services/storage.service.ts`
  - `uploadFile(file: Express.Multer.File, subfolder: string): string`
    - Saves file to `server/storage/{subfolder}/`
    - Returns URL path: `/api/storage/{subfolder}/{filename}`
  - `getFilePath(filename: string, subfolder: string): string`
    - Returns absolute path to file
  - `deleteFile(filename: string, subfolder: string): void`
    - Removes file from storage

#### 1.4 Create `StorageController`
- **File**: `server/src/modules/storage/controllers/storage.controller.ts`
  - `GET /api/storage/:subfolder/:filename` — `@Public()` — Serve file
    - Validate subfolder (whitelist: `settings`, `avatars`, `general`)
    - Validate filename (no path traversal)
    - Set correct `Content-Type` header based on extension
    - Return file via `res.sendFile()`

### Phase 2: Server — Update Settings Module

#### 2.1 Update `SettingsController`
- **File**: `server/src/modules/settings/controllers/settings.controller.ts`
  - Remove `serveFile` endpoint (moved to StorageController)
  - Remove `UPLOAD_DIR` constant
  - Update `uploadFile` to use `StorageService`:
    - Call `storageService.uploadFile(file, 'settings')`
    - Return `{ url: result }` (e.g., `/api/storage/settings/settings-...png`)
  - Remove `diskStorage` config from `FileInterceptor` — use `memoryStorage` instead
    - Pass file buffer to `StorageService.uploadFile()`
    - Cleaner separation of concerns

#### 2.2 Update `SettingsModule`
- **File**: `server/src/modules/settings/settings.module.ts`
  - Import `StorageModule`

### Phase 3: Client — Fix URL Resolution

#### 3.1 Update `settings.store.ts`
- **File**: `client/src/stores/settings.store.ts`
  - Remove manual URL construction in `uploadFile()`:
    ```ts
    // BEFORE (broken)
    const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
    return `${base}${data.url}`
    
    // AFTER (correct)
    return data.url  // e.g., "/api/storage/settings/settings-...png"
    ```
  - The URL `/api/storage/settings/...` is already absolute from the server's perspective
  - The axios `baseURL` is `http://localhost:3000/api`, so when the client makes API calls, it resolves correctly
  - For `<img src>` and `<link href>`, the browser resolves `/api/...` relative to the page origin — this only works if Vite proxies `/api` to the backend

#### 3.2 Add Vite Proxy (alternative to absolute URLs)
- **File**: `client/vite.config.ts`
  - Add proxy configuration:
    ```ts
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
    ```
  - This way, `http://localhost:5173/api/storage/...` proxies to `http://localhost:3000/api/storage/...`
  - `<img src="/api/storage/...">` works without absolute URLs

### Phase 4: Documentation

#### 4.1 Update `docs/architecture.md`
- Update server directory tree: `uploads/` → `storage/`
- Add StorageModule to module list
- Add Storage API endpoint to API Endpoints table
- Remove `serveFile` from Settings endpoints

#### 4.2 Update `AGENTS.md`
- Update server directory structure
- Add `server/storage/` convention
- Add Vite proxy note

## API Endpoints (New/Changed)

### Storage

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/storage/:subfolder/:filename` | Serve uploaded file | Public |

**Subfolder whitelist**: `settings`, `avatars`, `general`

**Response**: Binary file with correct `Content-Type` header

### Settings (Changed)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/settings/upload` | Upload file | Bearer + Roles + Permissions |

**Upload Response** (changed):
```json
{ "url": "/api/storage/settings/settings-1234567890-123456.png" }
```

## Files to Create

| File | Description |
|------|-------------|
| `server/storage/.gitkeep` | Track empty storage directory |
| `server/src/modules/storage/storage.module.ts` | Storage module |
| `server/src/modules/storage/controllers/storage.controller.ts` | File serving controller |
| `server/src/modules/storage/services/storage.service.ts` | File storage service |
| `tasks/18-fix-image-upload-storage.md` | This file |

## Files to Modify

| File | Change |
|------|--------|
| `server/src/modules/settings/controllers/settings.controller.ts` | Remove serveFile, use StorageService |
| `server/src/modules/settings/settings.module.ts` | Import StorageModule |
| `client/src/stores/settings.store.ts` | Remove manual URL construction |
| `client/vite.config.ts` | Add `/api` proxy |
| `docs/architecture.md` | Update directory tree, add Storage API |
| `AGENTS.md` | Update server conventions |

## Files to Delete

| File | Reason |
|------|--------|
| `server/uploads/` directory | Replaced by `server/storage/` |

## Migration Notes

- Existing files in `server/uploads/` should be moved to `server/storage/settings/`
- Existing `app_favicon` and `login_bg_image` values in the `settings` table contain old URLs (`/api/settings/uploads/...`) — these need to be updated to `/api/storage/settings/...`
- Migration SQL:
  ```sql
  UPDATE settings SET value = REPLACE(value, '/api/settings/uploads/', '/api/storage/settings/') WHERE key IN ('app_favicon', 'login_bg_image');
  ```

## Verification

1. Upload a favicon → verify URL returns `/api/storage/settings/...`
2. Preview shows the uploaded image
3. Browser favicon updates to uploaded image
4. Refresh page → settings persist, favicon still shows
5. Upload background image → preview shows correctly
6. Login page shows uploaded background image
7. Direct URL access `http://localhost:3000/api/storage/settings/{filename}` returns the image
