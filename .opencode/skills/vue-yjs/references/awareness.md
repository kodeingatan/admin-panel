# Awareness & Presence

## Overview

Awareness provides presence information about connected users. It's not persisted in the Yjs document and is automatically cleared when a user goes offline.

## Basic Usage

### Getting Awareness

```ts
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'room', ydoc)

// Access awareness from provider
const awareness = provider.awareness
```

### Setting Local State

```ts
// Set entire state
awareness.setLocalState({
  user: {
    name: 'John',
    color: '#ff0000',
  },
  cursor: {
    anchor: 0,
    head: 0,
  },
})

// Set specific field
awareness.setLocalStateField('user', {
  name: 'John',
  color: '#ff0000',
})
```

### Getting States

```ts
// Get all states
const states = awareness.getStates()
states.forEach((state, clientId) => {
  console.log(`Client ${clientId}:`, state)
})

// Get specific client state
const clientState = awareness.getStates().get(clientId)

// Get local client ID
const localClientId = awareness.clientID
```

## Observing Changes

```ts
awareness.on('change', () => {
  const states = awareness.getStates()
  
  states.forEach((state, clientId) => {
    if (state.user) {
      console.log(`User ${state.user.name} is present`)
    }
  })
})

// Get specific changes
awareness.on('change', () => {
  const prevStates = awareness.getStatesPrev()
  const currStates = awareness.getStates()
  
  // Find new users
  currStates.forEach((state, clientId) => {
    if (!prevStates.has(clientId)) {
      console.log('New user joined:', state.user?.name)
    }
  })
  
  // Find left users
  prevStates.forEach((state, clientId) => {
    if (!currStates.has(clientId)) {
      console.log('User left:', state.user?.name)
    }
  })
})
```

## User Information

### Setting User Info

```ts
awareness.setLocalStateField('user', {
  name: 'John Doe',
  color: '#ff0000',
  avatar: 'https://example.com/avatar.jpg',
  status: 'online',
})
```

### Random Colors

```ts
function getRandomColor(): string {
  const colors = [
    '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff',
    '#ff8800', '#88ff00', '#0088ff',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

awareness.setLocalStateField('user', {
  name: 'John',
  color: getRandomColor(),
})
```

## Cursor Sharing

### Basic Cursor

```ts
import { TextSelection } from 'prosemirror-state'

// Set cursor position
awareness.setLocalStateField('cursor', {
  anchor: 5,
  head: 10,
})

// Observe remote cursors
awareness.on('change', () => {
  awareness.getStates().forEach((state, clientId) => {
    if (state.cursor) {
      console.log(`Client ${clientId} cursor:`, state.cursor)
    }
  })
})
```

### With ProseMirror

```ts
import { yCursorPlugin } from 'y-prosemirror'

// Add cursor plugin
const plugins = [
  yCursorPlugin(provider.awareness),
]
```

### With Tiptap

```ts
import { Collaboration } from '@tiptap/extension-collaboration'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'

const editor = new Editor({
  extensions: [
    Collaboration.configure({
      document: ydoc,
    }),
    CollaborationCursor.configure({
      provider,
      user: {
        name: 'John',
        color: '#ff0000',
      },
    }),
  ],
})
```

## Custom Presence Data

### Mouse Position

```ts
// Track mouse position
document.addEventListener('mousemove', (e) => {
  awareness.setLocalStateField('mouse', {
    x: e.clientX,
    y: e.clientY,
  })
})

// Render remote cursors
awareness.on('change', () => {
  awareness.getStates().forEach((state, clientId) => {
    if (state.mouse) {
      renderRemoteCursor(state.mouse.x, state.mouse.y, state.user?.name)
    }
  })
})
```

### Selection State

```ts
// Track selection
awareness.setLocalStateField('selection', {
  from: 0,
  to: 10,
  type: 'text',
})

// Observe remote selections
awareness.on('change', () => {
  awareness.getStates().forEach((state, clientId) => {
    if (state.selection) {
      renderRemoteSelection(state.selection, state.user?.color)
    }
  })
})
```

## Vue Component Example

### User List Component

