# Examples

## Basic Collaborative Document

### Simple Sync

```vue
<template>
  <div>
    <input v-model="localValue" @input="syncToYjs" />
    <p>Remote value: {{ remoteValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'my-room', ydoc)
const ymap = ydoc.getMap('shared-data')

const localValue = ref('')
const remoteValue = ref('')

onMounted(() => {
  ymap.observe(event => {
    remoteValue.value = ymap.get('value') || ''
  })
  
  ymap.set('value', localValue.value)
})

function syncToYjs() {
  ydoc.transact(() => {
    ymap.set('value', localValue.value)
  })
}

onBeforeUnmount(() => {
  provider.disconnect()
  ydoc.destroy()
})
</script>
```

## Shared Todo List

```vue
<template>
  <div>
    <input v-model="newTodo" @keyup.enter="addTodo" />
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        <input
          type="checkbox"
          :checked="todo.done"
          @change="toggleTodo(index)"
        />
        <span :class="{ done: todo.done }">{{ todo.text }}</span>
        <button @click="removeTodo(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

interface Todo {
  text: string
  done: boolean
}

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'todos', ydoc)
const yarray = ydoc.getArray<Todo>('todos')

const newTodo = ref('')
const todos = ref<Todo[]>([])

onMounted(() => {
  yarray.observe(() => {
    todos.value = yarray.toArray()
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
  yarray.delete(index, 1)
  yarray.insert(index, [{ ...todo, done: !todo.done }])
}

function removeTodo(index: number) {
  yarray.delete(index, 1)
}

onBeforeUnmount(() => {
  provider.disconnect()
  ydoc.destroy()
})
</script>

<style scoped>
.done {
  text-decoration: line-through;
  color: #999;
}
</style>
```

## Collaborative Editor with Awareness

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
import { ySyncPlugin, yCursorPlugin } from 'y-prosemirror'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from 'prosemirror-schema-basic'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { toggleMark } from 'prosemirror-commands'

const editorContainer = ref<HTMLDivElement>()
const users = ref<any[]>([])

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'editor', ydoc)
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
  // Set user info
  provider.awareness.setLocalStateField('user', {
    name: `User ${Math.floor(Math.random() * 1000)}`,
    color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
  })
  
  // Observe users
  provider.awareness.on('change', () => {
    users.value = Array.from(provider.awareness.getStates().values())
  })
  
  const state = EditorState.create({
    schema,
    plugins: [
      ySyncPlugin(ytext),
      yCursorPlugin(provider.awareness),
      keymap({
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
</style>
```

## Offline-First App

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

## Collaborative Whiteboard

```vue
<template>
  <div class="whiteboard">
    <div class="toolbar">
      <button @click="setTool('pen')" :class="{ active: currentTool === 'pen' }">
        Pen
      </button>
      <button @click="setTool('eraser')" :class="{ active: currentTool === 'eraser' }">
        Eraser
      </button>
      <input v-model="strokeColor" type="color" />
      <input v-model.number="strokeWidth" type="range" min="1" max="20" />
    </div>
    <canvas
      ref="canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const canvas = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isDrawing = ref(false)
const currentTool = ref<'pen' | 'eraser'>('pen')
const strokeColor = ref('#000000')
const strokeWidth = ref(2)

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'whiteboard', ydoc)
const yarray = ydoc.getArray<any>('strokes')

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = canvas.value.offsetHeight
  }
  
  // Observe remote strokes
  yarray.observe(() => {
    redrawCanvas()
  })
})

function startDrawing(e: MouseEvent) {
  isDrawing.value = true
  const { x, y } = getCoordinates(e)
  
  ctx.value?.beginPath()
  ctx.value?.moveTo(x, y)
}

function draw(e: MouseEvent) {
  if (!isDrawing.value || !ctx.value) return
  
  const { x, y } = getCoordinates(e)
  
  ctx.value.lineTo(x, y)
  ctx.value.strokeStyle = currentTool.value === 'eraser' ? '#ffffff' : strokeColor.value
  ctx.value.lineWidth = currentTool.value === 'eraser' ? strokeWidth.value * 5 : strokeWidth.value
  ctx.value.lineCap = 'round'
  ctx.value.stroke()
}

function stopDrawing() {
  if (!isDrawing.value) return
  
  isDrawing.value = false
  
  // Store stroke in Yjs
  ydoc.transact(() => {
    yarray.push([{
      tool: currentTool.value,
      color: strokeColor.value,
      width: strokeWidth.value,
      // Simplified: in real app, store all points
    }])
  })
}

function getCoordinates(e: MouseEvent) {
  const rect = canvas.value?.getBoundingClientRect()
  return {
    x: e.clientX - (rect?.left || 0),
    y: e.clientY - (rect?.top || 0),
  }
}

function redrawCanvas() {
  if (!ctx.value || !canvas.value) return
  
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Redraw all strokes from Yjs
  yarray.forEach(stroke => {
    // Draw stroke (simplified)
  })
}

function setTool(tool: 'pen' | 'eraser') {
  currentTool.value = tool
}

onBeforeUnmount(() => {
  provider.disconnect()
  ydoc.destroy()
})
</script>

<style scoped>
.whiteboard {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
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

canvas {
  display: block;
  width: 100%;
  height: 400px;
  cursor: crosshair;
}
</style>
```
