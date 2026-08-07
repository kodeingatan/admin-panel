# Advanced Topics

## 1. Custom Easing Functions

### Cubic Bézier

```js
import { cubicBezier } from 'animejs';

// Custom cubic bezier
const customEase = cubicBezier(.7, .1, .5, .9);

animate('.element', {
  x: 100,
  ease: customEase
});
```

### Spring Physics

```js
import { spring } from 'animejs';

// Custom spring
const customSpring = spring({
  bounce: .35,
  mass: 1,
  stiffness: 100,
  damping: 10
});

animate('.element', {
  x: 100,
  ease: customSpring
});
```

### Custom Easing Function

```js
// Custom easing function
const customEase = (t) => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

animate('.element', {
  x: 100,
  ease: customEase
});
```

## 2. Complex Timeline Sequences

### Nested Timelines

```js
const mainTl = createTimeline();
const childTl = createTimeline();

childTl.add('.square', { x: 100 });

mainTl.add(childTl);
mainTl.add('.circle', { x: 100 });
```

### Timeline Labels

```js
const tl = createTimeline();

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');
```

### Timeline Position Parameters

```js
const tl = createTimeline();

tl.add('.el1', { x: 100 })
  .add('.el2', { x: 100 }, '-=500') // 500ms sebelum el1 selesai
  .add('.el3', { x: 100 }, '+=200') // 200ms setelah el2 selesai
  .add('.el4', { x: 100 }, '<');     // Bersamaan dengan el3
```

## 3. Scroll-Triggered Animations

### ScrollObserver

```js
import { onScroll, animate } from 'animejs';

onScroll({
  target: '.element',
  container: window,
  onEnter: () => {
    animate('.element', { x: 100 });
  },
  onLeave: () => {
    animate('.element', { x: 0 });
  }
});
```

### Scroll Sync

```js
import { onScroll, createTimeline } from 'animejs';

const tl = createTimeline();

onScroll({
  target: '.section',
  container: window,
  sync: tl
});

tl.add('.element', { x: 100 });
```

## 4. Layout Animations

### FLIP Animation

```js
import { layout } from 'animejs';

// Record initial state
layout.record();

// Update DOM
document.querySelector('.container').appendChild(newElement);

// Animate from initial to final state
layout.animate({
  duration: 500,
  ease: 'outExpo'
});
```

### Staggered Layout

```js
import { layout, stagger } from 'animejs';

layout.record();
// Update DOM
layout.animate({
  children: {
    delay: stagger(50),
    duration: 500
  }
});
```

## 5. Animatable for Reactive Values

### Cursor Following

```js
import { createAnimatable, utils } from 'animejs';

const animatable = createAnimatable('.element', {
  x: 500,
  y: 500,
  ease: 'out(3)'
});

window.addEventListener('mousemove', (e) => {
  const x = utils.clamp(e.clientX, -250, 250);
  const y = utils.clamp(e.clientY, -250, 250);
  
  animatable.x(x);
  animatable.y(y);
});
```

### Animation Loop

```js
import { createAnimatable } from 'animejs';

const animatable = createAnimatable('.element', {
  x: 500,
  y: 500,
  ease: 'out(3)'
});

let time = 0;
const animate = () => {
  time += 0.01;
  
  animatable.x(Math.sin(time) * 200);
  animatable.y(Math.cos(time) * 200);
  
  requestAnimationFrame(animate);
};

animate();
```

## 6. Text Animations

### SplitText

```js
import { animate, splitText, stagger } from 'animejs';

const { chars } = splitText('h2', { words: false, chars: true });

animate(chars, {
  y: [
    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ],
  delay: stagger(50),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});
```

### ScrambleText

```js
import { animate, scrambleText } from 'animejs';

animate('.element', {
  innerHTML: scrambleText({
    text: 'Hello World',
    chars: 'upper',
    ease: 'inOut'
  }),
  duration: 2000
});
```

## 7. SVG Animations

### Morphing

```js
import { animate, morphTo } from 'animejs';

animate('circle', {
  d: morphTo('path'),
  duration: 1000
});
```

### Motion Path

