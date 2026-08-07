# Node Views

## Overview

Node views allow custom rendering of nodes with interactive content.

## Types of Node Views

### Editable Text

```vue
<template>
  <NodeViewWrapper class="custom-node">
    <span contenteditable="true" @input="updateContent">
      {{ node.textContent }}
    </span>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const props = defineProps<{
  node: any
  updateAttributes: (attrs: Record<string, any>) => void
}>()

function updateContent(event: Event) {
  const target = event.target as HTMLInputElement
  props.updateAttributes({ text: target.textContent })
}
</script>
```

### Non-Editable Text

```vue
<template>
  <NodeViewWrapper class="mention-node" contenteditable="false">
    <span class="mention">@{{ node.attrs.label }}</span>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<{
  node: any
}>()
</script>
```

### Mixed Content

```vue
<template>
  <NodeViewWrapper class="complex-node">
    <div class="header" contenteditable="false">
      <span>{{ node.attrs.title }}</span>
    </div>
    <NodeViewContent class="content" />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const props = defineProps<{
  node: any
}>()
</script>
```

## Vue NodeView Component

```vue
<template>
  <NodeViewWrapper class="custom-component">
    <div class="controls">
      <button @click="decrement">-</button>
      <span>{{ node.attrs.count }}</span>
      <button @click="increment">+</button>
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

function increment() {
  props.updateAttributes({ count: props.node.attrs.count + 1 })
}

function decrement() {
  props.updateAttributes({ count: props.node.attrs.count - 1 })
}
</script>

<style scoped>
.custom-component {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin: 8px 0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.controls button {
  padding: 4px 8px;
  cursor: pointer;
}
</style>
```

## Registering Vue NodeView

```ts
import { Node } from '@tiptap/core'
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

## NodeView Props

```ts
// Available props in Vue NodeView component
interface NodeViewProps {
  node: Node          // The ProseMirror node
  extension: Extension // The extension that created this node
  getPos: () => number // Get current position
  updateAttributes: (attrs: Record<string, any>) => void
  deleteNode: () => void
  selected: boolean    // Is node selected
  editor: Editor       // Editor instance
  HTMLAttributes: Record<string, any>
}
```

## Example: Counter Node

```vue
<template>
  <NodeViewWrapper class="counter-node">
    <span class="count" contenteditable="false">
      {{ node.attrs.count }}
    </span>
    <button @click="increment" contenteditable="false">+</button>
    <button @click="decrement" contenteditable="false">-</button>
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const props = defineProps<{
  node: any
  updateAttributes: (attrs: Record<string, any>) => void
}>()

function increment() {
  props.updateAttributes({ count: props.node.attrs.count + 1 })
}

function decrement() {
  props.updateAttributes({ count: props.node.attrs.count - 1 })
}
</script>

<style scoped>
.counter-node {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
}

.count {
  font-weight: bold;
  min-width: 24px;
  text-align: center;
}

button {
  cursor: pointer;
  padding: 2px 6px;
}
</style>
```

## Example: Mention Node

```vue
<template>
  <NodeViewWrapper class="mention" contenteditable="false">
    <span class="mention-symbol">@</span>
    <span class="mention-label">{{ node.attrs.label }}</span>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<{
  node: any
}>()
</script>

<style scoped>
.mention {
  display: inline-flex;
  align-items: center;
  background: #e8f4ff;
  border-radius: 4px;
  padding: 2px 6px;
  color: #0066cc;
  font-weight: 500;
}

.mention-symbol {
  margin-right: 2px;
}
</style>
```

## Example: Image with Caption

```vue
<template>
  <NodeViewWrapper class="image-node">
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      @click="selectImage"
    />
    <div
      class="caption"
      contenteditable="true"
      @input="updateCaption"
      data-placeholder="Add a caption..."
    >
      {{ node.attrs.caption }}
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<{
  node: any
  updateAttributes: (attrs: Record<string, any>) => void
  selected: boolean
}>()

function selectImage() {
  // Handle image selection
}

function updateCaption(event: Event) {
  const target = event.target as HTMLInputElement
  props.updateAttributes({ caption: target.textContent })
}
</script>

<style scoped>
.image-node {
  margin: 16px 0;
}

.image-node img {
  max-width: 100%;
  border-radius: 4px;
  cursor: pointer;
}

.image-node img.selected {
  outline: 2px solid #0066cc;
}

.caption {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 8px;
  padding: 4px;
}

.caption:focus {
  outline: none;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
```

## Selection Handling

```vue
<template>
  <NodeViewWrapper :class="{ 'is-selected': selected }">
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const props = defineProps<{
  selected: boolean
}>()
</script>
```

## Drag and Drop

```vue
<template>
  <NodeViewWrapper
    class="draggable-node"
    :draggable="true"
    @dragstart="onDragStart"
  >
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const props = defineProps<{
  getPos: () => number
}>()

function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData('text/plain', String(props.getPos()))
}
</script>
```
