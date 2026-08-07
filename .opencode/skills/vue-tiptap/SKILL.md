---
name: tiptap-vue
description: Build rich text editor Vue 3 components with Tiptap for a component library with Storybook. Covers installation, configuration, extensions, custom nodes/marks, Vue 3 Composition API integration, and Storybook documentation. Use when building Tiptap-based Vue editor components.
license: MIT
metadata:
  author: openai-codex
  version: "1.0.0"
---

# Tiptap Vue Component Library Skill

Build rich text editor Vue 3 components using Tiptap, documented with Storybook.

## When to Use

- Building Tiptap editor Vue components
- Creating rich text editing experiences
- Documenting editor components in Storybook
- Extending Tiptap with custom nodes, marks, or extensions
- Integrating Tiptap into a Vue 3 component library

## Quick Start

### Installation

```bash
npm install @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit
```

### Basic Editor Component

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

## References

| Topic | File |
|-------|------|
| Installation & Setup | `references/installation.md` |
| Editor API & Configuration | `references/editor-api.md` |
| Extensions & StarterKit | `references/extensions.md` |
| Custom Nodes & Marks | `references/custom-nodes-marks.md` |
| Custom Extensions | `references/custom-extensions.md` |
| Vue 3 Integration | `references/vue3-integration.md` |
| Events & Commands | `references/events-commands.md` |
| Styling | `references/styling.md` |
| Storybook Patterns | `references/storybook-patterns.md` |
| Node Views | `references/node-views.md` |
| Schema & Content | `references/schema-content.md` |

## Architecture

### Extension Types

| Type | Purpose | Example |
|------|---------|---------|
| **Node** | Content blocks (paragraph, heading) | `@tiptap/extension-heading` |
| **Mark** | Inline formatting (bold, italic) | `@tiptap/extension-bold` |
| **Extension** | Editor functionality (history, keymaps) | `@tiptap/extension-placeholder` |

### StarterKit Included Extensions

**Nodes:** Blockquote, BulletList, CodeBlock, Document, HardBreak, Heading, HorizontalRule, ListItem, OrderedList, Paragraph, Text

**Marks:** Bold, Code, Italic, Strike

**Extensions:** Dropcursor, Gapcursor, UndoRedo, ListKeymap, TrailingNode

## Core Concepts

### Schema

Tiptap uses a strict ProseMirror schema defining content structure:

```ts
Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  parseHTML() { return [{ tag: 'p' }] },
  renderHTML({ HTMLAttributes }) { return ['p', HTMLAttributes, 0] },
})
```

### State & Transactions

- **State**: Current content + selection + metadata
- **Transaction**: A change to the state (content, selection, or both)
- **Commands**: Methods that create and dispatch transactions

### Content Formats

```ts
// HTML string
editor.getHTML()

// JSON (recommended for persistence)
editor.getJSON()

// Plain text
editor.getText()
```

## Vue 3 Patterns

### useEditor Composable

```ts
const editor = useEditor({
  content: '<p>Initial content</p>',
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    // Handle content changes
  },
})
```

### Two-Way Binding (v-model)

```vue
<template>
  <editor-content :editor="editor" />
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})
</script>
```

## Storybook Integration

### Story Pattern

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import TiptapEditor from './TiptapEditor.vue'

const meta: Meta<typeof TiptapEditor> = {
  title: 'Editor/TiptapEditor',
  component: TiptapEditor,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    editable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: '<p>Hello World</p>',
    editable: true,
  },
}
```

## Best Practices

1. **Always destroy editor on unmount** - Call `editor.destroy()` in `onBeforeUnmount`
2. **Use `useEditor` composable** - Handles lifecycle automatically
3. **Prefer JSON over HTML** - More flexible, easier to parse
4. **Extend rather than replace** - Use `.extend()` to customize existing extensions
5. **Keep extensions focused** - One extension = one responsibility
6. **Document in Storybook** - Every component needs stories
7. **Type everything** - Use TypeScript for props, emits, and extension options
8. **Test with different content** - Empty, simple, complex nested structures

## Common Patterns

### Toolbar with Commands

```vue
<template>
  <div>
    <div class="toolbar">
      <button @click="editor?.chain().focus().toggleBold().run()">
        Bold
      </button>
      <button @click="editor?.chain().focus().toggleItalic().run()">
        Italic
      </button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>
```

### Read-Only Mode

```ts
const editor = useEditor({
  content: data,
  editable: false,
  extensions: [StarterKit],
})

// Toggle later
editor.value?.setEditable(!editor.value.isEditable)
```

### Custom Node Extension

```ts
import { Node } from '@tiptap/core'

const CustomNode = Node.create({
  name: 'customNode',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return { color: { default: 'blue' } }
  },
  parseHTML() { return [{ tag: 'div[data-custom]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-custom': '', ...HTMLAttributes }, 0]
  },
  addCommands() {
    return {
      setCustomNode: () => ({ commands }) => {
        return commands.setNode(this.name)
      },
    }
  },
})
```

## Dependencies

**Required:**
- `@tiptap/vue-3` - Vue 3 integration
- `@tiptap/pm` - ProseMirror peer dependency
- `@tiptap/starter-kit` - Common extensions bundle

**Optional (per extension):**
- `@tiptap/extension-*` - Individual extensions
- `@tiptap/extension-image`
- `@tiptap/extension-table`
- `@tiptap/extension-link`
- `@tiptap/extension-placeholder`
- `@tiptap/extension-code-block-lowlight`

## Integration

**With vue-best-practices:** Use Composition API, `<script setup>`, TypeScript
**With ui-styling:** Apply Tailwind or component library styles
**With design-system:** Use design tokens for editor theming

**Skill Dependencies:** vue-best-practices
**Primary Agents:** frontend-developer, ui-developer
