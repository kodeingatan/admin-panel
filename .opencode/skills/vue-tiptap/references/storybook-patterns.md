# Storybook Patterns

## Basic Story

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import TiptapEditor from './TiptapEditor.vue'

const meta: Meta<typeof TiptapEditor> = {
  title: 'Editor/TiptapEditor',
  component: TiptapEditor,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Editor content (HTML)',
    },
    editable: {
      control: 'boolean',
      description: 'Enable/disable editing',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: '<p>Hello World</p>',
    editable: true,
  },
}

export const ReadOnly: Story = {
  args: {
    modelValue: '<p>This is read-only content</p>',
    editable: false,
  },
}

export const WithPlaceholder: Story = {
  args: {
    modelValue: '',
    editable: true,
    placeholder: 'Start typing...',
  },
}
```

## Complex Story with Controls

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import TiptapEditor from './TiptapEditor.vue'

const meta: Meta<typeof TiptapEditor> = {
  title: 'Editor/TiptapEditor',
  component: TiptapEditor,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    editable: { control: 'boolean' },
    extensions: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { TiptapEditor },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <div>
        <div style="margin-bottom: 16px; padding: 8px; background: #f5f5f5;">
          <strong>Current Content:</strong>
          <pre style="white-space: pre-wrap; font-size: 12px;">{{ content }}</pre>
        </div>
        <TiptapEditor v-model="content" v-bind="args" />
      </div>
    `,
  }),
  args: {
    modelValue: '<p>Try editing this content</p>',
    editable: true,
  },
}
```

## Story with Different Extensions

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import TiptapEditor from './TiptapEditor.vue'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const meta: Meta<typeof TiptapEditor> = {
  title: 'Editor/TiptapEditor',
  component: TiptapEditor,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: {
    modelValue: '<p>Try adding an image:</p><img src="https://picsum.photos/200" />',
    editable: true,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
  },
}

export const WithLink: Story = {
  args: {
    modelValue: '<p>Click this <a href="https://tiptap.dev">link</a></p>',
    editable: true,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
  },
}

export const WithPlaceholder: Story = {
  args: {
    modelValue: '',
    editable: true,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type something...',
      }),
    ],
  },
}
```

## Toolbar Story

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import TiptapEditorWithToolbar from './TiptapEditorWithToolbar.vue'

const meta: Meta<typeof TiptapEditorWithToolbar> = {
  title: 'Editor/TiptapEditorWithToolbar',
  component: TiptapEditorWithToolbar,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    editable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: '<h2>Title</h2><p>Content with <strong>bold</strong> and <em>italic</em></p>',
    editable: true,
  },
}

export const WithToolbar: Story = {
  render: (args) => ({
    components: { TiptapEditorWithToolbar },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <div>
        <p style="margin-bottom: 8px;">Editor with toolbar:</p>
        <TiptapEditorWithToolbar v-model="content" v-bind="args" />
      </div>
    `,
  }),
  args: {
    modelValue: '<p>Edit this content</p>',
    editable: true,
  },
}
```

## Play Function for Testing

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from '@storybook/test'
import TiptapEditor from './TiptapEditor.vue'

const meta: Meta<typeof TiptapEditor> = {
  title: 'Editor/TiptapEditor',
  component: TiptapEditor,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Editable: Story = {
  args: {
    modelValue: '<p>Initial content</p>',
    editable: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox')
    
    // Click to focus
    await userEvent.click(editor)
    
    // Type new content
    await userEvent.keyboard('Hello World')
    
    // Verify content changed
    await expect(editor).toHaveTextContent('Hello World')
  },
}
```

## Accessibility Testing

```ts
export const Accessible: Story = {
  args: {
    modelValue: '<p>Accessible content</p>',
    editable: true,
  },
  parameters: {
    a11y: {
      element: '.tiptap',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
}
```

## Documentation

```ts
export const Documentation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A rich text editor built with Tiptap for Vue 3.',
      },
    },
  },
}
```

## Controls Configuration

```ts
const meta: Meta<typeof TiptapEditor> = {
  title: 'Editor/TiptapEditor',
  component: TiptapEditor,
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'HTML content',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '<p></p>' },
      },
    },
    editable: {
      control: 'boolean',
      description: 'Enable/disable editing',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when empty',
      table: {
        type: { summary: 'string' },
      },
    },
  },
}
```
