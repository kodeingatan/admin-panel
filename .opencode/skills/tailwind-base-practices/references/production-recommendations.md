# Rekomendasi Produksi Tailwind CSS

## Build Optimization

### 1. Content Scanning

Tailwind v4 sudah otomatis scan content:

```css
@import "tailwindcss";
```

Untuk tambahan scan:
```css
@import "tailwindcss";
@source "../node_modules/@angular/core";
```

### 2. Hanya Generate yang Digunakan

```css
@import "tailwindcss";

@theme {
  --color-blue-*: initial;
  --color-gray-*: initial;
  --color-white: initial;
  --color-black: initial;
  --color-transparent: initial;
}
```

### 3. Minify CSS

```bash
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --minify
```

## Performance Tips

### 1. Hindari Arbitrary Values Berlebihan

```html
<!-- ❌ Mengurangi cache-ability -->
<div class="w-[123px] h-[456px] bg-[#1da1f2]">

<!-- ✅ Gunakan theme variables -->
<div class="w-custom h-custom bg-primary">
```

### 2. Gunakan Container Queries

```html
<div class="@container">
  <div class="flex @md:flex-row">
    <!-- Responsive component -->
  </div>
</div>
```

### 3. Named Containers

```html
<div class="@container/sidebar">
  <div class="flex @md/sidebar:flex-row">
    <!-- Sidebar responsive -->
  </div>
</div>

<div class="@container/main">
  <div class="grid @md/main:grid-cols-2">
    <!-- Main content responsive -->
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

### 4. Forced Colors Mode

```html
<div class="dark:bg-gray-800 forced-colors:bg-canvas">
  <!-- Works with Windows High Contrast mode -->
</div>
```

## Testing

### 1. Visual Regression Testing

```html
<div class="bg-blue-500 text-white p-4">
  Component for visual testing
</div>
```

### 2. Responsive Testing

```html
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  <!-- -->
</div>
```

### 3. Dark Mode Testing

```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <!-- -->
</div>
```

## Deployment

### 1. Environment Variables

```css
@import "tailwindcss";

@theme {
  --color-primary: var(--color-primary-env);
}
```

### 2. Self-Hosted

```bash
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --minify
```

## Best Practices

### 1. Custom Utility Classes

```css
@import "tailwindcss";

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### 2. Design System

```css
@import "tailwindcss";

@theme {
  --color-primary-50: oklch(0.96 0.04 254.6);
  --color-primary-500: oklch(0.54 0.25 254.6);
  --color-primary-950: oklch(0.23 0.2 254.6);
  --font-display: "Inter", sans-serif;
  --font-body: "Inter", sans-serif;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
}
```

## Checklist Sebelum Deploy

- [ ] CSS sudah di-minify
- [ ] Hanya generate yang digunakan
- [ ] Focus styles tersedia
- [ ] Color contrast memadai
- [ ] Dark mode berfungsi
- [ ] Responsive di semua breakpoint
- [ ] Screen reader tested
- [ ] High contrast mode tested
- [ ] CSS bundle size acceptable
- [ ] No unused CSS
