# Preflight (Base Styles) Tailwind CSS

## Apa itu Preflight?

Preflight adalah kumpulan base styles yang diterapkan oleh Tailwind untuk menciptakan fondasi yang lebih konsisten di semua browser. Preflight aktif secara default.

## Kapan Preflight Dinonaktifkan

Preflight otomatis **nonaktif** ketika:
- CSS di-import dengan `@import "tailwindcss/preflight"`
- Dalam `@layer base` atau `@layer theme`

## Mengaktifkan Preflight

```css
@import "tailwindcss";
@import "tailwindcss/preflight";
```

## Apa yang Dikontrol oleh Preflight

1. **Reset CSS** — Menghapus margin/padding default
2. **Typography** — Mengatur font-size, line-height, heading sizes
3. **Link styles** — Mengatur warna link, text-decoration
4. **Image defaults** — `max-width: 100%`, `display: block`
5. **Form element resets** — Border, padding, font inheritance
6. **Table resets** — Border-collapse, border-spacing
7. **Hidden attributes** — `[hidden]` styles

## Tips Penggunaan

1. **Selalu gunakan Tailwind colors** — Preflight menghapus styling default browser
2. **Pastikan ada viewport meta tag**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

3. **Untuk typography-heavy sites**, gunakan `@tailwindcss/typography` plugin

4. **Perhatikan form elements** — Preflight mengubah styling form
