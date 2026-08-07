# Timeline Guide

## Basic Timeline

```js
import { createTimeline } from 'animejs';

const tl = createTimeline();

tl.add('.square', { x: 100 })
  .add('.circle', { x: 100 }, '-=500');
```

## Timeline with Defaults

```js
const tl = createTimeline({
  defaults: { duration: 750, ease: 'outExpo' }
});

tl.add('.square', { x: '15rem' })
  .add('.circle', { x: '15rem' });
```

## Timeline with Labels

```js
const tl = createTimeline();

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');
```

## Timeline Position Parameters

- `'<`: Mulai bersamaan dengan animasi sebelumnya
- `'<-=500'`: Mulai 500ms sebelum animasi sebelumnya
- `'>'`: Mulai setelah animasi sebelumnya selesai
- `'>+=500'`: Mulai 500ms setelah animasi sebelumnya selesai
- `'500'`: Mulai pada waktu 500ms

## Timeline Methods

```js
const tl = createTimeline();

// Menambah animasi
tl.add('.element', { x: 100 });

// Menambah timer
tl.add({ duration: 1000, onUpdate: () => {} });

// Menambah label
tl.label('myLabel');

// Menambah callback
tl.call(() => console.log('done'));

// Sync timeline lain
tl.sync(otherTimeline);

// Menghapus animasi
tl.remove('.element');
```

## Timeline Playback

```js
const tl = createTimeline();

tl.play();
tl.pause();
tl.restart();
tl.reverse();
tl.cancel();
tl.complete();
tl.seek(500);
tl.stretch(2000);
```

## Timeline Callbacks

```js
const tl = createTimeline({
  onBegin: () => console.log('begin'),
  onComplete: () => console.log('complete'),
  onUpdate: (self) => console.log(self.progress),
  onLoop: () => console.log('loop'),
  onPause: () => console.log('pause')
});
```

## Nested Timelines

```js
const mainTl = createTimeline();
const childTl = createTimeline();

childTl.add('.square', { x: 100 });

mainTl.add(childTl);
mainTl.add('.circle', { x: 100 });
```

## Timeline with Animatable

```js
import { createTimeline, createAnimatable } from 'animejs';

const tl = createTimeline();
const animatable = createAnimatable('.element', { x: 500 });

tl.add(() => animatable.x(100));
```

## Best Practices

1. **Gunakan Defaults**: Untuk menghindari pengulangan konfigurasi
2. **Gunakan Labels**: Untuk sequence yang kompleks
3. **Position Parameters**: Pelajari cara mengatur timing
4. **Nested Timelines**: Untuk modularity
5. **Cleanup**: Selalu cancel timeline saat tidak digunakan
