# Instalasi Naive UI

## Instalasi Package

```bash
npm install naive-ui
# atau
yarn add naive-ui
# atau
pnpm add naive-ui
# atau
bun add naive-ui
```

## Pola Penggunaan

### 1. Direct Import (Recommended)

Pendekatan paling efisien — mengaktifkan tree-shaking dan mengurangi bundle size:

```vue
<script setup>
import { NButton } from 'naive-ui'
</script>

<template>
  <n-button>Click Me</n-button>
</template>
```

### 2. Global Installation

Instalasi semua komponen secara global (tidak direkomendasikan untuk production):

```ts
import naive from 'naive-ui'
app.use(naive)
```

### 3. Selective Global Installation

Instalasi hanya komponen tertentu secara global:

```ts
import { create, NButton, NInput } from 'naive-ui'
const naive = create({ components: [NButton, NInput] })
app.use(naive)
```

### 4. Auto Import dengan Volar

Gunakan plugin auto-import untuk development experience terbaik:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ]
})
```

## TypeScript Configuration

Untuk global components di TypeScript:

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["naive-ui/volar"]
  }
}
```

## Font Setup (Opsional)

Untuk font yang sesuai dengan tema:

```ts
import 'vfonts/Inter.css'
// atau
import 'vfonts/FiraCode.css'
```

Gunakan `NGlobalStyle` untuk memastikan font responsif terhadap tema.

## Dependencies Pendukung

| Package | Fungsi |
|---------|--------|
| `async-validator` | Form validation |
| `css-render` | CSS-in-JS rendering |
| `date-fns` | Date manipulation |
| `treemate` | Tree data structure |
| `vueuc` | Vue utility components |
| `vooks` | Vue composition utilities |
| `vfonts` | Font management |
| `xicons` | Icon library |
