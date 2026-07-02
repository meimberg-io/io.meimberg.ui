import type {Meta, StoryObj} from '@storybook/react-vite'
import {Pill} from './Pill'

const meta: Meta<typeof Pill> = {
  title: 'Atoms/Pill',
  component: Pill,
}

export default meta
type Story = StoryObj<typeof Pill>

export const Default: Story = {
  args: {
    className: 'bg-muted text-muted-foreground border-transparent',
    children: '12',
  },
}

export const Counter: Story = {
  args: {
    className: 'bg-primary/10 text-primary border-transparent',
    children: '42',
  },
}

export const Status: Story = {
  args: {
    className: 'bg-success/15 text-success border-transparent',
    children: 'Done',
  },
}

export const Label: Story = {
  args: {
    className: 'bg-accent/40 text-foreground border-border',
    children: 'Draft',
  },
}
