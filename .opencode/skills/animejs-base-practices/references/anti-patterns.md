# Anti-Patterns

## 1. Import Anti-Patterns

### ❌ Import Semua Module

```js
// ❌ Bad: Import semua
import * as anime from 'animejs';

// ✅ Good: Import spesifik
import { animate, stagger, splitText } from 'animejs';
```

### ❌ Import dari Path yang Salah

```js
// ❌ Bad
import animate from 'animejs/animation.js';

// ✅ Good
import { animate } from 'animejs/animation';
```

## 2. Target Anti-Patterns

### ❌ Selector Terlalu Umum

```js
// ❌ Bad
animate('div', { x: 100 });
animate('.element', { x: 100 }); // Jika banyak .element

// ✅ Good
animate('#specific-element', { x: 100 });
animate('.my-component .specific-element', { x: 100 });
```

### ❌ Tidak Menggunakan Refs

```vue
<!-- ❌ Bad -->
<script setup>
import { onMounted } from 'vue';
import { animate } from 'animejs';

onMounted(() => {
  animate('.element', { x: 100 }); // Bisa salah target
});
</script>

<!-- ✅ Good -->
<script setup>
import { ref, onMounted } from 'vue';
import { animate } from 'animejs';

const elementRef = ref(null);

onMounted(() => {
  animate(elementRef.value, { x: 100 });
});
</script>

<template>
  <div ref="elementRef"></div>
</template>
```

## 3. Cleanup Anti-Patterns

### ❌ Tidak Cleanup Animation

```vue
<!-- ❌ Bad -->
<script setup>
import { onMounted } from 'vue';
import { animate } from 'animejs';

onMounted(() => {
  animate('.element', { x: 100, loop: true });
});
</script>

<!-- ✅ Good -->
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { animate } from 'animejs';

let animation = null;

onMounted(() => {
  animation = animate('.element', { x: 100, loop: true });
});

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>
```

## 4. Performance Anti-Patterns

### ❌ Menganimasi Layout Properties

```js
// ❌ Bad: Trigger layout
animate('.element', { 
  top: 100, 
  left: 50, 
  width: 200, 
  height: 200 
});

// ✅ Good: Gunakan transforms
animate('.element', { 
  x: 100, 
  y: 50, 
  scaleX: 2, 
  scaleY: 2 
});
```

### ❌ Terlalu Banyak Animasi Simultan

```js
// ❌ Bad: 100 animations bersamaan
for (let i = 0; i < 100; i++) {
  animate(`.el${i}`, { x: 100 });
}

// ✅ Good: Gunakan stagger
animate('.elements', { 
  x: 100, 
  delay: stagger(50) 
});

// ✅ Good: Gunakan timeline
const tl = createTimeline();
for (let i = 0; i < 100; i++) {
  tl.add(`.el${i}`, { x: 100 }, i * 50);
}
```

## 5. Accessibility Anti-Patterns

### ❌ Tidak Menghormati Reduced Motion

```js
// ❌ Bad
animate('.element', { x: 100 });

// ✅ Good
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  animate('.element', { x: 100 });
}
```

### ❌ Animasi yang Mengganggu

```js
// ❌ Bad: Animasi terus-menerus
animate('.element', { 
  x: 100, 
  loop: true,
  alternate: true 
});

// ✅ Good: Animasi terkendali
animate('.element', { 
  x: 100, 
  duration: 1000,
  ease: 'outExpo'
});
```

## 6. Timeline Anti-Patterns

### ❌ Tidak Menggunakan Position Parameters

```js
// ❌ Bad: Semua mulai di awal
const tl = createTimeline();
tl.add('.el1', { x: 100 });
tl.add('.el2', { x: 100 });

// ✅ Good: Gunakan position parameters
const tl = createTimeline();
tl.add('.el1', { x: 100 });
tl.add('.el2', { x: 100 }, '-=500');
```

### ❌ Tidak Menggunakan Defaults

