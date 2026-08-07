# Production Recommendations

## 1. Bundle Size Optimization

### Tree Shaking

```js
// ✅ Good: Import hanya yang dibutuhkan
import { animate } from 'animejs';

// ❌ Bad: Import semua
import * as anime from 'animejs';
```

### Minified Version

```html
<!-- ✅ Good -->
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>

<!-- ❌ Bad -->
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.js"></script>
```

### Code Splitting

```js
// ✅ Good: Dynamic import
const loadAnimation = async () => {
  const { animate } = await import('animejs');
  return animate;
};

// Load hanya saat dibutuhhkan
if (needsAnimation) {
  const animate = await loadAnimation();
  animate('.element', { x: 100 });
}
```

## 2. Performance Optimization

### Hardware Acceleration

```js
// ✅ Good: Gunakan transform properties
animate('.element', { 
  x: 100, 
  y: 50, 
  rotate: '1turn' 
});

// ❌ Bad: Layout properties
animate('.element', { 
  top: 100, 
  left: 50, 
  width: 200 
});
```

### WAAPI for Simple Animations

```js
// ✅ Good: Gunakan WAAPI untuk sederhana
import { waapi } from 'animejs';
waapi.animate('.element', { x: 100 });

// ❌ Bad: Full anime.js untuk simple
import { animate } from 'animejs';
animate('.element', { x: 100 });
```

### Batch Animations

```js
// ✅ Good: Batch animations
const tl = createTimeline();
tl.add(['.el1', '.el2', '.el3'], { x: 100 });

// ❌ Bad: Banyak animasi terpisah
animate('.el1', { x: 100 });
animate('.el2', { x: 100 });
animate('.el3', { x: 100 });
```

## 3. Accessibility

### Reduced Motion

```js
// ✅ Good: Hormati preferensi user
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  animate('.element', { x: 100 });
}
```

### ARIA Attributes

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

### Keyboard Navigation

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { animate } from 'animejs';

const buttonRef = ref(null);

onMounted(() => {
  buttonRef.value.addEventListener('focus', () => {
    animate(buttonRef.value, { scale: 1.05 });
  });

  buttonRef.value.addEventListener('blur', () => {
    animate(buttonRef.value, { scale: 1 });
  });
});
</script>

<template>
  <button ref="buttonRef" tabindex="0">Click me</button>
</template>
```

## 4. Error Handling

### Try-Catch

```js
// ✅ Good: Handle errors
try {
  animate('.element', { x: 100 });
} catch (error) {
  console.error('Animation error:', error);
}
```

### Fallback

```js
// ✅ Good: Fallback untuk browser lama
if (typeof animate !== 'undefined') {
  animate('.element', { x: 100 });
} else {
  // CSS fallback
  document.querySelector('.element').style.transform = 'translateX(100px)';
}
```

## 5. Memory Management

### Cleanup

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

### Remove Event Listeners

```js
// ✅ Good: Remove event listeners
const handler = () => {
  animate('.element', { x: 100 });
};

element.addEventListener('click', handler);

// Cleanup
element.removeEventListener('click', handler);
```

## 6. Testing

### Unit Testing

```js
// ✅ Good: Test animations
describe('Animation', () => {
  it('should animate correctly', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    animate(element, { x: 100 });
    
    // Assert animation
    expect(element.style.transform).toBe('translateX(100px)');
    
    // Cleanup
    document.body.removeChild(element);
  });
});
```

### Integration Testing

```js
// ✅ Good: Test dengan framework
import { render, screen } from '@testing-library/vue';
import MyComponent from './MyComponent.vue';

describe('MyComponent', () => {
  it('should animate on mount', async () => {
    render(MyComponent);
    
    const element = screen.getByTestId('animated-element');
    
    // Wait for animation
    await waitFor(() => {
      expect(element).toHaveStyle({ transform: 'translateX(100px)' });
    });
  });
});
```

## 7. Monitoring

### Performance Monitoring

```js
// ✅ Good: Monitor performance
const start = performance.now();
animate('.element', { x: 100 });
const end = performance.now();

console.log(`Animation took ${end - start} milliseconds`);
```

### Error Monitoring

```js
// ✅ Good: Monitor errors
window.addEventListener('error', (event) => {
  console.error('Animation error:', event.error);
  // Send to error tracking service
});
```

## 8. Documentation

### Komentari Animasi Kompleks

```js
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

### README

```markdown
## Animations

Project ini menggunakan anime.js untuk animasi.

### Dependencies

- anime.js v4.0.0

### Usage

```js
import { animate } from 'animejs';

animate('.element', { x: 100 });
```

### Performance

- Gunakan transform properties
- Gunakan WAAPI untuk animasi sederhana
- Selalu cleanup animations
```

## 9. Deployment

### CDN

```html
<!-- ✅ Good: Gunakan CDN dengan versioning -->
<script src="https://cdn.jsdelivr.net/npm/animejs@4.0.0/dist/bundles/anime.umd.min.js"></script>
```

### npm

```json
{
  "dependencies": {
    "animejs": "^4.0.0"
  }
}
```

### Lazy Loading

```js
// ✅ Good: Lazy load animations
const loadAnimations = async () => {
  const { animate } = await import('animejs');
  return animate;
};

// Load saat dibutuhkan
if (route.meta.requiresAnimation) {
  const animate = await loadAnimations();
  // Setup animations
}
```

## 10. Monitoring & Analytics

### Track Animation Usage

```js
// ✅ Good: Track animasi yang digunakan
const trackAnimation = (animationType) => {
  // Send to analytics
  analytics.track('animation_used', { type: animationType });
};

// Gunakan
animate('.button', { 
  scale: 0.95,
  onComplete: () => trackAnimation('button_press')
});
```

### Performance Metrics

```js
// ✅ Good: Track performance metrics
const trackPerformance = (metric, value) => {
  // Send to monitoring service
  monitoring.track(metric, value);
};

// Measure animation performance
const start = performance.now();
animate('.element', { x: 100 });
const end = performance.now();

trackPerformance('animation_duration', end - start);
```
