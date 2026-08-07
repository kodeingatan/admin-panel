# Document Updates

## Overview

Changes in Yjs are encoded into binary document updates. These updates are commutative, associative, and idempotent, meaning they can be applied in any order and multiple times.

## Update API

### Y.applyUpdate

Apply a document update to a Y.Doc.

```ts
import * as Y from 'yjs'

const ydoc = new Y.Doc()

// Apply update from another document
ydoc.on('update', (update: Uint8Array) => {
  Y.applyUpdate(ydoc, update)
})

// Apply update with origin
ydoc.on('update', (update: Uint8Array, origin: any) => {
  Y.applyUpdate(ydoc, update, origin)
})
```

### Y.encodeStateAsUpdate

Encode the document state as a single update message.

```ts
// Get full state
const state = Y.encodeStateAsUpdate(ydoc)

// Get only differences from a target state vector
const targetStateVector = Y.encodeStateVector(remoteDoc)
const diff = Y.encodeStateAsUpdate(ydoc, targetStateVector)
```

### Y.encodeStateVector

Compute the state vector describing the local document state.

```ts
// Get state vector
const stateVector = Y.encodeStateVector(ydoc)

// Use state vector to compute diff
const diff = Y.encodeStateAsUpdate(ydoc, stateVector)
```

## Syncing Clients

### Complete Sync

Exchange full document states:

```ts
const doc1 = new Y.Doc()
const doc2 = new Y.Doc()

// Get states
const state1 = Y.encodeStateAsUpdate(doc1)
const state2 = Y.encodeStateAsUpdate(doc2)

// Apply to each other
Y.applyUpdate(doc1, state2)
Y.applyUpdate(doc2, state1)
```

### Differential Sync

Exchange only differences using state vectors:

```ts
const doc1 = new Y.Doc()
const doc2 = new Y.Doc()

// Get state vectors
const sv1 = Y.encodeStateVector(doc1)
const sv2 = Y.encodeStateVector(doc2)

// Compute diffs
const diff1 = Y.encodeStateAsUpdate(doc1, sv2)
const diff2 = Y.encodeStateAsUpdate(doc2, sv1)

// Apply diffs
Y.applyUpdate(doc1, diff2)
Y.applyUpdate(doc2, diff1)
```

### Sync Without Loading Doc

Sync using only binary updates:

```ts
// Encode states as binary
let state1 = Y.encodeStateAsUpdate(doc1)
let state2 = Y.encodeStateAsUpdate(doc2)

// Destroy docs
doc1.destroy()
doc2.destroy()

// Compute state vectors from updates
const sv1 = Y.encodeStateVectorFromUpdate(state1)
const sv2 = Y.encodeStateVectorFromUpdate(state2)

// Compute diffs
const diff1 = Y.diffUpdate(state1, sv2)
const diff2 = Y.diffUpdate(state2, sv1)

// Merge updates
state1 = Y.mergeUpdates([state1, diff2])
state2 = Y.mergeUpdates([state2, diff1])
```

## Event Handling

### Update Events

```ts
ydoc.on('update', (update: Uint8Array, origin: any) => {
  // Send update to server/peers
  sendUpdate(update)
  
  // Or store in database
  saveUpdate(update)
})

// Transaction events
ydoc.on('beforeTransaction', () => {
  console.log('Transaction starting')
})

ydoc.on('afterTransaction', () => {
  console.log('Transaction complete')
})
```

### Transaction Origin

Use transaction origin to filter updates:

```ts
// Local changes
ydoc.transact(() => {
  ymap.set('key', 'value')
}, 'local')

// Filter by origin
ydoc.on('update', (update, origin) => {
  if (origin === 'local') {
    // Don't send back to server
    return
  }
  // Apply to local state
  Y.applyUpdate(ydoc, update)
})
```

## Merging Updates

### Y.mergeUpdates

Merge multiple updates into one:

```ts
const updates = [update1, update2, update3]
const merged = Y.mergeUpdates(updates)

// Merged update is smaller than sum of individual updates
console.log(merged.length) // Smaller than update1 + update2 + update3
```

### Y.diffUpdate

Compute differences between updates:

```ts
const fullUpdate = Y.encodeStateAsUpdate(ydoc)
const stateVector = Y.encodeStateVector(remoteDoc)

// Get only the missing parts
const diff = Y.diffUpdate(fullUpdate, stateVector)
```

## Vue Example

### Sync Manager

```vue
<template>
  <div>
    <div class="status">
      <span :class="status">{{ status }}</span>
      <span v-if="synced">Synced</span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const props = defineProps<{
  room: string
  serverUrl: string
}>()

const status = ref<'connecting' | 'connected' | 'disconnected'>('connecting')
const synced = ref(false)

const ydoc = new Y.Doc()
const provider = new WebsocketProvider(
  props.serverUrl,
  props.room,
  ydoc
)

onMounted(() => {
  provider.on('status', ({ status: s }) => {
    status.value = s as any
  })
  
  provider.on('synced', (s) => {
    synced.value = s
  })
  
  // Listen for updates
  ydoc.on('update', (update: Uint8Array) => {
    console.log('Document updated, size:', update.length)
  })
})

onBeforeUnmount(() => {
  provider.disconnect()
  ydoc.destroy()
})

// Expose ydoc to children
defineExpose({
  ydoc,
  provider,
})
</script>
```

## Base64 Encoding

### Encoding Updates

```ts
import { fromUint8Array, toUint8Array } from 'js-base64'

// Encode update to Base64
const update = Y.encodeStateAsUpdate(ydoc)
const base64 = fromUint8Array(update)

// Decode Base64 to update
const binary = toUint8Array(base64)
Y.applyUpdate(ydoc, binary)
```

### Storing in Database

```ts
// Store in database
async function saveDocument(ydoc: Y.Doc) {
  const state = Y.encodeStateAsUpdate(ydoc)
  const base64 = fromUint8Array(state)
  
  await db.documents.update(id, { state: base64 })
}

// Load from database
async function loadDocument(ydoc: Y.Doc, id: string) {
  const doc = await db.documents.findById(id)
  
  if (doc?.state) {
    const binary = toUint8Array(doc.state)
    Y.applyUpdate(ydoc, binary)
  }
}
```

## Best Practices

### 1. Use Transactions

Bundle multiple changes in a transaction:

```ts
ydoc.transact(() => {
  ymap.set('a', 1)
  ymap.set('b', 2)
  yarray.insert(0, ['item'])
})
```

### 2. Filter by Origin

Prevent update loops by filtering by origin:

```ts
ydoc.on('update', (update, origin) => {
  if (origin === 'remote') {
    return // Don't re-apply remote updates
  }
  // Forward to other peers
  sendToPeers(update)
})
```

### 3. Merge Updates

Merge multiple updates for efficiency:

```ts
const updates = []
ydoc.on('update', (update) => {
  updates.push(update)
})

// Periodically merge and send
setInterval(() => {
  if (updates.length > 0) {
    const merged = Y.mergeUpdates(updates)
    sendToPeers(merged)
    updates.length = 0
  }
}, 1000)
```

### 4. Use State Vectors for Efficiency

Only send missing updates:

```ts
function syncWithPeer(peerStateVector: Uint8Array) {
  const diff = Y.encodeStateAsUpdate(ydoc, peerStateVector)
  sendToPeer(diff)
}
```
