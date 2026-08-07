# Vue 3 Integration

## useYjs Composable

### Basic Usage

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

export function useYjs(options: {
  room: string
  serverUrl?: string
  enableOffline?: boolean
}) {
  const ydoc = ref<Y.Doc>(new Y.Doc())
  const provider = ref<WebsocketProvider | null>(null)
  const persistence = ref<IndexeddbPersistence | null>(null)
  const synced = ref(false)
  const connected = ref(false)

  onMounted(() => {
    // Create WebSocket provider
    if (options.serverUrl) {
      provider.value = new WebsocketProvider(
        options.serverUrl,
        options.room,
        ydoc.value
      )

      provider.value.on('synced', (s: boolean) => {
        synced.value = s
      })

      provider.value.on('status', ({ status }: { status: string }) => {
        connected.value = status === 'connected'
      })
    }

    // Enable offline persistence
    if (options.enableOffline) {
      persistence.value = new IndexeddbPersistence(
        options.room,
        ydoc.value
      )

      persistence.value.once('synced', () => {
        synced.value = true
      })
    }
  })

  onBeforeUnmount(() => {
    provider.value?.disconnect()
    persistence.value?.destroy()
    ydoc.value.destroy()
  })

  return {
    ydoc,
    provider,
    persistence,
    synced,
    connected,
  }
}
```

### Using in Component

```vue
<template>
  <div>
    <div class="status">
      <span v-if="connected" class="online">Online</span>
      <span v-else class="offline">Offline</span>
      <span v-if="synced">Synced</span>
    </div>
    <div ref="editorContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useYjs } from './composables/useYjs'
import * as Y from 'yjs'
import { EditorView } from 'prosemirror-view'

const editorContainer = ref<HTMLDivElement>()

const { ydoc, provider, connected, synced } = useYjs({
  room: 'my-room',
  serverUrl: 'wss://localhost:1234',
  enableOffline: true,
})

let view: EditorView | null = null

onMounted(() => {
  // Initialize editor with ydoc
  // ...
})