```js
// ❌ Bad: Pengulangan konfigurasi
const tl = createTimeline();
tl.add('.el1', { x: 100, duration: 750, ease: 'outExpo' });
tl.add('.el2', { x: 100, duration: 750, ease: 'outExpo' });

// ✅ Good: Gunakan defaults
const tl = createTimeline({
  defaults: { duration: 750, ease: 'outExpo' }
});
tl.add('.el1', { x: 100 });
tl.add('.el2', { x: 100 });
```

## 7. Easing Anti-Patterns

### ❌ Menggunakan Linear untuk Semua

```js
// ❌ Bad
animate('.element', { x: 100, ease: 'linear' });

// ✅ Good: Pilih easing yang sesuai
animate('.button', { scale: 0.95, ease: 'outBack' });
animate('.page', { opacity: 1, ease: 'inOutCubic' });
```

### ❌ Tidak Menggunakan Spring

```js
// ❌ Bad
animate('.element', { x: 100, ease: 'outElastic' });

// ✅ Good: Gunakan spring
animate('.element', { 
  x: 100, 
  ease: spring({ bounce: .35 }) 
});
```

## 8. Testing Anti-Patterns

### ❌ Tidak Test Animations

```js
// ❌ Bad
// Tidak ada testing

// ✅ Good
describe('Animation', () => {
  it('should animate correctly', () => {
    // Test animation behavior
  });
});
```

### ❌ Tidak Mock Time

```js
// ❌ Bad
// Animasi berjalan real-time

// ✅ Good
jest.useFakeTimers();
jest.advanceTimersByTime(1000);
```

## 9. Production Anti-Patterns

### ❌ Menggunakan Version yang Salah

```html
<!-- ❌ Bad -->
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.js"></script>

<!-- ✅ Good -->
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>
```

### ❌ Tidak Lazy Load

```js
// ❌ Bad: Load semua di awal
import { animate, stagger, splitText } from 'animejs';

// ✅ Good: Lazy load
const loadAnimations = async () => {
  const { animate } = await import('animejs');
};
```

## 10. Memory Anti-Patterns

### ❌ Tidak Cleanup Event Listeners

```js
// ❌ Bad
const handler = () => {
  animate('.element', { x: 100 });
};

element.addEventListener('click', handler);
// Tidak pernah removeEventListener

// ✅ Good
const handler = () => {
  animate('.element', { x: 100 });
};

element.addEventListener('click', handler);

// Cleanup
element.removeEventListener('click', handler);
```

### ❌ Tidak Cleanup Animations

```vue
<!-- ❌ Bad -->
<script setup>
import { onMounted } from 'vue';
import { animate } from 'animejs';

onMounted(() => {
  animate('.element', { x: 100 });
});
</script>

<!-- ✅ Good -->
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

## 11. Error Handling Anti-Patterns

### ❌ Tidak Handle Errors

```js
// ❌ Bad
animate('.element', { x: 100 });

// ✅ Good
try {
  animate('.element', { x: 100 });
} catch (error) {
  console.error('Animation error:', error);
}
```

### ❌ Tidak Ada Fallback

```js
// ❌ Bad
if (typeof animate !== 'undefined') {
  animate('.element', { x: 100 });
}

// ✅ Good
if (typeof animate !== 'undefined') {
  animate('.element', { x: 100 });
} else {
  // CSS fallback
  document.querySelector('.element').style.transform = 'translateX(100px)';
}
```

## 12. Documentation Anti-Patterns

### ❌ Tidak Dokumentasi

```js
// ❌ Bad: Tanpa konteks
const tl = createTimeline();
tl.add('.a', { y: -50 })
  .add('.b', { opacity: 1 }, '-=300')
  .add('.c', { y: 0 }, '-=200');

// ✅ Good: Dokumentasi yang jelas

/**
 * Page entrance animation sequence
 * 1. Header slides up
 * 2. Content fades in
 * 3. Footer slides up
 */
const tl = createTimeline();
tl.add('.header', { y: -50 })
  .add('.content', { opacity: 1 }, '-=300')
  .add('.footer', { y: 0 }, '-=200');
```
