# Custom Extensions

## Extension Types

### 1. Extension (Functionality)

Adds capabilities without schema changes.

```ts
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',
  
  // Storage for mutable data
  addStorage() {
    return {
      count: 0,
    }
  },
  
  // Add options
  addOptions() {
    return {
      option1: 'default',
    }
  },
  
  // Add global attributes to other extensions
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          customAttr: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-custom'),
            renderHTML: (attributes) => ({
              'data-custom': attributes.customAttr,
            }),
          },
        },
      },
    ]
  },
  
  // Add commands
  addCommands() {
    return {
      customCommand: (attributes) => ({ commands }) => {
        return commands.updateAttributes('paragraph', attributes)
      },
    }
  },
  
  // Add keyboard shortcuts
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => this.editor.commands.customCommand(),
    }
  },
  
  // Lifecycle hooks
  onCreate() {
    console.log('Extension created')
  },
  onUpdate() {
    this.storage.count += 1
  },
  onDestroy() {
    console.log('Extension destroyed')
  },
})
```

### 2. Node (Content Block)

Adds new content types to the schema.

```ts
import { Node } from '@tiptap/core'

const CustomNode = Node.create({
  name: 'customNode',
  
  // Schema definition
  group: 'block',
  content: 'inline*',
  draggable: true,
  selectable: true,
  atom: false,
  code: false,
  defining: true,
  isolating: false,
  
  // Add attributes
  addAttributes() {
    return {
      color: {
        default: 'blue',
        parseHTML: (element) => element.getAttribute('data-color'),
        renderHTML: (attributes) => ({
          'data-color': attributes.color,
        }),
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
      },
    ]
  },
  
  // Render to HTML
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-custom-node': '', ...HTMLAttributes }, 0]
  },
  
  // Add commands
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
  
  // Add input rules (markdown shortcuts)
  addInputRules() {
    return [
      {
        find: /(?:^|\s)::custom\s$/,
        handler: ({ state, range, match }) => {
          const { tr } = state
          tr.insertText('', range.from, range.to)
          tr.replaceWith(range.from, range.to, this.type.create())
        },
      },
    ]
  },
})
```

### 3. Mark (Inline Formatting)

Adds inline formatting to text.

```ts
import { Mark } from '@tiptap/core'

const CustomMark = Mark.create({
  name: 'customMark',
  
  // Schema definition
  inclusive: true,
  excludes: '_',
  spanning: true,
  exitable: false,
  
  // Add attributes
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-color'),
        renderHTML: (attributes) => ({
          'data-color': attributes.color,
        }),
      },
    }
  },
  
  // Parse from HTML
  parseHTML() {
    return [
      {
        tag: 'span[data-custom-mark]',
        getAttrs: (element) => {
          return {
            color: element.getAttribute('data-color'),
          }
        },
      },
    ]
  },
  
  // Render to HTML
  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-custom-mark': '', ...HTMLAttributes }, 0]
  },
  
  // Add commands
  addCommands() {
    return {
      setCustomMark: (attributes) => ({ commands }) => {
        return commands.setMark(this.name, attributes)
      },
      toggleCustomMark: (attributes) => ({ commands }) => {
        return commands.toggleMark(this.name, attributes)
      },
      unsetCustomMark: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
  
  // Add keyboard shortcuts
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-m': () => this.editor.commands.toggleCustomMark(),
    }
  },
  
  // Add input rules
  addInputRules() {
    return [
      {
        find: /(?:^|\s)::custom\s$/,
        handler: ({ state, range, match }) => {
          const { tr } = state
          tr.addMark(range.from, range.to, this.type.create())
        },
      },
    ]
  },
})
```

## Extending Existing Extensions

### Using .extend()

```ts
import Bold from '@tiptap/extension-bold'

const CustomBold = Bold.extend({
  // Change HTML rendering
  renderHTML({ HTMLAttributes }) {
    return ['b', HTMLAttributes, 0]  // Use <b> instead of <strong>
  },
  
  // Add keyboard shortcuts
  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.commands.toggleBold(),
    }
  },
  
  // Add options
  addOptions() {
    return {
      ...this.parent?.(),
      customOption: true,
    }
  },
})
```

### Using .configure()

```ts
const editor = useEditor({
  extensions: [
    Bold.configure({
      HTMLAttributes: {
        class: 'my-bold',
      },
    }),
  ],
})
```

## Extension Configuration Options

### addOptions()

```ts
const CustomExtension = Extension.create({
  name: 'customExtension',
  addOptions() {
    return {
      option1: 'default',
      option2: 42,
      option3: true,
    }
  },
})

// Configure when using
CustomExtension.configure({
  option1: 'custom',
  option2: 100,
})
```

### addStorage()

```ts
const CustomExtension = Extension.create({
  name: 'customExtension',
  addStorage() {
    return {
      data: [],
      count: 0,
    }
  },
  onUpdate() {
    this.storage.count += 1
    this.storage.data.push('update')
  },
})

// Access storage
editor.storage.customExtension.count
editor.storage.customExtension.data
```

## Publishing Extensions

### Create Standalone Extension

```bash
npm init tiptap-extension
```

### Project Structure

```
my-extension/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── rollup.config.js
```

### Package.json

```json
{
  "name": "@my-org/tiptap-extension-custom",
  "version": "1.0.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "@tiptap/core": "^2.0.0"
  }
}
```
