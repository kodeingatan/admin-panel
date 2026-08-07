# Extensions & StarterKit

## StarterKit

The StarterKit bundles the most common extensions for quick setup.

### Installation

```bash
npm install @tiptap/starter-kit
```

### Usage

```ts
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  extensions: [StarterKit],
})
```

### Configuration

```ts
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      // Disable extensions
      history: false,
      
      // Configure heading levels
      heading: {
        levels: [1, 2, 3],
      },
      
      // Configure code block
      codeBlock: {
        HTMLAttributes: {
          class: 'my-code-block',
        },
      },
    }),
  ],
})
```

### Included Extensions

#### Nodes
| Extension | Description |
|-----------|-------------|
| `Blockquote` | Wraps content in a blockquote |
| `BulletList` | Unordered lists with `-` or `*` |
| `CodeBlock` | Code blocks with triple backticks |
| `Document` | Root document node |
| `HardBreak` | Line breaks with Shift+Enter |
| `Heading` | H1-H6 headings |
| `HorizontalRule` | Horizontal rules with `---` |
| `ListItem` | List item support |
| `OrderedList` | Ordered lists with numbers |
| `Paragraph` | Paragraph blocks |
| `Text` | Inline text |

#### Marks
| Extension | Description |
|-----------|-------------|
| `Bold` | Bold text with `**` or Ctrl+B |
| `Code` | Inline code with `` ` `` |
| `Italic` | Italic text with `*` or Ctrl+I |
| `Strike` | Strikethrough with `~~` |

#### Extensions
| Extension | Description |
|-----------|-------------|
| `Dropcursor` | Visual cursor when dragging |
| `Gapcursor` | Clickable gaps between nodes |
| `History` | Undo/Redo with Ctrl+Z/Ctrl+Shift+Z |
| `ListKeymap` | Keyboard shortcuts for lists |
| `TrailingNode` | Adds empty paragraph at end |

## Individual Extensions

### Installing Extensions

```bash
npm install @tiptap/extension-image
npm install @tiptap/extension-table
npm install @tiptap/extension-link
npm install @tiptap/extension-placeholder
```

### Common Extensions

| Extension | Package | Description |
|-----------|---------|-------------|
| `Image` | `@tiptap/extension-image` | Image support |
| `Table` | `@tiptap/extension-table` | Table support |
| `TableRow` | `@tiptap/extension-table-row` | Table rows |
| `TableCell` | `@tiptap/extension-table-cell` | Table cells |
| `TableHeader` | `@tiptap/extension-table-header` | Table headers |
| `Link` | `@tiptap/extension-link` | Hyperlinks |
| `Placeholder` | `@tiptap/extension-placeholder` | Placeholder text |
| `Highlight` | `@tiptap/extension-highlight` | Text highlighting |
| `Underline` | `@tiptap/extension-underline` | Underline text |
| `TextAlign` | `@tiptap/extension-text-align` | Text alignment |
| `Color` | `@tiptap/extension-color` | Text color |
| `TextStyle` | `@tiptap/extension-text-style` | Required for Color |
| `TaskList` | `@tiptap/extension-task-list` | Task lists |
| `TaskItem` | `@tiptap/extension-task-item` | Task list items |
| `Lowlight` | `@tiptap/extension-code-block-lowlight` | Syntax highlighting |

### Usage with Configuration

```ts
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    Placeholder.configure({
      placeholder: 'Start typing...',
    }),
  ],
})
```

## Custom Extension Configuration

### Using .configure()

```ts
// Each extension accepts .configure() for options
Heading.configure({
  levels: [1, 2, 3],
  HTMLAttributes: {
    class: 'my-heading',
  },
})

// Chain configuration
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
  ],
})
```

### Disabling StarterKit Extensions

```ts
StarterKit.configure({
  // Disable specific extensions
  history: false,
  dropcursor: false,
  
  // Configure others
  heading: {
    levels: [1, 2],
  },
})
```
