# Accessibility

## Overview

Accessibility (a11y) adalah praktik untuk membuat aplikasi web dapat digunakan oleh semua orang, termasuk orang dengan disabilities. Animasi dapat mempengaruhi accessibility jika tidak diimplementasikan dengan benar.

## Reduced Motion

### Prefers Reduced Motion

```js
// ✅ Good: Hormati preferensi user
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  animate('.element', { x: 100 });
}
```

### CSS Media Query

```css
/* CSS */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none !important;
    transition: none !important;
  }
}
```

## ARIA Attributes

### Role Attributes

```vue
<template>
  <!-- Status messages -->
  <div 
    class="animated-element"
    role="status"
    aria-live="polite"
    :aria-label="status"
  ></div>
  
  <!-- Progress indicators -->
  <div 
    class="progress-bar"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
  ></div>
</template>
```

### Label Attributes

```vue
<template>
  <div 
    class="animated-button"
    role="button"
    aria-label="Close dialog"
    tabindex="0"
  ></div>
</template>
```

## Keyboard Navigation

### Focus Management

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { animate } from 'animejs';

const buttonRef = ref(null);
let animation = null;

onMounted(() => {
  buttonRef.value.addEventListener('focus', () => {
    animation = animate(buttonRef.value, {
      scale: 1.05,
      duration: 200,
      ease: 'outBack'
    });
  });

  buttonRef.value.addEventListener('blur', () => {
    if (animation) animation.cancel();
    animate(buttonRef.value, {
      scale: 1,
      duration: 200,
      ease: 'outBack'
    });
  });
});

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>

<template>
  <button 
    ref="buttonRef"
    class="animated-button"
    tabindex="0"
  >
    Click me
  </button>
</template>
```

### Skip Links

```vue
<template>
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>
  
  <nav class="animated-nav">
    <!-- Navigation items -->
  </nav>
  
  <main id="main-content" class="animated-content">
    <!-- Main content -->
  </main>
</template>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
</style>
```

## Screen Readers

### Live Regions

```vue
<template>
  <div 
    class="animated-notification"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    {{ message }}
  </div>
</template>
```

### Descriptive Labels

```vue
<template>
  <div 
    class="animated-image"
    role="img"
    aria-label="Description of the image"
  >
    <!-- Image content -->
  </div>
</template>
```

## Color Contrast

### Sufficient Contrast

```css
/* CSS */
.animated-element {
  color: #333; /* Dark text */
  background: #fff; /* Light background */
  /* Ratio minimum 4.5:1 untuk normal text */
  /* Ratio minimum 3:1 untuk large text */
}
```

### Focus Indicators

```css
/* CSS */
.animated-button:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Jangan hilangkan outline */
.animated-button:focus:not(:focus-visible) {
  outline: none;
}

.animated-button:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

## Motion Sensitivity

### Vestibular Disorders

```js
// ✅ Good: Hindari motion yang berlebihan
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Animasi yang aman
  animate('.element', { 
    opacity: 0.5,
    duration: 1000 
  });
} else {
  // Static fallback
  animate('.element', { 
    opacity: 0.5,
    duration: 0 
  });
}
```

### Epilepsy Considerations

```js
// ✅ Good: Hindari flashing yang berlebihan
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Animasi yang aman
  animate('.element', { 
    opacity: [0, 1],
    duration: 1000,
    loop: false // Hindari loop yang terus-menerus
  });
}
```

## Best Practices

1. **Selalu Hormati Reduced Motion**: Cek `prefers-reduced-motion`
2. **Gunakan ARIA Attributes**: Untuk screen readers
3. **Keyboard Navigation**: Pastikan dapat diakses dengan keyboard
4. **Focus Management**: Animasi tidak boleh mengganggu focus
5. **Color Contrast**: Pastikan kontras yang cukup
6. **Hindari Flashing**: Hindari animasi yang berkedip cepat
7. **Test**: Test dengan screen readers dan keyboard

## Testing

### Screen Reader Testing

```bash
# macOS: VoiceOver
Cmd + F5

# Windows: NVDA
Ctrl + Alt + N

# Linux: Orca
Super + Alt + S
```

### Keyboard Testing

1. Tab untuk navigasi
2. Enter/Space untuk aktivasi
3. Escape untuk menutup
4. Arrow keys untuk navigasi

### Automated Testing

```js
// Jest + axe-core
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no violations', async () => {
    const { container } = render(MyComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Resources

- WCAG 2.1: https://www.w3.org/TR/WCAG21/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- Web Accessibility Initiative: https://www.w3.org/WAI/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility
