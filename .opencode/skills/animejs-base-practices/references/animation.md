# Animation Guide

## Basic Animation

```js
import { animate } from 'animejs';

// Animasi sederhana
animate('.element', {
  x: 100,
  duration: 1000,
  ease: 'outExpo'
});
```

## Multi-Property Animation

```js
animate('.element', {
  x: 100,
  y: 50,
  rotate: '1turn',
  scale: 1.5,
  duration: 1000,
  ease: 'outExpo'
});
```

## Keyframes

```js
animate('.element', {
  x: [
    { to: 100, ease: 'outExpo', duration: 500 },
    { to: 0, ease: 'outBounce', duration: 800 }
  ]
});
```

## Stagger Animation

```js
import { animate, stagger } from 'animejs';

animate('.elements', {
  x: 100,
  delay: stagger(50),
  ease: 'outExpo'
});
```

## Timeline Animation

```js
import { createTimeline } from 'animejs';

const tl = createTimeline({ defaults: { duration: 750 } });

tl.add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');
```

## Animatable

```js
import { createAnimatable } from 'animejs';

const animatable = createAnimatable('.element', {
  x: 500,
  y: 500,
  ease: 'out(3)'
});

// Trigger animation
animatable.x(100);
animatable.y(100);
```

## WAAPI Animation

```js
import { waapi } from 'animejs';

// Menggunakan Web Animation API
waapi.animate('.element', {
  x: 100,
  duration: 1000
});
```

## Color Animation

```js
animate('.element', {
  backgroundColor: '#ff0000',
  duration: 1000
});
```

## SVG Animation

```js
animate('circle', {
  cx: 100,
  cy: 100,
  r: 50,
  duration: 1000
});
```

## Text Animation

```js
import { animate, splitText } from 'animejs';

const { chars } = splitText('h2', { words: false, chars: true });

animate(chars, {
  y: [
    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ],
  rotate: {
    from: '-1turn',
    delay: 0
  },
  delay: stagger(50),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});
```

## Scroll Animation

```js
import { onScroll } from 'animejs';

onScroll({
  target: '.element',
  container: window,
  onEnter: () => {
    animate('.element', { x: 100 });
  }
});
```

## Best Practices

1. **Gunakan CSS Transforms**: Lebih performa daripada properti layout
2. **Batasi Simultan Animations**: Jangan terlalu banyak animasi berjalan bersamaan
3. **Gunakan WAAPI**: Untuk animasi sederhana yang butuh hardware acceleration
4. **Cleanup**: Selalu cancel animation saat component unmount
5. **Accessibility**: Hormati prefers-reduced-motion
