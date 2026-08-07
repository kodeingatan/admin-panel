# Styling

## Default CSS

Tiptap injects minimal CSS by default. Disable with `injectCSS: false`.

## Scoped Styles

```css
/* Target the editor container */
.tiptap {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tiptap p {
  margin: 1em 0;
}

.tiptap h1 {
  font-size: 2em;
  margin: 0.5em 0;
}

.tiptap h2 {
  font-size: 1.5em;
  margin: 0.5em 0;
}
```

## Custom Classes on Extensions

```ts
const editor = useEditor({
  extensions: [
    Paragraph.configure({
      HTMLAttributes: {
        class: 'my-paragraph',
      },
    }),
    Heading.configure({
      HTMLAttributes: {
        class: 'my-heading',
      },
    }),
    StarterKit,
  ],
})
```

## Editor Container Classes

```ts
const editor = useEditor({
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})
```

## Tailwind CSS

### Using @apply

```css
.tiptap {
  p {
    @apply my-4 first:mt-0 last:mb-0 text-base leading-relaxed;
  }

  h1 {
    @apply text-3xl font-bold mt-8 mb-4 first:mt-0 last:mb-0;
  }

  h2 {
    @apply text-2xl font-bold mt-6 mb-3 first:mt-0 last:mb-0;
  }

  strong {
    @apply font-bold;
  }

  em {
    @apply italic;
  }

  code {
    @apply bg-gray-100 px-1 rounded font-mono text-sm;
  }

  pre {
    @apply bg-gray-900 text-white p-4 rounded-lg overflow-x-auto;
  }

  pre code {
    @apply bg-transparent p-0;
  }

  blockquote {
    @apply border-l-4 border-gray-300 pl-4 italic;
  }

  ul {
    @apply list-disc pl-6;
  }

  ol {
    @apply list-decimal pl-6;
  }

  li {
    @apply mb-2;
  }

  a {
    @apply text-blue-600 underline;
  }

  img {
    @apply max-w-full h-auto rounded;
  }

  hr {
    @apply border-gray-300 my-8;
  }
}
```

### Tailwind Typography Plugin

```bash
npm install @tailwindcss/typography
```

```ts
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

```ts
const editor = useEditor({
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})
```

## Active State Styling

```css
.tiptap {
  .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
}
```

## Button Active States

```css
.toolbar button.is-active {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}

.toolbar button:hover {
  background: #f0f0f0;
}

.toolbar button.is-active:hover {
  background: #0052a3;
}
```

## Read-Only Mode

```css
.tiptap[contenteditable="false"] {
  background: #f9f9f9;
  cursor: default;
}

.tiptap[contenteditable="false"]:focus {
  outline: none;
}
```

## Code Blocks

```css
.tiptap pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

.tiptap pre code {
  background: none;
  padding: 0;
  color: inherit;
}
```

## Blockquote

```css
.tiptap blockquote {
  border-left: 3px solid #0066cc;
  margin-left: 0;
  padding-left: 16px;
  font-style: italic;
  color: #555;
}
```

## Lists

```css
.tiptap ul {
  list-style-type: disc;
  padding-left: 24px;
}

.tiptap ol {
  list-style-type: decimal;
  padding-left: 24px;
}

.tiptap li {
  margin: 4px 0;
}

.tiptap li p {
  margin: 0;
}
```

## Tables

```css
.tiptap table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.tiptap th,
.tiptap td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: left;
}

.tiptap th {
  background: #f5f5f5;
  font-weight: bold;
}

.tiptap td.selected,
.tiptap th.selected {
  background: #e8f4ff;
}
```

## Placeholder

```css
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
```

## Dark Mode

```css
.dark .tiptap {
  background: #1a1a1a;
  color: #e0e0e0;
  border-color: #333;
}

.dark .tiptap pre {
  background: #0d0d0d;
}

.dark .tiptap blockquote {
  border-left-color: #4a9eff;
  color: #aaa;
}

.dark .tiptap a {
  color: #4a9eff;
}

.dark .tiptap code {
  background: #2a2a2a;
}
```
