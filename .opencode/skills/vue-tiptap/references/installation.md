# Installation & Setup

## Requirements

- Node.js 18+
- Vue 3.2+
- npm or yarn

## Install Dependencies

```bash
npm install @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit
```

### Package Breakdown

| Package | Purpose |
|---------|---------|
| `@tiptap/vue-3` | Vue 3 integration (useEditor, EditorContent) |
| `@tiptap/pm` | ProseMirror core libraries |
| `@tiptap/starter-kit` | Bundle of common extensions |

## Project Setup

### Using Vite

```bash
npm create vite@latest my-editor-app -- --template vue-ts
cd my-editor-app
npm install @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit
```

### Using with Existing Vue Project

```bash
npm install @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit
```

## Minimal Editor Component

```vue
<template>
  <editor-content :editor="editor" />
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>Hello World</p>',
  extensions: [StarterKit],
})
</script>
```

## App Integration

```vue
<template>
  <div id="app">
    <TiptapEditor />
  </div>
</template>

<script setup lang="ts">
import TiptapEditor from './components/TiptapEditor.vue'
</script>
```

## Verify Installation

Run dev server:

```bash
npm run dev
```

Open browser - you should see an editable text area.
