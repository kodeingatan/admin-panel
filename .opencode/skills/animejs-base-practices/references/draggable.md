# Draggable Guide

## Basic Draggable

```js
import { createDraggable } from 'animejs';

createDraggable('.element');
```

## Draggable with Container

```js
createDraggable('.element', {
  container: '.container'
});
```

## Draggable with Axes

```js
createDraggable('.element', {
  x: true, // Enable horizontal drag
  y: true  // Enable vertical drag
});
```

## Draggable with Snap

```js
createDraggable('.element', {
  snap: {
    x: 50, // Snap to 50px increments
    y: 50
  }
});
```

## Draggable Settings

```js
createDraggable('.element', {
  trigger: '.handle', // Custom trigger element
  container: '.container',
  containerPadding: 20,
  containerFriction: 0.8,
  releaseContainerFriction: 0.6,
  releaseMass: 1,
  releaseStiffness: 300,
  releaseDamping: 10,
  velocityMultiplier: 1.8,
  minVelocity: 0.5,
  maxVelocity: 30,
  releaseEase: 'outElastic',
  dragSpeed: 1,
  dragThreshold: 3,
  scrollThreshold: 50,
  scrollSpeed: 1,
  cursor: 'grab'
});
```

## Draggable Callbacks

```js
createDraggable('.element', {
  onGrab: (self) => console.log('grabbed', self),
  onDrag: (self) => console.log('dragging', self),
  onUpdate: (self) => console.log('updated', self),
  onRelease: (self) => console.log('released', self),
  onSnap: (self) => console.log('snapped', self),
  onSettle: (self) => console.log('settled', self),
  onResize: (self) => console.log('resized', self),
  onAfterResize: (self) => console.log('after resize', self)
});
```

## Draggable Methods

```js
const draggable = createDraggable('.element');

// Control methods
draggable.disable();
draggable.enable();
draggable.setX(100);
draggable.setY(100);
draggable.animateInView();
draggable.scrollInView();
draggable.stop();
draggable.reset();
draggable.revert();
draggable.refresh();
```

## Draggable with Animation

```js
import { createDraggable, animate } from 'animejs';

createDraggable('.element', {
  releaseEase: 'outElastic',
  onRelease: (self) => {
    // Animate to final position
    animate('.element', {
      x: 0,
      y: 0,
      ease: 'outElastic'
    });
  }
});
```

## Draggable in Vue 3

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { createDraggable } from 'animejs';

const elementRef = ref(null);
let draggable = null;

onMounted(() => {
  draggable = createDraggable(elementRef.value, {
    container: '.container'
  });
});

onUnmounted(() => {
  if (draggable) draggable.remove();
});
</script>

<template>
  <div ref="elementRef" class="draggable-element"></div>
</template>
```

## Best Practices

1. **Container**: Selalu tentukan container untuk membatasi area drag
2. **Snap**: Gunakan snap untuk UX yang lebih baik
3. **Release Ease**: Pilih easing yang sesuai untuk release
4. **Callbacks**: Manfaatkan callbacks untuk integrasi dengan logic lain
5. **Cleanup**: Selalu remove draggable saat component unmount
6. **Accessibility**: Pastikan tetap accessible untuk keyboard users
