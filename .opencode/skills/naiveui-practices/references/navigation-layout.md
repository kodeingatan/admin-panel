# Navigation & Layout Naive UI

## Tabs System

### Komponen

| Komponen | Fungsi |
|----------|--------|
| `NTabs` | Container tabs |
| `NTabPane` | Individual tab content |
| `NTab` | Tab trigger (renderless) |

### Dasar Penggunaan

```vue
<template>
  <n-tabs v-model:value="activeTab" type="line" @update:value="handleChange">
    <n-tab-pane name="tab1" tab="Tab 1">
      <p>Konten tab 1</p>
    </n-tab-pane>
    <n-tab-pane name="tab2" tab="Tab 2">
      <p>Konten tab 2</p>
    </n-tab-pane>
    <n-tab-pane name="tab3" tab="Tab 3" disabled>
      <p>Konten tab 3 (disabled)</p>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('tab1')

function handleChange(name) {
  console.log('Tab berubah ke:', name)
}
</script>
```

### Tab Types

| Type | Deskripsi |
|------|-----------|
| `bar` | Default dengan underline indicator |
| `line` | Simple line dengan border |
| `card` | Card-style tabs |
| `segment` | Pill-style segmented control |

### Tab Placement

```vue
<n-tabs type="line" placement="top">Top tabs</n-tabs>
<n-tabs type="line" placement="bottom">Bottom tabs</n-tabs>
<n-tabs type="line" placement="left">Left tabs</n-tabs>
<n-tabs type="line" placement="right">Right tabs</n-tabs>
```

### Display Directive

```vue
<!-- Destroy content saat tab tidak aktif -->
<n-tabs display-directive="if">

<!-- Sembunyikan content saat tab tidak aktif -->
<n-tabs display-directive="show">

<!-- Lazy loading dengan show behavior -->
<n-tabs display-directive="show:lazy">
```

### Tab Features

```vue
<template>
  <n-tabs
    v-model:value="activeTab"
    type="card"
    addable
    closable
    :animated="true"
    @add="handleAdd"
    @close="handleClose"
  >
    <!-- tabs -->
  </n-tabs>
</template>
```

## Menu System

### Komponen

| Komponen | Fungsi |
|----------|--------|
| `NMenu` | Container menu |
| `NMenuItem` | Menu item |
| `NMenuGroup` | Menu group |
| `NSubmenu` | Submenu |

### Dasar Penggunaan

```vue
<template>
  <n-menu
    v-model:value="activeKey"
    :options="menuOptions"
    @update:value="handleUpdate"
  />
</template>

<script setup>
import { ref, h } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

const activeKey = ref('dashboard')

const menuOptions: MenuOption[] = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: () => h(NIcon, null, { default: () => '📊' })
  },
  {
    label: 'User Management',
    key: 'users',
    icon: () => h(NIcon, null, { default: () => '👥' }),
    children: [
      { label: 'User List', key: 'user-list' },
      { label: 'Add User', key: 'add-user' }
    ]
  },
  {
    label: 'Settings',
    key: 'settings',
    disabled: true
  }
]

function handleUpdate(key) {
  console.log('Menu dipilih:', key)
}
</script>
```

### Menu Modes

**Vertical** (default):
```vue
<n-menu :options="options" />
```

**Horizontal**:
```vue
<n-menu mode="horizontal" :options="options" />
```

**Collapsed** (vertical only):
```vue
<n-menu :collapsed="true" :collapsed-width="64" :options="options" />
```

### Menu Features

```vue
<template>
  <n-menu
    v-model:value="activeKey"
    :options="options"
    :collapsed="isCollapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :indent="24"
    :root-indent="24"
    accordion
  />
</template>
```

### Menu with Custom Rendering

```ts
const options: MenuOption[] = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: renderIcon('📊'),
    renderLabel: () => h('span', { style: 'font-weight: bold' }, 'Dashboard'),
    renderExtra: () => h(NBadge, { value: 5 })
  }
]
```

### Layout Integration

```vue
<template>
  <n-layout has-sider>
    <n-layout-sider>
      <n-menu :options="menuOptions" />
    </n-layout-sider>
    <n-layout-content>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>
```

## Breadcrumb

```vue
<template>
  <n-breadcrumb>
    <n-breadcrumb-item>Home</n-breadcrumb-item>
    <n-breadcrumb-item>Components</n-breadcrumb-item>
    <n-breadcrumb-item>Navigation</n-breadcrumb-item>
  </n-breadcrumb>
</template>
```

## Anchor

```vue
<template>
  <n-anchor affix :top="80" :bound="15">
    <n-anchor-link title="Section 1" href="#section1" />
    <n-anchor-link title="Section 2" href="#section2">
      <n-anchor-link title="Subsection 2.1" href="#section2-1" />
    </n-anchor-link>
  </n-anchor>
</template>
```

## Affix

```vue
<template>
  <n-affix :top="0">
    <n-button>Sticky Button</n-button>
  </n-affix>
</template>
```

## BackTop

```vue
<template>
  <n-layout>
    <n-layout-content>Long content...</n-layout-content>
    <n-back-top :bottom="20" />
  </n-layout>
</template>
```
