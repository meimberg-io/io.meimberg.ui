import type {Meta, StoryObj} from '@storybook/react-vite'
import {FilterChip} from './FilterChip'

const meta: Meta<typeof FilterChip> = {
  title: 'Atoms/FilterChip',
  component: FilterChip,
  args: {
    onRemove: () => {},
  },
}

export default meta
type Story = StoryObj<typeof FilterChip>

export const MdWithLabel: Story = {
  name: 'md + prefix label',
  args: {
    size: 'md',
    label: 'Project:',
    children: 'Q3 Roadmap',
  },
}

export const SmPlain: Story = {
  name: 'sm without prefix (primary)',
  args: {
    size: 'sm',
    children: 'Important',
  },
}

export const SmCustomTint: Story = {
  name: 'sm + custom tint',
  args: {
    size: 'sm',
    tone: 'custom',
    className: 'bg-amber-100 text-amber-800',
    children: 'design',
  },
}
