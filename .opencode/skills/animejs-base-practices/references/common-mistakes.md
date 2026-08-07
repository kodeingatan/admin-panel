# Common Mistakes

## 1. Import yang Salah

### ❌ Import Semua Module

```js
// ❌ Bad
import * as anime from 'animejs';

// ✅ Good
import { animate, stagger, splitText } from 'animejs';
```

### ❌ Import dari Path yang Salah

```js
// ❌ Bad
import animate from 'animejs/animation.js';

// ✅ Good
import { animate } from 'animejs/animation';
```

## 2. Target yang Terlalu Generik

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

## 3. Tidak Cleanup Animation

### ❌ Tidak Cancel Animation

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

## 4. Menganimasi Layout Properties

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

## 5. Terlalu Banyak Animasi Simultan

### ❌ Terlalu Banyak Simultan

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

## 6. Mengabaikan Accessibility

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

## 7. Performance Issues

### ❌ Menggunakan anime.js untuk Simple Animation

```js
// ❌ Bad: Overkill untuk simple animation
import { animate } from 'animejs';
animate('.element', { x: 100 });

// ✅ Good: Gunakan WAAPI
import { waapi } from 'animejs';
waapi.animate('.element', { x: 100 });

// ✅ Good: Gunakan CSS
// .element { transition: transform 1s; }
// .element:hover { transform: translateX(100px); }
```

### ❌ Tidak Menggunakan Hardware Acceleration

```js
// ❌ Bad: Layout properties
animate('.element', { left: 100 });

// ✅ Good: Transform properties
animate('.element', { x: 100 }); // Gunakan will-change: transform
```

## 8. Timeline Issues

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

## 9. Easing Issues

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

## 10. Testing Issues

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

## 11. Production Issues

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
