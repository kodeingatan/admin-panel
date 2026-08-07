# Plugins System

## Plugin Basics

Plugins extend editor behavior by adding props, state, and event handlers.

### Creating a Plugin

```ts
import { Plugin } from 'prosemirror-state'

const myPlugin = new Plugin({
  props: {
    handleKeyDown(view, event) {
      console.log('Key pressed:', event.key)
      return false // Don't handle
    },
  },
})
```

### Plugin Spec Properties

| Property | Type | Description |
|----------|------|-------------|
| `props` | `EditorProps` | View props added by plugin |
| `state` | `StateField` | Plugin's state field |
| `key` | `PluginKey` | Unique key for plugin |
| `view` | `function` | Called when view is created |
| `filterTransaction` | `function` | Filter transactions |
| `appendTransaction` | `function` | Append transactions |

## Plugin Props

### Event Handlers

```ts
const myPlugin = new Plugin({
  props: {
    handleKeyDown(view, event) {
      // Return true to handle, false to ignore
      return false
    },
    handleTextInput(view, from, to, text) {
      // Return true to handle, false to ignore
      return false
    },
    handlePaste(view, event, slice) {
      // Return true to handle, false to ignore
      return false
    },
    handleDrop(view, event, slice, moved) {
      // Return true to handle, false to ignore
      return false
    },
    handleDOMEvents: {
      focus(view, event) {
        console.log('Editor focused')
        return false
      },
      blur(view, event) {
        console.log('Editor blurred')
        return false
      },
    },
  },
})
```

### Editor Props

```ts
const myPlugin = new Plugin({
  props: {
    // Custom attributes on editor DOM
    attributes: {
      class: 'my-editor',
      'data-placeholder': 'Start typing...',
    },
    
    // Decorations
    decorations(state) {
      return DecorationSet.empty
    },
    
    // Node views
    nodeViews: {},
    
    // Editable
    editable(state) {
      return true
    },
    
    // Transform clipboard
    transformCopied(slice) {
      return slice
    },
    
    // Transform pasted
    transformPasted(slice) {
      return slice
    },
  },
})
```

## Plugin State

### StateField

```ts
import { Plugin, PluginKey } from 'prosemirror-state'

const myKey = new PluginKey('myPlugin')

const myPlugin = new Plugin({
  key: myKey,
  state: {
    // Initialize state
    init(config, instance) {
      return { count: 0 }
    },
    
    // Apply transaction to state
    apply(tr, value, oldState, newState) {
      if (tr.getMeta(myKey)) {
        return { count: value.count + 1 }
      }
      return value
    },
  },
})

// Access plugin state
function getMyState(state: EditorState) {
  return myKey.getState(state)
}
```

### StateField Properties

| Property | Type | Description |
|----------|------|-------------|
| `init` | `function` | Initialize state value |
| `apply` | `function` | Apply transaction to state |
| `toJSON` | `function` | Serialize to JSON |
| `fromJSON` | `function` | Deserialize from JSON |

## PluginKey

PluginKey identifies plugins and provides access to their state.

### Creating a Key

```ts
import { PluginKey } from 'prosemirror-state'

const myKey = new PluginKey('myPlugin')
```

### Using a Key

```ts
// Get plugin from state
const plugin = myKey.get(state)

// Get plugin state
const pluginState = myKey.getState(state)

// Create plugin with key
const myPlugin = new Plugin({
  key: myKey,
  state: { ... },
})
```

## Plugin View

Plugins can create views that interact with the DOM.

### Creating a View

```ts
const myPlugin = new Plugin({
  view(editorView) {
    // Called when view is created
    console.log('Editor view created')
    
    return {
      // Called when state updates
      update(view, prevState) {
        console.log('State updated')
      },
      
      // Called when view is destroyed
      destroy() {
        console.log('View destroyed')
      },
    }
  },
})
```

## Filter Transaction

Plugins can filter transactions before they are applied.

```ts
const myPlugin = new Plugin({
  filterTransaction(tr, state) {
    // Return false to cancel transaction
    if (tr.getMeta('blocked')) {
      return false
    }
    return true
  },
})
```

## Append Transaction

Plugins can append additional transactions after the current one.

```ts
const myPlugin = new Plugin({
  appendTransaction(transactions, oldState, newState) {
    // Check if we need to append a transaction
    if (someCondition) {
      return newState.tr.insertText('Auto-added text')
    }
    return null
  },
})
```

## Using Plugins

### Adding to State

```ts
const state = EditorState.create({
  schema: mySchema,
  plugins: [
    myPlugin,
    anotherPlugin,
  ],
})
```

### Updating Plugins

```ts
const newState = state.reconfigure({
  plugins: [
    myPlugin,
    newPlugin,
    // anotherPlugin removed
  ],
})
```

## Example: Transaction Counter

```ts
import { Plugin, PluginKey } from 'prosemirror-state'

const transactionCounterKey = new PluginKey<number>('transactionCounter')

const transactionCounter = new Plugin({
  key: transactionCounterKey,
  state: {
    init() { return 0 },
    apply(tr, value) {
      return value + 1
    },
  },
})

// Usage
function getTransactionCount(state: EditorState): number {
  return transactionCounterKey.getState(state) ?? 0
}
```

## Example: Input Validator

```ts
import { Plugin } from 'prosemirror-state'

const inputValidator = new Plugin({
  filterTransaction(tr, state) {
    // Block transactions that would create invalid content
    if (tr.docChanged) {
      // Validate document
      const isValid = validateDocument(tr.doc)
      return isValid
    }
    return true
  },
})
```

## Example: Auto-save

```ts
import { Plugin, PluginKey } from 'prosemirror-state'

const autoSaveKey = new PluginKey('autoSave')

const autoSave = new Plugin({
  key: autoSaveKey,
  state: {
    init() { return null },
    apply(tr, value, oldState, newState) {
      if (tr.docChanged) {
        // Debounced save
        setTimeout(() => {
          saveDocument(newState.doc)
        }, 1000)
      }
      return value
    },
  },
})
```
