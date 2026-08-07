# Installation

## NPM Installation

```bash
npm install animejs
```

## Module Imports

### ES Modules (Recommended)

```js
import { animate, stagger, splitText } from 'animejs';
```

### CommonJS

```js
const { animate } = require('animejs');
```

### Standalone Modules

```js
import { animate } from 'animejs/animation';
import { createTimeline } from 'animejs/timeline';
import { createAnimatable } from 'animejs/animatable';
import { createDraggable } from 'animejs/draggable';
import { createTimer } from 'animejs/timer';
import { eases, cubicBezier, spring } from 'animejs/easings';
```

## CDN Installation

### ES Modules

```js
import { animate } from 'https://esm.sh/animejs';
```

### UMD Global Object

```html
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>
<script>
  const { animate } = anime;
</script>
```

## Direct Download

Download from GitHub repository:

- `dist/modules/index.js` - ES modules entry point
- `dist/modules/index.cjs` - CommonJS modules entry point
- `dist/bundles/anime.esm.js` - Bundled ES modules
- `dist/bundles/anime.esm.min.js` - Bundled and minified ES modules
- `dist/bundles/anime.umd.js` - Bundled UMD
- `dist/bundles/anime.umd.min.js` - Bundled and minified UMD

## Best Practices

- Gunakan ES modules untuk tree-shaking yang optimal
- Import hanya fungsi yang dibutuhkan
- Gunakan bundler seperti Vite atau esbuild untuk development
- Untuk production, gunakan minified version
