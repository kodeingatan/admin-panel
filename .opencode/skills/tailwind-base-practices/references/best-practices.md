# Best Practices Tailwind CSS

## Code Organization

### 1. Class Order Konsisten
```html
<!-- Disarankan: Responsive → State → Layout → Spacing → Visual -->
<div class="grid md:grid-cols-3 gap-6 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl">
```

### 2. Component Extraction
```html
<!-- ❌ Duplikasi -->
<div class="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
  <div class="flex items-center gap-3">
    <img class="w-10 h-10 rounded-full" />
    <span class="font-medium text-gray-900">...</span>
  </div>
  <button class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
    Action
  </button>
</div>

<!-- ✅ Extracted component -->
<ProfileCard />
```

### 3. Group Related Classes
```html
<!-- Gunakan @apply untuk komponen yang sering digunakan -->
@layer components {
  .btn-primary {
    @apply px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors;
  }
}
```

## Responsive Design

### 1. Mobile-First
```html
<!-- ✅ Benar: mobile-first -->
<div class="text-sm md:text-base lg:text-lg">Responsive text</div>

<!-- ❌ Salah: desktop-first -->
<div class="text-lg md:text-base lg:text-sm">Wrong order</div>
```

### 2. Jangan Over-nesting
```html
<!-- ❌ Terlalu kompleks -->
<div class="sm:md:lg:xl:2xl:grid-cols-6">

<!-- ✅ Gunakan range -->
<div class="lg:grid-cols-6">
```

## Dark Mode

### 1. Konsisten Pairing
```html
<!-- Selalu light + dark pair -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### 2. Gunakan Opacity untuk Halus
```html
<div class="bg-black/5 dark:bg-white/5">
```

## Performance

### 1. Hindari Arbitrary Values Berlebihan
```html
<!-- ❌ Mengurangi cache-ability -->
<div class="w-[123px] h-[456px] bg-[#1da1f2]">

<!-- ✅ Gunakan theme variables -->
<div class="w-custom h-custom bg-primary">
```

### 2. Gunakan Container Queries untuk Responsive Component
```html
<div class="@container">
  <div class="flex @md:flex-row">
    <!-- Responsive component -->
  </div>
</div>
```

## Accessibility

### 1. Focus Styles
```html
<button class="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Accessible button
</button>
```

### 2. Color Contrast
```html
<!-- ✅ Good contrast -->
<div class="text-gray-900 bg-white">High contrast</div>

<!-- ❌ Bad contrast -->
<div class="text-gray-400 bg-white">Low contrast</div>
```

### 3. Screen Reader
```html
<button class="sr-only focus:not-sr-only">
  Skip to content
</button>
```

## Maintainability

### 1. Jangan Terlalu Panjang
```html
<!-- ❌ Terlalu panjang, pertimbangkan component -->
<div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">

<!-- ✅ Component-based -->
<div class="card">
```

### 2. Gunakan @layer untuk Organisasi
```css
@layer base {
  /* Base styles */
}

@layer components {
  /* Reusable components */
}

@layer utilities {
  /* Custom utilities */
}
```

### 3. Jangan Overuse @apply
```html
<!-- ❌ @apply berlebihan -->
@layer components {
  .card {
    @apply p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between;
  }
}

<!-- ✅ @apply untuk hal yang benar-benar reusable -->
@layer components {
  .btn {
    @apply px-4 py-2 font-medium rounded-md transition-colors;
  }
  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700;
  }
}
```
