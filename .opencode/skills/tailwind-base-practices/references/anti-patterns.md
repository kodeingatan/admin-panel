# Anti-Patterns Tailwind CSS

## ❌ Menggunakan `@apply` Terlalu Banyak

### ❌ Salah
```css
@layer components {
  .card {
    @apply p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 font-medium rounded-md transition-colors;
  }
}

@layer components {
  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500;
  }
}
```

### ✅ Benar
```html
<!-- Gunakan utility classes langsung -->
<div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
  <!-- -->
</div>

<!-- Atau gunakan component Vue -->
<Card>
  <template #default>
    <!-- content -->
  </template>
</Card>
```

## ❌ Arbitrary Values untuk Spacing

### ❌ Salah
```html
<div class="p-[12px] m-[8px] gap-[16px]">
```

### ✅ Benar
```html
<div class="p-3 m-2 gap-4">
  <!-- p-3 = 0.75rem = 12px -->
  <!-- m-2 = 0.5rem = 8px -->
  <!-- gap-4 = 1rem = 16px -->
</div>
```

## ❌ Over-nesting Responsive

### ❌ Salah
```html
<div class="sm:md:lg:xl:2xl:grid-cols-6">
```

### ✅ Benar
```html
<div class="grid-cols-1 md:grid-cols-3 lg:grid-cols-6">
```

## ❌ Menggunakan `!important` Terlalu Banyak

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

## ❌ Custom Styles Tanpa Alasan

### ❌ Salah
```css
.custom-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
}
```

### ✅ Benar
```html
<button class="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold">
  <!-- Atau gunakan theme variable -->
</button>
```

## ❌ Menggunakan Tailwind untuk Animasi Kompleks

### ❌ Salah
```html
<div class="animate-bounce animate-pulse animate-spin">
```

### ✅ Benar
```html
<!-- Gunakan CSS animations untuk kompleks -->
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

## ❌ Mencampur Tailwind dengan CSS Modules

### ❌ Salah
```vue
<template>
  <div :class="[$style.container, 'bg-white p-4']">
```

### ✅ Benar
```vue
<template>
  <div class="bg-white p-4">
    <!-- Gunakan Tailwind atau CSS Modules, jangan campur -->
  </div>
</template>
```

## ❌ Menggunakan Font Size yang Terlalu Banyak

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

## ❌ Tidak Menggunakan Named Containers

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

## ❌ Menggunakan `@source` Secara Berlebihan

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

## ❌ Menggunakan Variants yang Tidak Perlu

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
