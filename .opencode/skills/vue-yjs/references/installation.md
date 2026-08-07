# Installation & Setup

## Requirements

- Node.js 18+
- Vue 3.2+
- npm or yarn

## Install Dependencies

```bash
npm install yjs y-websocket y-indexeddb
```

### Package Breakdown

| Package | Purpose |
|---------|---------|
| `yjs` | Core CRDT library |
| `y-websocket` | WebSocket provider for client-server sync |
| `y-indexeddb` | Offline persistence with IndexedDB |

### Optional Packages

```bash
# For peer-to-peer sync
npm install y-webrtc

# For ProseMirror editor binding
npm install y-prosemirror

# For Tiptap editor binding
npm install y-tiptap

# For Quill editor binding
npm install y-quill
```

## Project Setup

### Using Vite

```bash
npm create vite@latest my-collab-app -- --template vue-ts
cd my-collab-app
npm install yjs y-websocket y-indexeddb
```

### Using with Existing Vue Project

```bash
npm install yjs y-websocket y-indexeddb
```

## Basic Setup

```ts
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

// Create Yjs document
const ydoc = new Y.Doc()

// WebSocket provider for real-time sync
const provider = new WebsocketProvider(
  'wss://localhost:1234',
  'my-room',
  ydoc
)

// IndexedDB persistence for offline support
const persistence = new IndexeddbPersistence('my-room', ydoc)

// Listen for sync events
persistence.once('synced', () => {
  console.log('Loaded from IndexedDB')
})

provider.on('synced', (synced: boolean) => {
  console.log('WebSocket synced:', synced)
})
```

## Vue Component Setup

```vue
<template>
  <div ref="editorContainer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const editorContainer = ref<HTMLDivElement>()
const ydoc = new Y.Doc()
let provider: WebsocketProvider | null = null
let persistence: IndexeddbPersistence | null = null

onMounted(() => {
  // Connect to WebSocket server
  provider = new WebsocketProvider(
    'wss://localhost:1234',
    'my-room',
    ydoc
  )
  
  // Enable offline persistence
  persistence = new IndexeddbPersistence('my-room', ydoc)
  
  // Listen for connection status
  provider.on('status', ({ status }: { status: string }) => {
    console.log('Connection status:', status)
  })
})

onBeforeUnmount(() => {
  provider?.disconnect()
  persistence?.destroy()
  ydoc.destroy()
})
</script>
```

## Server Setup

### WebSocket Server

```bash
npm install y-websocket
```

```js
// server.js
const { WebSocketServer } = require('y-websocket')
const wss = new WebSocketServer({ port: 1234 })

wss.on('connection', (ws, req) => {
  console.log('Client connected')
})
```

### Using with y-redis

```bash
npm install y-redis
```

```js
const { setupWSConnection } = require('y-websocket/bin/utils')
const { Redis } = require('ioredis')

const redis = new Redis()
const wss = new WebSocketServer({ port: 1234 })

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req, { gc: true })
})
```

## Verify Installation

Run dev server:

```bash
npm run dev
```

Open multiple browser tabs to test collaboration.

## TypeScript Support

Yjs includes TypeScript definitions. No additional `@types` packages needed.

```ts
import * as Y from 'yjs'

const ydoc: Y.Doc = new Y.Doc()
const ymap: Y.Map<string> = ydoc.getMap('my-map')
const yarray: Y.Array<string> = ydoc.getArray('my-array')
const ytext: Y.Text = ydoc.getText('my-text')
```
