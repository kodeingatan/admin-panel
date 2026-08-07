# Instalasi Tailwind CSS

## Metode Instalasi

### 1. Menggunakan Vite Plugin (Recommended untuk Vue 3 + Vite)

**Step 1: Install packages**
```bash
npm install tailwindcss @tailwindcss/vite
```

**Step 2: Konfigurasi Vite**
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
```

**Step 3: Import Tailwind CSS di file CSS**
```css
@import "tailwindcss";
```

**Step 4: Jalankan dev server**
```bash
npm run dev
```

### 2. Menggunakan PostCSS

```bash
npm install tailwindcss @tailwindcss/postcss
```

```js
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 3. Menggunakan Tailwind CLI

```bash
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --watch
```

### 4. Play CDN (untuk eksperimen)

```html
<script src="https://cdn.tailwindcss.com"></script>
```

## Struktur File yang Direkomendasikan

```
src/
├── assets/
│   └── main.css        ← File CSS dengan @import "tailwindcss"
├── components/
├── App.vue
└── main.ts
```

## Konfigurasi TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["tailwindcss"]
  }
}
```

## Kompatibilitas dengan Vue 3 + Vite

| Kebutuhan | Package |
|-----------|---------|
| Vite | `@tailwindcss/vite` |
| PostCSS | `@tailwindcss/postcss` |
| Vue 3 | `@vitejs/plugin-vite` |

## Tips

- Gunakan `@tailwindcss/vite` untuk integrasi paling seamless
- File CSS harus di-import ke `main.ts` atau `main.js`
- Pastikan compiled CSS ter-load di `<head>` (Vite handle otomatis)
