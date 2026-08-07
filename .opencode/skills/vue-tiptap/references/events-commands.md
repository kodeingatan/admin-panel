# Events & Commands

## Events

### Available Events

| Event | Description |
|-------|-------------|
| `beforeCreate` | Before editor view is created |
| `create` | Editor fully initialized and ready |
| `update` | Content has changed |
| `selectionUpdate` | Selection has changed |
| `transaction` | Editor state changed |
| `focus` | Editor gains focus |
| `blur` | Editor loses focus |
| `destroy` | Editor instance being destroyed |
| `paste` | Content pasted into editor |
| `drop` | Content dropped into editor |
| `delete` | Content deleted from editor |
| `contentError` | Content doesn't match schema |

### Event Handlers (Configuration)

```ts
const editor = useEditor({
  extensions: [StarterKit],
  onCreate: ({ editor }) => {
    console.log('Editor created')
  },
  onUpdate: ({ editor }) => {
    console.log('Content:', editor.getHTML())
  },
  onFocus: ({ editor, event }) => {
    console.log('Focused')
  },
  onBlur: ({ editor, event }) => {
    console.log('Blurred')
  },
  onSelectionUpdate: ({ editor }) => {
    console.log('Selection:', editor.state.selection)
  },
  onTransaction: ({ editor, transaction }) => {
    console.log('Transaction applied')
  },
  onDestroy: () => {
    console.log('Destroyed')
  },
  onPaste: (event, slice) => {
    console.log('Pasted')
  },
  onDrop: (event, slice, moved) => {
    console.log('Dropped')
  },
  onContentError: ({ editor, error, disableCollaboration }) => {
    console.error('Content error:', error)
  },
})
```

### Event Binding (Instance)

```ts
// Bind
editor.on('update', ({ editor }) => {
  console.log('Updated')
})

// Unbind
editor.off('update', onUpdateHandler)
```

## Commands

### Content Commands

| Command | Description |
|---------|-------------|
| `clearContent()` | Clear the whole document |
| `insertContent(html)` | Insert HTML at cursor |
| `insertContentAt(position, html)` | Insert at specific position |
| `setContent(html)` | Replace entire document |

### Nodes & Marks Commands

| Command | Description |
|---------|-------------|
| `clearNodes()` | Normalize nodes to paragraphs |
| `deleteNode(type)` | Delete a node |
| `extendMarkRange(type)` | Extend selection to mark |
| `setMark(type, attrs)` | Add a mark |
| `setNode(type)` | Replace range with node |
| `toggleMark(type)` | Toggle mark on/off |
| `toggleNode(type, type2)` | Toggle between nodes |
| `toggleWrap(type)` | Wrap/unwrap nodes |
| `unsetAllMarks()` | Remove all marks |
| `unsetMark(type)` | Remove specific mark |
| `updateAttributes(type, attrs)` | Update node/mark attributes |

### List Commands

| Command | Description |
|---------|-------------|
| `liftListItem(type)` | Lift list item |
| `sinkListItem(type)` | Sink list item |
| `splitListItem(type)` | Split list item |
| `toggleList(type)` | Toggle list type |
| `wrapInList(type)` | Wrap in list |

### Selection Commands

| Command | Description |
|---------|-------------|
| `blur()` | Remove focus |
| `deleteRange(range)` | Delete range |
| `deleteSelection()` | Delete selection |
| `enter()` | Trigger enter |
| `focus(position)` | Focus editor |
| `selectAll()` | Select all |
| `setNodeSelection(position)` | Set node selection |
| `setTextSelection(range)` | Set text selection |

### Chaining Commands

```ts
// Basic chain
editor.chain().focus().toggleBold().run()

// Multiple commands
editor
  .chain()
  .focus()
  .toggleBold()
  .toggleItalic()
  .run()

// Check if commands can execute
editor.can().toggleBold()  // Returns boolean
editor.can().chain().toggleBold().toggleItalic().run()  // All must be true

// First successful command
editor.commands.first(({ commands }) => [
  () => commands.undoInputRule(),
  () => commands.deleteSelection(),
])
```

### Custom Commands in Extensions

```ts
const CustomExtension = Extension.create({
  name: 'customExtension',
  addCommands() {
    return {
      customCommand: (attributes) => ({ commands }) => {
        return commands.setMark('bold', attributes)
      },
    }
  },
})

// Usage
editor.commands.customCommand({ color: 'red' })
```

### Inline Commands

```ts
editor
  .chain()
  .command(({ tr }) => {
    // Manipulate transaction directly
    tr.insertText('Custom text')
    return true
  })
  .run()
```

## Keyboard Shortcuts

### Default Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Toggle bold |
| `Ctrl/Cmd + I` | Toggle italic |
| `Ctrl/Cmd + U` | Toggle underline |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Shift + Enter` | Hard break |
| `Enter` | New paragraph |
| `Tab` | Indent (in lists/code blocks) |
| `Shift + Tab` | Outdent |

### Custom Keyboard Shortcuts

```ts
const CustomExtension = Extension.create({
  name: 'customExtension',
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-x': () => this.editor.commands.toggleStrike(),
      'Enter': () => this.editor.commands.insertContent('\n'),
    }
  },
})
```
