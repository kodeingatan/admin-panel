# Functions & Directives Tailwind CSS

## @theme Directive

Mendefinisikan custom theme tokens:

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", sans-serif;
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --breakpoint-3xl: 120rem;
}
```

### Theme Variable Namespaces

| Namespace | Contoh | Utility |
|-----------|--------|---------|
| `--color-*` | `--color-mint-500` | `bg-mint-500`, `text-mint-500` |
| `--font-*` | `--font-sans` | `font-sans` |
| `--text-*` | `--text-xl` | `text-xl` |
| `--font-weight-*` | `--font-bold` | `font-bold` |
| `--tracking-*` | `--tracking-wide` | `tracking-wide` |
| `--leading-*` | `--leading-relaxed` | `leading-relaxed` |
| `--breakpoint-*` | `--breakpoint-3xl` | `3xl:block` |
| `--container-*` | `--container-8xl` | `@8xl:container` |
| `--spacing-*` | `--spacing-lg` | `gap-lg`, `p-lg` |
| `--radius-*` | `--radius-xl` | `rounded-xl` |
| `--shadow-*` | `--shadow-glow` | `shadow-glow` |
| `--animate-*` | `--animate-fade-in` | `animate-fade-in` |
| `--ease-*` | `--ease-bounce` | `ease-bounce` |
| `--grid-*` | `--grid-cols-4` | `grid-cols-4` |
| `--spacing` | `--spacing` | Base spacing unit |

### Inline Directive

Untuk menghindari cyclic references:

```css
@import "tailwindcss";
@theme inline {
  --font-sans: var(--font-inter);
  --color-primary: var(--color-blue-500);
}
```

## @custom-variant Directive

Membuat custom variant:

### Shorthand Syntax
```css
@custom-variant theme-midnight {
  &:where([data-theme="midnight"] *) {
    @slot;
  }
}
```

### Media Query Variant
```css
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```

### Vertical Writing Mode
```css
@custom-variant vertical {
  writing-mode: vertical-rl;
  @slot;
}
```

### Container Queries
```css
@custom-variant container {
  container-type: inline-size;
  @slot;
}
```

### Named Variants
```css
@custom-variant theme-midnight (&:where([data-theme="midnight"], [data-theme="midnight"] *));
```

### Order Matters
```css
/* Hover lebih penting dari focus */
@custom-variant hover-focus {
  @media (hover: hover) {
    &:hover {
      @slot;
    }
  }
  &:focus {
    @slot;
  }
}
```

## @source Directive

Memberitahu Tailwind ke mana harus scan:

```css
@import "tailwindcss";
@source "../node_modules/@angular/core";
@source "../node_modules/radix-vue";
```

### Exclude Source
```css
@import "tailwindcss";
@source not "../src/legacy";
@source not "**/*.test";
```

## @utility Directive

Membuat custom utility:

### Simple Utility
```css
@utility content-auto {
  content-visibility: auto;
}
```

### Complex Utility
```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### Functional Utility
```css
@theme {
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*, integer, [integer]);
}
```

### With Fallback
```css
@utility tab-* {
  tab-size: --value(integer, --default(4));
}
```

## @variant Directive (deprecated)

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
  @variant hover, focus {
    background: black;
  }
}
```

## Fungsi CSS

### `--value()`

Mendapatkan value dari theme variable, bare value, atau arbitrary value:

```css
@utility tab-* {
  tab-size: --value(--tab-size-*, integer, [integer]);
}
```

- `--value(--tab-size-*)` — Cari theme value `--tab-size-{value}`
- `--value(integer)` — Bare integer value
- `--value([integer])` — Arbitrary integer value

### `--spacing()`

Mengkonversi value ke spacing:

```css
@utility inset-* {
  inset: --spacing(--value(integer));
}
```

### `--default()`

Memberikan default value:

```css
@utility tab-* {
  tab-size: --value(integer, --default(4));
}
```

### `--alpha()`

Mengubah opacity:

```css
@utility text-7xl {
  font-size: 4.5rem;
  line-height: 1;
}
```

### `--color()` (deprecated)

```css
@theme {
  --color-brand: #1da1f2;
}

@utility highlight {
  color: --color(var(--color-brand));
}
```

## @plugin Directive

Memuat plugin Node.js:

```css
@plugin "@tailwindcss/typography";
@plugin "tailwindcss-animate";
```

### Custom Config Plugin
```css
@plugin "./my-plugin";
```

### Dengan Options
```css
@plugin "@tailwindcss/container-queries" {
  container: true;
}
```

## @config Directive

Memuat file konfigurasi lama (jika perlu kompatibilitas):

```css
@import "tailwindcss";
@config "../tailwind.config.js";
```

## Referensi

- https://tailwindcss.com/docs/functions-and-directives
