# Custom Styles Tailwind CSS

## Customizing Theme

Gunakan `@theme` untuk mengkustomisasi design tokens:

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", sans-serif;
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
}
```

## Arbitrary Values

Gunakan square bracket `[]` untuk value sekali pakai:

```html
<div class="top-[117px] lg:top-[344px]">
  <!-- -->
</div>

<div class="bg-[#bada55] text-[22px] before:content-['Festivus']">
  <!-- -->
</div>

<!-- CSS variables shorthand -->
<div class="fill-(--my-brand-color)">
  <!-- fill-[var(--my-brand-color)] -->
</div>
```

## Arbitrary Properties

Untuk CSS property yang tidak ada utility-nya:

```html
<div class="[mask-type:luminance] hover:[mask-type:alpha]">
  <!-- -->
</div>

<!-- CSS variables -->
<div class="[--scroll-offset:56px] lg:[--scroll-offset:44px]">
  <!-- -->
</div>
```

## Handling Whitespace

Gunakan underscore `_` untuk spasi dalam arbitrary values:

```html
<div class="grid grid-cols-[1fr_500px_2fr]">
  <!-- -->
</div>
```

## Resolving Ambiguities

Ketika utility name ambigu, gunakan CSS data type:

```html
<!-- Font size -->
<div class="text-[22px]">...</div>

<!-- Color -->
<div class="text-[#bada55]">...</div>

<!-- Dengan CSS variable — gunakan hint -->
<div class="text-(length:--my-var)">...</div>  <!-- font-size -->
<div class="text-(color:--my-var)">...</div>   <!-- color -->
```

## Custom CSS

### Base Styles
```html
<!doctype html>
<html lang="en" class="bg-gray-100 font-serif text-gray-900">
  <!-- -->
</html>
```

Atau gunakan `@layer base`:
```css
@layer base {
  h1 {
    font-size: var(--text-2xl);
  }
  h2 {
    font-size: var(--text-xl);
  }
}
```

### Component Classes

```css
@layer components {
  .card {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
    box-shadow: var(--shadow-xl);
  }
}
```

```html
<!-- Card dengan square corners -->
<div class="card rounded-none">
  <!-- -->
</div>
```

### Third-Party Components

```css
@layer components {
  .select2-dropdown {
    /* ... */
  }
}
```

## Custom Utilities

### Simple Utilities

```css
@utility content-auto {
  content-visibility: auto;
}
```

```html
<div class="content-auto hover:content-auto lg:content-auto">
  <!-- -->
</div>
```

### Complex Utilities

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### Functional Utilities

```css
@theme {
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*, integer, [integer]);
}
```

Mendukung:
- Theme values: `tab-github` → `tab-size: 8`
- Bare values: `tab-2` → `tab-size: 2`
- Arbitrary values: `tab-[4]` → `tab-size: 4`

### Default Values

```css
@utility tab-* {
  tab-size: --value(integer, --default(4));
}
```

`tab` tanpa angka → `tab-size: 4`

### Negative Values

```css
@utility inset-* {
  inset: --spacing(--value(integer));
  inset: --value([percentage], [length]);
}

@utility -inset-* {
  inset: --spacing(--value(integer) * -1);
  inset: calc(--value([percentage], [length]) * -1);
}
```

## Custom Variants

```css
@custom-variant theme-midnight {
  &:where([data-theme="midnight"] *) {
    @slot;
  }
}
```

```html
<html data-theme="midnight">
  <button class="theme-midnight:bg-black">
    <!-- -->
  </button>
</html>
```

### Shorthand Syntax

```css
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```

## Using Variants in Custom CSS

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}

/* Multiple variants */
.my-element {
  @variant hover:focus {
    background: black;
  }
}

/* Multiple variants for same style */
.my-element {
  @variant hover, focus {
    background: black;
  }
}
```
