# Utilities Guide

## Overview

Anime.js menyediakan berbagai utilitas untuk membantu manipulasi values dan DOM.

## DOM Selection

### $()

```js
import { utils } from 'animejs';

// Seleksi DOM elements
const elements = utils.$('.element');

// Seleksi dengan context
const elements = utils.$('.element', document.body);
```

## Value Manipulation

### get()

```js
import { utils } from 'animejs';

// Dapatkan nilai komputed
const value = utils.get('.element', 'x');
```

### set()

```js
import { utils } from 'animejs';

// Set nilai
utils.set('.element', { x: 100, opacity: 0.5 });
```

### cleanInlineStyles()

```js
import { utils } from 'animejs';

// Hapus inline styles
utils.cleanInlineStyles('.element');
```

### remove()

```js
import { utils } from 'animejs';

// Hapus element
utils.remove('.element');
```

## Math Utilities

### random()

```js
import { utils } from 'animejs';

// Random number
const value = utils.random(0, 100);
```

### createSeededRandom()

```js
import { utils } from 'animejs';

// Seeded random untuk reproducible results
const seededRandom = utils.createSeededRandom(123);
const value = seededRandom();
```

### randomPick()

```js
import { utils } from 'animejs';

// Random pick dari array
const value = utils.randomPick([1, 2, 3, 4, 5]);
```

### shuffle()

```js
import { utils } from 'animejs';

// Shuffle array
const array = [1, 2, 3, 4, 5];
const shuffled = utils.shuffle(array);
```

### round()

```js
import { utils } from 'animejs';

// Round number
const value = utils.round(3.14159, 2); // 3.14
```

### clamp()

```js
import { utils } from 'animejs';

// Clamp value
const value = utils.clamp(150, 0, 100); // 100
```

### snap()

```js
import { utils } from 'animejs';

// Snap to grid
const value = utils.snap(17, 10); // 20
```

### wrap()

```js
import { utils } from 'animejs';

// Wrap value
const value = utils.wrap(110, 0, 100); // 10
```

### mapRange()

```js
import { utils } from 'animejs';

// Map value dari range ke range lain
const value = utils.mapRange(50, 0, 100, 0, 1); // 0.5
```

### lerp()

```js
import { utils } from 'animejs';

// Linear interpolation
const value = utils.lerp(0, 100, 0.5); // 50
```

### damp()

```js
import { utils } from 'animejs';

// Damping
const value = utils.damp(0, 100, 0.1, 0.016);
```

### roundPad()

```js
import { utils } from 'animejs';

// Round dengan padding
const value = utils.roundPad(3.1, 3); // "3.100"
```

### padStart()

```js
import { utils } from 'animejs';

// Pad start
const value = utils.padStart(5, 3, '0'); // "005"
```

### padEnd()

```js
import { utils } from 'animejs';

// Pad end
const value = utils.padEnd(5, 3, '0'); // "500"
```

### degToRad()

```js
import { utils } from 'animejs';

// Degrees to radians
const value = utils.degToRad(180); // Math.PI
```

### radToDeg()

```js
import { utils } from 'animejs';

// Radians to degrees
const value = utils.radToDeg(Math.PI); // 180
```

## Time Utilities

### keepTime()

```js
import { utils } from 'animejs';

// Create time keeper
const timeKeeper = utils.keepTime();
```

### sync()

```js
import { utils } from 'animejs';

// Sync timers
utils.sync([timer1, timer2]);
```

## Best Practices

1. **Gunakan Utilities**: Untuk manipulasi values yang umum
2. **Performance**: Utilities dioptimasi untuk performa
3. **Reusability**: Dapat digunakan di mana saja
4. **Chainable**: Beberapa utilities dapat di-chain
5. **Type Safety**: TypeScript support tersedia
