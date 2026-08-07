# Warna Tailwind CSS

## Default Color Palette

Tailwind menyediakan 22 palet warna dengan shade 50-950:

| Warna | Shades |
|-------|--------|
| slate | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| gray | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| zinc | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| stone | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| red | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| orange | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| amber | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| yellow | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| lime | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| green | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| emerald | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| teal | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| cyan | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| sky | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| blue | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| indigo | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| violet | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| purple | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| fuchsia | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| pink | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| rose | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |

### Special Colors
- **white** — `#ffffff`
- **black** — `#000000`
- **transparent** — `transparent`
- **current** — `currentColor`

## Contoh Usage

```html
<!-- Background color -->
<div class="bg-blue-500"></div>

<!-- Text color -->
<p class="text-red-600"></p>

<!-- Border color -->
<div class="border-2 border-green-300"></div>

<!-- Ring color -->
<button class="ring-2 ring-blue-400"></button>
```

## Color Opacity

### Inline Opacity (Recommended)
```html
<div class="bg-blue-500/50">bg-blue-500 with 50% opacity</div>
<div class="text-red-500/75">text-red-500 with 75% opacity</div>
<div class="border-black/10">border-black with 10% opacity</div>
```

### Theme Variables
```css
@theme {
  --color-primary: oklch(0.5 0.25 160);
}
```

```html
<div class="bg-primary/50"></div>
```

## Custom Warna

### Menggunakan @theme
```css
@import "tailwindcss";

@theme {
  --color-brand-50: oklch(0.96 0.04 254.6);
  --color-brand-100: oklch(0.92 0.08 254.6);
  --color-brand-500: oklch(0.54 0.25 254.6);
  --color-brand-950: oklch(0.23 0.2 254.6);
}
```

```html
<button class="bg-brand-500 hover:bg-brand-600">
  <!-- -->
</button>
```

### Menggunakan Arbitrary Values
```html
<button class="bg-[#1da1f2]">
  <!-- -->
</button>
```

### Referencing CSS Variables
```html
<button class="bg-(--my-brand-color)">
  <!-- shorthand untuk bg-[var(--my-brand-color)] -->
</button>
```

## Color Palettes

Untuk membatasi palet warna yang digunakan:

```css
@import "tailwindcss";
@source "components";
@theme {
  --color-blue-*: initial;
  --color-gray-*: initial;
  --color-white: initial;
  --color-black: initial;
  --color-transparent: initial;
}
```

Hanya warna yang didefinisikan yang akan di-generate.

## Color Utilities Lengkap

| Kategori | Contoh |
|----------|--------|
| Background | `bg-blue-500`, `bg-transparent`, `bg-current` |
| Text | `text-red-500`, `text-white`, `text-current` |
| Border | `border-green-500`, `border-black` |
| Ring | `ring-blue-500`, `ring-offset-2` |
| Fill | `fill-blue-500` |
| Stroke | `stroke-red-500` |
| Accent | `accent-blue-500` |
| Caret | `caret-blue-500` |
| Placeholder | `placeholder-gray-400` |
| Divide | `divide-gray-200` |
| Shadow | `shadow-blue-500/50` |
