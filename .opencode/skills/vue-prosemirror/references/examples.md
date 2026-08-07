# Examples

## Basic Editor

### Minimal Editor

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

## Custom Schema

### Schema with Headings and Lists

```ts
import { Schema } from 'prosemirror-model'

const mySchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    heading: {
      group: 'block',
      content: 'text*',
      attrs: { level: { default: 1 } },
    },
    bulletList: { group: 'block', content: 'listItem+' },
    orderedList: { group: 'block', content: 'listItem+' },
    listItem: { content: 'paragraph' },
    text: { inline: true },
  },
  marks: {
    strong: {},
    em: {},
  },
})
```

### Schema with Links

```ts
const linkSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    text: { inline: true },
  },
  marks: {
    link: {
      attrs: {
        href: {},
        title: { default: null },
      },
      toDOM(node) {
        return ['a', { href: node.attrs.href, title: node.attrs.title }, 0]
      },
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(element) {
            return {
              href: element.getAttribute('href'),
              title: element.getAttribute('title'),
            }
          },
        },
      ],
    },
  },
})
```

## Collaborative Editing

### Basic Collaboration

```ts
import { collab } from 'prosemirror-collab'
import { stepType } from 'prosemirror-collab'

const collabPlugin = collab()

const state = EditorState.create({
  schema: mySchema,
  plugins: [collabPlugin],
})

// Send changes to server
function sendChanges(view: EditorView, steps: Step[]) {
  fetch('/api/collab', {
    method: 'POST',
    body: JSON.stringify({ steps }),
  })
}

// Receive changes from server
function receiveChanges(view: EditorView, steps: Step[]) {
  const tr = steps.reduce(
    (tr, step) => tr.step(step),
    view.state.tr
  )
  view.dispatch(tr)
}
```

## Image Upload

### Image with Placeholder

```ts
const imageSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    image: {
      group: 'block',
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
      },
      toDOM(node) {
        return ['img', {
          src: node.attrs.src,
          alt: node.attrs.alt,
          title: node.attrs.title,
        }]
      },
      parseDOM: [
        {
          tag: 'img',
          getAttrs(element) {
            return {
              src: element.getAttribute('src'),
              alt: element.getAttribute('alt'),
              title: element.getAttribute('title'),
            }
          },
        },
      ],
    },
    text: { inline: true },
  },
})

// Image upload plugin
const imageUploadPlugin = new Plugin({
  props: {
    handlePaste(view, event, slice) {
      const items = Array.from(event.clipboardData?.items || [])
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            uploadImage(file).then(url => {
              const tr = view.state.tr.replaceWith(
                view.state.selection.from,
                view.state.selection.to,
                view.state.schema.nodes.image.create({ src: url })
              )
              view.dispatch(tr)
            })
          }
          return true
        }
      }
      return false
    },
  },
})

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  
  const data = await response.json()
  return data.url
}
```

## Code Block

### Code Block with Syntax Highlighting

```ts
const codeBlockSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    codeBlock: {
      group: 'block',
      content: 'text*',
      marks: '',
      toDOM() {
        return ['pre', ['code', 0]]
      },
      parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    },
    text: { inline: true },
  },
})

// Code block plugin
const codeBlockPlugin = new Plugin({
  props: {
    handleKeyDown(view, event) {
      if (event.key === 'Tab') {
        event.preventDefault()
        const tr = view.state.tr
        tr.insertText('  ')
        view.dispatch(tr)
        return true
      }
      return false
    },
  },
})
```

## Table

### Basic Table

```ts
import { table, tableNodes, tablePlugins } from 'prosemirror-tables'

const tableSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    table: {
      group: 'block',
      content: 'tableRow+',
      tableRole: 'table',
    },
    tableRow: {
      content: 'tableCell+',
      tableRole: 'row',
    },
    tableCell: {
      content: 'paragraph+',
      tableRole: 'cell',
    },
    tableHeader: {
      content: 'paragraph+',
      tableRole: 'header_cell',
    },
    text: { inline: true },
  },
})

// Add table plugins
const plugins = [
  ...tablePlugins,
  // other plugins...
]
```

## Placeholder

### Placeholder Text

```ts
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

function placeholderPlugin(text: string) {
  return new Plugin({
    props: {
      decorations(state) {
        if (state.doc.content.size > 2) return DecorationSet.empty
        
        return DecorationSet.create(state.doc, [
          Decoration.widget(1, () => {
            const div = document.createElement('div')
            div.className = 'placeholder'
            div.textContent = text
            div.style.color = '#999'
            div.style.pointerEvents = 'none'
            return div
          }),
        ])
      },
    },
  })
}

// Usage
const state = EditorState.create({
  schema,
  plugins: [placeholderPlugin('Start typing...')],
})
```

## Input Rules

### Custom Input Rules

