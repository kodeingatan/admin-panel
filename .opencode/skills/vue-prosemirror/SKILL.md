# Skill: vue-prosemirror

# ProseMirror Vue Component Library Skill

Build rich text editor Vue 3 components using ProseMirror directly, documented with Storybook.

## When to Use

- Building ProseMirror editor Vue components
- Creating custom document schemas
- Building collaborative editing features
- Implementing custom node views
- Need full control over editor behavior
- Documenting editor components in Storybook

## Quick Start

### Installation

```bash
npm install prosemirror-model prosemirror-state prosemirror-view prosemirror-transform prosemirror-commands prosemirror-history prosemirror-keymap prosemirror-inputrules prosemirror-schema-basic prosemirror-schema-list prosemirror-gapcursor
```

### Basic Editor Component

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

## References

| Topic | File |
|-------|------|
| Installation & Setup | `references/installation.md` |
| Schema Basics | `references/schema-basics.md` |
| State & Transactions | `references/state-transactions.md` |
| Plugins System | `references/plugins-system.md` |
| Commands | `references/commands.md` |
| Node Views | `references/node-views.md` |
| Decorations | `references/decorations.md` |
| Vue 3 Integration | `references/vue3-integration.md` |
| Storybook Patterns | `references/storybook-patterns.md` |
| Examples | `references/examples.md` |

## Architecture

### Core Modules

| Module | Purpose |
|--------|---------|
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

### Data Flow

```
User Input → View → Transaction → State → View → DOM Update
```

## Core Concepts

### Schema

Defines document structure with node types and marks:

```ts
import { Schema } from 'prosemirror-model'

const mySchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    heading: { group: 'block', content: 'text*', attrs: { level: { default: 1 } } },
    text: { inline: true },
  },
  marks: {
    strong: {},
    em: {},
  },
})
```

### State

Immutable state holding document, selection, and plugin state:

```ts
import { EditorState } from 'prosemirror-state'

const state = EditorState.create({
  schema: mySchema,
  plugins: [...],
})
```

### Transactions

Immutable changes to state:

```ts
const tr = state.tr
tr.insertText('Hello')
const newState = state.apply(tr)
```

### Plugins

Extend editor behavior:

```ts
import { Plugin } from 'prosemirror-state'

const myPlugin = new Plugin({
  props: {
    handleKeyDown(view, event) {
      console.log('Key pressed:', event.key)
      return false
    },
  },
})
```

## Vue 3 Patterns

### useProseMirror Composable

```ts
import { useProseMirror } from './composables/useProseMirror'

const { editor, view, state } = useProseMirror({
  schema: mySchema,
  plugins: [...],
})
```

### Two-Way Binding (v-model)

```vue
<template>
  <ProseMirrorEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProseMirrorEditor from './ProseMirrorEditor.vue'

const content = ref('<p>Hello</p>')
</script>
```

## Storybook Integration

### Story Pattern

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import ProseMirrorEditor from './ProseMirrorEditor.vue'

const meta: Meta<typeof ProseMirrorEditor> = {
  title: 'Editor/ProseMirrorEditor',
  component: ProseMirrorEditor,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    editable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: '<p>Hello World</p>',
    editable: true,
  },
}
```

## Best Practices

1. **Always destroy view on unmount** - Call `view.destroy()` in `onBeforeUnmount`
2. **Use immutable state** - Never mutate state objects directly
3. **Create transactions for changes** - Use `state.tr` to create transactions
4. **Prefer plugins over direct manipulation** - Use plugins for editor extensions
5. **Document in Storybook** - Every component needs stories
6. **Type everything** - Use TypeScript for schemas and plugins
7. **Test with different content** - Empty, simple, complex nested structures
8. **Handle collaborative editing** - Use prosemirror-collab for real-time collaboration

## Dependencies

**Required:**
- `prosemirror-model` - Document model
- `prosemirror-state` - Editor state
- `prosemirror-view` - DOM view
- `prosemirror-transform` - Document transforms
- `prosemirror-commands` - Editing commands

**Optional (per feature):**
- `prosemirror-history` - Undo/redo
- `prosemirror-keymap` - Keyboard bindings
- `prosemirror-inputrules` - Input macros
- `prosemirror-collab` - Collaborative editing
- `prosemirror-gapcursor` - Gap cursor
- `prosemirror-schema-basic` - Basic schema
- `prosemirror-schema-list` - List schema

## Integration

**With vue-best-practices:** Use Composition API, `<script setup>`, TypeScript
**With ui-styling:** Apply Tailwind or component library styles
**With design-system:** Use design tokens for editor theming

**Skill Dependencies:** vue-best-practices
**Primary Agents:** frontend-developer, ui-developer

Base directory for this skill: /home/afdal/Laboratorium/PROJECT/componenet-stories/.opencode/skills/vue-prosemirror
Relative paths in this skill (e.g. scripts/, reference/) are relative to this base directory.
