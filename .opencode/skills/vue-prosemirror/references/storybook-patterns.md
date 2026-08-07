# Storybook Patterns

## Basic Story

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import ProseMirrorEditor from './ProseMirrorEditor.vue'

const meta: Meta<typeof ProseMirrorEditor> = {
  title: 'Editor/ProseMirrorEditor',
  component: ProseMirrorEditor,
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
import ProseMirrorEditor from './ProseMirrorEditor.vue'

const meta: Meta<typeof ProseMirrorEditor> = {
  title: 'Editor/ProseMirrorEditor',
  component: ProseMirrorEditor,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    editable: { control: 'boolean' },
    schema: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { ProseMirrorEditor },
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
        <ProseMirrorEditor v-model="content" v-bind="args" />
      </div>
    `,
  }),
  args: {
    modelValue: '<p>Try editing this content</p>',
    editable: true,
  },
}
```

## Story with Different Schemas

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import { Schema } from 'prosemirror-model'
import ProseMirrorEditor from './ProseMirrorEditor.vue'

const basicSchema = new Schema({
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

const advancedSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'text*' },
    heading: {
      group: 'block',
      content: 'text*',
      attrs: { level: { default: 1 } },
    },
    bulletList: { group: 'block', content: 'listItem+' },
    listItem: { content: 'paragraph' },
    text: { inline: true },
  },
  marks: {
    strong: {},
    em: {},
  },
})

const meta: Meta<typeof ProseMirrorEditor> = {
  title: 'Editor/ProseMirrorEditor',
  component: ProseMirrorEditor,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const BasicSchema: Story = {
  args: {
    modelValue: '<p>Basic editor</p>',
    editable: true,
    schema: basicSchema,
  },
}

export const AdvancedSchema: Story = {
  args: {
    modelValue: '<h2>Title</h2><p>Content with <strong>bold</strong> and <em>italic</em></p>',
    editable: true,
    schema: advancedSchema,
  },
}
```

## Toolbar Story

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import ProseMirrorEditorWithToolbar from './ProseMirrorEditorWithToolbar.vue'

const meta: Meta<typeof ProseMirrorEditorWithToolbar> = {
  title: 'Editor/ProseMirrorEditorWithToolbar',
  component: ProseMirrorEditorWithToolbar,
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
    components: { ProseMirrorEditorWithToolbar },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <div>
        <p style="margin-bottom: 8px;">Editor with toolbar:</p>
        <ProseMirrorEditorWithToolbar v-model="content" v-bind="args" />
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
import ProseMirrorEditor from './ProseMirrorEditor.vue'

const meta: Meta<typeof ProseMirrorEditor> = {
  title: 'Editor/ProseMirrorEditor',
  component: ProseMirrorEditor,
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
      element: '.ProseMirror',
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
        story: 'A rich text editor built with ProseMirror for Vue 3.',
      },
    },
  },
}
```

## Controls Configuration

```ts
const meta: Meta<typeof ProseMirrorEditor> = {
  title: 'Editor/ProseMirrorEditor',
  component: ProseMirrorEditor,
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

## Story with Multiple Variants

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import ProseMirrorEditor from './ProseMirrorEditor.vue'

const meta: Meta<typeof ProseMirrorEditor> = {
  title: 'Editor/ProseMirrorEditor',
  component: ProseMirrorEditor,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    modelValue: '',
    editable: true,
  },
}

export const Simple: Story = {
  args: {
    modelValue: '<p>Simple content</p>',
    editable: true,
  },
}

export const WithFormatting: Story = {
  args: {
    modelValue: '<p><strong>Bold</strong> and <em>italic</em> text</p>',
    editable: true,
  },
}

export const WithHeadings: Story = {
  args: {
    modelValue: '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>',
    editable: true,
  },
}

export const WithLists: Story = {
  args: {
    modelValue: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
    editable: true,
  },
}
```
