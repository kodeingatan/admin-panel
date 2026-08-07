# Schema Basics

## Schema Structure

A ProseMirror schema defines the document structure with node types and marks.

### Basic Schema

```ts
import { Schema } from 'prosemirror-model'

const mySchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    heading: {
      group: 'block',
      content: 'text*',
      attrs: { level: { default: 1 } },
    },
    text: { inline: true },
  },
  marks: {
    strong: {},
    em: {},
  },
})
```

## Node Types

### Node Spec Properties

| Property | Type | Description |
|----------|------|-------------|
| `content` | `string` | Content expression |
| `group` | `string` | Node group (block, inline) |
| `inline` | `boolean` | Whether node is inline |
| `atom` | `boolean` | Whether node is atomic (not editable) |
| `draggable` | `boolean` | Whether node can be dragged |
| `selectable` | `boolean` | Whether node can be selected |
| `code` | `boolean` | Whether node contains code |
| `defining` | `boolean` | Whether node should be kept on replace |
| `isolating` | `boolean` | Whether node fences cursor |
| `attrs` | `object` | Node attributes |
| `toDOM` | `function` | DOM serialization |
| `parseDOM` | `array` | DOM parsing rules |

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

// Exactly two paragraphs
content: 'paragraph{2}'

// One to five paragraphs
content: 'paragraph{1,5}'

// Two or more paragraphs
content: 'paragraph{2,}'
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

### Node with Attributes

```ts
heading: {
  group: 'block',
  content: 'text*',
  attrs: {
    level: { default: 1 },
    id: { default: null },
  },
  toDOM(node) {
    return [`h${node.attrs.level}`, { id: node.attrs.id }, 0]
  },
  parseDOM: [
    { tag: 'h1', attrs: { level: 1 } },
    { tag: 'h2', attrs: { level: 2 } },
    { tag: 'h3', attrs: { level: 3 } },
  ],
}
```

## Marks

### Mark Spec Properties

| Property | Type | Description |
|----------|------|-------------|
| `inclusive` | `boolean` | Whether mark extends over adjacent text |
| `excludes` | `string` | Marks that exclude this mark |
| `spanning` | `boolean` | Whether mark can span multiple nodes |
| `toDOM` | `function` | DOM serialization |
| `parseDOM` | `array` | DOM parsing rules |

### Basic Marks

```ts
marks: {
  strong: {
    toDOM() { return ['strong', 0] },
    parseDOM: [
      { tag: 'strong' },
      { tag: 'b', getAttrs: (node) => node.style.fontWeight !== 'normal' && null },
      { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
    ],
  },
  em: {
    toDOM() { return ['em', 0] },
    parseDOM: [
      { tag: 'em' },
      { tag: 'i' },
      { style: 'font-style=italic' },
    ],
  },
}
```

### Marks with Attributes

```ts
marks: {
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    toDOM(node) {
      return ['a', { href: node.attrs.href, title: node.attrs.title }, 0]
    },
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(element) {
          return {
            href: element.getAttribute('href'),
            title: element.getAttribute('title'),
          }
        },
      },
    ],
  },
}
```

## Serialization

### toDOM

```ts
paragraph: {
  group: 'block',
  content: 'text*',
  toDOM(node) { return ['p', 0] },
}

// With attributes
heading: {
  group: 'block',
  content: 'text*',
  attrs: { level: { default: 1 } },
  toDOM(node) { return [`h${node.attrs.level}`, 0] },
}
```

### DOMOutputSpec Format

```ts
// Simple element
['p', 0]

// With attributes
['div', { class: 'container' }, 0]

// With multiple children
['ul', ['li', 0], ['li', 0]]

// Leaf node (no content hole)
['hr']

// Inline element
['strong', 0]
```

## Parsing

### parseDOM Rules

```ts
paragraph: {
  group: 'block',
  content: 'text*',
  parseDOM: [
    { tag: 'p' },
    { tag: 'div', attrs: { class: 'paragraph' } },
    { style: 'text-align', getAttrs: (value) => value === 'center' && null },
  ],
}
```

### Parse Rule Properties

| Property | Type | Description |
|----------|------|-------------|
| `tag` | `string` | CSS selector to match |
| `style` | `string` | CSS style to match |
| `getAttrs` | `function` | Extract attributes from DOM |
| `contentElement` | `string` | Element to use as content |
| `preserveWhitespace` | `string` | How to handle whitespace |

## Content Formats

### HTML Content

```ts
import { DOMParser } from 'prosemirror-model'

const parser = DOMParser.fromSchema(mySchema)
const doc = parser.parse(element)

const state = EditorState.create({
  doc,
  schema: mySchema,
})
```

### JSON Content

```ts
const doc = mySchema.nodeFromJSON(jsonContent)

const state = EditorState.create({
  doc,
  schema: mySchema,
})
```

### Plain Text

```ts
const doc = mySchema.node('doc', null, [
  mySchema.node('paragraph', null, [mySchema.text('Hello World')]),
])

const state = EditorState.create({
  doc,
  schema: mySchema,
})
```

## Schema from Basic

```ts
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
})
```

## Extending Schema

```ts
import { Schema } from 'prosemirror-model'

const baseSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    text: { inline: true },
  },
  marks: {
    strong: {},
    em: {},
  },
})

// Extend with heading
const extendedSchema = new Schema({
  nodes: baseSchema.spec.nodes.append({
    heading: {
      group: 'block',
      content: 'text*',
      attrs: { level: { default: 1 } },
    },
  }),
  marks: baseSchema.spec.marks,
})
```
