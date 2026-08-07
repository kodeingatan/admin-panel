# ProseMirror Integration

## Overview

The `y-prosemirror` module provides ProseMirror plugins that make any ProseMirror-based editor collaborative.

## Installation

```bash
npm install yjs y-prosemirror prosemirror-model prosemirror-state prosemirror-view
```

## Basic Usage

```ts
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from 'prosemirror-schema-basic'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'room', ydoc)
const ytext = ydoc.getText('prosemirror')

const state = EditorState.create({
  schema,
  plugins: [
    ySyncPlugin(ytext),
    yCursorPlugin(provider.awareness),
    yUndoPlugin(),
  ],
})

const view = new EditorView(document.getElementById('editor'), { state })
```

## Plugins

### ySyncPlugin

Synchronizes the ProseMirror document with a Y.Text type.

```ts
import { ySyncPlugin } from 'y-prosemirror'

const syncPlugin = ySyncPlugin(ytext)

// With options
const syncPlugin = ySyncPlugin(ytext, {
  // Custom mapping function
  mapping: (transaction) => transaction,
})
```

### yCursorPlugin

Renders remote cursors using the Awareness protocol.

```ts
import { yCursorPlugin } from 'y-prosemirror'

const cursorPlugin = yCursorPlugin(provider.awareness)

// With custom cursor renderer
const cursorPlugin = yCursorPlugin(provider.awareness, {
  cursorBuilder: (user) => {
    const cursor = document.createElement('span')
    cursor.className = 'remote-cursor'
    cursor.style.borderLeftColor = user.color
    cursor.setAttribute('data-name', user.name)
    return cursor
  },
  selectionBuilder: (user) => {
    const selection = document.createElement('span')
    selection.className = 'remote-selection'
    selection.style.backgroundColor = user.color + '40' // 25% opacity
    return selection
  },
})
```

### yUndoPlugin

Provides collaborative undo/redo functionality.

```ts
import { yUndoPlugin, undo, redo } from 'y-prosemirror'

const undoPlugin = yUndoPlugin()

// Use undo/redo
undo(view.state, view.dispatch)
redo(view.state, view.dispatch)
```

## Vue Component Example

```vue
<template>
  <div>
    <div class="toolbar">
      <button @click="handleUndo" :disabled="!canUndo">Undo</button>
      <button @click="handleRedo" :disabled="!canRedo">Redo</button>
    </div>
    <div ref="editorContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from 'prosemirror-schema-basic'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'

const editorContainer = ref<HTMLDivElement>()
const canUndo = ref(false)
const canRedo = ref(false)

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'room', ydoc)
const ytext = ydoc.getText('prosemirror')

let view: EditorView | null = null

onMounted(() => {
  const syncPlugin = ySyncPlugin(ytext)
  const cursorPlugin = yCursorPlugin(provider.awareness)
  const undoPlugin = yUndoPlugin()

  const state = EditorState.create({
    schema,
    plugins: [
      syncPlugin,
      cursorPlugin,
      undoPlugin,
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        ...baseKeymap,
      }),
    ],
  })

  view = new EditorView(editorContainer.value!, {
    state,
    dispatchTransaction(tr) {
      const newState = view!.state.apply(tr)
      view!.updateState(newState)
      
      // Update undo/redo state
      canUndo.value = undo(newState) // Check if undo is possible
      canRedo.value = redo(newState) // Check if redo is possible
    },
  })
})

function handleUndo() {
  if (view) {
    undo(view.state, view.dispatch)
  }
}

function handleRedo() {
  if (view) {
    redo(view.state, view.dispatch)
  }
}

onBeforeUnmount(() => {
  view?.destroy()
  provider.disconnect()
  ydoc.destroy()
})
</script>
```

## Awareness Configuration

### Setting User Info

```ts
const awareness = provider.awareness

awareness.setLocalStateField('user', {
  name: 'John Doe',
  color: '#ff0000',
  avatar: 'https://example.com/avatar.jpg',
})
```

### Rendering Remote Cursors

```ts
const cursorPlugin = yCursorPlugin(provider.awareness, {
  cursorBuilder: (user) => {
    const cursor = document.createElement('div')
    cursor.className = 'remote-cursor'
    cursor.style.cssText = `
      position: absolute;
      border-left: 2px solid ${user.color};
      height: 1.2em;
      margin-left: -1px;
      margin-right: -1px;
    `
    
    const label = document.createElement('div')
    label.className = 'cursor-label'
    label.style.cssText = `
      position: absolute;
      top: -1.4em;
      left: -2px;
      background-color: ${user.color};
      color: white;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
    `
    label.textContent = user.name
    
    cursor.appendChild(label)
    return cursor
  },
})
```

