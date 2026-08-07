# Editor API & Configuration

## Editor Options

```ts
const editor = new Editor({
  element: document.querySelector('.editor'),  // DOM element to bind to
  extensions: [StarterKit],                     // Required: extensions array
  content: '<p>Hello</p>',                      // Initial content (HTML or JSON)
  editable: true,                               // Enable/disable editing
  autofocus: 'end',                             // 'start' | 'end' | 'all' | false
  injectCSS: true,                              // Inject default Tiptap CSS
  enableInputRules: true,                       // Enable input rules (markdown shortcuts)
  enablePasteRules: true,                       // Enable paste rules
  textDirection: 'auto',                        // 'ltr' | 'rtl' | 'auto'
  editorProps: {
    attributes: {
      class: 'tiptap prose prose-sm',
    },
  },
  parseOptions: {
    preserveWhitespace: 'full',
  },
  // Event handlers
  onCreate: ({ editor }) => {},
  onUpdate: ({ editor }) => {},
  onFocus: ({ editor, event }) => {},
  onBlur: ({ editor, event }) => {},
  onSelectionUpdate: ({ editor }) => {},
  onTransaction: ({ editor, transaction }) => {},
  onDestroy: () => {},
})
```

## Editor Methods

### Content Access

```ts
editor.getHTML()      // Returns HTML string
editor.getJSON()      // Returns JSON object (recommended)
editor.getText()      // Returns plain text
editor.getAttributes('link')  // Get attributes of selected node/mark
```

### State Checks

```ts
editor.isEditable      // boolean - is editor editable
editor.isEmpty         // boolean - is content empty
editor.isFocused       // boolean - is editor focused
editor.isDestroyed     // boolean - is editor destroyed
```

### Commands

```ts
editor.commands.setContent('<p>New content</p>')
editor.commands.clearContent()
editor.commands.insertContent('<p>Inserted</p>')
editor.commands.insertContentAt(5, '<p>At position</p>')
```

### Chain Commands

```ts
editor
  .chain()
  .focus()
  .toggleBold()
  .toggleItalic()
  .run()

// Check if commands can execute
editor.can().toggleBold()  // Returns boolean
```

### Lifecycle

```ts
editor.setEditable(false)  // Make read-only
editor.setEditable(true)   // Make editable
editor.destroy()           // Cleanup and unmount
editor.mount(element)      // Mount to DOM element
editor.unmount()           // Unmount from DOM
```

## Vue 3 useEditor

```ts
import { useEditor, EditorContent } from '@tiptap/vue-3'

const editor = useEditor({
  content: '<p>Hello</p>',
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    console.log('Content changed:', editor.getHTML())
  },
  onFocus: ({ editor }) => {
    console.log('Editor focused')
  },
  onBlur: ({ editor }) => {
    console.log('Editor blurred')
  },
})

// Access editor instance
editor.value?.getHTML()
```

## Editor Properties

| Property | Type | Description |
|----------|------|-------------|
| `isEditable` | `boolean` | Whether editor is editable |
| `isEmpty` | `boolean` | Whether content is empty |
| `isFocused` | `boolean` | Whether editor has focus |
| `isDestroyed` | `boolean` | Whether editor is destroyed |
| `schema` | `Schema` | ProseMirror schema |
| `storage` | `object` | Extension storage access |
| `state` | `EditorState` | ProseMirror state |
| `view` | `EditorView` | ProseMirror view |
