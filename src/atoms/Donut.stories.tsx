import type {Meta, StoryObj} from '@storybook/react-vite'
import {Donut} from './Donut'

const meta: Meta<typeof Donut> = {
  title: 'Atoms/Donut',
  component: Donut,
}

export default meta
type Story = StoryObj<typeof Donut>

export const Default: Story = {
  args: {
    segments: [
      {value: 4, color: 'hsl(var(--p1))'},
      {value: 6, color: 'hsl(var(--p2))'},
      {value: 12, color: 'hsl(var(--p3))'},
      {value: 8, color: 'hsl(var(--p4))'},
    ],
    size: 96,
    strokeWidth: 10,
  },
}

export const Small: Story = {
  args: {
    segments: [
      {value: 1, color: 'hsl(var(--p1))'},
      {value: 2, color: 'hsl(var(--p2))'},
    ],
    size: 48,
    strokeWidth: 6,
  },
}

export const Empty: Story = {
  args: {
    segments: [],
    size: 64,
    strokeWidth: 8,
  },
  render: args => (
    <div className="text-muted-foreground">
      <Donut {...args} />
    </div>
  ),
}

export const SingleSegment: Story = {
  args: {
    segments: [{value: 1, color: 'hsl(var(--primary))'}],
    size: 64,
    strokeWidth: 8,
  },
}