```js
import { animate, createMotionPath } from 'animejs';

const motionPath = createMotionPath('.element');

animate('.element', {
  offsetDistance: motionPath,
  duration: 2000
});
```

### Draw SVG

```js
import { animate } from 'animejs';

animate('path', {
  strokeDashoffset: [1000, 0],
  duration: 2000
});
```

## 8. Drag and Drop

### Advanced Draggable

```js
import { createDraggable, animate } from 'animejs';

createDraggable('.element', {
  container: '.container',
  snap: { x: 50, y: 50 },
  releaseEase: 'outElastic',
  onRelease: (self) => {
    animate('.element', {
      x: 0,
      y: 0,
      ease: 'outElastic'
    });
  }
});
```

### Drag Constraints

```js
createDraggable('.element', {
  container: '.container',
  containerPadding: 20,
  containerFriction: 0.8,
  releaseContainerFriction: 0.6
});
```

## 9. Performance Monitoring

### Performance API

```js
// Mark performance
performance.mark('animation-start');

animate('.element', { x: 100 });

performance.mark('animation-end');
performance.measure('animation', 'animation-start', 'animation-end');

const measures = performance.getEntriesByName('animation');
console.log('Animation duration:', measures[0].duration);
```

### FPS Monitoring

```js
let lastTime = performance.now();
let frames = 0;

const checkFPS = () => {
  frames++;
  const now = performance.now();
  
  if (now - lastTime >= 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = now;
  }
  
  requestAnimationFrame(checkFPS);
};

checkFPS();
```

## 10. Custom Plugins

### Plugin Structure

```js
const myPlugin = {
  name: 'myPlugin',
  install: (anime) => {
    anime.myMethod = (target, options) => {
      // Custom method
      return animate(target, options);
    };
  }
};

// Use plugin
anime.use(myPlugin);
anime.myMethod('.element', { x: 100 });
```

## 11. TypeScript Support

### Type Definitions

```typescript
import { animate, Animation } from 'animejs';

const animation: Animation = animate('.element', {
  x: 100,
  duration: 1000,
  ease: 'outExpo'
});

// Type-safe callbacks
animation.onComplete = (self) => {
  console.log(self.progress);
};
```

### Custom Types

```typescript
interface MyAnimationOptions {
  target: string;
  x?: number;
  y?: number;
  duration?: number;
}

const myAnimate = (options: MyAnimationOptions) => {
  return animate(options.target, {
    x: options.x,
    y: options.y,
    duration: options.duration
  });
};
```

## 12. Server-Side Rendering

### SSR Considerations

```js
// ❌ Bad: Direct DOM manipulation in SSR
if (typeof window !== 'undefined') {
  animate('.element', { x: 100 });
}

// ✅ Good: Client-only animations
import { onMounted } from 'vue';

onMounted(() => {
  if (typeof window !== 'undefined') {
    animate('.element', { x: 100 });
  }
});
```

### Dynamic Import

```js
// ✅ Good: Dynamic import for SSR
const loadAnimation = async () => {
  if (typeof window !== 'undefined') {
    const { animate } = await import('animejs');
    return animate;
  }
  return null;
};
```

## 13. Web Workers

### Offload Calculations

```js
// worker.js
self.addEventListener('message', (e) => {
  const { start, end, duration } = e.data;
  
  // Calculate animation values
  const values = [];
  for (let t = 0; t <= duration; t += 16) {
    const progress = t / duration;
    values.push(start + (end - start) * progress);
  }
  
  self.postMessage(values);
});

// main.js
const worker = new Worker('worker.js');
worker.postMessage({ start: 0, end: 100, duration: 1000 });
worker.onmessage = (e) => {
  const values = e.data;
  // Use values for animation
};
```

## 14. Module Federation

### Shared Animation Modules

```js
// remote/src/animations.js
export const animations = {
  fadeIn: (element) => {
    return animate(element, { opacity: 1, duration: 500 });
  },
  slideIn: (element) => {
    return animate(element, { x: 0, duration: 500 });
  }
};

// host/src/App.js
import { animations } from 'remote/src/animations';
animations.fadeIn('.element');
```
