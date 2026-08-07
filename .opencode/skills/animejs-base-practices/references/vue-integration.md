# Vue 3 Integration

## Basic Setup

### Installation

```bash
npm install animejs
```

### Import

```js
import { animate, stagger, splitText } from 'animejs';
```

## Basic Animation

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { animate } from 'animejs';

const elementRef = ref(null);

onMounted(() => {
  animate(elementRef.value, {
    x: 100,
    duration: 1000,
    ease: 'outExpo'
  });
});
</script>

<template>
  <div ref="elementRef" class="animated-element"></div>
</template>
```

## Animation with Cleanup

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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

## Timeline Animation

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createTimeline } from 'animejs';

const squareRef = ref(null);
const circleRef = ref(null);
let timeline = null;

onMounted(() => {
  timeline = createTimeline({ defaults: { duration: 750 } });
  
  timeline
    .add(squareRef.value, { x: '15rem' })
    .add(circleRef.value, { x: '15rem' }, '-=500');
});

onUnmounted(() => {
  if (timeline) timeline.cancel();
});
</script>

<template>
  <div class="animation-container">
    <div ref="squareRef" class="square"></div>
    <div ref="circleRef" class="circle"></div>
  </div>
</template>
```

## Stagger Animation

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { animate, stagger } from 'animejs';

const listRef = ref(null);
let animation = null;

onMounted(() => {
  animation = animate(listRef.value.children, {
    x: 100,
    delay: stagger(50),
    ease: 'outExpo'
  });
});

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>

<template>
  <ul ref="listRef">
    <li v-for="i in 5" :key="i">Item {{ i }}</li>
  </ul>
</template>
```

## Draggable

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createDraggable } from 'animejs';

const draggableRef = ref(null);
let draggable = null;

onMounted(() => {
  draggable = createDraggable(draggableRef.value, {
    container: '.container',
    releaseEase: 'outElastic'
  });
});

onUnmounted(() => {
  if (draggable) draggable.remove();
});
</script>

<template>
  <div class="container">
    <div ref="draggableRef" class="draggable-element"></div>
  </div>
</template>
```

## Scroll Animation

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { animate, onScroll } from 'animejs';

const elementRef = ref(null);
let scrollObserver = null;

onMounted(() => {
  scrollObserver = onScroll({
    target: elementRef.value,
    container: window,
    onEnter: () => {
      animate(elementRef.value, { x: 100 });
    }
  });
});

onUnmounted(() => {
  if (scrollObserver) scrollObserver.revert();
});
</script>

<template>
  <div ref="elementRef" class="scroll-element"></div>
</template>
```

## Text Animation

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { animate, splitText, stagger } from 'animejs';

const textRef = ref(null);
let animation = null;

onMounted(() => {
  const { chars } = splitText(textRef.value, { words: false, chars: true });
  
  animation = animate(chars, {
    y: [
      { to: '-2.75rem', ease: 'outExpo', duration: 600 },
      { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
    ],
    delay: stagger(50),
    ease: 'inOutCirc',
    loopDelay: 1000,
    loop: true
  });
});

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>

<template>
  <h2 ref="textRef">HELLO WORLD</h2>
</template>
```

## Reactive Animation

```vue
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { animate } from 'animejs';

const elementRef = ref(null);
const isActive = ref(false);
let animation = null;

watch(isActive, (newVal) => {
  if (animation) animation.cancel();
  
  animation = animate(elementRef.value, {
    x: newVal ? 100 : 0,
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
  <button @click="isActive = !isActive">Toggle</button>
</template>
```

## Animation with Props

```vue
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { animate } from 'animejs';

const props = defineProps({
  targetX: { type: Number, default: 100 },
  duration: { type: Number, default: 1000 },
  ease: { type: String, default: 'outExpo' }
});

const elementRef = ref(null);
let animation = null;

const runAnimation = () => {
  if (animation) animation.cancel();
  
  animation = animate(elementRef.value, {
    x: props.targetX,
    duration: props.duration,
    ease: props.ease
  });
};

onMounted(runAnimation);

watch(() => [props.targetX, props.duration, props.ease], runAnimation);

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>

<template>
  <div ref="elementRef" class="animated-element"></div>
</template>
```

## Best Practices

1. **Selalu Cleanup**: Cancel animation di `onUnmounted()`
2. **Gunakan Refs**: Untuk target spesifik
3. **Watch Props**: Untuk animasi reaktif
4. **Lifecycle Hooks**: Setup di `onMounted()`, cleanup di `onUnmounted()`
5. **Accessibility**: Hormati `prefers-reduced-motion`
6. **Performance**: Gunakan WAAPI untuk animasi sederhana
7. **Testing**: Test animasi pada berbagai device

## Common Patterns

### Page Transitions

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { createTimeline } from 'animejs';

let timeline = null;

onMounted(() => {
  timeline = createTimeline({ defaults: { duration: 500 } });
  
  timeline
    .add('.page-header', { y: -50, opacity: 0 })
    .add('.page-content', { opacity: 0 }, '-=300')
    .add('.page-footer', { y: 50, opacity: 0 }, '-=200');
});

onUnmounted(() => {
  if (timeline) timeline.cancel();
});
</script>
```

### Modal Animation

```vue
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { animate } from 'animejs';

const props = defineProps({ show: Boolean });
const modalRef = ref(null);
let animation = null;

watch(() => props.show, (newVal) => {
  if (animation) animation.cancel();
  
  animation = animate(modalRef.value, {
    scale: newVal ? 1 : 0.8,
    opacity: newVal ? 1 : 0,
    duration: 300,
    ease: 'outBack'
  });
});

onUnmounted(() => {
  if (animation) animation.cancel();
});
</script>

<template>
  <div ref="modalRef" class="modal" v-show="show">
    <slot />
  </div>
</template>
```
