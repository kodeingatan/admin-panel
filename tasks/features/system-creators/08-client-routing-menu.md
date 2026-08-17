# 08 — Client: Dynamic Routing + Menu

## Goal

Integrasikan generated modules ke client routing dan sidebar menu secara dinamis.

## Files to Modify

### 1. `client/src/router/index.ts`

Add wildcard route for dynamic CRUD pages:

```typescript
// Add after static routes
{
  path: '/dashboard/sc/:moduleName',
  name: 'DynamicCrud',
  component: () => import('@/views/DynamicCrudPage.vue'),
  meta: {
    requiresAuth: true,
    requiredRoles: ['Admin', 'Super Admin'],
  },
},
```

### 2. `client/src/components/layout/AppLayout/AppLayout.vue`

Changes:
1. Import `useDynamicModules` composable
2. Fetch active modules on mount
3. Add "Generated Modules" group to menu options
4. Update `routeKeyMap` dynamically

```typescript
import { useDynamicModules } from '@/composables/useDynamicModules'

const { registeredModules, loadModules } = useDynamicModules()

onMounted(async () => {
  await loadModules()
})

// Add to computed menuOptions
const generatedMenu = computed(() => {
  if (registeredModules.value.length === 0) return null
  return {
    label: 'Generated Modules',
    key: 'generated-modules',
    icon: renderIcon(CubeSpawn),
    children: registeredModules.value.map(m => ({
      label: renderMenuLabel(m.menuLabel, m.routePath),
      key: `sc-${m.name}`,
    })),
  }
})

// Insert after Admin group
if (hasAnyRole(['Admin', 'Super Admin'])) {
  // ... existing admin group
  const genMenu = generatedMenu.value
  if (genMenu) options.push(genMenu)
}
```

Update `routeKeyMap`:
```typescript
// Build from registeredModules
const routeKeyMap = computed(() => {
  const map: Record<string, string> = {
    '/dashboard': 'dashboard',
    // ... existing mappings
  }
  for (const m of registeredModules.value) {
    map[m.routePath] = `sc-${m.name}`
  }
  return map
})

// Update watch
watch(
  () => route.path,
  (path) => {
    activeKey.value = routeKeyMap.value[path] || 'dashboard'
  },
  { immediate: true },
)
```

### 3. `client/src/composables/useDynamicModules.ts`

Ensure `loadModules` is called from `AppLayout` so modules are available for routing.

### 4. `client/src/types/index.ts`

Ensure `ScModule` and related types are exported.

## Flow

```
1. AppLayout mounts → calls loadModules()
2. Fetches /api/system-creators/registry → gets active modules
3. Builds menu items from modules
4. Updates routeKeyMap with module route paths
5. User clicks menu item → router.push('/dashboard/sc/{name}')
6. DynamicCrudPage component loads → fetches module config → renders CRUD
```

## Verification

- [ ] Sidebar shows "Generated Modules" group when modules exist
- [ ] Each module appears as a menu item with correct label
- [ ] Clicking menu item navigates to correct route
- [ ] Active menu highlighting works for dynamic routes
- [ ] Route guard works (only Admin+ can access generated pages)
- [ ] Menu updates when modules are created/deactivated (requires page refresh or reactive update)
- [ ] Empty state: no "Generated Modules" group when no modules exist