## Version History

### Creating Snapshots

```ts
import { createSnapshot } from 'y-prosemirror'

// Create a snapshot of the current state
const snapshot = createSnapshot(ydoc)

// Store snapshot
const snapshots = []
snapshots.push({
  timestamp: Date.now(),
  snapshot,
})
```

### Comparing Versions

```ts
import { createSnapshot, snapshotContainsUpdates } from 'y-prosemirror'

// Check if updates are contained in a snapshot
const containsUpdates = snapshotContainsUpdates(ydoc, snapshot)
```

## Caveats

### 1. Index Positions Don't Work

In collaborative editing, index positions can't be transformed reliably. Use relative positions instead.

```ts
import { relativePositionToAbsolutePosition, absolutePositionToRelativePosition } from 'y-prosemirror'

// Convert absolute position to relative
const relPos = absolutePositionToRelativePosition(pos, ytext)

// Convert relative position back to absolute
const absPos = relativePositionToAbsolutePosition(ytext, relPos)
```

### 2. Use Transactions

Bundle multiple changes in a transaction to reduce observer calls.

```ts
ydoc.transact(() => {
  ytext.insert(0, 'Hello ')
  ytext.insert(6, 'World')
})
```

## Complete Example

### Collaborative Editor with Toolbar

```vue
<template>
  <div class="editor-wrapper">
    <div class="toolbar">
      <button @click="handleBold" :class="{ active: isBold }">
        <strong>B</strong>
      </button>
      <button @click="handleItalic" :class="{ active: isItalic }">
        <em>I</em>
      </button>
      <button @click="handleUndo">Undo</button>
      <button @click="handleRedo">Redo</button>
      <span class="separator" />
      <span class="users">
        {{ users.length }} user(s) online
      </span>
    </div>
    <div ref="editorContainer" class="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  undo,
  redo,
} from 'y-prosemirror'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from 'prosemirror-schema-basic'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { toggleMark } from 'prosemirror-commands'

const editorContainer = ref<HTMLDivElement>()
const users = ref<any[]>([])

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'room', ydoc)
const ytext = ydoc.getText('prosemirror')

let view: EditorView | null = null

const isBold = computed(() => {
  if (!view) return false
  const { from } = view.state.selection
  return view.state.doc.marksAt(from).some(m => m.type.name === 'strong')
})

const isItalic = computed(() => {
  if (!view) return false
  const { from } = view.state.selection
  return view.state.doc.marksAt(from).some(m => m.type.name === 'em')
})

onMounted(() => {
  // Observe awareness changes
  provider.awareness.on('change', () => {
    users.value = Array.from(provider.awareness.getStates().values())
  })

  const state = EditorState.create({
    schema,
    plugins: [
      ySyncPlugin(ytext),
      yCursorPlugin(provider.awareness),
      yUndoPlugin(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-b': toggleMark(schema.marks.strong),
        'Mod-i': toggleMark(schema.marks.em),
        ...baseKeymap,
      }),
    ],
  })

  view = new EditorView(editorContainer.value!, { state })
})

function handleBold() {
  if (view) {
    toggleMark(schema.marks.strong)(view.state, view.dispatch)
  }
}

function handleItalic() {
  if (view) {
    toggleMark(schema.marks.em)(view.state, view.dispatch)
  }
}

function handleUndo() {
  if (view) {
    undo(view.state, view.dispatch)
  }
}

function handleRedo() {
  if (view) {
    redo(view.state, view.dispatch)
  }
}

onBeforeUnmount(() => {
  view?.destroy()
  provider.disconnect()
  ydoc.destroy()
})
</script>

<style scoped>
.editor-wrapper {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  background: #f5f5f5;
}

.toolbar button {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.toolbar button.active {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}

.separator {
  width: 1px;
  height: 24px;
  background: #ccc;
  margin: 0 8px;
}

.users {
  font-size: 12px;
  color: #666;
}

.editor {
  padding: 16px;
  min-height: 200px;
}

:deep(.ProseMirror) {
  outline: none;
}

:deep(.remote-cursor) {
  position: absolute;
  border-left: 2px solid;
  height: 1.2em;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
}

:deep(.cursor-label) {
  position: absolute;
  top: -1.4em;
  left: -2px;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}
</style>
```
