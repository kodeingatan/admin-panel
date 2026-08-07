# Providers

## Overview

Providers connect Yjs documents to network or database backends. They handle syncing document updates between peers.

## Provider Types

| Type | Package | Purpose |
|------|---------|---------|
| Network | `y-websocket` | Client-server sync via WebSocket |
| Network | `y-webrtc` | Peer-to-peer sync via WebRTC |
| Database | `y-indexeddb` | Offline persistence in browser |
| Database | `y-leveldb` | Server-side persistence with LevelDB |
| Database | `y-redis` | Server-side persistence with Redis |

## WebSocket Provider

### Basic Usage

```ts
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider(
  'wss://localhost:1234',
  'my-room',
  ydoc
)

// Listen for connection status
provider.on('status', ({ status }: { status: string }) => {
  console.log('Status:', status) // 'connecting' | 'connected'
})

// Listen for sync events
provider.on('synced', (synced: boolean) => {
  console.log('Synced:', synced)
})

// Disconnect
provider.disconnect()

// Destroy
provider.destroy()
```

### With Awareness

```ts
const provider = new WebsocketProvider('wss://localhost:1234', 'room', ydoc)

// Access awareness
const awareness = provider.awareness

// Set local state
awareness.setLocalStateField('user', {
  name: 'John',
  color: '#ff0000',
})

// Observe changes
awareness.on('change', () => {
  const states = awareness.getStates()
  states.forEach((state, clientId) => {
    console.log(`User ${clientId}:`, state.user)
  })
})
```

### With Authentication

```ts
const provider = new WebsocketProvider(
  'wss://localhost:1234',
  'room',
  ydoc,
  {
    params: {
      token: 'my-auth-token',
    },
  }
)
```

### With Binary Protocol

```ts
const provider = new WebsocketProvider(
  'wss://localhost:1234',
  'room',
  ydoc,
  {
    binary: true, // Use binary encoding (default: true)
  }
)
```

## WebRTC Provider

### Basic Usage

```ts
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

const ydoc = new Y.Doc()
const provider = new WebrtcProvider('my-room', ydoc)

// Listen for awareness changes
provider.awareness.on('change', () => {
  console.log('Peers:', provider.awareness.getStates().size)
})

// Disconnect
provider.disconnect()

// Destroy
provider.destroy()
```

### With Signaling Server

```ts
const provider = new WebrtcProvider('my-room', ydoc, {
  signaling: ['wss://signaling.example.com'],
})
```

### With Room Password

```ts
const provider = new WebrtcProvider('my-room', ydoc, {
  password: 'my-secret-password',
})
```

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

// Destroy
persistence.destroy()
```

### With Multiple Stores

```ts
const doc1 = new Y.Doc()
const doc2 = new Y.Doc()

const persistence1 = new IndexeddbPersistence('room-1', doc1)
const persistence2 = new IndexeddbPersistence('room-2', doc2)
```

## Custom Provider

### Template

```ts
import * as Y from 'yjs'
import { Observable } from 'lib0/observable'

class CustomProvider extends Observable {
  private ydoc: Y.Doc
  private connected: boolean = false

  constructor(ydoc: Y.Doc) {
    super()
    this.ydoc = ydoc

    // Listen for local updates
    ydoc.on('update', (update: Uint8Array, origin: any) => {
      if (origin !== this) {
        // Send update to server/peers
        this.sendUpdate(update)
      }
    })
  }

  private sendUpdate(update: Uint8Array) {
    // Send update via your custom protocol
    console.log('Sending update:', update)
  }

  public receiveUpdate(update: Uint8Array) {
    // Apply update from server/peers
    Y.applyUpdate(this.ydoc, update, this)
  }

  public connect() {
    this.connected = true
    this.emit('status', [{ status: 'connected' }])
  }

  public disconnect() {
    this.connected = false
    this.emit('status', [{ status: 'disconnected' }])
  }

  public destroy() {
    this.disconnect()
  }
}
```

### Usage

```ts
const ydoc = new Y.Doc()
const provider = new CustomProvider(ydoc)

provider.on('status', ({ status }) => {
  console.log('Status:', status)
})

provider.connect()
```

## Meshing Providers

Providers can be combined for redundancy and reliability.

```ts
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()

// All three providers sync the same document
const wsProvider = new WebsocketProvider('wss://server.com', 'room', ydoc)
const rtcProvider = new WebrtcProvider('room', ydoc)
const idbProvider = new IndexeddbPersistence('room', ydoc)

// Changes sync through all channels
ymap.set('key', 'value') // Synced via WebSocket, WebRTC, and IndexedDB
```

## Server Setup

### WebSocket Server

```js
// server.js
const { WebSocketServer } = require('y-websocket')

const wss = new WebSocketServer({ port: 1234 })

wss.on('connection', (ws, req) => {
  console.log('Client connected')
  
  ws.on('close', () => {
    console.log('Client disconnected')
  })
})
```

### With y-redis

```js
// server.js
const { setupWSConnection } = require('y-websocket/bin/utils')
const WebSocketServer = require('ws').WebSocketServer

const wss = new WebSocketServer({ port: 1234 })

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req, {
    gc: true, // Enable garbage collection
  })
})
```

### With Persistence

```js
// server.js
const { setupWSConnection } = require('y-websocket/bin/utils')
const { Redis } = require('ioredis')

const redis = new Redis()
const wss = new WebSocketServer({ port: 1234 })

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req, {
    gc: true,
    persist: true, // Persist to Redis
  })
})
```

## Connection Events

### Status Events

```ts
provider.on('status', ({ status }: { status: string }) => {
  switch (status) {
    case 'connecting':
      console.log('Connecting to server...')
      break
    case 'connected':
      console.log('Connected to server')
      break
    case 'disconnected':
      console.log('Disconnected from server')
      break
  }
})
```

### Sync Events

```ts
provider.on('synced', (synced: boolean) => {
  if (synced) {
    console.log('Document fully synced')
  } else {
    console.log('Syncing document...')
  }
})
```

## Complete Example

### Collaborative Editor with Multiple Providers

```vue
<template>
  <div>
    <div class="status" :class="connectionStatus">
      {{ connectionStatus }}
    </div>
    <div ref="editorContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'

const editorContainer = ref<HTMLDivElement>()
const connectionStatus = ref<'connecting' | 'connected' | 'disconnected'>('connecting')

const ydoc = new Y.Doc()
let wsProvider: WebsocketProvider | null = null
let rtcProvider: WebrtcProvider | null = null
let idbPersistence: IndexeddbPersistence | null = null

onMounted(() => {
  // WebSocket provider
  wsProvider = new WebsocketProvider(
    'wss://localhost:1234',
    'collaborative-editor',
    ydoc
  )
  
  wsProvider.on('status', ({ status }) => {
    connectionStatus.value = status as any
  })
  
  // WebRTC provider for P2P fallback
  rtcProvider = new WebrtcProvider(
    'collaborative-editor',
    ydoc
  )
  
  // IndexedDB persistence
  idbPersistence = new IndexeddbPersistence(
    'collaborative-editor',
    ydoc
  )
  
  idbPersistence.once('synced', () => {
    console.log('Loaded from IndexedDB')
  })
})

onBeforeUnmount(() => {
  wsProvider?.disconnect()
  rtcProvider?.disconnect()
  idbPersistence?.destroy()
  ydoc.destroy()
})
</script>

<style scoped>
.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
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
</style>
```
