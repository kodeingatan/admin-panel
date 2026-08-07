# Frequently Asked Questions

## 1. Apa itu Anime.js?

Anime.js adalah JavaScript animation engine yang powerful untuk membuat animasi pada web. Versi terbaru adalah v4.0.0.

## 2. Bagaimana cara install anime.js?

```bash
npm install animejs
```

## 3. Bagaimana cara import anime.js?

```js
// ES Modules
import { animate, stagger, splitText } from 'animejs';

// CommonJS
const { animate } = require('animejs');
```

## 4. Apa perbedaan animate() dan createTimeline()?

- `animate()`: Untuk animasi tunggal
- `createTimeline()`: Untuk sequence animasi

## 5. Bagaimana cara cleanup animation di Vue 3?

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { animate } from 'animejs';

let animation = null;

onMounted(() => {
  animation = animate('.element', { x: 100 });
});

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>
```

## 6. Apa itu WAAPI?

WAAPI (Web Animation API) adalah versi lightweight dari anime.js yang menggunakan browser's native animation capabilities.

## 7. Bagaimana cara menghormati prefers-reduced-motion?

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  animate('.element', { x: 100 });
}
```

## 8. Apa itu stagger?

Stagger adalah fungsi untuk membuat animasi beruntun dengan delay antar element.

```js
animate('.elements', {
  x: 100,
  delay: stagger(50)
});
```

## 9. Bagaimana cara membuat scroll animation?

```js
import { onScroll, animate } from 'animejs';

onScroll({
  target: '.element',
  container: window,
  onEnter: () => {
    animate('.element', { x: 100 });
  }
});
```

## 10. Apa itu Animatable?

Animatable adalah fitur untuk membuat properties yang dapat diubah secara efisien, cocok untuk values yang sering berubah seperti cursor following.

```js
import { createAnimatable } from 'animejs';

const animatable = createAnimatable('.element', {
  x: 500,
  y: 500
});

animatable.x(100);
```

## 11. Bagaimana cara membuat draggable?

```js
import { createDraggable } from 'animejs';

createDraggable('.element', {
  container: '.container'
});
```

## 12. Apa itu layout animation?

Layout animation adalah fitur untuk menganimasi perubahan layout DOM secara otomatis.

```js
import { layout } from 'animejs';

layout.record();
// Update DOM
layout.animate();
```

## 13. Bagaimana cara performance monitoring?

```js
const start = performance.now();
animate('.element', { x: 100 });
const end = performance.now();

console.log(`Animation took ${end - start} milliseconds`);
```

## 14. Apa itu FLIP animation?

FLIP (First, Last, Invert, Play) adalah teknik animasi yang merekam posisi awal, menghitung perbedaan, dan menganimasikannya.

## 15. Bagaimana cara mengoptimalkan bundle size?

- Gunakan tree shaking
- Import hanya fungsi yang dibutuhkan
- Gunakan minified version
- Lazy load animations

## 16. Apa itu custom easing?

Custom easing adalah fungsi easing yang dibuat sendiri untuk kebutuhan spesifik.

```js
import { cubicBezier, spring } from 'animejs';

// Cubic Bezier
const ease = cubicBezier(.7, .1, .5, .9);

// Spring
const springEase = spring({ bounce: .35 });
```

## 17. Bagaimana cara testing animations?

```js
import { animate } from 'animejs';

describe('Animation', () => {
  it('should animate correctly', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    animate(element, { x: 100 });
    
    expect(element.style.transform).toBe('translateX(100px)');
    
    document.body.removeChild(element);
  });
});
```

## 18. Apa itu text animation?

Text animation adalah animasi yang diterapkan pada text, biasanya menggunakan splitText untuk memecah text menjadi characters, words, atau lines.

```js
import { animate, splitText, stagger } from 'animejs';

const { chars } = splitText('h2', { words: false, chars: true });

animate(chars, {
  y: 100,
  delay: stagger(50)
});
```

## 19. Bagaimana cara membuat modal animation?

```vue
<script setup>
import { ref, watch } from 'vue';
import { animate } from 'animejs';

const props = defineProps({ show: Boolean });
const modalRef = ref(null);

watch(() => props.show, (newVal) => {
  animate(modalRef.value, {
    scale: newVal ? 1 : 0.8,
    opacity: newVal ? 1 : 0,
    duration: 300,
    ease: 'outBack'
  });
});
</script>

<template>
  <div ref="modalRef" class="modal" v-show="show">
    <slot />
  </div>
</template>
```

## 20. Apa best practices untuk production?

1. Selalu cleanup animations
2. Hormati reduced motion
3. Gunakan WAAPI untuk simple animations
4. Monitor performance
5. Test animations
6. Gunakan minified version
7. Lazy load animations
8. Dokumentasi animasi kompleks
