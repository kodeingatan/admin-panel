# Responsive Design Tailwind CSS

## Mobile-First Approach

Tailwind menggunakan **mobile-first** breakpoint system:
- Unprefixed utilities (seperti `bg-blue-500`) berlaku untuk **semua screen size**
- Prefixed utilities (seperti `md:bg-blue-500`) berlaku **mulai dari breakpoint tertentu ke atas**

### Default Breakpoints

| Prefix | Min Width | CSS |
|--------|-----------|-----|
| `sm` | 640px | `@media (width >= 40rem)` |
| `md` | 768px | `@media (width >= 48rem)` |
| `lg` | 1024px | `@media (width >= 64rem)` |
| `xl` | 1280px | `@media (width >= 80rem)` |
| `2xl` | 1536px | `@media (width >= 96rem)` |

## Contoh Responsive

```html
<!-- Default: stacked, md: side-by-side -->
<div class="md:flex">
  <div class="md:shrink-0">
    <img class="h-48 w-full md:h-full md:w-48" />
  </div>
  <div class="p-8">
    <h2 class="text-xl font-bold">Title</h2>
    <p class="text-gray-500">Description</p>
  </div>
</div>
```

## Targeting Mobile

**Jangan gunakan `sm:` untuk mobile** — gunakan unprefixed utilities:

```html
<!-- ❌ Salah — hanya center di 640px+ -->
<div class="sm:text-center"></div>

<!-- ✅ Benar — center di mobile, left-align di sm+ -->
<div class="text-center sm:text-left"></div>
```

## Breakpoint Range

Gunakan `max-*` variants untuk range tertentu:

```html
<!-- Hanya berlaku di sm sampai sebelum md -->
<div class="md:max-xl:flex">
  <!-- -->
</div>
```

### Max-Width Variants

| Variant | Media Query |
|---------|-------------|
| `max-sm` | `@media (width < 40rem)` |
| `max-md` | `@media (width < 48rem)` |
| `max-lg` | `@media (width < 64rem)` |
| `max-xl` | `@media (width < 80rem)` |
| `max-2xl` | `@media (width < 96rem)` |

## Targeting Single Breakpoint

```html
<!-- Hanya berlaku di md (768px - 1023px) -->
<div class="md:max-lg:flex">
  <!-- -->
</div>
```

## Custom Breakpoints

```css
@import "tailwindcss";
@theme {
  --breakpoint-xs: 30rem;
  --breakpoint-2xl: 100rem;
  --breakpoint-3xl: 120rem;
}
```

```html
<div class="grid xs:grid-cols-2 3xl:grid-cols-6">
  <!-- -->
</div>
```

## Container Queries

Container queries memungkinkan styling berdasarkan parent element:

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- -->
  </div>
</div>
```

### Named Containers

```html
<div class="@container/main">
  <div class="flex flex-row @sm/main:flex-col">
    <!-- -->
  </div>
</div>
```

### Custom Container Sizes

```css
@import "tailwindcss";
@theme {
  --container-8xl: 96rem;
}
```

## Viewport Meta Tag

Pastikan viewport meta tag ada di `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
