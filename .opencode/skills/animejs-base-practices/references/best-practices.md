# Best Practices

## 1. Installation & Import

### Gunakan ES Modules

```js
// ✅ Good
import { animate, stagger, splitText } from 'animejs';

// ❌ Bad
import * as anime from 'animejs';
```

### Import Spesifik

```js
// ✅ Good: Import hanya yang dibutuhkan
import { animate } from 'animejs';
import { createTimeline } from 'animejs/timeline';

// ❌ Bad: Import semua
import * as anime from 'animejs';
```

## 2. Animation Patterns

### Gunakan CSS Selectors yang Spesifik

```js
// ✅ Good
animate('.my-component .element', { x: 100 });

// ❌ Bad
animate('div', { x: 100 });
```

### Gunakan Refs untuk Target Spesifik

```vue
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

## 3. Timeline Usage

### Gunakan Timeline untuk Sequence

```js
// ✅ Good
const tl = createTimeline();
tl.add('.square', { x: 100 })
  .add('.circle', { x: 100 }, '-=500');

// ❌ Bad
animate('.square', { x: 100 });
animate('.circle', { x: 100 });
```

### Gunakan Defaults

```js
// ✅ Good
const tl = createTimeline({
  defaults: { duration: 750, ease: 'outExpo' }
});

// ❌ Bad
const tl = createTimeline();
tl.add('.square', { x: 100, duration: 750, ease: 'outExpo' });
```

## 4. Easings

### Pilih Easing yang Tepat

```js
// ✅ Good: Easing sesuai konteks
animate('.button', { 
  scale: 0.95, 
  ease: 'outBack' // Untuk button press
});

// ❌ Bad: Linear untuk semua
animate('.button', { scale: 0.95, ease: 'linear' });
```

### Gunakan Spring untuk Natural Animation

```js
// ✅ Good
animate('.element', { 
  x: 100, 
  ease: spring({ bounce: .35 }) 
});

// ❌ Bad
animate('.element', { x: 100, ease: 'linear' });
```

## 5. Performance

### Gunakan CSS Transforms

```js
// ✅ Good: Transform properties
animate('.element', { x: 100, y: 50, rotate: '1turn' });

// ❌ Bad: Layout properties
animate('.element', { top: 100, left: 50, width: 200 });
```

### Batasi Animasi Simultan

```js
// ✅ Good: Batch animations
const tl = createTimeline();
tl.add('.el1', { x: 100 })
  .add('.el2', { x: 100 }, '-=800');

// ❌ Bad: Terlalu banyak simultan
for (let i = 0; i < 100; i++) {
  animate(`.el${i}`, { x: 100 }); // 100 animations bersamaan
}
```

### Gunakan WAAPI untuk Sederhana

```js
// ✅ Good: WAAPI untuk simple animations
import { waapi } from 'animejs';
waapi.animate('.element', { x: 100 });

// ❌ Bad: Full anime.js untuk simple animation
import { animate } from 'animejs';
animate('.element', { x: 100 });
```

## 6. Vue 3 Integration

### Cleanup Animation

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { animate } from 'animejs';

const elementRef = ref(null);
let animation = null;

onMounted(() => {
  animation = animate(elementRef.value, {
    x: 100,
    duration: 1000
  });
});

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>
```

### Gunakan Lifecycle Hooks

```js
// ✅ Good
onMounted(() => {
  // Setup animations
});

onUnmounted(() => {
  // Cleanup animations
});

// ❌ Bad
onBeforeMount(() => {
  // Animasi sebelum DOM ready
});
```

## 7. Accessibility

### Hormati Reduced Motion

```js
// ✅ Good
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  animate('.element', { x: 100 });
}

// ❌ Bad
animate('.element', { x: 100 }); // Selalu animasi
```

### Gunakan ARIA Attributes

```vue
<template>
  <div 
    class="animated-element"
    role="status"
    aria-live="polite"
    :aria-label="status"
  ></div>
</template>
```

## 8. Testing

### Test Animations

```js
// ✅ Good
describe('Animation', () => {
  it('should animate correctly', () => {
    // Test animation behavior
  });
});
```

### Mock Time

```js
// ✅ Good
jest.useFakeTimers();
// Advance timers
jest.advanceTimersByTime(1000);
```

## 9. Documentation

### Komentari Animasi Kompleks

```js
// ✅ Good: Complex animation sequence
const tl = createTimeline();
tl.add('.header', { y: -50 })    // Slide up header
  .add('.content', { opacity: 1 }, '-=300') // Fade in content
  .add('.footer', { y: 0 }, '-=200'); // Slide up footer

// ❌ Bad: Tanpa konteks
const tl = createTimeline();
tl.add('.a', { y: -50 })
  .add('.b', { opacity: 1 }, '-=300')
  .add('.c', { y: 0 }, '-=200');
```

## 10. Production

### Gunakan Minified Version

```html
<!-- ✅ Good -->
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>

<!-- ❌ Bad -->
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.js"></script>
```

### Lazy Load Animations

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
