# Decorations

## What are Decorations

Decorations are visual modifications to the editor view without changing the document.

## Decoration Types

| Type | Description |
|------|-------------|
| `Decoration.widget` | Widget at a position |
| `Decoration.inline` | Inline decoration |
| `Decoration.node` | Node decoration |

## Widget Decorations

### Basic Widget

```ts
import { Decoration, DecorationSet } from 'prosemirror-view'

const widget = Decoration.widget(5, () => {
  const span = document.createElement('span')
  span.className = 'my-widget'
  span.textContent = '★'
  return span
})

const decorations = DecorationSet.create(doc, [widget])
```

### Widget Options

```ts
const widget = Decoration.widget(5, () => {
  const span = document.createElement('span')
  span.className = 'my-widget'
  span.textContent = '★'
  return span
}, {
  side: -1, // -1: before, 1: after
  covers: true, // Whether widget covers the position
  key: 'my-widget', // Key for updating
})
```

## Inline Decorations

### Basic Inline

```ts
const inline = Decoration.inline(5, 10, {
  class: 'highlight',
  style: 'background-color: yellow',
})

const decorations = DecorationSet.create(doc, [inline])
```

### Inline with Attributes

```ts
const inline = Decoration.inline(5, 10, {
  class: 'highlight',
  style: 'background-color: yellow',
  'data-custom': 'value',
})
```

## Node Decorations

### Basic Node Decoration

```ts
const node = Decoration.node(0, 20, {
  class: 'highlighted-block',
  style: 'border: 1px solid blue',
})

const decorations = DecorationSet.create(doc, [node])
```

### Node Decoration with Attributes

```ts
const node = Decoration.node(0, 20, {
  class: 'highlighted-block',
  style: 'border: 1px solid blue',
  'data-custom': 'value',
})
```

## Decoration Sets

### Creating DecorationSet

```ts
// Empty
const empty = DecorationSet.empty

// From decorations
const decorations = DecorationSet.create(doc, [widget, inline, node])

// From array
const decorations = DecorationSet.create(doc, decorationsArray)
```

### Methods

```ts
// Map through a mapping
const mapped = decorations.map(mapping)

// Add decorations
const newDecorations = decorations.add(doc, newDecorations)

// Remove decorations
const reduced = decorations.remove([oldDecoration])

// Find decorations at a position
const found = decorations.find(5, 10)

// Get decorations as array
const array = decorations.toArray()
```

## Plugin with Decorations

### Basic Plugin

```ts
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

const highlightPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, decorations) {
      // Update decorations based on transaction
      return decorations.map(tr.mapping, tr.doc)
    },
  },
  props: {
    decorations(state) {
      return highlightPlugin.getState(state)
    },
  },
})
```

### Plugin with Search

```ts
const searchPlugin = new Plugin({
  state: {
    init() {
      return { query: '', decorations: DecorationSet.empty }
    },
    apply(tr, value) {
      const meta = tr.getMeta(searchPlugin)
      if (meta) {
        return meta
      }
      return {
        query: value.query,
        decorations: value.decorations.map(tr.mapping, tr.doc),
      }
    },
  },
  props: {
    decorations(state) {
      return searchPlugin.getState(state).decorations
    },
  },
})

// Usage
function setSearch(view: EditorView, query: string) {
  const { state } = view
  const decorations = findSearchDecorations(state.doc, query)
  const tr = state.tr
  tr.setMeta(searchPlugin, { query, decorations })
  view.dispatch(tr)
}

function findSearchDecorations(doc, query) {
  const decorations = []
  const regex = new RegExp(query, 'gi')
  
  doc.descendants((node, pos) => {
    if (node.isText) {
      let match
      while ((match = regex.exec(node.text)) !== null) {
        decorations.push(
          Decoration.inline(pos + match.index, pos + match.index + match[0].length, {
            class: 'search-highlight',
          })
        )
      }
    }
  })
  
  return DecorationSet.create(doc, decorations)
}
```

## Active Line Highlight

### Plugin

```ts
const activeLinePlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, decorations, oldState, newState) {
      if (!tr.selectionSet && !tr.docChanged) {
        return decorations
      }
      
      const pos = newState.selection.$from
      const lineStart = pos.start()
      const lineEnd = pos.end()
      
      return DecorationSet.create(newState.doc, [
        Decoration.node(lineStart, lineEnd, {
          class: 'active-line',
        }),
      ])
    },
  },
  props: {
    decorations(state) {
      return activeLinePlugin.getState(state)
    },
  },
})
```

## Cursor Decoration

### Plugin

```ts
const cursorPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, decorations, oldState, newState) {
      if (!tr.selectionSet) {
        return decorations
      }
      
      const { from } = newState.selection
      
      return DecorationSet.create(newState.doc, [
        Decoration.widget(from, () => {
          const cursor = document.createElement('span')
          cursor.className = 'custom-cursor'
          cursor.style.width = '2px'
          cursor.style.height = '20px'
          cursor.style.backgroundColor = 'blue'
          return cursor
        }),
      ])
    },
  },
  props: {
    decorations(state) {
      return cursorPlugin.getState(state)
    },
  },
})
```

## Tooltip Decoration

### Plugin

```ts
const tooltipPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, decorations, oldState, newState) {
      if (!tr.selectionSet) {
        return decorations
      }
      
      const { from, to } = newState.selection
      
      if (from === to) {
        return DecorationSet.empty
      }
      
      return DecorationSet.create(newState.doc, [
        Decoration.widget(to, () => {
          const tooltip = document.createElement('div')
          tooltip.className = 'tooltip'
          tooltip.textContent = 'Selected text'
          tooltip.style.position = 'absolute'
          tooltip.style.backgroundColor = 'black'
          tooltip.style.color = 'white'
          tooltip.style.padding = '4px 8px'
          tooltip.style.borderRadius = '4px'
          return tooltip
        }),
      ])
    },
  },
  props: {
    decorations(state) {
      return tooltipPlugin.getState(state)
    },
  },
})
```

## Using Decorations in Vue

### Plugin Component

```vue
<template>
  <div ref="editorContainer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'

const editorContainer = ref<HTMLDivElement>()
let view: EditorView | null = null

const highlightPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, decorations) {
      return decorations.map(tr.mapping, tr.doc)
    },
  },
  props: {
    decorations(state) {
      return highlightPlugin.getState(state)
    },
  },
})

onMounted(() => {
  const state = EditorState.create({
    schema: mySchema,
    plugins: [highlightPlugin],
  })

  view = new EditorView(editorContainer.value!, { state })
})

onBeforeUnmount(() => {
  view?.destroy()
})
</script>
```
