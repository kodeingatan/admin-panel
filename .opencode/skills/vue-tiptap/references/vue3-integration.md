# Vue 3 Integration

## useEditor Composable

The `useEditor` composable is the recommended way to use Tiptap with Vue 3.

### Basic Usage

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

### useEditor Options

```ts
const editor = useEditor({
  // Content
  content: '<p>Initial content</p>',  // HTML or JSON
  // or
  content: { type: 'doc', content: [{ type: 'paragraph' }] },
  
  // Extensions
  extensions: [StarterKit],
  
  // Editor settings
  editable: true,
  autofocus: 'end',
  injectCSS: true,
  enableInputRules: true,
  enablePasteRules: true,
  
  // Event handlers
  onCreate: ({ editor }) => {
    console.log('Editor created')
  },
  onUpdate: ({ editor }) => {
    console.log('Content changed')
  },
  onFocus: ({ editor, event }) => {
    console.log('Editor focused')
  },
  onBlur: ({ editor, event }) => {
    console.log('Editor blurred')
  },
  onSelectionUpdate: ({ editor }) => {
    console.log('Selection changed')
  },
  onTransaction: ({ editor, transaction }) => {
    console.log('Transaction applied')
  },
  onDestroy: () => {
    console.log('Editor destroyed')
  },
  onPaste: (event, slice) => {
    console.log('Content pasted')
  },
  onDrop: (event, slice, moved) => {
    console.log('Content dropped')
  },
})
```

## Two-Way Binding (v-model)

### Implementation

```vue
<template>
  <editor-content :editor="editor" />
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Watch for external changes
watch(
  () => props.modelValue,
  (value) => {
    const isCurrentContent = editor.value?.getHTML() === value
    if (isCurrentContent) return
    editor.value?.commands.setContent(value, false)
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
```

### JSON v-model

```vue
<script setup lang="ts">
import { watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{
  modelValue: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getJSON())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    const isCurrentContent = JSON.stringify(editor.value?.getJSON()) === JSON.stringify(value)
    if (isCurrentContent) return
    editor.value?.commands.setContent(value, false)
  }
)
</script>
```

## Component with Toolbar

```vue
<template>
  <div class="editor-container">
    <div class="toolbar" v-if="editor">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        Bold
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        Italic
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        H2
      </button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{
  modelValue?: string
  editable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue || '',
  editable: props.editable ?? true,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar button {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.toolbar button.is-active {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}
</style>
```

## Lifecycle Management

### Automatic Cleanup

The `useEditor` composable automatically handles cleanup on unmount.

### Manual Cleanup

```ts
import { onBeforeUnmount } from 'vue'

const editor = useEditor({
  extensions: [StarterKit],
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
```

### Accessing Editor Instance

```ts
const editor = useEditor({
  extensions: [StarterKit],
})

// Access via .value
editor.value?.getHTML()
editor.value?.chain().focus().toggleBold().run()
```

## Props & Emits Patterns

### Defining Props

```ts
const props = defineProps<{
  modelValue: string
  editable?: boolean
  placeholder?: string
}>()
```

### Defining Emits

```ts
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': []
  'blur': []
}>()
```

### Using with v-model

```vue
<template>
  <TiptapEditor v-model="content" :editable="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from './TiptapEditor.vue'

const content = ref('<p>Hello</p>')
</script>
```
