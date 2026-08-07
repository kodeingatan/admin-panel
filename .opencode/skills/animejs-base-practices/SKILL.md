---
name: animejs-base-practices
description: Best practices untuk menggunakan anime.js v4 pada project Vue 3 + Vite + Naive UI. Mencakup installation, animation, timeline, easings, draggable, dan production recommendations.
metadata:
  author: opencompany
  version: "1.0"
  category: animation
---

# Anime.js Base Practices

## Kapan Skill Digunakan

- Ketika ingin membuat animasi pada komponen Vue 3
- Ketika ingin mengimplementasikan micro-interactions
- Ketika ingin membuat page transitions
- Ketika ingin menambahkan drag-and-drop functionality
- Ketika ingin membuat scroll-triggered animations
- Ketika ingin mengoptimalkan performa animasi

## Kapan Skill TIDAK Digunakan

- Ketika hanya membutuhkan CSS transitions sederhana
- Ketika animasi sudah bisa diselesaikan dengan CSS animations
- Ketika tidak ada kebutuhan untuk JavaScript-based animations

## Workflow Penggunaan

1. **Evaluasi Kebutuhan**: Tentukan apakah animasi membutuhkan JavaScript atau cukup dengan CSS
2. **Instalasi**: Install anime.js via npm atau CDN
3. **Import**: Gunakan ES modules untuk tree-shaking yang optimal
4. **Implementasi**: Ikuti best practices yang telah ditetapkan
5. **Optimasi**: Gunakan WAAPI untuk animasi sederhana yang membutuhkan hardware acceleration
6. **Testing**: Test animasi pada berbagai device dan browser

## Best Practices

### Installation & Import

```bash
npm install animejs
```

```js
// ✅ Good: Import spesifik untuk tree-shaking
import { animate, stagger, splitText } from 'animejs';

// ❌ Bad: Import semua module
import * as anime from 'animejs';
```

### Animation Patterns

```js
// ✅ Good: Gunakan CSS selectors yang spesifik
animate('.my-component .element', { x: 100 });

// ✅ Good: Gunakan refs untuk target spesifik
const elementRef = ref(null);
animate(elementRef.value, { x: 100 });

// ❌ Bad: Terlalu generik
animate('div', { x: 100 });
```

### Timeline Usage

```js
// ✅ Good: Gunakan timeline untuk sequence animasi
const tl = createTimeline({ defaults: { duration: 750 } });
tl.add('.square', { x: '15rem' })
  .add('.circle', { x: '15rem' }, '<-=500');

// ❌ Bad: Banyak animate() terpisah
animate('.square', { x: '15rem' });
animate('.circle', { x: '15rem' });
```

### Easings

```js
// ✅ Good: Gunakan easings yang sesuai dengan konteks
animate('.element', { 
  x: 100, 
  ease: 'outExpo' // Untuk animasi yang cepat di awal
});

// ✅ Good: Gunakan spring untuk animasi natural
animate('.element', { 
  x: 100, 
  ease: spring({ bounce: .35 }) 
});

// ❌ Bad: Gunakan linear untuk semua animasi
animate('.element', { x: 100, ease: 'linear' });
```

### Performance

```js
// ✅ Good: Gunakan WAAPI untuk animasi sederhana
import { waapi } from 'animejs';
waapi.animate('.element', { x: 100 });

// ✅ Good: Batasi animasi yang simultan
// Gunakan requestAnimationFrame untuk custom loops

// ❌ Bad: Terlalu banyak animasi simultan
// Hindari animasi pada properti yang trigger layout
```

### Vue 3 Integration

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { animate } from 'animejs';

const elementRef = ref(null);
let animation = null;

onMounted(() => {
  animation = animate(elementRef.value, {
    x: 100,
    duration: 1000,
    ease: 'outExpo'
  });
});

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>

<template>
  <div ref="elementRef" class="animated-element"></div>
</template>
```

### Draggable

```js
// ✅ Good: Gunakan createDraggable untuk drag functionality
import { createDraggable } from 'animejs';

createDraggable('.draggable-element', {
  container: '.container',
  releaseEase: 'outElastic'
});

// ❌ Bad: Implement drag manual dengan mouse events
```

## Conventions

- Gunakan `animate()` untuk animasi satu kali
- Gunakan `createTimeline()` untuk sequence animasi
- Gunakan `createAnimatable()` untuk values yang sering berubah
- Gunakan `createDraggable()` untuk drag-and-drop
- Gunakan `stagger()` untuk animasi beruntun
- Selalu cleanup animation di `onUnmounted()`
- Gunakan CSS transforms daripada properti layout (top, left, width, height)

## Anti-Patterns

- Menggunakan `animate()` untuk semua kebutuhan animasi
- Tidak melakukan cleanup animation
- Menganimasi properti yang trigger layout
- Menggunakan terlalu banyak animasi simultan
- Mengabaikan preferensi user untuk reduced motion

## Hal yang Wajib Dihindari

- Jangan menganimasi `top`, `left`, `width`, `height` langsung
- Jangan menggunakan animasi yang mengganggu accessibility
- Jangan mengabaikan performance pada mobile devices
- Jangan menggunakan animasi tanpa fallback untuk browser yang tidak support

## Referensi Internal

- `references/official-documentation.md` - Dokumentasi resmi anime.js
- `references/getting-started.md` - Panduan memulai
- `references/installation.md` - Cara instalasi
- `references/concepts.md` - Konsep inti anime.js
- `references/animation.md` - Panduan animasi
- `references/timeline.md` - Panduan timeline
- `references/easings.md` - Panduan easings
- `references/draggable.md` - Panduan draggable
- `references/utilities.md` - Fungsi utilitas
- `references/best-practices.md` - Best practices
- `references/performance.md` - Optimasi performa
- `references/common-mistakes.md` - Kesalahan umum
- `references/vue-integration.md` - Integrasi dengan Vue 3

## Checklist Sebelum Implementasi

- [ ] Tentukan jenis animasi yang dibutuhkan
- [ ] Pilih metode yang tepat (animate, timeline, animatable, draggable)
- [ ] Pertimbangkan performa pada target device
- [ ] Siapkan cleanup mechanism
- [ ] Test pada berbagai browser

## Checklist Sesudah Implementasi

- [ ] Animasi berjalan smooth
- [ ] Tidak ada layout shift
- [ ] Cleanup berfungsi dengan baik
- [ ] Accessibility tetap terjaga
- [ ] Performa acceptable

## Instruksi untuk AI

Selalu ikuti best practices yang telah dipelajari. Rujuk file-file di folder `references/` untuk informasi lebih detail. Prioritaskan performa dan accessibility dalam setiap implementasi animasi.