onBeforeUnmount(() => {
  view?.destroy()
})
</script>
```

## Two-Way Binding Composable

### useYjsMap

```ts
import { ref, watch, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'

export function useYjsMap<T extends Record<string, any>>(
  ydoc: Y.Doc,
  name: string
) {
  const ymap = ydoc.getMap<T>(name)
  const data = ref<T>(ymap.toJSON() as T)

  // Observe changes from Yjs
  ymap.observe(() => {
    data.value = ymap.toJSON() as T
  })

  // Watch local changes and sync to Yjs
  watch(
    data,
    (newData) => {
      ydoc.transact(() => {
        Object.keys(newData).forEach((key) => {
          if (ymap.get(key) !== newData[key]) {
            ymap.set(key, newData[key])
          }
        })
      })
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    ymap.unobserve()
  })

  return data
}
```

### useYjsArray

```ts
import { ref, watch, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'

export function useYjsArray<T>(ydoc: Y.Doc, name: string) {
  const yarray = ydoc.getArray<T>(name)
  const items = ref<T[]>(yarray.toArray())

  // Observe changes from Yjs
  yarray.observe(() => {
    items.value = yarray.toArray()
  })

  // Watch local changes and sync to Yjs
  watch(
    items,
    (newItems) => {
      ydoc.transact(() => {
        yarray.delete(0, yarray.length)
        yarray.insert(0, newItems)
      })
    },
    { deep: true }
  )

  function insert(index: number, ...items: T[]) {
    yarray.insert(index, items)
  }

  function delete(index: number, count: number = 1) {
    yarray.delete(index, count)
  }

  function push(...items: T[]) {
    yarray.push(items)
  }

  onBeforeUnmount(() => {
    yarray.unobserve()
  })

  return {
    items,
    insert,
    delete,
    push,
  }
}
```

### useYjsText

```ts
import { ref, watch, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'

export function useYjsText(ydoc: Y.Doc, name: string) {
  const ytext = ydoc.getText(name)
  const text = ref(ytext.toString())

  // Observe changes from Yjs
  ytext.observe(() => {
    text.value = ytext.toString()
  })

  // Watch local changes and sync to Yjs
  watch(text, (newText) => {
    ydoc.transact(() => {
      ytext.delete(0, ytext.length)
      ytext.insert(0, newText)
    })
  })

  function insert(index: number, content: string) {
    ytext.insert(index, content)
  }

  function delete(index: number, length: number) {
    ytext.delete(index, length)
  }

  function format(index: number, length: number, attributes: any) {
    ytext.format(index, length, attributes)
  }

  onBeforeUnmount(() => {
    ytext.unobserve()
  })

  return {
    text,
    insert,
    delete,
    format,
  }
}
```

## Shared State Example

### useSharedCounter

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'

export function useSharedCounter(ydoc: Y.Doc, name: string = 'counter') {
  const ymap = ydoc.getMap<number>(name)
  const count = ref(ymap.get('count') || 0)

  onMounted(() => {
    ymap.observe(() => {
      count.value = ymap.get('count') || 0
    })
  })

  function increment() {
    ydoc.transact(() => {
      ymap.set('count', (ymap.get('count') || 0) + 1)
    })
  }

  function decrement() {
    ydoc.transact(() => {
      ymap.set('count', (ymap.get('count') || 0) - 1)
    })
  }

  function reset() {
    ydoc.transact(() => {
      ymap.set('count', 0)
    })
  }

  onBeforeUnmount(() => {
    ymap.unobserve()
  })

  return {
    count,
    increment,
    decrement,
    reset,
  }
}
```

### Usage

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup lang="ts">
import { useYjs } from './composables/useYjs'
import { useSharedCounter } from './composables/useSharedCounter'

const { ydoc } = useYjs({
  room: 'counter-room',
  serverUrl: 'wss://localhost:1234',
})

const { count, increment, decrement, reset } = useSharedCounter(ydoc)
</script>
```

## Provider Integration

### useYjsProvider

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

export function useYjsProvider(options: {
  room: string
  serverUrl: string
  enableOffline?: boolean
}) {
  const ydoc = ref<Y.Doc>(new Y.Doc())
  const provider = ref<WebsocketProvider | null>(null)
  const persistence = ref<IndexeddbPersistence | null>(null)
  const status = ref<'connecting' | 'connected' | 'disconnected'>('connecting')
  const synced = ref(false)

  onMounted(() => {
    // WebSocket provider
    provider.value = new WebsocketProvider(
      options.serverUrl,
      options.room,
      ydoc.value
    )

    provider.value.on('status', ({ status: s }) => {
      status.value = s as any
    })

    provider.value.on('synced', (s: boolean) => {
      synced.value = s
    })

    // Offline persistence
    if (options.enableOffline) {
      persistence.value = new IndexeddbPersistence(
        options.room,
        ydoc.value
      )
    }
  })

  onBeforeUnmount(() => {
    provider.value?.disconnect()
    persistence.value?.destroy()
    ydoc.value.destroy()
  })

  return {
    ydoc,
    provider,
    persistence,
    status,
    synced,
  }
}
```

## Awareness Integration

### useYjsAwareness

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { WebsocketProvider } from 'y-websocket'

export function useYjsAwareness(provider: WebsocketProvider) {
  const awareness = provider.awareness
  const localState = ref(awareness.getLocalState())
  const remoteStates = ref<Map<number, any>>(new Map())

  onMounted(() => {
    awareness.on('change', () => {
      localState.value = awareness.getLocalState()
      
      const states = new Map(awareness.getStates())
      states.delete(awareness.clientID)
      remoteStates.value = states
    })
  })

  function setLocalState(state: any) {
    awareness.setLocalState(state)
  }

  function setLocalStateField(field: string, value: any) {
    awareness.setLocalStateField(field, value)
  }

  onBeforeUnmount(() => {
    awareness.off('change', () => {})
  })

  return {
    localState,
    remoteStates,
    setLocalState,
    setLocalStateField,
  }
}
```

## Complete Example

### Collaborative Todo App

```vue
<template>
  <div class="app">
    <div class="header">
      <h1>Collaborative Todo</h1>
      <div class="status">
        <span :class="status">{{ status }}</span>
        <span v-if="synced" class="synced">Synced</span>
      </div>
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
    
    <div class="users">
      <span v-for="[clientId, state] in users" :key="clientId">
        {{ state.user?.name || 'Anonymous' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useYjsProvider } from './composables/useYjsProvider'
import { useYjsAwareness } from './composables/useYjsAwareness'
import { useYjsArray } from './composables/useYjsArray'

interface Todo {
  text: string
  done: boolean
}

const { ydoc, provider, status, synced } = useYjsProvider({
  room: 'todo-room',
  serverUrl: 'wss://localhost:1234',
  enableOffline: true,
})

const { localState, setLocalStateField } = useYjsAwareness(provider!)
const { items: todos, insert, delete: remove, push } = useYjsArray<Todo>(ydoc, 'todos')

const newTodo = ref('')
const users = computed(() => {
  const states = new Map(provider?.awareness.getStates())
  states.delete(provider?.awareness.clientID || 0)
  return states
})

// Set local user info
onMounted(() => {
  setLocalStateField('user', {
    name: `User ${Math.floor(Math.random() * 1000)}`,
    color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
  })
})

function addTodo() {
  if (!newTodo.value.trim()) return
  push({ text: newTodo.value, done: false })
  newTodo.value = ''
}

function toggleTodo(index: number) {
  const todo = todos.value[index]
  remove(index)
  insert(index, { ...todo, done: !todo.done })
}

function removeTodo(index: number) {
  remove(index)
}
</script>

<style scoped>
.app {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.connected {
  background: #d4edda;
  color: #155724;
}

.status.disconnected {
  background: #f8d7da;
  color: #721c24;
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

.users {
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
}
</style>
```