```ts
import { inputRules } from 'prosemirror-inputrules'
import { wrappingInputRule, textblockTypeInputRule } from 'prosemirror-inputrules'

// Heading input rule
const headingRule = textblockTypeInputRule(
  /^(#{1,6})\s/,
  schema.nodes.heading,
  match => ({ level: match[1].length })
)

// Bold input rule
const boldRule = markInputRule(
  /\*\*([^*]+)\*\*/,
  schema.marks.strong
)

// Italic input rule
const italicRule = markInputRule(
  /([^*]+)\*/,
  schema.marks.em
)

// List input rule
const listRule = wrappingInputRule(
  /^\s*([-+*])\s/,
  schema.nodes.bulletList
)

// Ordered list input rule
const orderedListRule = wrappingInputRule(
  /^(\d+)\.\s/,
  schema.nodes.orderedList,
  match => ({ order: +match[1] })
)

// Usage
const plugins = [
  inputRules({
    rules: [
      headingRule,
      boldRule,
      italicRule,
      listRule,
      orderedListRule,
    ],
  }),
]
```

## Keymaps

### Custom Keymaps

```ts
import { keymap } from 'prosemirror-keymap'
import { toggleMark } from 'prosemirror-commands'
import { wrapIn, setBlockType } from 'prosemirror-commands'
import { undo, redo } from 'prosemirror-history'

const customKeymap = keymap({
  'Mod-z': undo,
  'Mod-y': redo,
  'Mod-b': toggleMark(schema.marks.strong),
  'Mod-i': toggleMark(schema.marks.em),
  'Mod-Shift-1': setBlockType(schema.nodes.heading, { level: 1 }),
  'Mod-Shift-2': setBlockType(schema.nodes.heading, { level: 2 }),
  'Mod-Shift-3': setBlockType(schema.nodes.heading, { level: 3 }),
  'Mod-Shift-7': wrapIn(schema.nodes.orderedList),
  'Mod-Shift-8': wrapIn(schema.nodes.bulletList),
  'Mod-Shift-9': wrapIn(schema.nodes.blockquote),
})
```

## Complete Example

### Full Editor with Toolbar

```vue
<template>
  <div class="editor-container">
    <div class="toolbar" v-if="view">
      <button @click="toggleBold" :class="{ 'is-active': isBold }">
        B
      </button>
      <button @click="toggleItalic" :class="{ 'is-active': isItalic }">
        I
      </button>
      <button @click="toggleHeading(1)" :class="{ 'is-active': isHeading(1) }">
        H1
      </button>
      <button @click="toggleHeading(2)" :class="{ 'is-active': isHeading(2) }">
        H2
      </button>
      <button @click="toggleHeading(3)" :class="{ 'is-active': isHeading(3) }">
        H3
      </button>
      <button @click="toggleBulletList">
        • List
      </button>
      <button @click="toggleOrderedList">
        1. List
      </button>
      <button @click="toggleBlockquote">
        " Quote
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
import { setBlockType, wrapIn } from 'prosemirror-commands'
import { history } from 'prosemirror-history'
import { undo, redo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { inputRules } from 'prosemirror-inputrules'
import { Schema } from 'prosemirror-model'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    heading: {
      group: 'block',
      content: 'text*',
      attrs: { level: { default: 1 } },
    },
    bulletList: { group: 'block', content: 'listItem+' },
    orderedList: { group: 'block', content: 'listItem+' },
    listItem: { content: 'paragraph' },
    blockquote: { group: 'block', content: 'block+' },
    text: { inline: true },
  },
  marks: {
    strong: {},
    em: {},
  },
})

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

function isHeading(level: number): boolean {
  if (!view) return false
  const { from } = view.state.selection
  const $pos = view.state.doc.resolve(from)
  return $pos.parent.type.name === 'heading' && $pos.parent.attrs.level === level
}

function toggleBold() {
  if (!view) return
  toggleMark(schema.marks.strong)(view.state, view.dispatch)
}

function toggleItalic() {
  if (!view) return
  toggleMark(schema.marks.em)(view.state, view.dispatch)
}

function toggleHeading(level: number) {
  if (!view) return
  setBlockType(schema.nodes.heading, { level })(view.state, view.dispatch)
}

function toggleBulletList() {
  if (!view) return
  wrapIn(schema.nodes.bulletList)(view.state, view.dispatch)
}

function toggleOrderedList() {
  if (!view) return
  wrapIn(schema.nodes.orderedList)(view.state, view.dispatch)
}

function toggleBlockquote() {
  if (!view) return
  wrapIn(schema.nodes.blockquote)(view.state, view.dispatch)
}

onMounted(() => {
  const state = EditorState.create({
    schema,
    plugins: [
      history(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-b': toggleMark(schema.marks.strong),
        'Mod-i': toggleMark(schema.marks.em),
        ...baseKeymap,
      }),
    ],
  })

  view = new EditorView(editorContainer.value!, { state })
})

onBeforeUnmount(() => {
  view?.destroy()
})
</script>

<style scoped>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid #ccc;
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

:deep(.ProseMirror) {
  padding: 16px;
  min-height: 200px;
}

:deep(.ProseMirror p.is-empty::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
```
