# Easings Guide

## Overview

Easings menentukan bagaimana animasi bergerak dari satu nilai ke nilai lain. Anime.js menyediakan berbagai jenis easings.

## Built-in Eases

### Power Easings

```js
// inOut dengan power
'ease.inOut(1)' // linear
'ease.inOut(2)' // quad
'ease.inOut(3)' // cubic
'ease.inOut(4)' // quart
'ease.inOut(5)' // quint
```

### Named Easings

```js
'inQuad'
'outQuad'
'inOutQuad'
'inCubic'
'outCubic'
'inOutCubic'
'inQuart'
'outQuart'
'inOutQuart'
'inQuint'
'outQuint'
'inOutQuint'
'inSine'
'outSine'
'inOutSine'
'inExpo'
'outExpo'
'inOutExpo'
'inCirc'
'outCirc'
'inOutCirc'
'inElastic'
'outElastic'
'inOutElastic'
'inBack'
'outBack'
'inOutBack'
'inBounce'
'outBounce'
'inOutBounce'
```

## Cubic Bézier

```js
import { cubicBezier } from 'animejs';

// Custom cubic bezier
cubicBezier(.7, .1, .5, .9);

// Digunakan
animate('.element', {
  x: 100,
  ease: cubicBezier(.7, .1, .5, .9)
});
```

## Linear

```js
import { linear } from 'animejs';

animate('.element', {
  x: 100,
  ease: linear
});
```

## Steps

```js
import { steps } from 'animejs';

// steps(jumlah, direction)
steps(5, 'end');

// Digunakan
animate('.element', {
  x: 100,
  ease: steps(5, 'end')
});
```

## Irregular

```js
import { irregular } from 'animejs';

// irregular(values)
irregular([0, 0.5, 0.2, 0.8, 1]);
```

## Spring

```js
import { spring } from 'animejs';

// Spring physics
spring({ bounce: .35 });

// Digunakan
animate('.element', {
  x: 100,
  ease: spring({ bounce: .35 })
});
```

## Easing Functions Editor

Kunjungi https://animejs.com/easing-editor untuk membuat dan memvisualisasikan custom easing functions.

## Best Practices

1. **Pilih Easing yang Tepat**: Sesuaikan dengan konteks animasi
2. **Gunakan Spring**: Untuk animasi yang natural dan responsive
3. **Cubic Bézier**: Untuk custom curves yang spesifik
4. **Hindari Linear**: Kecuali untuk animasi mekanik
5. **Test**: Coba berbagai easings untuk menemukan yang terbaik

## Rekomendasi Berdasarkan Kasus

- **Button hover**: `outExpo` atau `outBack`
- **Page transitions**: `inOutCubic` atau `inOutQuart`
- **Drag release**: `outElastic` atau `outBounce`
- **Loading animations**: `linear` atau `inOutSine`
- **Micro-interactions**: `outBack` atau `outElastic`
