# Konsep Inti Tailwind CSS

## Utility-First Approach

Tailwind menggunakan pendekatan **utility-first** — setiap class mengerjakan satu hal spesifik.

### Perbandingan

**Traditional CSS:**
```html
<button class="btn">Click</button>
<style>
  .btn {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 600;
  }
  .btn:hover {
    background-color: #2563eb;
  }
</style>
```

**Tailwind CSS:**
```html
<button class="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
  Click
</button>
```

### Keuntungan Utility-First

- **Cepat** — Tidak perlu switch antara HTML dan CSS
- **Konsisten** — Menggunakan design system yang sudah ditentukan
- **Maintainable** — Hapus class = hapus style, tidak ada CSS tersembunyi
- **Portable** — Copy paste komponen ke mana saja
- **CSS tidak bertumbuh** — Style sudah reusable dari awal

## Variant System

Tailwind menggunakan **variant prefixes** untuk kondisi berbeda:

| Variant | Fungsi | Contoh |
|---------|--------|--------|
| `hover:` | Saat hover | `hover:bg-blue-700` |
| `focus:` | Saat focus | `focus:ring-2` |
| `active:` | Saat aktif | `active:bg-blue-800` |
| `disabled:` | Saat disabled | `disabled:opacity-50` |
| `dark:` | Dark mode | `dark:bg-gray-800` |
| `sm:` | >= 640px | `sm:text-lg` |
| `md:` | >= 768px | `md:flex` |
| `lg:` | >= 1024px | `lg:grid-cols-3` |
| `xl:` | >= 1280px | `xl:px-8` |
| `2xl:` | >= 1536px | `2xl:max-w-7xl` |

## Composable Classes

Beberapa utility bisa dikomposisi bersama:

```html
<!-- Filter bisa dikomposisi -->
<div class="blur-sm grayscale">
  <!-- blur + grayscale akan bekerja bersama -->
</div>

<!-- Transformasi bisa dikomposisi -->
<div class="rotate-3 scale-110">
  <!-- rotate + scale akan bekerja bersama -->
</div>
```

Tailwind menggunakan CSS variables untuk memungkinkan komposisi ini.

## Arbitrary Values

Gunakan square bracket `[]` untuk value di luar theme:

```html
<!-- Color di luar palette -->
<button class="bg-[#316ff6]">Facebook Blue</button>

<!-- Spesifik pixel -->
<div class="top-[117px]">Custom position</div>

<!-- Grid kompleks -->
<div class="grid grid-cols-[24rem_2.5rem_minmax(0,1fr)]">
  <!-- -->
</div>

<!-- CSS variables -->
<div class="fill-(--my-brand-color)">
  <!-- shorthand untuk fill-[var(--my-brand-color)] -->
</div>
```

## Class Conflicts

Ketika dua class menarget CSS property yang sama, class yang **lebih baru di stylesheet** yang menang:

```html
<!-- display: grid yang akan diterapkan (bukan flex) -->
<div class="grid flex">
  <!-- -->
</div>
```

## Important Modifier

Untuk memaksa class tertentu:

```html
<!-- Tambahkan ! di akhir untuk !important -->
<div class="bg-red-500!">
  <!-- background-color akan !important -->
</div>
```

## Prefix Option

Jika ada konflik nama class dengan Tailwind:

```css
@import "tailwindcss" prefix(tw);
```

Sekarang semua class Tailwind menggunakan prefix `tw:`:
```html
<div class="tw:bg-blue-500 tw:text-white">
  <!-- -->
</div>
```
