# Vue 3 Integration

## useProseMirror Composable

### Basic Usage

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'

export function useProseMirror(options: {
  schema: Schema
  plugins?: Plugin[]
}) {
  const view = ref<EditorView | null>(null)
  const state = ref<EditorState | null>(null)
  
  function createView(element: HTMLDivElement) {
    state.value = EditorState.create({
      schema: options.schema,
      plugins: options.plugins || [],
    })
    
    view.value = new EditorView(element, {
      state: state.value,
    })
  }
  
  function destroy() {
    view.value?.destroy()
    view.value = null
    state.value = null
  }
  
  return {
    view,
    state,
    createView,
    destroy,
  }
}
```

### Using in Component

```vue
<template>
  <div ref="editorContainer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useProseMirror } from './composables/useProseMirror'
import { schema } from './schema'

const editorContainer = ref<HTMLDivElement>()
const { view, createView, destroy } = useProseMirror({ schema })

onMounted(() => {
  if (editorContainer.value) {
    createView(editorContainer.value)
  }
})

onBeforeUnmount(() => {
  destroy()
})
</script>
```

## Two-Way Binding (v-model)

### Implementation

```vue
<template>
  <div ref="editorContainer" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser } from 'prosemirror-model'
import { Schema } from 'prosemirror-model'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLDivElement>()
let view: EditorView | null = null

function createView() {
  const doc = DOMParser.fromSchema(schema).parse(
    new DOMParser().parseFromString(props.modelValue, 'text/html').body
  )
  
  const state = EditorState.create({
    schema,
    doc,
  })
  
  view = new EditorView(editorContainer.value!, {
    state,
    dispatchTransaction(tr) {
      const newState = view!.state.apply(tr)
      view!.updateState(newState)
      
      if (tr.docChanged) {
        emit('update:modelValue', view!.state.doc.content.contentMiddle(0).toString())
      }
    },
  })
}

// Watch for external changes
watch(
  () => props.modelValue,
  (value) => {
    if (!view) return
    
    const currentContent = view.state.doc.content.contentMiddle(0).toString()
    if (currentContent === value) return
    
    const doc = DOMParser.fromSchema(schema).parse(
      new DOMParser().parseFromString(value, 'text/html').body
    )
    
    const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, doc.content)
    view.dispatch(tr)
  }
)

onMounted(() => {
  if (editorContainer.value) {
    createView()
  }
})

onBeforeUnmount(() => {
  view?.destroy()
})
</script>
```

### JSON v-model

```vue
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'

const props = defineProps<{
  modelValue: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

const editorContainer = ref<HTMLDivElement>()
let view: EditorView | null = null

function createView() {
  const doc = schema.nodeFromJSON(props.modelValue)
  
  const state = EditorState.create({
    schema,
    doc,
  })
  
  view = new EditorView(editorContainer.value!, {
    state,
    dispatchTransaction(tr) {
      const newState = view!.state.apply(tr)
      view!.updateState(newState)
      
      if (tr.docChanged) {
        emit('update:modelValue', view!.state.doc.toJSON())
      }
    },
  })
}

// Watch for external changes
watch(
  () => props.modelValue,
  (value) => {
    if (!view) return
    
    const currentJSON = JSON.stringify(view.state.doc.toJSON())
    if (currentJSON === JSON.stringify(value)) return
    
    const doc = schema.nodeFromJSON(value)
    const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, doc.content)
    view.dispatch(tr)
  }
)

onMounted(() => {
  if (editorContainer.value) {
    createView()
  }
})

onBeforeUnmount(() => {
  view?.destroy()
})
</script>
```

## Component with Toolbar

```vue
<template>
  <div class="editor-container">
    <div class="toolbar" v-if="view">
      <button @click="toggleBold" :class="{ 'is-active': isBold }">
        Bold
      </button>
      <button @click="toggleItalic" :class="{ 'is-active': isItalic }">
        Italic
      </button>
      <button @click="setHeading(2)" :class="{ 'is-active': isHeading2 }">
        H2
      </button>
    </div>
    <div ref="editorContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { toggleMark } from 'prosemirror-commands'
import { setBlockType } from 'prosemirror-commands'
import { schema } from './schema'

const props = defineProps<{
  modelValue?: string
  editable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLDivElement>()
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

const isHeading2 = computed(() => {
  if (!view) return false
  const { from } = view.state.selection
  const $pos = view.state.doc.resolve(from)
  return $pos.parent.type.name === 'heading' && $pos.parent.attrs.level === 2
})

function toggleBold() {
  if (!view) return
  toggleMark(schema.marks.strong)(view.state, view.dispatch)
}

function toggleItalic() {
  if (!view) return
  toggleMark(schema.marks.em)(view.state, view.dispatch)
}

function setHeading(level: number) {
  if (!view) return
  setBlockType(schema.nodes.heading, { level })(view.state, view.dispatch)
}

onMounted(() => {
  const state = EditorState.create({
    schema,
    doc: props.modelValue ? 
      new DOMParser().parseFromString(props.modelValue, 'text/html').body : 
      undefined,
  })

  view = new EditorView(editorContainer.value!, {
    state,
    editable: () => props.editable ?? true,
    dispatchTransaction(tr) {
      const newState = view!.state.apply(tr)
      view!.updateState(newState)
      
      if (tr.docChanged) {
        emit('update:modelValue', view!.state.doc.content.contentMiddle(0).toString())
      }
    },
  })
})

onBeforeUnmount(() => {
  view?.destroy()
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

```ts
import { onBeforeUnmount } from 'vue'

const view = ref<EditorView | null>(null)

onBeforeUnmount(() => {
  view.value?.destroy()
})
```

### Manual Cleanup

```ts
function destroyEditor() {
  view.value?.destroy()
  view.value = null
}
```

## Accessing Editor Instance

```ts
const editorContainer = ref<HTMLDivElement>()
let view: EditorView | null = null

onMounted(() => {
  // Create view
  view = new EditorView(editorContainer.value!, { state })
})

// Access view
view?.state.doc
view?.state.selection
view?.dispatch(tr)
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
  <ProseMirrorEditor v-model="content" :editable="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProseMirrorEditor from './ProseMirrorEditor.vue'

const content = ref('<p>Hello</p>')
</script>
```

## Composable Example

### useEditor

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

export function useEditor(options: {
  schema: Schema
  content?: string
  plugins?: Plugin[]
  editable?: boolean
  onUpdate?: (doc: string) => void
}) {
  const view = ref<EditorView | null>(null)
  
  function create(element: HTMLDivElement) {
    const state = EditorState.create({
      schema: options.schema,
      plugins: options.plugins || [],
    })
    
    view.value = new EditorView(element, {
      state,
      editable: () => options.editable ?? true,
      dispatchTransaction(tr) {
        const newState = view!.state.apply(tr)
        view!.updateState(newState)
        
        if (tr.docChanged && options.onUpdate) {
          options.onUpdate(view!.state.doc.content.contentMiddle(0).toString())
        }
      },
    })
  }
  
  function destroy() {
    view.value?.destroy()
    view.value = null
  }
  
  function getHTML(): string {
    return view.value?.state.doc.content.contentMiddle(0).toString() ?? ''
  }
  
  function getJSON(): Record<string, unknown> {
    return view.value?.state.doc.toJSON() ?? {}
  }
  
  return {
    view,
    create,
    destroy,
    getHTML,
    getJSON,
  }
}
```
