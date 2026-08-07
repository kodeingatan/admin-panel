# Installation & Setup

## Requirements

- Node.js 18+
- Vue 3.2+
- npm or yarn

## Install Dependencies

```bash
npm install prosemirror-model prosemirror-state prosemirror-view prosemirror-transform prosemirror-commands prosemirror-history prosemirror-keymap prosemirror-inputrules prosemirror-schema-basic prosemirror-schema-list prosemirror-gapcursor
```

### Package Breakdown

| Package | Purpose |
|---------|---------|
| `prosemirror-model` | Document model (nodes, marks, schema) |
| `prosemirror-state` | Editor state, selection, plugins |
| `prosemirror-view` | DOM rendering, user interaction |
| `prosemirror-transform` | Document modifications |
| `prosemirror-commands` | Editing commands |
| `prosemirror-history` | Undo/redo |
| `prosemirror-keymap` | Keyboard bindings |
| `prosemirror-inputrules` | Input macros |
| `prosemirror-schema-basic` | Basic schema |
| `prosemirror-schema-list` | List schema |
| `prosemirror-gapcursor` | Gap cursor support |

## Project Setup

### Using Vite

```bash
npm create vite@latest my-editor-app -- --template vue-ts
cd my-editor-app
npm install prosemirror-model prosemirror-state prosemirror-view prosemirror-transform prosemirror-commands prosemirror-history prosemirror-keymap prosemirror-inputrules prosemirror-schema-basic prosemirror-schema-list prosemirror-gapcursor
```

### Using with Existing Vue Project

```bash
npm install prosemirror-model prosemirror-state prosemirror-view prosemirror-transform prosemirror-commands prosemirror-history prosemirror-keymap prosemirror-inputrules prosemirror-schema-basic prosemirror-schema-list prosemirror-gapcursor
```

## Minimal Editor Component

```vue
<template>
  <div ref="editorContainer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { schema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import { undo, redo } from 'prosemirror-history'

const editorContainer = ref<HTMLDivElement>()
let view: EditorView | null = null

onMounted(() => {
  const state = EditorState.create({
    schema,
    plugins: [
      history(),
      keymap({ 'Mod-z': undo, 'Mod-y': redo }),
      keymap(baseKeymap),
    ],
  })

  view = new EditorView(editorContainer.value!, { state })
})

onBeforeUnmount(() => {
  view?.destroy()
})
</script>
```

## App Integration

```vue
<template>
  <div id="app">
    <ProseMirrorEditor />
  </div>
</template>

<script setup lang="ts">
import ProseMirrorEditor from './components/ProseMirrorEditor.vue'
</script>
```

## Verify Installation

Run dev server:

```bash
npm run dev
```

Open browser - you should see an editable text area.

## CSS

Import ProseMirror's base CSS:

```ts
import 'prosemirror-view/style/prosemirror.css'
```

Or in your main.ts:

```ts
import 'prosemirror-view/style/prosemirror.css'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```