```vue
<template>
  <div class="user-list">
    <div
      v-for="[clientId, state] in users"
      :key="clientId"
      class="user"
      :style="{ color: state.user?.color }"
    >
      <span class="dot" :style="{ backgroundColor: state.user?.color }" />
      {{ state.user?.name || 'Anonymous' }}
      <span v-if="clientId === localClientId" class="you">(you)</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Awareness } from 'y-protocols/awareness'

const props = defineProps<{
  awareness: Awareness
}>()

const users = ref<Map<number, any>>(new Map())

const localClientId = computed(() => props.awareness.clientID)

onMounted(() => {
  const updateUsers = () => {
    users.value = new Map(props.awareness.getStates())
  }
  
  props.awareness.on('change', updateUsers)
  updateUsers()
})

onBeforeUnmount(() => {
  props.awareness.off('change', updateUsers)
})
</script>

<style scoped>
.user-list {
  display: flex;
  gap: 8px;
  padding: 8px;
}

.user {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.you {
  color: #999;
  font-size: 12px;
}
</style>
```

### Cursor Rendering Component

```vue
<template>
  <div class="remote-cursors">
    <div
      v-for="[clientId, state] in remoteCursors"
      :key="clientId"
      class="cursor"
      :style="getCursorStyle(state)"
    >
      <div class="cursor-label" :style="{ backgroundColor: state.user?.color }">
        {{ state.user?.name }}
      </div>
      <div class="cursor-caret" :style="{ borderLeftColor: state.user?.color }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Awareness } from 'y-protocols/awareness'

const props = defineProps<{
  awareness: Awareness
}>()

const remoteCursors = ref<Map<number, any>>(new Map())

onMounted(() => {
  const updateCursors = () => {
    const cursors = new Map()
    props.awareness.getStates().forEach((state, clientId) => {
      if (state.cursor && clientId !== props.awareness.clientID) {
        cursors.set(clientId, state)
      }
    })
    remoteCursors.value = cursors
  }
  
  props.awareness.on('change', updateCursors)
  updateCursors()
})

onBeforeUnmount(() => {
  props.awareness.off('change', updateCursors)
})

function getCursorStyle(state: any) {
  // Calculate position based on cursor state
  return {
    // This is a simplified example
    // Real implementation would calculate position from cursor offset
    left: `${state.cursor?.x || 0}px`,
    top: `${state.cursor?.y || 0}px`,
  }
}
</script>

<style scoped>
.cursor {
  position: absolute;
  pointer-events: none;
  z-index: 100;
}

.cursor-label {
  position: absolute;
  top: -20px;
  left: 0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  white-space: nowrap;
}

.cursor-caret {
  width: 2px;
  height: 20px;
  border-left: 2px solid;
}
</style>
```

## Awareness Events

### Event Types

| Event | Description |
|-------|-------------|
| `change` | Called when any client's state changes |
| `update` | Called with detailed change info |

### Using Events

```ts
// Basic change listener
awareness.on('change', () => {
  console.log('Awareness changed')
})

// Detailed update listener
awareness.on('update', ({ added, updated, removed }) => {
  console.log('Added clients:', added)
  console.log('Updated clients:', updated)
  console.log('Removed clients:', removed)
})
```

## Best Practices

### 1. Keep Awareness Light

Only share essential information. Don't send large payloads.

```ts
// Good
awareness.setLocalStateField('user', {
  name: 'John',
  color: '#ff0000',
})

// Bad
awareness.setLocalStateField('user', {
  name: 'John',
  color: '#ff0000',
  avatar: largeBase64String, // Don't do this!
  history: [...], // Don't do this!
})
```

### 2. Handle Cleanup

Awareness is automatically cleared when a user disconnects, but you should still clean up observers.

```ts
onBeforeUnmount(() => {
  awareness.off('change', handler)
})
```

### 3. Use Meaningful Field Names

```ts
// Good
awareness.setLocalStateField('cursor', { anchor: 5, head: 10 })
awareness.setLocalStateField('user', { name: 'John', color: '#ff0000' })

// Bad
awareness.setLocalStateField('d', { a: 5, b: 10 })
awareness.setLocalStateField('u', { n: 'John', c: '#ff0000' })
```
