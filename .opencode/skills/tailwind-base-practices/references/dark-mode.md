# Dark Mode Tailwind CSS

## Dasar Penggunaan

Gunakan prefix `dark:` untuk styling dark mode:

```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <!-- -->
</div>
```

## Default Behavior

Secara default, Tailwind menggunakan `prefers-color-scheme` media query:

```css
.dark\:bg-gray-800 {
  @media (prefers-color-scheme: dark) {
    background-color: var(--color-gray-800);
  }
}
```

## Manual Toggle dengan Class

Override dark variant menggunakan custom selector:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- -->
    </div>
  </body>
</html>
```

## Manual Toggle dengan Data Attribute

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

```html
<html data-theme="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- -->
    </div>
  </body>
</html>
```

## Three-Way Theme Toggle

```javascript
// Inisialisasi — sync dengan localStorage
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
);

// Saat user memilih light mode
localStorage.theme = "light";

// Saat user memilih dark mode
localStorage.theme = "dark";

// Saat user memilih OS preference
localStorage.removeItem("theme");
```

## Best Practices Dark Mode

1. **Gunakan unprefixed untuk light, prefixed untuk dark:**
   ```html
   <div class="bg-white dark:bg-gray-800">
   ```

2. **Gunakan warna yang konsisten:**
   - Light: `gray-50` sampai `gray-200` untuk background
   - Dark: `gray-800` sampai `gray-950` untuk background

3. **Test di kedua mode** — pastikan kontras memadai

4. **Gunakan opacity untuk halus:**
   ```html
   <div class="bg-black/5 dark:bg-white/5">
   ```

5. **Pertimbangkan forced-colors** untuk accessibility:
   ```html
   <div class="dark:bg-gray-800 forced-colors:bg-canvas">
   ```
