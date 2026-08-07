# Skill: vue-yjs

# Yjs Vue Component Library Skill

Build collaborative Vue 3 components using Yjs CRDT, documented with Storybook.

## When to Use

- Building collaborative editing features
- Syncing state across multiple users in real-time
- Implementing offline-first applications
- Adding awareness/presence features (cursors, user presence)
- Integrating Yjs with ProseMirror or Tiptap editors
- Documenting collaborative components in Storybook

## Quick Start

### Installation

```bash
npm install yjs y-websocket y-indexeddb
```

### Basic Collaborative Document

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
  
  // Sync local changes to Yjs
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

## References

| Topic | File |
|-------|------|
| Installation & Setup | `references/installation.md` |
| Shared Types | `references/shared-types.md` |
| Providers | `references/providers.md` |
| Awareness & Presence | `references/awareness.md` |
| ProseMirror Integration | `references/prosemirror-integration.md` |
| Vue 3 Integration | `references/vue3-integration.md` |
| Offline Support | `references/offline-support.md` |
| Document Updates | `references/document-updates.md` |
| Storybook Patterns | `references/storybook-patterns.md` |
| Examples | `references/examples.md` |

## Architecture

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Y.Doc** | The root container for all shared data |
| **Shared Types** | Y.Map, Y.Array, Y.Text, Y.XmlFragment, Y.XmlElement, Y.XmlText |
| **Providers** | Network adapters (WebSocket, WebRTC) or database adapters (IndexedDB) |
| **Awareness** | Presence information (cursors, user info) |
| **Updates** | Binary-encoded changes that sync across peers |

### Data Flow

```
Local Change → Y.Doc → Transaction → Update → Provider → Network → Remote Y.Doc
```

### Ecosystem

| Package | Purpose |
|---------|---------|
| `yjs` | Core CRDT library |
| `y-websocket` | WebSocket provider |
| `y-webrtc` | Peer-to-peer provider |
| `y-indexeddb` | Offline persistence |
| `y-prosemirror` | ProseMirror editor binding |
| `y-tiptap` | Tiptap editor binding |
| `y-quill` | Quill editor binding |

## Core Concepts

### Shared Types

```ts
import * as Y from 'yjs'

const ydoc = new Y.Doc()

// Map (like JavaScript Map)
const ymap = ydoc.getMap('my-map')
ymap.set('key', 'value')

// Array (like JavaScript Array)
const yarray = ydoc.getArray('my-array')
yarray.insert(0, ['item1', 'item2'])

// Text (rich text with formatting)
const ytext = ydoc.getText('my-text')
ytext.insert(0, 'Hello')
ytext.format(0, 5, { bold: true })

// XML Fragment
const yxml = ydoc.getXmlFragment('my-xml')
```

### Providers

```ts
import { WebsocketProvider } from 'y-websocket'
import { WebrtcProvider } from 'y-webrtc'

// WebSocket (client-server)
const wsProvider = new WebsocketProvider('wss://server.com', 'room', ydoc)

// WebRTC (peer-to-peer)
const rtcProvider = new WebrtcProvider('room', ydoc)
```

### Awareness

```ts
const awareness = wsProvider.awareness

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

## Vue 3 Patterns

### useYjs Composable

```ts
import { useYjs } from './composables/useYjs'

const { ydoc, provider, awareness } = useYjs({
  room: 'my-room',
  serverUrl: 'wss://localhost:1234',
})
```

### Two-Way Binding

```vue
<template>
  <YjsEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import YjsEditor from './YjsEditor.vue'

const content = ref('')
</script>
```

## Storybook Integration

### Story Pattern

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import YjsEditor from './YjsEditor.vue'

const meta: Meta<typeof YjsEditor> = {
  title: 'Collaborative/YjsEditor',
  component: YjsEditor,
  tags: ['autodocs'],
  argTypes: {
    room: { control: 'text' },
    serverUrl: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
  },
}
```

## Best Practices

1. **Always destroy ydoc on unmount** - Call `ydoc.destroy()` in `onBeforeUnmount`
2. **Use transactions for batch updates** - Bundle changes in `ydoc.transact()`
3. **Handle provider connection states** - Listen to 'synced', 'status' events
4. **Use IndexedDB for offline support** - Add `y-indexeddb` persistence
5. **Document in Storybook** - Every component needs stories
6. **Type everything** - Use TypeScript for shared types
7. **Test with multiple tabs** - Verify sync works correctly
8. **Be aware of caveats** - Don't mutate JSON objects from shared types

## Dependencies

**Required:**
- `yjs` - Core CRDT library

**Optional (per feature):**
- `y-websocket` - WebSocket provider
- `y-webrtc` - WebRTC provider
- `y-indexeddb` - Offline persistence
- `y-prosemirror` - ProseMirror binding
- `y-tiptap` - Tiptap binding
- `y-quill` - Quill binding

## Integration

**With vue-prosemirror:** Use `y-prosemirror` for collaborative editing
**With vue-tiptap:** Use `y-tiptap` for collaborative editing
**With ui-styling:** Apply Tailwind or component library styles
**With design-system:** Use design tokens for user presence colors

**Skill Dependencies:** vue-prosemirror or vue-tiptap (optional)
**Primary Agents:** frontend-developer, ui-developer

Base directory for this skill: /home/afdal/Laboratorium/PROJECT/componenet-stories/.opencode/skills/vue-yjs
Relative paths in this skill (e.g. scripts/, reference/) are relative to this base directory.
