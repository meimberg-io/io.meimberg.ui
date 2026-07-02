import type {Meta, StoryObj} from '@storybook/react-vite'
import {ThemeToggle} from './ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Atoms/ThemeToggle',
  component: ThemeToggle,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {}

export const InTopbarRow: Story = {
  render: () => (
    <div className="flex items-center justify-between border border-border rounded-md px-4 py-2 max-w-md">
      <span className="body-sm text-muted-foreground">Topbar mock</span>
      <ThemeToggle />
    </div>
  ),
}
