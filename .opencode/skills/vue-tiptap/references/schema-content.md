# Schema & Content

## Schema Structure

Tiptap uses a strict ProseMirror schema defining content structure.

### Node Schema

```ts
Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  inline: false,
  atom: false,
  draggable: false,
  selectable: true,
  code: false,
  defining: false,
  isolating: false,
  
  addAttributes() {
    return {
      textAlign: {
        default: 'left',
      },
    }
  },
  
  parseHTML() {
    return [{ tag: 'p' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['p', HTMLAttributes, 0]
  },
})
```

### Mark Schema

```ts
Mark.create({
  name: 'bold',
  inclusive: true,
  excludes: '_',
  spanning: true,
  exitable: false,
  
  parseHTML() {
    return [
      { tag: 'strong' },
      { tag: 'b', getAttrs: (node) => node.style.fontWeight !== 'normal' && null },
      { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['strong', HTMLAttributes, 0]
  },
})
```

## Content Attribute

### Content Expressions

```ts
// Must have one or more blocks
content: 'block+'

// Must have zero or more blocks
content: 'block*'

// Allows all inline content
content: 'inline*'

// Must not have anything else than text
content: 'text*'

// Can have paragraphs or lists
content: '(paragraph|list?)+'

// Must have heading at top, then blocks
content: 'heading block+'
```

### Groups

```ts
// Block group
group: 'block'

// Inline group
group: 'inline'

// Multiple groups
group: 'block list'
```

## Content Formats

### HTML Content

```ts
const editor = useEditor({
  content: '<p>Hello <strong>World</strong></p>',
  extensions: [StarterKit],
})

// Get HTML
const html = editor.getHTML()
```

### JSON Content

```ts
const editor = useEditor({
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello ' },
          {
            type: 'text',
            text: 'World',
            marks: [{ type: 'bold' }],
          },
        ],
      },
    ],
  },
  extensions: [StarterKit],
})

// Get JSON
const json = editor.getJSON()
```

### Plain Text

```ts
const editor = useEditor({
  content: 'Hello World',
  extensions: [StarterKit],
})

// Get text
const text = editor.getText()
```

## Parsing Content

### Parse from HTML

```ts
const CustomNode = Node.create({
  name: 'customNode',
  parseHTML() {
    return [
      {
        tag: 'div[data-custom]',
        getAttrs: (element) => ({
          color: element.getAttribute('data-color'),
        }),
      },
    ]
  },
})
```

### Parse from JSON

```ts
// JSON is parsed automatically
const editor = useEditor({
  content: {
    type: 'doc',
    content: [...],
  },
  extensions: [StarterKit],
})
```

## Rendering Content

### Render to HTML

```ts
const CustomNode = Node.create({
  name: 'customNode',
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-custom': '', ...HTMLAttributes }, 0]
  },
})
```

### Render to JSON

```ts
// JSON is rendered automatically
const json = editor.getJSON()
```

## Persistence

### LocalStorage

```ts
// Save
localStorage.setItem('editor', JSON.stringify(editor.getJSON()))

// Load
const saved = localStorage.getItem('editor')
if (saved) {
  editor.commands.setContent(JSON.parse(saved))
}
```

### Database

```ts
// Save
await fetch('/api/content', {
  method: 'POST',
  body: JSON.stringify(editor.getJSON()),
})

// Load
const response = await fetch('/api/content')
const data = await response.json()
editor.commands.setContent(data)
```

## Invalid Content Handling

```ts
const editor = useEditor({
  content: invalidContent,
  enableContentCheck: true,
  onContentError: ({ editor, error, disableCollaboration }) => {
    console.error('Content error:', error)
    disableCollaboration()
    editor.setEditable(false)
  },
})
```

## Schema Validation

```ts
import { getSchema } from '@tiptap/core'

const schema = getSchema([
  Document,
  Paragraph,
  Text,
  Heading,
])

// Validate content
const isValid = schema.nodeFromJSON(jsonContent)
```

## Node Properties

| Property | Description |
|----------|-------------|
| `content` | What content the node can contain |
| `group` | Which group the node belongs to |
| `inline` | Whether node renders inline |
| `atom` | Whether node is atomic (not editable) |
| `draggable` | Whether node can be dragged |
| `selectable` | Whether node can be selected |
| `code` | Whether node contains code |
| `defining` | Whether node should be kept on replace |
| `isolating` | Whether node fences cursor |
| `whitespace` | How whitespace is parsed |
| `marks` | Which marks are allowed |
| `addAttributes` | Custom attributes |
| `parseHTML` | How to parse from HTML |
| `renderHTML` | How to render to HTML |
