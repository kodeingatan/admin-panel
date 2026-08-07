# Offline Support

## Overview

Yjs supports offline editing through database providers that persist document updates locally. The most common provider is `y-indexeddb` for browser applications.

## IndexedDB Provider

### Basic Usage

```ts
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()
const persistence = new IndexeddbPersistence('my-room', ydoc)

// Listen for sync events
persistence.once('synced', () => {
  console.log('Loaded from IndexedDB')
})

// Make changes (persisted automatically)
const ymap = ydoc.getMap('my-map')
ymap.set('key', 'value')

// Destroy when done
persistence.destroy()
```

### With WebSocket Provider

```ts
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()

// IndexedDB for offline persistence
const idbPersistence = new IndexeddbPersistence('my-room', ydoc)

// WebSocket for real-time sync
const wsProvider = new WebsocketProvider(
  'wss://localhost:1234',
  'my-room',
  ydoc
)

// Both providers sync the same document
// Changes are persisted locally and synced when online
```

### Handling Sync Events

```ts
const idbPersistence = new IndexeddbPersistence('my-room', ydoc)

idbPersistence.once('synced', () => {
  console.log('Initial load from IndexedDB complete')
  // Now safe to render UI
})

// Multiple persistence instances
const idb1 = new IndexeddbPersistence('room-1', doc1)
const idb2 = new IndexeddbPersistence('room-2', doc2)

Promise.all([
  new Promise(resolve => idb1.once('synced', resolve)),
  new Promise(resolve => idb2.once('synced', resolve)),
]).then(() => {
  console.log('All rooms loaded')
})
```

## Vue Component Example

### Offline-First Editor

```vue
<template>
  <div>
    <div class="status">
      <span :class="connectionStatus">{{ connectionStatus }}</span>
      <span v-if="synced" class="synced">Data loaded</span>
    </div>
    <div ref="editorContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const editorContainer = ref<HTMLDivElement>()
const connectionStatus = ref<'connecting' | 'connected' | 'disconnected'>('connecting')
const synced = ref(false)

const ydoc = new Y.Doc()
let wsProvider: WebsocketProvider | null = null
let idbPersistence: IndexeddbPersistence | null = null

onMounted(() => {
  // IndexedDB for offline support
  idbPersistence = new IndexeddbPersistence('editor-room', ydoc)
  
  idbPersistence.once('synced', () => {
    synced.value = true
    console.log('Loaded from IndexedDB')
  })
  
  // WebSocket for real-time sync
  wsProvider = new WebsocketProvider(
    'wss://localhost:1234',
    'editor-room',
    ydoc
  )
  
  wsProvider.on('status', ({ status }) => {
    connectionStatus.value = status as any
  })
  
  wsProvider.on('synced', (s) => {
    console.log('WebSocket synced:', s)
  })
})

onBeforeUnmount(() => {
  wsProvider?.disconnect()
  idbPersistence?.destroy()
  ydoc.destroy()
})
</script>

<style scoped>
.status {
  display: flex;
  gap: 8px;
  padding: 8px;
  margin-bottom: 8px;
}

.status span {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status .connecting {
  background: #fff3cd;
  color: #856404;
}

.status .connected {
  background: #d4edda;
  color: #155724;
}

.status .disconnected {
  background: #f8d7da;
  color: #721c24;
}

.status .synced {
  background: #d1ecf1;
  color: #0c5460;
}
</style>
```

## Service Worker

### Basic Service Worker

```js
// sw.js
const CACHE_NAME = 'my-app-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    })
  )
})
```

### Register Service Worker

```ts
// main.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered:', registration)
    }).catch((error) => {
      console.log('SW registration failed:', error)
    })
  })
}
```

## Complete Example

### Offline-First Todo App

```vue
<template>
  <div class="app">
    <div class="status-bar">
      <span :class="['status', connectionStatus]">{{ connectionStatus }}</span>
      <span v-if="synced" class="synced-badge">Offline Ready</span>
    </div>
    
    <div class="input-group">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a todo..."
      />
      <button @click="addTodo">Add</button>
    </div>
    
    <ul class="todo-list">
      <li
        v-for="(todo, index) in todos"
        :key="index"
        :class="{ done: todo.done }"
      >
        <input
          type="checkbox"
          :checked="todo.done"
          @change="toggleTodo(index)"
        />
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(index)">×</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

interface Todo {
  text: string
  done: boolean
}

const newTodo = ref('')
const todos = ref<Todo[]>([])
const connectionStatus = ref<'connecting' | 'connected' | 'disconnected'>('connecting')
const synced = ref(false)

const ydoc = new Y.Doc()
const yarray = ydoc.getArray<Todo>('todos')

let wsProvider: WebsocketProvider | null = null
let idbPersistence: IndexeddbPersistence | null = null

onMounted(() => {
  // IndexedDB for offline support
  idbPersistence = new IndexeddbPersistence('todos', ydoc)
  
  idbPersistence.once('synced', () => {
    synced.value = true
    todos.value = yarray.toArray()
  })
  
  // Observe changes
  yarray.observe(() => {
    todos.value = yarray.toArray()
  })
  
  // WebSocket for real-time sync
  wsProvider = new WebsocketProvider(
    'wss://localhost:1234',
    'todos',
    ydoc
  )
  
  wsProvider.on('status', ({ status }) => {
    connectionStatus.value = status as any
  })
})

function addTodo() {
  if (!newTodo.value.trim()) return
  ydoc.transact(() => {
    yarray.push([{ text: newTodo.value, done: false }])
  })
  newTodo.value = ''
}

function toggleTodo(index: number) {
  const todo = yarray.get(index)
  ydoc.transact(() => {
    yarray.delete(index, 1)
    yarray.insert(index, [{ ...todo, done: !todo.done }])
  })
}

function removeTodo(index: number) {
  ydoc.transact(() => {
    yarray.delete(index, 1)
  })
}

onBeforeUnmount(() => {
  wsProvider?.disconnect()
  idbPersistence?.destroy()
  ydoc.destroy()
})
</script>

<style scoped>
.app {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.status-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.connecting {
  background: #fff3cd;
  color: #856404;
}

.status.connected {
  background: #d4edda;
  color: #155724;
}

.status.disconnected {
  background: #f8d7da;
  color: #721c24;
}

.synced-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #d1ecf1;
  color: #0c5460;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.input-group input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-group button {
  padding: 8px 16px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.todo-list li.done span {
  text-decoration: line-through;
  color: #999;
}

.todo-list button {
  margin-left: auto;
  padding: 4px 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

## Best Practices

### 1. Always Enable Offline Persistence

For production apps, always include IndexedDB persistence:

```ts
const idbPersistence = new IndexeddbPersistence(room, ydoc)
```

### 2. Handle Sync Events

Wait for IndexedDB to sync before rendering UI:

```ts
idbPersistence.once('synced', () => {
  // Now safe to render
})
```

### 3. Use Multiple Providers

Combine WebSocket and IndexedDB for best reliability:

```ts
const wsProvider = new WebsocketProvider(serverUrl, room, ydoc)
const idbPersistence = new IndexeddbPersistence(room, ydoc)
```

### 4. Clean Up on Unmount

Always destroy providers and persistence:

```ts
onBeforeUnmount(() => {
  wsProvider?.disconnect()
  idbPersistence?.destroy()
  ydoc.destroy()
})
```
