# Core Concepts

## Animation Architecture

Anime.js v4 memiliki arsitektur modular dengan komponen-komponen berikut:

### 1. Timer

Timer adalah dasar dari semua animasi di anime.js. Timer mengatur waktu dan callbacks.

```js
import { createTimer } from 'animejs';

const timer = createTimer({
  duration: 1000,
  loop: true,
  onUpdate: self => console.log(self.currentTime)
});
```

### 2. Animation

Animation memanfaatkan timer untuk menganimasi properties pada targets.

```js
import { animate } from 'animejs';

const animation = animate('.element', {
  x: 100,
  duration: 1000,
  ease: 'outExpo'
});
```

### 3. Timeline

Timeline mengatur多个 animations dan timers secara sequential atau parallel.

```js
import { createTimeline } from 'animejs';

const tl = createTimeline();
tl.add('.square', { x: 100 })
  .add('.circle', { x: 100 }, '-=500');
```

### 4. Animatable

Animatable membuat properties yang dapat diubah secara efisien.

```js
import { createAnimatable } from 'animejs';

const animatable = createAnimatable('.element', {
  x: { duration: 500 },
  y: { duration: 500 }
});

// Trigger animation
animatable.x(100);
```

### 5. Draggable

Draggable menambahkan drag-and-drop functionality.

```js
import { createDraggable } from 'animejs';

createDraggable('.element', {
  container: '.container'
});
```

## Targets

Targets adalah elemen yang akan dianimasi:

- CSS Selector: `'.element'`, `'#my-id'`, `'.class'`
- DOM Elements: `document.querySelector('.element')`
- JavaScript Objects: `{ x: 0, y: 0 }`
- Array of targets: `['.el1', '.el2', '.el3']`

## Animatable Properties

### CSS Properties

```js
animate('.element', {
  opacity: 0.5,
  backgroundColor: '#ff0000',
  width: '100px'
});
```

### CSS Transforms

```js
animate('.element', {
  x: 100,
  y: 50,
  rotate: '1turn',
  scale: 1.5,
  skewX: '10deg'
});
```

### CSS Variables

```js
animate('.element', {
  '--custom-property': 100
});
```

### JavaScript Object Properties

```js
const obj = { x: 0, y: 0 };
animate(obj, {
  x: 100,
  y: 50
});
```

### HTML Attributes

```js
animate('.element', {
  width: 100,
  height: 100
});
```

### SVG Attributes

```js
animate('circle', {
  cx: 100,
  cy: 100,
  r: 50
});
```

## Tween Value Types

### Numerical

```js
animate('.element', { x: 100 });
```

### Unit Conversion

```js
animate('.element', { x: '10rem' });
```

### Relative

```js
animate('.element', { x: '+=50' });
```

### Color

```js
animate('.element', { backgroundColor: '#ff0000' });
```

### Function Based

```js
animate('.element', {
  x: (el, i) => i * 50
});
```

## Playback Settings

- `delay`: Waktu tunda sebelum animasi dimulai
- `duration`: Durasi animasi dalam ms
- `loop`: Ulangi animasi
- `loopDelay`: Delay antar loop
- `alternate`: Balik arah animasi
- `reversed`: Mulai dari akhir
- `autoplay`: Mulai otomatis

## Callbacks

- `onBegin`: Dipanggil saat animasi dimulai
- `onComplete`: Dipanggil saat animasi selesai
- `onUpdate`: Dipanggil setiap update
- `onLoop`: Dipanggil saat loop
- `onPause`: Dipanggil saat pause
- `then()`: Promise-based callback

## Methods

- `play()`: Mulai animasi
- `pause()`: Jeda animasi
- `restart()`: Mulai ulang animasi
- `reverse()`: Balik arah animasi
- `cancel()`: Batalkan animasi
- `complete()`: Selesaikan animasi
- `seek()`: Lompat ke waktu tertentu
- `stretch()`: Ubah durasi animasi
