# Commands

## Command Type

Commands are functions that create and dispatch transactions.

### Command Signature

```ts
type Command = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView
) => boolean
```

### Command Behavior

1. Check if command can execute in current state
2. If `dispatch` is provided, create and dispatch transaction
3. Return `true` if command succeeded, `false` otherwise

## Base Commands

### Text Commands

```ts
import {
  deleteSelection,
  joinBackward,
  joinForward,
  selectBackward,
  selectForward,
  liftEmptyBlock,
  splitBlock,
  createParagraphNear,
  wrapIn,
  setBlockType,
} from 'prosemirror-commands'

// Delete selected content
deleteSelection(state, dispatch)

// Join with previous block
joinBackward(state, dispatch)

// Join with next block
joinForward(state, dispatch)

// Select backward
selectBackward(state, dispatch)

// Select forward
selectForward(state, dispatch)

// Lift empty block
liftEmptyBlock(state, dispatch)

// Split block
splitBlock(state, dispatch)

// Create paragraph near
createParagraphNear(state, dispatch)

// Wrap in node type
wrapIn(mySchema.nodes.blockquote)(state, dispatch)

// Set block type
setBlockType(mySchema.nodes.heading, { level: 1 })(state, dispatch)
```

## Creating Custom Commands

### Basic Command

```ts
import { Command } from 'prosemirror-state'

const insertHello: Command = (state, dispatch) => {
  if (dispatch) {
    const tr = state.tr.insertText('Hello')
    dispatch(tr)
  }
  return true
}
```

### Command with Parameters

```ts
function insertText(text: string): Command {
  return (state, dispatch) => {
    if (dispatch) {
      const tr = state.tr.insertText(text)
      dispatch(tr)
    }
    return true
  }
}

// Usage
insertText('Hello')(state, dispatch)
```

### Command with View

```ts
function insertAtCursor(text: string): Command {
  return (state, dispatch, view) => {
    if (dispatch) {
      const tr = state.tr.insertText(text)
      dispatch(tr)
    }
    return true
  }
}
```

## Command Examples

### Toggle Mark

```ts
function toggleMark(markType: MarkType): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection
    const marks = state.doc.marksAt(from)
    const mark = marks.find(m => m.type === markType)
    
    const tr = state.tr
    if (mark) {
      tr.removeMark(from, to, markType)
    } else {
      tr.addMark(from, to, markType.create())
    }
    
    if (dispatch) {
      dispatch(tr)
    }
    return true
  }
}
```

### Insert Node

```ts
function insertNode(nodeType: NodeType, attrs?: Record<string, any>): Command {
  return (state, dispatch) => {
    const node = nodeType.createAndFill(attrs)
    if (!node) return false
    
    if (dispatch) {
      const tr = state.tr.replaceSelectionWith(node)
      dispatch(tr)
    }
    return true
  }
}
```

### Wrap in Blockquote

```ts
function wrapInBlockquote(): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection
    const range = state.doc.resolve(from).blockRange(state.doc.resolve(to))
    
    if (!range) return false
    
    const wrapping = findWrapping(range, state.schema.nodes.blockquote)
    if (!wrapping) return false
    
    if (dispatch) {
      const tr = state.tr.wrap(range, wrapping)
      dispatch(tr)
    }
    return true
  }
}
```

## Command Chains

### Using Chain

```ts
import { Transaction } from 'prosemirror-state'

function chainCommands(...commands: Command[]): Command {
  return (state, dispatch) => {
    for (const cmd of commands) {
      if (cmd(state, dispatch)) {
        return true
      }
    }
    return false
  }
}

// Usage
const myCommand = chainCommands(
  deleteSelection,
  joinBackward,
  selectBackward
)
```

### Chaining Transactions

```ts
function insertAndFormat(text: string, markType: MarkType): Command {
  return (state, dispatch) => {
    if (!dispatch) return true
    
    const tr = state.tr
    tr.insertText(text)
    tr.addMark(0, text.length, markType.create())
    dispatch(tr)
    
    return true
  }
}
```

## Keymaps

### Basic Keymap

```ts
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { undo, redo } from 'prosemirror-history'

const myKeymap = keymap({
  'Mod-z': undo,
  'Mod-y': redo,
  ...baseKeymap,
})
```

### Custom Keymap

```ts
const customKeymap = keymap({
  'Mod-b': toggleMark(schema.marks.strong),
  'Mod-i': toggleMark(schema.marks.em),
  'Mod-Enter': splitBlock,
  'Shift-Enter': (state, dispatch) => {
    if (dispatch) {
      const tr = state.tr
      tr.replaceSelectionWith(schema.nodes.hardBreak.create())
      dispatch(tr)
    }
    return true
  },
})
```

## Command Groups

### Text Editing Commands

```ts
import {
  deleteSelection,
  joinBackward,
  joinForward,
  selectBackward,
  selectForward,
  liftEmptyBlock,
  splitBlock,
  createParagraphNear,
  wrapIn,
  setBlockType,
} from 'prosemirror-commands'

// Backspace behavior
const backspace = chainCommands(
  deleteSelection,
  joinBackward,
  selectBackward
)

// Enter behavior
const enter = chainCommands(
  splitBlock,
  liftEmptyBlock,
  createParagraphNear
)
```

## Command with Conditions

### Check Before Executing

```ts
function insertHeading(level: number): Command {
  return (state, dispatch) => {
    const { from } = state.selection
    const $pos = state.doc.resolve(from)
    
    // Check if we're in a textblock
    if (!$pos.parent.isTextblock) {
      return false
    }
    
    if (dispatch) {
      const tr = state.tr
      tr.setBlockType(from, from + $pos.parent.nodeSize - 2, schema.nodes.heading, { level })
      dispatch(tr)
    }
    return true
  }
}
```

## Example: Toolbar Commands

```ts
import { toggleMark } from 'prosemirror-commands'
import { wrapIn } from 'prosemirror-commands'

const commands = {
  bold: toggleMark(schema.marks.strong),
  italic: toggleMark(schema.marks.em),
  heading1: setBlockType(schema.nodes.heading, { level: 1 }),
  heading2: setBlockType(schema.nodes.heading, { level: 2 }),
  heading3: setBlockType(schema.nodes.heading, { level: 3 }),
  blockquote: wrapIn(schema.nodes.blockquote),
  bulletList: wrapIn(schema.nodes.bulletList),
  orderedList: wrapIn(schema.nodes.orderedList),
}

// Usage in Vue component
function executeCommand(command: Command) {
  if (view) {
    command(view.state, view.dispatch)
  }
}
```

## Using Commands in Vue

### Command Handler

```ts
import { EditorView } from 'prosemirror-view'
import { Command } from 'prosemirror-state'

function useCommands(view: Ref<EditorView | null>) {
  function execute(command: Command) {
    if (view.value) {
      command(view.value.state, view.value.dispatch)
    }
  }

  return {
    execute,
    bold: () => execute(toggleMark(schema.marks.strong)),
    italic: () => execute(toggleMark(schema.marks.em)),
    heading: (level: number) => execute(setBlockType(schema.nodes.heading, { level })),
  }
}
```
