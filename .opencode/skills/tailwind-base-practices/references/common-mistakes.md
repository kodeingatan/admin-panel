# Common Mistakes Tailwind CSS

## 1. Lupa Import CSS

### ❌ Salah
```js
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
// CSS tidak di-import!
```

### ✅ Benar
```ts
// main.ts
import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
```

## 2. Menggunakan `@tailwind` Directives (v3)

### ❌ Salah (Tailwind v3)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ✅ Benar (Tailwind v4)
```css
@import "tailwindcss";
```

## 3. Menggunakan `tailwind.config.js` (v4)

### ❌ Salah (Tailwind v4)
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {},
  },
}
```

### ✅ Benar (Tailwind v4)
```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.72 0.11 221.19);
}
```

## 4. Tidak Menggunakan Mobile-First

### ❌ Salah
```html
<!-- Desktop-first approach -->
<div class="text-lg sm:text-base md:text-sm lg:text-xs">
  Responsive text
</div>
```

### ✅ Benar
```html
<!-- Mobile-first approach -->
<div class="text-xs sm:text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

## 5. Overusing `@apply`

### ❌ Salah
```css
@layer components {
  .card {
    @apply p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200;
  }
}

@layer components {
  .card-title {
    @apply text-lg font-semibold text-gray-900;
  }
}

@layer components {
  .card-content {
    @apply text-gray-600;
  }
}
```

### ✅ Benar
```html
<!-- Gunakan utility classes langsung -->
<div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
  <h2 class="text-lg font-semibold text-gray-900">Title</h2>
  <p class="text-gray-600">Content</p>
</div>
```

## 6. Menggunakan Arbitrary Values untuk Colors

### ❌ Salah
```html
<div class="bg-[#3b82f6] text-[#ffffff]">
```

### ✅ Benar
```html
<div class="bg-blue-500 text-white">
  <!-- Atau custom theme -->
</div>
```

## 7. Tidak Menggunakan Prefix untuk Dark Mode

### ❌ Salah
```html
<div class="bg-white bg-gray-800">
  <!-- Kedua background akan diterapkan -->
</div>
```

### ✅ Benar
```html
<div class="bg-white dark:bg-gray-800">
  <!-- Hanya satu yang diterapkan tergantung mode -->
</div>
```

## 8. Menggunakan `!important` Terlalu Banyak

### ❌ Salah
```html
<button class="!bg-blue-500 !text-white !px-4 !py-2 !rounded-md">
```

### ✅ Benar
```html
<button class="bg-blue-500 text-white px-4 py-2 rounded-md">
  <!-- Gunakan ! hanya jika benar-benar perlu override -->
</button>
```

## 9. Menggunakan Responsive yang Terlalu Kompleks

### ❌ Salah
```html
<div class="sm:hidden md:block lg:flex xl:grid 2xl:grid-cols-4">
```

### ✅ Benar
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <!-- Lebih sederhana -->
</div>
```

## 10. Tidak Menggunakan Named Containers

### ❌ Salah
```html
<div class="@container">
  <div class="flex @md:flex-row">
    <!-- -->
  </div>
</div>
```

### ✅ Benar
```html
<div class="@container/sidebar">
  <div class="flex @md/sidebar:flex-row">
    <!-- -->
  </div>
</div>
```

## 11. Menggunakan `@source` Secara Berlebihan

### ❌ Salah
```css
@import "tailwindcss";
@source "../node_modules";
@source "../node_modules/@angular";
@source "../node_modules/radix-vue";
@source "../src/**/*.vue";
@source "../src/**/*.ts";
```

### ✅ Benar
```css
@import "tailwindcss";
@source "../node_modules/@angular/core";
```

## 12. Tidak Menggunakan Variants yang Tepat

### ❌ Salah
```html
<div class="md:max-lg:flex lg:max-xl:grid">
```

### ✅ Benar
```html
<div class="lg:grid">
  <!-- Simplify -->
</div>
```

## 13. Menggunakan CSS Modules dengan Tailwind

### ❌ Salah
```vue
<template>
  <div :class="[$style.container, 'bg-white p-4']">
</template>
```

### ✅ Benar
```vue
<template>
  <div class="bg-white p-4">
    <!-- Gunakan Tailwind atau CSS Modules, jangan campur -->
  </div>
</template>
```

## 14. Menggunakan Font Size yang Terlalu Banyak

### ❌ Salah
```html
<p class="text-[13px] text-[14px] text-[15px] text-[16px]">
```

### ✅ Benar
```html
<p class="text-sm">14px</p>
<p class="text-base">16px</p>
<p class="text-lg">18px</p>
```

## 15. Menggunakan Animasi Tanpa `@theme`

### ❌ Salah
```html
<div class="animate-bounce animate-pulse animate-spin">
```

### ✅ Benar
```html
<div class="animate-fade-in">
```

```css
@theme {
  --animate-fade-in: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```
