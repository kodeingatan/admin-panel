# Node Views

## What are Node Views

Node views provide custom rendering of nodes in the editor DOM.

## Basic Node View

### Function-Based

```ts
import { NodeView } from 'prosemirror-view'

function myNodeView(node, view, getPos, decorations) {
  const dom = document.createElement('div')
  dom.className = 'my-node'
  dom.textContent = node.textContent
  
  return {
    dom,
    update(node, decorations) {
      if (node.type.name !== 'myNode') return false
      dom.textContent = node.textContent
      return true
    },
    stopEvent(event) {
      // Return true to stop event from reaching the view
      return false
    },
    ignoreMutation(mutation) {
      // Return true to ignore mutation
      return false
    },
    destroy() {
      // Cleanup
    },
  }
}
```

### Class-Based

```ts
class MyNodeView implements NodeView {
  dom: HTMLElement
  
  constructor(node, view, getPos, decorations) {
    this.dom = document.createElement('div')
    this.dom.className = 'my-node'
    this.dom.textContent = node.textContent
  }
  
  update(node, decorations) {
    if (node.type.name !== 'myNode') return false
    this.dom.textContent = node.textContent
    return true
  }
  
  stopEvent(event) {
    return false
  }
  
  ignoreMutation(mutation) {
    return false
  }
  
  destroy() {
    // Cleanup
  }
}
```

## Node View Properties

| Property | Type | Description |
|----------|------|-------------|
| `dom` | `Node` | DOM node to render |
| `contentDOM` | `Node` | Where content goes (if editable) |
| `update` | `function` | Called when node updates |
| `stopEvent` | `function` | Filter events |
| `ignoreMutation` | `function` | Filter mutations |
| `destroy` | `function` | Cleanup |

## Node View Arguments

```ts
function myNodeView(
  node: Node,           // The node being rendered
  view: EditorView,     // The editor view
  getPos: () => number, // Get node's position
  decorations: Decoration[] // Node decorations
) {
  // ...
}
```

## Registering Node Views

### In EditorView

```ts
import { EditorView } from 'prosemirror-view'

const view = new EditorView(editorElement, {
  state,
  nodeViews: {
    myNode: myNodeView,
  },
})
```

### In Plugin

```ts
import { Plugin } from 'prosemirror-state'

const myPlugin = new Plugin({
  props: {
    nodeViews: {
      myNode: myNodeView,
    },
  },
})
```

## Editable Node Views

### With Content DOM

```ts
function editableNodeView(node, view, getPos) {
  const dom = document.createElement('div')
  dom.className = 'editable-node'
  
  const contentDOM = document.createElement('div')
  contentDOM.className = 'content'
  dom.appendChild(contentDOM)
  
  return {
    dom,
    contentDOM, // Content renders here
    update(node) {
      return node.type.name === 'editableNode'
    },
  }
}
```

## Non-Editable Node Views

### Atomic Nodes

```ts
function imageNodeView(node, view, getPos) {
  const dom = document.createElement('div')
  dom.className = 'image-node'
  
  const img = document.createElement('img')
  img.src = node.attrs.src
  img.alt = node.attrs.alt
  dom.appendChild(img)
  
  return {
    dom,
    stopEvent(event) {
      // Stop all events (node is non-editable)
      return true
    },
  }
}
```

## Interactive Node Views

### With Event Handlers

```ts
function interactiveNodeView(node, view, getPos) {
  const dom = document.createElement('div')
  dom.className = 'interactive-node'
  
  const button = document.createElement('button')
  button.textContent = 'Click me'
  button.addEventListener('click', () => {
    // Update node attributes
    const pos = getPos()
    const tr = view.state.tr
    tr.setNodeMarkup(pos, undefined, {
      ...node.attrs,
      clicked: true,
    })
    view.dispatch(tr)
  })
  dom.appendChild(button)
  
  return {
    dom,
    update(node) {
      return node.type.name === 'interactiveNode'
    },
  }
}
```

## Vue Component Node Views

### Using Vue Components

```ts
import { createApp } from 'vue'
import MyNodeComponent from './MyNodeComponent.vue'

function vueNodeView(node, view, getPos) {
  const container = document.createElement('div')
  
  const app = createApp(MyNodeComponent, {
    node,
    view,
    getPos,
  })
  
  app.mount(container)
  
  return {
    dom: container,
    update(node) {
      // Update Vue component props
      return node.type.name === 'myNode'
    },
    destroy() {
      app.unmount()
    },
  }
}
```

### Vue Component Example

```vue
<!-- MyNodeComponent.vue -->
<template>
  <div class="my-node" :class="{ clicked: node.attrs.clicked }">
    <slot />
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup lang="ts">
import { Node } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'

const props = defineProps<{
  node: Node
  view: EditorView
  getPos: () => number
}>()

function handleClick() {
  const pos = props.getPos()
  const tr = props.view.state.tr
  tr.setNodeMarkup(pos, undefined, {
    ...props.node.attrs,
    clicked: true,
  })
  props.view.dispatch(tr)
}
</script>
```

## Decorations in Node Views

### Receiving Decorations

```ts
function myNodeView(node, view, getPos, decorations) {
  // decorations is an array of Decoration objects
  console.log('Node decorations:', decorations)
  
  return {
    dom,
    update(node, decorations) {
      // Updated decorations available here
      return true
    },
  }
}
```

## Event Filtering

### stopEvent

```ts
function myNodeView(node, view, getPos) {
  return {
    dom,
    stopEvent(event) {
      // Return true to prevent event from reaching editor
      if (event.type === 'mousedown') {
        return true // Handle mousedown ourselves
      }
      return false
    },
  }
}
```

### ignoreMutation

```ts
function myNodeView(node, view, getPos) {
  return {
    dom,
    ignoreMutation(mutation) {
      // Return true to ignore mutation
      if (mutation.type === 'childList') {
        return true // Ignore child changes
      }
      return false
    },
  }
}
```

## Complete Example: Code Block

```ts
import { NodeView } from 'prosemirror-view'
import { Node } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'

class CodeBlockView implements NodeView {
  dom: HTMLDivElement
  textarea: HTMLTextAreaElement
  node: Node
  view: EditorView
  getPos: () => number
  
  constructor(node: Node, view: EditorView, getPos: () => number) {
    this.node = node
    this.view = view
    this.getPos = getPos
    
    this.dom = document.createElement('div')
    this.dom.className = 'code-block'
    
    this.textarea = document.createElement('textarea')
    this.textarea.value = node.textContent
    this.textarea.addEventListener('input', this.handleInput.bind(this))
    this.dom.appendChild(this.textarea)
  }
  
  handleInput() {
    const pos = this.getPos()
    const tr = this.view.state.tr
    tr.replaceWith(pos + 1, pos + 1 + this.node.content.size, 
      this.view.state.schema.text(this.textarea.value))
    this.view.dispatch(tr)
  }
  
  update(node: Node) {
    if (node.type.name !== 'codeBlock') return false
    this.node = node
    this.textarea.value = node.textContent
    return true
  }
  
  stopEvent(event: Event) {
    return true // Handle all events ourselves
  }
  
  destroy() {
    // Cleanup
  }
}
```
