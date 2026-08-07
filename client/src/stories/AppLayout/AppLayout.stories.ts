import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AppLayout from '../../components/AppLayout/AppLayout.vue'

const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john@example.com',
}

const meta: Meta<typeof AppLayout> = {
  title: 'Components/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
  args: {
    user: mockUser,
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { AppLayout },
    setup: () => ({ args }),
    template: `
      <AppLayout v-bind="args">
        <div class="p-6">
          <h1 class="text-2xl font-bold">Dashboard Content</h1>
          <p class="mt-2 text-gray-600">This is the main content area.</p>
        </div>
      </AppLayout>
    `,
  }),
}
