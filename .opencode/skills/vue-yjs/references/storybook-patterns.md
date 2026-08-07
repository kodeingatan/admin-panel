# Storybook Patterns

## Basic Story

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import YjsEditor from './YjsEditor.vue'

const meta: Meta<typeof YjsEditor> = {
  title: 'Collaborative/YjsEditor',
  component: YjsEditor,
  tags: ['autodocs'],
  argTypes: {
    room: {
      control: 'text',
      description: 'Room name for collaboration',
    },
    serverUrl: {
      control: 'text',
      description: 'WebSocket server URL',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
  },
}
```

## Story with Multiple Instances

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import YjsEditor from './YjsEditor.vue'

const meta: Meta<typeof YjsEditor> = {
  title: 'Collaborative/YjsEditor',
  component: YjsEditor,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const MultipleUsers: Story = {
  render: () => ({
    components: { YjsEditor },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <h3>User 1</h3>
          <YjsEditor room="demo-room" serverUrl="wss://localhost:1234" />
        </div>
        <div>
          <h3>User 2</h3>
          <YjsEditor room="demo-room" serverUrl="wss://localhost:1234" />
        </div>
      </div>
    `,
  }),
}
```

## Story with Offline Support

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import YjsEditor from './YjsEditor.vue'

const meta: Meta<typeof YjsEditor> = {
  title: 'Collaborative/YjsEditor',
  component: YjsEditor,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const OfflineEnabled: Story = {
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
    enableOffline: true,
  },
}
```

## Story with Awareness

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import YjsEditorWithAwareness from './YjsEditorWithAwareness.vue'

const meta: Meta<typeof YjsEditorWithAwareness> = {
  title: 'Collaborative/YjsEditorWithAwareness',
  component: YjsEditorWithAwareness,
  tags: ['autodocs'],
  argTypes: {
    room: { control: 'text' },
    serverUrl: { control: 'text' },
    userName: { control: 'text' },
    userColor: { control: 'color' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
    userName: 'John',
    userColor: '#ff0000',
  },
}

export const MultipleUsers: Story = {
  render: (args) => ({
    components: { YjsEditorWithAwareness },
    setup() {
      return { args }
    },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <h3>User 1 (John)</h3>
          <YjsEditorWithAwareness
            v-bind="args"
            userName="John"
            userColor="#ff0000"
          />
        </div>
        <div>
          <h3>User 2 (Jane)</h3>
          <YjsEditorWithAwareness
            v-bind="args"
            userName="Jane"
            userColor="#00ff00"
          />
        </div>
      </div>
    `,
  }),
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
  },
}
```

## Play Function for Testing

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from '@storybook/test'
import YjsEditor from './YjsEditor.vue'

const meta: Meta<typeof YjsEditor> = {
  title: 'Collaborative/YjsEditor',
  component: YjsEditor,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Editable: Story = {
  args: {
    room: 'test-room',
    serverUrl: 'wss://localhost:1234',
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

## Story with Controls

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import YjsEditor from './YjsEditor.vue'

const meta: Meta<typeof YjsEditor> = {
  title: 'Collaborative/YjsEditor',
  component: YjsEditor,
  tags: ['autodocs'],
  argTypes: {
    room: { control: 'text' },
    serverUrl: { control: 'text' },
    enableOffline: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {
  render: (args) => ({
    components: { YjsEditor },
    setup() {
      const room = ref(args.room)
      const serverUrl = ref(args.serverUrl)
      return { room, serverUrl, args }
    },
    template: `
      <div>
        <div style="margin-bottom: 16px; padding: 8px; background: #f5f5f5;">
          <label>Room: <input v-model="room" /></label>
          <label>Server: <input v-model="serverUrl" /></label>
        </div>
        <YjsEditor :room="room" :serverUrl="serverUrl" />
      </div>
    `,
  }),
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
  },
}
```

## Story with Status Display

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import YjsEditorWithStatus from './YjsEditorWithStatus.vue'

const meta: Meta<typeof YjsEditorWithStatus> = {
  title: 'Collaborative/YjsEditorWithStatus',
  component: YjsEditorWithStatus,
  tags: ['autodocs'],
  argTypes: {
    room: { control: 'text' },
    serverUrl: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
  },
}

export const MultipleUsers: Story = {
  render: () => ({
    components: { YjsEditorWithStatus },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <h3>User 1</h3>
          <YjsEditorWithStatus room="demo-room" serverUrl="wss://localhost:1234" />
        </div>
        <div>
          <h3>User 2</h3>
          <YjsEditorWithStatus room="demo-room" serverUrl="wss://localhost:1234" />
        </div>
      </div>
    `,
  }),
}
```

## Accessibility Testing

```ts
export const Accessible: Story = {
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
  },
  parameters: {
    a11y: {
      element: '.yjs-editor',
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
        story: 'A collaborative editor built with Yjs for Vue 3. Supports real-time sync, offline editing, and user awareness.',
      },
    },
  },
}
```

## Story with Different Editors

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import YjsProsemirrorEditor from './YjsProsemirrorEditor.vue'
import YjsTiptapEditor from './YjsTiptapEditor.vue'

const meta: Meta<typeof YjsProsemirrorEditor> = {
  title: 'Collaborative/Editors',
  tags: ['autodocs'],
}

export default meta

export const ProseMirror: StoryObj<typeof YjsProsemirrorEditor> = {
  render: () => ({
    components: { YjsProsemirrorEditor },
    template: `
      <div>
        <h3>ProseMirror Editor</h3>
        <YjsProsemirrorEditor room="demo" serverUrl="wss://localhost:1234" />
      </div>
    `,
  }),
}

export const Tiptap: StoryObj<typeof YjsTiptapEditor> = {
  render: () => ({
    components: { YjsTiptapEditor },
    template: `
      <div>
        <h3>Tiptap Editor</h3>
        <YjsTiptapEditor room="demo" serverUrl="wss://localhost:1234" />
      </div>
    `,
  }),
}
```

## Story with Version History

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import YjsEditorWithHistory from './YjsEditorWithHistory.vue'

const meta: Meta<typeof YjsEditorWithHistory> = {
  title: 'Collaborative/YjsEditorWithHistory',
  component: YjsEditorWithHistory,
  tags: ['autodocs'],
  argTypes: {
    room: { control: 'text' },
    serverUrl: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    room: 'demo-room',
    serverUrl: 'wss://localhost:1234',
  },
}
```
