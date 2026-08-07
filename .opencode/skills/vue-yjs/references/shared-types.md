# Shared Types

## Overview

Yjs provides shared types that automatically sync and persist their state. They are similar to native JavaScript data types but with CRDT capabilities.

## Y.Map

A shared type similar to JavaScript's `Map`.

### Basic Usage

```ts
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const ymap = ydoc.getMap('my-map')

// Set values
ymap.set('name', 'John')
ymap.set('age', 30)

// Get values
const name = ymap.get('name') // 'John'

// Delete values
ymap.delete('name')

// Check existence
ymap.has('name') // false

// Get size
ymap.size // 1

// Convert to JSON
ymap.toJSON() // { age: 30 }
```

### Observing Changes

```ts
ymap.observe(event => {
  // Get changed keys
  event.changes.keys.forEach((change, key) => {
    console.log(`Key "${key}" changed:`, change)
    // change.action: 'add' | 'update' | 'delete'
    // change.oldValue: previous value (for 'update' and 'delete')
  })
})

// Deep observation
ymap.observeDeep(events => {
  events.forEach(event => {
    console.log('Deep change:', event)
  })
})
```

### TypeScript

```ts
interface User {
  name: string
  color: string
}

const ymap = ydoc.getMap<User>('users')
ymap.set('user1', { name: 'John', color: '#ff0000' })
```

## Y.Array

A shared type similar to JavaScript's `Array`.

### Basic Usage

```ts
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const yarray = ydoc.getArray('my-array')

// Insert items
yarray.insert(0, ['a', 'b', 'c'])
yarray.insert(1, ['x']) // ['a', 'x', 'b', 'c']

// Delete items
yarray.delete(1, 2) // ['a', 'c']

// Get items
const item = yarray.get(0) // 'a'

// Get length
yarray.length // 2

// Convert to array
yarray.toArray() // ['a', 'c']

// Push items
yarray.push(['d']) // ['a', 'c', 'd']

// Unshift items
yarray.unshift(['z']) // ['z', 'a', 'c', 'd']
```

### Observing Changes

```ts
yarray.observe(event => {
  event.changes.delta.forEach(change => {
    if (change.insert) {
      console.log('Inserted:', change.insert)
    }
    if (change.delete) {
      console.log('Deleted count:', change.delete)
    }
    if (change.retain) {
      console.log('Retained count:', change.retain)
    }
  })
})
```

### Nested Types

```ts
const yarray = ydoc.getArray('nested')
const nestedMap = new Y.Map()
nestedMap.set('key', 'value')
yarray.insert(0, [nestedMap])

// Observe deep changes
yarray.observeDeep(events => {
  events.forEach(event => {
    console.log('Deep change in array:', event)
  })
})
```

## Y.Text

A shared type for text with formatting support.

### Basic Usage

```ts
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const ytext = ydoc.getText('my-text')

// Insert text
ytext.insert(0, 'Hello World')

// Delete text
ytext.delete(5, 6) // Removes ' World'

// Get text length
ytext.length // 5

// Convert to string
ytext.toString() // 'Hello'

// Get plain text
ytext.toDelta() // [{ insert: 'Hello' }]
```

### Formatting (Marks)

```ts
// Apply bold formatting
ytext.format(0, 5, { bold: true })

// Apply multiple formats
ytext.format(0, 5, { bold: true, italic: true })

// Remove formatting
ytext.removeFormat(0, 5)

// Get formatted content
ytext.toDelta()
// [{ insert: 'Hello', attributes: { bold: true } }]
```

### Observing Changes

```ts
ytext.observe(event => {
  event.changes.delta.forEach(change => {
    if (change.insert) {
      console.log('Inserted:', change.insert)
    }
    if (change.delete) {
      console.log('Deleted count:', change.delete)
    }
    if (change.retain) {
      console.log('Retained count:', change.retain)
    }
  })
})
```

### Embedding Objects

```ts
// Insert embed
ytext.insertEmbed(0, { image: 'https://example.com/img.png' })

// Insert with attributes
ytext.insertEmbed(0, { mention: { name: 'John' } }, { color: 'blue' })
```

## Y.XmlFragment

A shared type for managing a collection of XML nodes.

### Basic Usage

```ts
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const yxml = ydoc.getXmlFragment('my-xml')

// Insert XML elements
const p = new Y.XmlElement('p')
p.insert(0, [new Y.XmlText('Hello')])
yxml.insert(0, [p])

// Get children
const children = yxml.toArray()

// Convert to string
yxml.toString() // '<p>Hello</p>'
```

## Y.XmlElement

A shared type representing an XML node.

### Basic Usage

```ts
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const yxml = ydoc.getXmlFragment('my-xml')

// Create element
const heading = new Y.XmlElement('h1')
heading.insert(0, [new Y.XmlText('Title')])

// Set attributes
heading.setAttribute('class', 'title')

// Get attributes
heading.getAttribute('class') // 'title'

// Insert into fragment
yxml.insert(0, [heading])
```

## Y.XmlText

Extends Y.Text to represent an XML text node.

### Basic Usage

```ts
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const yxml = ydoc.getXmlFragment('my-xml')

// Create element with text
const p = new Y.XmlElement('p')
const text = new Y.XmlText()
text.insert(0, 'Hello')
text.format(0, 5, { bold: true })
p.insert(0, [text])

yxml.insert(0, [p])
```

## Caveats

### 1. Shared Types Can't Be Moved

Once a shared type is inserted into the document, it can't be moved to another position.

```ts
const yarray = ydoc.getArray('array')
const ymap = ydoc.getMap('map')

// This will throw an error
ymap.set('key', yarray)
yarray.insert(0, [ymap]) // Error!
```

### 2. Don't Mutate JSON Objects

Yjs doesn't clone inserted objects. Mutating them directly can cause sync issues.

```ts
const ymap = ydoc.getMap('my-map')
const obj = { val: 0 }
ymap.set('obj', obj)

// DON'T do this
obj.val = 1 // Bad!

// DO this instead
ymap.set('obj', { ...obj, val: 1 }) // Good!
```

### 3. Use Transactions for Batch Updates

Bundle multiple changes in a transaction to reduce observer calls and network updates.

```ts
ydoc.transact(() => {
  ymap.set('a', 1)
  ymap.set('b', 2)
  yarray.insert(0, ['item'])
})
```

## Complete Example

### Shared Todo List

```vue
<template>
  <div>
    <input v-model="newTodo" @keyup.enter="addTodo" />
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        <input
          type="checkbox"
          :checked="todo.done"
          @change="toggleTodo(index)"
        />
        <span :class="{ done: todo.done }">{{ todo.text }}</span>
        <button @click="removeTodo(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

interface Todo {
  text: string
  done: boolean
}

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('wss://localhost:1234', 'todos', ydoc)
const yarray = ydoc.getArray<Todo>('todos')

const newTodo = ref('')
const todos = ref<Todo[]>([])

onMounted(() => {
  yarray.observe(() => {
    todos.value = yarray.toArray()
  })
})

function addTodo() {
  if (!newTodo.value.trim()) return
  ydoc.transact(() => {
    yarray.push([{ text: newTodo.value, done: false }])
  })
  newTodo.value = ''
}

function toggleTodo(index: number) {
  const todo = yarray.get(index)
  yarray.delete(index, 1)
  yarray.insert(index, [{ ...todo, done: !todo.done }])
}

function removeTodo(index: number) {
  yarray.delete(index, 1)
}

onBeforeUnmount(() => {
  provider.disconnect()
  ydoc.destroy()
})
</script>

<style scoped>
.done {
  text-decoration: line-through;
  color: #999;
}
</style>
```
