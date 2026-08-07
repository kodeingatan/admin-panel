# Custom Nodes & Marks

## Creating a Custom Node

### Basic Node

```ts
import { Node } from '@tiptap/core'

const CustomNode = Node.create({
  name: 'customNode',
  
  // Schema
  group: 'block',
  content: 'inline*',
  draggable: true,
  selectable: true,
  
  // Attributes
  addAttributes() {
    return {
      color: {
        default: 'blue',
      },
      count: {
        default: 0,
      },
    }
  },
  
  // Parse from HTML
  parseHTML() {
    return [
      {
        tag: 'div[data-custom-node]',
        getAttrs: (element) => ({
          color: element.getAttribute('data-color'),
        }),
      },
    ]
  },
  
  // Render to HTML
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-custom-node': '', ...HTMLAttributes }, 0]
  },
  
  // Commands
  addCommands() {
    return {
      setCustomNode: (attributes) => ({ commands }) => {
        return commands.setNode(this.name, attributes)
      },
      toggleCustomNode: (attributes) => ({ commands }) => {
        return commands.toggleNode(this.name, 'paragraph', attributes)
      },
    }
  },
})
```

### Inline Node

```ts
const MentionNode = Node.create({
  name: 'mention',
  group: 'inline',
  inline: true,
  atom: true,
  
  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
    }
  },
  
  parseHTML() {
    return [{ tag: 'span[data-mention]' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-mention': '', ...HTMLAttributes }, `@${HTMLAttributes.label}`]
  },
  
  addCommands() {
    return {
      insertMention: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },
})
```

### Atomic Node

```ts
const EmbedNode = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,
  draggable: true,
  
  addAttributes() {
    return {
      src: { default: null },
      type: { default: 'video' },
    }
  },
  
  parseHTML() {
    return [{ tag: 'div[data-embed]' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-embed': '', ...HTMLAttributes }]
  },
})
```

## Creating a Custom Mark

### Basic Mark

```ts
import { Mark } from '@tiptap/core'

const HighlightMark = Mark.create({
  name: 'highlight',
  
  // Schema
  inclusive: true,
  excludes: '_',
  spanning: true,
  
  // Attributes
  addAttributes() {
    return {
      color: {
        default: 'yellow',
      },
    }
  },
  
  // Parse from HTML
  parseHTML() {
    return [
      {
        tag: 'mark',
        getAttrs: (element) => ({
          color: element.getAttribute('data-color'),
        }),
      },
    ]
  },
  
  // Render to HTML
  renderHTML({ HTMLAttributes }) {
    return ['mark', { 'data-color': '', ...HTMLAttributes }, 0]
  },
  
  // Commands
  addCommands() {
    return {
      setHighlight: (attributes) => ({ commands }) => {
        return commands.setMark(this.name, attributes)
      },
      toggleHighlight: (attributes) => ({ commands }) => {
        return commands.toggleMark(this.name, attributes)
      },
      unsetHighlight: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
  
  // Keyboard shortcuts
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-h': () => this.editor.commands.toggleHighlight(),
    }
  },
  
  // Input rules
  addInputRules() {
    return [
      {
        find: /==(.+)==$/,
        handler: ({ state, range, match }) => {
          const { tr } = state
          tr.addMark(range.from, range.to, this.type.create())
        },
      },
    ]
  },
})
```

### Color Mark

```ts
const ColorMark = Mark.create({
  name: 'textStyle',
  
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.style.color?.replace(/['"]+/g, ''),
        renderHTML: (attributes) => {
          if (!attributes.color) return {}
          return { style: `color: ${attributes.color}` }
        },
      },
    }
  },
  
  parseHTML() {
    return [{ style: 'color' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },
  
  addCommands() {
    return {
      setColor: (color) => ({ commands }) => {
        return commands.setMark(this.name, { color })
      },
      unsetColor: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})
```

## Node with Vue Component

```vue
<template>
  <NodeViewWrapper class="custom-component">
    <div class="header">
      <span>{{ node.attrs.title }}</span>
    </div>
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const props = defineProps<{
  node: any
  updateAttributes: (attrs: Record<string, any>) => void
}>()
</script>
```

```ts
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomComponent from './CustomComponent.vue'

const CustomNode = Node.create({
  name: 'customNode',
  group: 'block',
  content: 'inline*',
  
  addNodeView() {
    return VueNodeViewRenderer(CustomComponent)
  },
})
```

## Extending Existing Nodes

### Using .extend()

```ts
import Paragraph from '@tiptap/extension-paragraph'

const CustomParagraph = Paragraph.extend({
  // Add attributes
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: null,
      },
    }
  },
  
  // Change rendering
  renderHTML({ HTMLAttributes }) {
    return ['p', { 'data-custom': '', ...HTMLAttributes }, 0]
  },
  
  // Add commands
  addCommands() {
    return {
      ...this.parent?.(),
      setParagraphColor: (color) => ({ commands }) => {
        return commands.updateAttributes('paragraph', { color })
      },
    }
  },
})
```

### Using .configure()

```ts
const editor = useEditor({
  extensions: [
    Paragraph.configure({
      HTMLAttributes: {
        class: 'my-paragraph',
      },
    }),
  ],
})
```

## Global Attributes

```ts
import { Extension } from '@tiptap/core'

const TextAlign = Extension.create({
  name: 'textAlign',
  
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          textAlign: {
            default: 'left',
            renderHTML: (attributes) => ({
              style: `text-align: ${attributes.textAlign}`,
            }),
            parseHTML: (element) => element.style.textAlign || 'left',
          },
        },
      },
    ]
  },
  
  addCommands() {
    return {
      setTextAlign: (alignment) => ({ commands }) => {
        return commands.updateAttributes('paragraph', { textAlign: alignment })
      },
    }
  },
})
```

## Storage

```ts
const CustomNode = Node.create({
  name: 'customNode',
  
  addStorage() {
    return {
      count: 0,
      history: [],
    }
  },
  
  onUpdate() {
    this.storage.count += 1
    this.storage.history.push(new Date().toISOString())
  },
})

// Access storage
editor.storage.customNode.count
editor.storage.customNode.history
```
