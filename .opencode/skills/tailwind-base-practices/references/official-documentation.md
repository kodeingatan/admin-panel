# Dokumentasi Resmi Tailwind CSS

## Sumber Resmi

- **Situs**: https://tailwindcss.com
- **Dokumentasi**: https://tailwindcss.com/docs
- **GitHub**: https://github.com/tailwindlabs/tailwindcss
- **Playground**: https://play.tailwindcss.com

## Ringkasan

Tailwind CSS adalah framework CSS utility-first yang bekerja dengan memindai semua file HTML, JavaScript components, dan template untuk menemukan class names, menghasilkan styles yang sesuai, lalu menulisnya ke file CSS statis.

**Fitur Utama:**
- Zero-runtime — CSS di-generate saat build time
- Utility-first — gunakan langsung di markup
- Mobile-first responsive design
- Dark mode built-in
- Theme variables yang bisa dikustomisasi
- JIT (Just-In-Time) engine — generate styles sesuai kebutuhan
- Tree-shakable — CSS hanya berisi yang digunakan

## Versi

Tailwind CSS v4.x — versi terbaru dengan perubahan signifikan dari v3:
- Tidak ada `tailwind.config.js` — semua konfigurasi di CSS
- Menggunakan `@theme` directive alih-alih config object
- Menggunakan `@import "tailwindcss"` alih-alih `@tailwind` directives
- CSS-first configuration
- Theme variables menggunakan CSS custom properties

## Kompatibilitas

| Kategori | Dukungan |
|----------|----------|
| Node.js | 18+ |
| Browser | Semua browser modern |
| Framework | Vite, Webpack, PostCSS, atau Tailwind CLI |
| Vue | Vue 3 dengan Vite |

## Struktur Dokumentasi

- **Getting Started**: Installation, editor setup, compatibility, upgrade guide
- **Core Concepts**: Utility classes, responsive design, dark mode, theme, custom styles
- **Base Styles**: Preflight (reset CSS)
- **Utilities**: 400+ utility classes (layout, typography, colors, effects, dll)
- **Functions & Directives**: @theme, @custom-variant, @utility, dll
