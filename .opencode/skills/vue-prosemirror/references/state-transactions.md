# State & Transactions

## Editor State

The editor state holds all editor data and is immutable.

### Creating State

```ts
import { EditorState } from 'prosemirror-state'

const state = EditorState.create({
  schema: mySchema,
  doc: initialDoc,
  selection: initialSelection,
  plugins: [...],
})
```

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `doc` | `Node` | Current document |
| `selection` | `Selection` | Current selection |
| `storedMarks` | `Mark[]` | Marks for next input |
| `schema` | `Schema` | Document schema |
| `plugins` | `Plugin[]` | Active plugins |

### State Methods

```ts
// Apply transaction
const newState = state.apply(tr)

// Get transaction from state
const tr = state.tr

// Reconfigure with new plugins
const newState = state.reconfigure({ plugins: [...] })

// Serialize to JSON
const json = state.toJSON()

// Deserialize from JSON
const state = EditorState.fromJSON({ schema: mySchema }, json)
```

## Transactions

Transactions are immutable changes to state.

### Creating Transactions

```ts
// Get transaction from state
const tr = state.tr

// Transaction is a subclass of Transform
tr.insertText('Hello')
tr.delete(0, 5)
tr.setSelection(TextSelection.create(tr.doc, 0))
```

### Transaction Methods

```ts
// Text operations
tr.insertText('Hello', from, to)
tr.replaceWith(from, to, slice)
tr.delete(from, to)

// Selection
tr.setSelection(newSelection)
tr.scrollIntoView()

// Marks
tr.addMark(from, to, mark)
tr.removeMark(from, to, mark)
tr.setStoredMarks(marks)

// Metadata
tr.setMeta('myKey', value)
tr.getMeta('myKey')

// Apply
const newState = state.apply(tr)
```

### Transaction Chaining

```ts
const tr = state.tr
  .insertText('Hello')
  .insertText(' World')
  .setSelection(TextSelection.create(tr.doc, 11))

const newState = state.apply(tr)
```

## Selection

Selections represent the cursor or selected range.

### Selection Types

| Type | Description |
|------|-------------|
| `TextSelection` | Cursor or text range |
| `NodeSelection` | Selected node |
| `AllSelection` | Entire document |

### TextSelection

```ts
import { TextSelection } from 'prosemirror-state'

// Create cursor at position
const cursor = TextSelection.create(doc, 5)

// Create selection range
const range = TextSelection.create(doc, 5, 10)

// Access properties
cursor.from // 5
cursor.to // 5
cursor.anchor // 5
cursor.head // 5
cursor.empty // true
cursor.$from // ResolvedPos
cursor.$to // ResolvedPos
```

### NodeSelection

```ts
import { NodeSelection } from 'prosemirror-state'

// Select node at position
const nodeSelection = NodeSelection.create(doc, 5)

// Access selected node
nodeSelection.node // The selected Node
nodeSelection.from // Position before node
nodeSelection.to // Position after node
```

### Creating Selections from State

```ts
// At start of document
const sel = Selection.atStart(doc)

// At end of document
const sel = Selection.atEnd(doc)

// Near a position
const sel = Selection.near($pos)

// From JSON
const sel = Selection.fromJSON(doc, json)
```

## Transactions in Practice

### Insert Text

```ts
const tr = state.tr
tr.insertText('Hello World')
const newState = state.apply(tr)
```

### Replace Range

```ts
const tr = state.tr
tr.replaceWith(0, 5, mySchema.node('paragraph', null, [mySchema.text('New content')]))
const newState = state.apply(tr)
```

### Add Mark

```ts
const tr = state.tr
const mark = mySchema.marks.strong.create()
tr.addMark(0, 5, mark)
const newState = state.apply(tr)
```

### Set Selection

```ts
const tr = state.tr
tr.setSelection(TextSelection.create(tr.doc, 5))
const newState = state.apply(tr)
```

### Complete Example

```ts
import { EditorState } from 'prosemirror-state'
import { TextSelection } from 'prosemirror-state'

function insertText(state: EditorState, text: string, position: number): EditorState {
  const tr = state.tr
  tr.insertText(text, position)
  tr.setSelection(TextSelection.create(tr.doc, position + text.length))
  return state.apply(tr)
}

// Usage
const newState = insertText(state, 'Hello', 0)
```

## Resolved Positions

Resolved positions provide context about a position in the document.

### Creating ResolvedPos

```ts
const $pos = doc.resolve(5)

// Properties
$pos.pos // 5
$pos.parent // Parent node
$pos.parentOffset // Offset in parent
$pos.depth // Depth in document tree
$pos.before() // Position before parent
$pos.after() // Position after parent
$pos.doc // Document node
```

### Using ResolvedPos

```ts
const $pos = doc.resolve(5)

// Get parent node type
$pos.parent.type.name // 'paragraph'

// Get ancestors
for (let i = 0; i <= $pos.depth; i++) {
  console.log($pos.node(i).type.name)
}

// Get path
$pos.path // [0, 0, 0, ...]
```

## Stored Marks

Stored marks are applied to the next typed text.

```ts
// Get stored marks
state.storedMarks

// Set stored marks in transaction
const tr = state.tr
tr.setStoredMarks([mySchema.marks.strong.create()])

// Clear stored marks
tr.setStoredMarks(null)
```

## State from JSON

```ts
import { EditorState } from 'prosemirror-state'

const json = {
  doc: { type: 'doc', content: [...] },
  selection: { type: 'text', anchor: 5 },
}

const state = EditorState.fromJSON({ schema: mySchema }, json)
```

## State to JSON

```ts
const json = state.toJSON()

// With plugin fields
const json = state.toJSON({
  myPlugin: myPlugin,
})
```
