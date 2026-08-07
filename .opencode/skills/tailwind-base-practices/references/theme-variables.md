# Theme Variables Tailwind CSS

## Apa itu Theme Variables?

Theme variables adalah CSS variables khusus yang didefinisikan dengan `@theme` directive. Mereka **bukan hanya CSS variables biasa** — mereka juga membuat utility classes baru secara otomatis.

## Menggunakan @theme

```css
@import "tailwindcss";

@theme {
  --color-mint-500: oklch(0.72 0.11 178);
  --font-script: "Great Vibes", cursive;
  --breakpoint-3xl: 120rem;
}
```

Sekarang bisa digunakan:
```html
<div class="bg-mint-500 font-script 3xl:grid-cols-4">
  <!-- -->
</div>
```

## Theme Variable Namespaces

| Namespace | Utility Classes |
|-----------|-----------------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*` |
| `--font-*` | `font-*` (font family) |
| `--text-*` | `text-*` (font size) |
| `--font-weight-*` | `font-*` (font weight) |
| `--tracking-*` | `tracking-*` (letter spacing) |
| `--leading-*` | `leading-*` (line height) |
| `--breakpoint-*` | `sm:*`, `md:*`, `lg:*` variants |
| `--container-*` | `@sm:*`, `@md:*` container query variants |
| `--spacing-*` | Spacing utilities (`p-*`, `m-*`, `gap-*`) |
| `--radius-*` | `rounded-*` |
| `--shadow-*` | `shadow-*` |
| `--animate-*` | `animate-*` |
| `--ease-*` | `ease-*` (transition timing) |

## Extending Default Theme

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", sans-serif;
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
}
```

## Overriding Default Theme

```css
@import "tailwindcss";

@theme {
  --breakpoint-sm: 30rem;  /* Override default sm breakpoint */
}
```

## Complete Override

```css
@import "tailwindcss";

@theme {
  --color-*: initial;  /* Hapus semua warna default */
  --color-white: #fff;
  --color-purple: #3f3cbb;
  --color-midnight: #121063;
}
```

## Custom Theme dari Awal

```css
@import "tailwindcss";

@theme {
  --*: initial;  /* Hapus semua default */
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-primary: oklch(0.72 0.11 221.19);
  --color-secondary: oklch(0.74 0.17 40.24);
}
```

## Referencing Variables Lain

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-inter);
}
```

Gunakan `inline` agar utility class menggunakan **value** dari variable, bukan reference.

## Animasi Keyframes

```css
@import "tailwindcss";

@theme {
  --animate-fade-in-scale: fade-in-scale 0.3s ease-out;

  @keyframes fade-in-scale {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}
```

## Sharing Across Projects

```css
/* packages/brand/theme.css */
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-primary: oklch(0.72 0.11 221.19);
}
```

```css
/* packages/admin/app.css */
@import "tailwindcss";
@import "../brand/theme.css";
```

## Menggunakan Theme Variables

### Di Custom CSS
```css
.typography {
  font-size: var(--text-base);
  color: var(--color-gray-700);
}
```

### Di Arbitrary Values
```html
<div class="rounded-[calc(var(--radius-xl)-1px)]">
  <!-- -->
</div>
```

### Di JavaScript
```javascript
let styles = getComputedStyle(document.documentElement);
let primary = styles.getPropertyValue("--color-primary");
```
