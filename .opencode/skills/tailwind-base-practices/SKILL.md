---
name: tailwind-base-practices
description: >
  Tailwind CSS v4 best practices, utility patterns, theming, responsive design,
  dark mode, custom styles, and Vue 3 + Vite integration. Covers CSS-first
  configuration with @theme, @custom-variant, @utility directives.
---

# Tailwind CSS — Best Practices Skill

Gunakan skill ini ketika mengerjakan styling dengan Tailwind CSS v4, terutama
dalam project Vue 3 + Vite. Semua referensi ada di `references/`.

---

## 1. Setup Cepat (Vue 3 + Vite)

```bash
npm install -D tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

```css
/* src/assets/main.css */
@import "tailwindcss";
```

```ts
// src/main.ts
import './assets/main.css'
```

> **v4 tidak lagi menggunakan `tailwind.config.js`** — semua konfigurasi di CSS.

---

## 2. Referensi Dokumentasi

| Topik | File |
|-------|------|
| Instalasi & Setup | `references/installation.md` |
| Konsep Inti (Utility-First) | `references/concepts.md` |
| Responsive Design | `references/responsive-design.md` |
| Dark Mode | `references/dark-mode.md` |
| Theme Variables (`@theme`) | `references/theme-variables.md` |
| Custom Styles & Utilities | `references/adding-custom-styles.md` |
| Colors | `references/color.md` |
| Functions & Directives | `references/functions-directives.md` |
| Preflight (Base Reset) | `references/preflight.md` |
| Hover, Focus & States | `references/hover-focus-states.md` |
| Editor Setup | `references/editor-setup.md` |
| Frameworks Lain | `references/other-frameworks.md` |
| Best Practices | `references/best-practices.md` |
| Anti-Patterns | `references/anti-patterns.md` |
| Common Mistakes | `references/common-mistakes.md` |
| Production Recommendations | `references/production-recommendations.md` |
| Official Documentation | `references/official-documentation.md` |

---

## 3. Quick Reference — Pattern yang Sering Dipakai

### Basic Utilities

```html
<!-- Layout -->
<div class="flex items-center justify-between p-4">

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">

<!-- Typography -->
<h1 class="text-2xl font-bold text-gray-900">
<p class="text-sm text-gray-500">

<!-- Colors -->
<button class="bg-blue-600 text-white hover:bg-blue-700">

<!-- Spacing -->
<div class="p-4 m-2 gap-4">

<!-- Borders & Radius -->
<div class="border border-gray-200 rounded-lg">

<!-- Shadows -->
<div class="shadow-md hover:shadow-lg">

<!-- Transitions -->
<button class="transition-colors duration-200">
```

### Dark Mode Pairing

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Responsive Breakpoints

```html
<!-- Mobile-first: sm(640) md(768) lg(1024) xl(1280) 2xl(1536) -->
<div class="text-sm md:text-base lg:text-lg">
```

### Interactive States

```html
<button class="hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 active:bg-blue-800 disabled:opacity-50">
```

---

## 4. Theme Customization

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.54 0.25 254.6);
  --font-display: "Inter", sans-serif;
  --breakpoint-3xl: 120rem;
  --animate-fade-in: fade-in 0.3s ease-out;
}
```

```html
<button class="bg-primary font-display animate-fade-in">
```

---

## 5. Custom Utilities

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 6. Anti-Patterns yang Harus Dihindari

1. **Jangan gunakan `@apply` berlebihan** — gunakan utility classes langsung
2. **Jangan over-nesting responsive** — gunakan range breakpoints
3. **Hindari arbitrary values untuk spacing** — gunakan theme spacing
4. **Jangan mencampur CSS Modules dengan Tailwind** — pilih salah satu
5. **Jangan gunakan `!important`** kecuali benar-benar perlu
