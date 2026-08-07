# Frameworks Lain dengan Tailwind CSS

## Vue 3 + Vite (Recommended)

### 1. Install Dependencies

```bash
npm install -D tailwindcss @tailwindcss/vite
```

### 2. Konfigurasi Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
```

### 3. Import CSS

```css
/* src/assets/main.css */
@import "tailwindcss";
```

### 4. Import di main.ts

```ts
import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
```

## React + Vite

### 1. Install Dependencies

```bash
npm install -D tailwindcss @tailwindcss/vite
```

### 2. Konfigurasi Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### 3. Import CSS

```css
@import "tailwindcss";
```

```tsx
import './index.css'

function App() {
  return <div className="bg-blue-500 text-white p-4">Hello</div>
}
```

## Next.js

### 1. Install Dependencies

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

### 2. PostCSS Config

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 3. Import CSS

```css
@import "tailwindcss";
```

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

## Nuxt 3

### 1. Install Module

```bash
npm install -D @nuxtjs/tailwindcss
```

### 2. Konfigurasi nuxt.config.ts

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
})
```

### 3. CSS File

```css
/* assets/css/tailwind.css */
@import "tailwindcss";
```

## Astro

### 1. Install Dependencies

```bash
npm install -D tailwindcss @tailwindcss/vite
```

### 2. Konfigurasi astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### 3. Import CSS

```astro
---
import '../styles/global.css';
---

<html>
  <body>
    <h1 class="text-3xl font-bold">Hello</h1>
  </body>
</html>
```

## SvelteKit

### 1. Install Dependencies

```bash
npm install -D tailwindcss @tailwindcss/vite
```

### 2. Konfigurasi vite.config.ts

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

### 3. Import CSS

```css
/* src/app.css */
@import "tailwindcss";
```

```svelte
<script>
  import '../app.css';
</script>
```

## Remix

### 1. Install Dependencies

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

### 2. PostCSS Config

```js
// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 3. Import CSS

```css
/* app/tailwind.css */
@import "tailwindcss";
```

```tsx
// app/root.tsx
import stylesheet from "~/tailwind.css?url";

export const links = () => [
  { rel: "stylesheet", href: stylesheet },
];
```

## Perbandingan Framework

| Framework | Vite Plugin | PostCSS | Module |
|-----------|-------------|---------|--------|
| Vue 3 | ✅ `@tailwindcss/vite` | ✅ | - |
| React | ✅ `@tailwindcss/vite` | ✅ | - |
| Next.js | - | ✅ `@tailwindcss/postcss` | - |
| Nuxt 3 | - | - | ✅ `@nuxtjs/tailwindcss` |
| Astro | ✅ `@tailwindcss/vite` | ✅ | - |
| SvelteKit | ✅ `@tailwindcss/vite` | ✅ | - |
| Remix | - | ✅ `@tailwindcss/postcss` | - |

## Tips untuk Semua Framework

1. **Gunakan Vite Plugin jika available** — Lebih cepat dan seamless
2. **Import CSS di entry point** — Pastikan CSS ter-load
3. **Gunakan theme variables** — Untuk konsistensi design
4. **Test responsive** — Pastikan berfungsi di semua screen size
5. **Perhatikan dark mode** — Test di kedua mode
