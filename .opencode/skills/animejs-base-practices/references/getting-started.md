# Getting Started

## Overview

Anime.js adalah JavaScript animation engine yang powerful untuk membuat animasi pada web. Versi terbaru adalah v4.0.0.

## Installation

### NPM

```bash
npm install animejs
```

### CDN

```js
// ES Modules
import { animate } from 'https://esm.sh/animejs';

// UMD
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>
```

## Basic Usage

### Import

```js
import { animate } from 'animejs';
```

### Simple Animation

```js
animate('.element', {
  x: 100,
  duration: 1000,
  ease: 'outExpo'
});
```

## Core Concepts

### Targets

Targets adalah elemen yang akan dianimasi:

- CSS Selector: `'.element'`
- DOM Elements: `document.querySelector('.element')`
- JavaScript Objects: `{ x: 0, y: 0 }`
- Array: `['.el1', '.el2']`

### Properties

Properties yang dapat dianimasi:

- CSS Properties: `opacity`, `backgroundColor`
- CSS Transforms: `x`, `y`, `rotate`, `scale`
- CSS Variables: `'--custom-property'`
- JavaScript Objects: Custom properties
- HTML Attributes: `width`, `height`
- SVG Attributes: `cx`, `cy`, `r`

### Playback Settings

- `delay`: Waktu tunda (ms)
- `duration`: Durasi animasi (ms)
- `loop`: Ulangi animasi
- `loopDelay`: Delay antar loop
- `alternate`: Balik arah
- `reversed`: Mulai dari akhir
- `autoplay`: Mulai otomatis

### Callbacks

- `onBegin`: Saat animasi dimulai
- `onComplete`: Saat animasi selesai
- `onUpdate`: Setiap update
- `onLoop`: Saat loop
- `onPause`: Saat pause
- `then()`: Promise-based

### Methods

- `play()`: Mulai
- `pause()`: Jeda
- `restart()`: Mulai ulang
- `reverse()`: Balik arah
- `cancel()`: Batalkan
- `complete()`: Selesaikan
- `seek()`: Lompat ke waktu
- `stretch()`: Ubah durasi

## First Animation

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { animate } from 'animejs';

const elementRef = ref(null);
let animation = null;

onMounted(() => {
  animation = animate(elementRef.value, {
    x: 100,
    rotate: '1turn',
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

<style>
.animated-element {
  width: 100px;
  height: 100px;
  background: #ff6b6b;
}
</style>
```

## Next Steps

1. Pelajari **Animation** untuk fitur lengkap
2. Pelajari **Timeline** untuk sequence animasi
3. Pelajari **Easings** untuk motion yang natural
4. Pelajari **Draggable** untuk drag-and-drop
5. Pelajari **Utilities** untuk helper functions

## Resources

- Documentation: https://animejs.com/documentation
- GitHub: https://github.com/juliangarnier/anime
- CodePen: https://codepen.io/collection/Poerqa
- Easing Editor: https://animejs.com/easing-editor
