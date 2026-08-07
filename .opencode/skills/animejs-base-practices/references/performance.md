# Performance Optimization

## 1. Gunakan CSS Transforms

### ❌ Layout Properties (Slow)

```js
// ❌ Bad: Trigger layout
animate('.element', { 
  top: 100, 
  left: 50, 
  width: 200, 
  height: 200 
});
```

### ✅ Transform Properties (Fast)

```js
// ✅ Good: Gunakan transforms
animate('.element', { 
  x: 100, 
  y: 50, 
  scaleX: 2, 
  scaleY: 2 
});
```

**Properti yang aman:**
- `x`, `y`, `z` (translate)
- `rotate`, `rotateX`, `rotateY`, `rotateZ`
- `scale`, `scaleX`, `scaleY`, `scaleZ`
- `skewX`, `skewY`
- `perspective`

## 2. Gunakan WAAPI untuk Simple Animation

### ❌ Full Anime.js (Heavy)

```js
// ❌ Bad: Overkill untuk simple animation
import { animate } from 'animejs';
animate('.element', { x: 100 });
```

### ✅ WAAPI (Lightweight)

```js
// ✅ Good: Gunakan Web Animation API
import { waapi } from 'animejs';
waapi.animate('.element', { x: 100 });
```

**Kapan gunakan WAAPI:**
- Animasi sederhana (1-2 properti)
- Tidak membutuhkan fitur kompleks
- Butuh hardware acceleration
- Ukuran bundle penting

## 3. Batasi Animasi Simultan

### ❌ Terlalu Banyak Simultan

```js
// ❌ Bad: 100 animations bersamaan
for (let i = 0; i < 100; i++) {
  animate(`.el${i}`, { x: 100 });
}
```

### ✅ Gunakan Stagger

```js
// ✅ Good: Stagger animations
animate('.elements', { 
  x: 100, 
  delay: stagger(50) 
});
```

### ✅ Gunakan Timeline

```js
// ✅ Good: Timeline dengan offset
const tl = createTimeline();
for (let i = 0; i < 100; i++) {
  tl.add(`.el${i}`, { x: 100 }, i * 50);
}
```

## 4. Gunakan Hardware Acceleration

### ✅ Will-Change

```css
/* CSS */
.animated-element {
  will-change: transform;
}
```

### ✅ Transform3d

```js
// ✅ Good: Trigger GPU acceleration
animate('.element', { 
  x: 100,
  // anime.js menggunakan transform3d secara otomatis
});
```

## 5. Lazy Load Animations

### ✅ Dynamic Import

```js
// ✅ Good: Lazy load animation module
const loadAnimations = async () => {
  const { animate } = await import('animejs');
  // Setup animations
};

// Load hanya saat dibutuhkan
if (needsAnimation) {
  loadAnimations();
}
```

### ✅ Route-Based Splitting

```js
// ✅ Good: Lazy load per route
const HomePage = () => import('./pages/HomePage.vue');
const AboutPage = () => import('./pages/AboutPage.vue');
```

## 6. Optimasi Selector

### ❌ Selector Kompleks

```js
// ❌ Bad: Selector kompleks
animate('.container > div:nth-child(2) .element', { x: 100 });

// ✅ Good: Selector sederhana
animate('#specific-element', { x: 100 });
```

### ✅ Gunakan ID

```js
// ✅ Good: ID lebih cepat
animate('#my-element', { x: 100 });
```

## 7. Cleanup Animations

### ✅ Selalu Cleanup

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

## 8. Gunakan requestAnimationFrame

### ✅ Custom Animation Loop

```js
// ✅ Good: Gunakan RAF untuk custom loop
let animationId;
const animate = () => {
  // Update animations
  animationId = requestAnimationFrame(animate);
};

// Start
animationId = requestAnimationFrame(animate);

// Stop
cancelAnimationFrame(animationId);
```

## 9. Debounce Events

### ❌ Terlalu Sering Trigger

```js
// ❌ Bad: Trigger setiap mousemove
window.addEventListener('mousemove', (e) => {
  animate('.element', { x: e.clientX });
});
```

### ✅ Debounce

```js
// ✅ Good: Debounce events
let timeout;
window.addEventListener('mousemove', (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    animate('.element', { x: e.clientX });
  }, 16); // ~60fps
});
```

## 10. Monitor Performance

### ✅ Gunakan DevTools

```js
// ✅ Good: Monitor performance
const start = performance.now();
// ... animation code
const end = performance.now();
console.log(`Animation took ${end - start} milliseconds`);
```

### ✅ Gunakan Performance API

```js
// ✅ Good: Mark performance
performance.mark('animation-start');
// ... animation code
performance.mark('animation-end');
performance.measure('animation', 'animation-start', 'animation-end');
```

## 11. Optimasi untuk Mobile

### ✅ Kurangi Animasi di Mobile

```js
// ✅ Good: Deteksi mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (!isMobile) {
  animate('.element', { x: 100 });
}
```

### ✅ Gunakan Reduced Motion

```js
// ✅ Good: Hormati preferensi user
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  animate('.element', { x: 100 });
}
```

## 12. Bundle Size Optimization

### ✅ Tree Shaking

```js
// ✅ Good: Import hanya yang dibutuhkan
import { animate } from 'animejs';

// ❌ Bad: Import semua
import * as anime from 'animejs';
```

### ✅ Gunakan Minified Version

```html
<!-- ✅ Good -->
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>

<!-- ❌ Bad -->
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.js"></script>
```

## 13. caching

### ✅ Cache DOM Queries

```js
// ❌ Bad: Query DOM berulang
animate('.element', { x: 100 });
animate('.element', { y: 50 });

// ✅ Good: Cache element
const element = document.querySelector('.element');
animate(element, { x: 100 });
animate(element, { y: 50 });
```

## 14. Batch Updates

### ❌ Update Terpisah

```js
// ❌ Bad: Banyak update terpisah
animate('.el1', { x: 100 });
animate('.el2', { x: 100 });
animate('.el3', { x: 100 });
```

### ✅ Batch Updates

```js
// ✅ Good: Batch dalam satu animasi
animate(['.el1', '.el2', '.el3'], { x: 100 });

// ✅ Good: Gunakan timeline
const tl = createTimeline();
tl.add(['.el1', '.el2', '.el3'], { x: 100 });
```
