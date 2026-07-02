import type {Meta, StoryObj} from '@storybook/react-vite'
import {FilterChip} from './FilterChip'

const meta: Meta<typeof FilterChip> = {
  title: 'Atoms/FilterChip',
  component: FilterChip,
  args: {
    onRemove: () => {},
    ariaLabel: 'Filter entfernen',
  },
}

export default meta
type Story = StoryObj<typeof FilterChip>

export const MdWithLabel: Story = {
  name: 'md + Prefix-Label (Mission-Filter)',
  args: {
    size: 'md',
    label: 'Mission:',
    children: 'Q3 Roadmap',
  },
}

export const SmPlain: Story = {
  name: 'sm ohne Prefix (primary)',
  args: {
    size: 'sm',
    children: 'Wichtig',
  },
}

export const SmCustomTint: Story = {
  name: 'sm + custom Tint (Tag-Vocab)',
  args: {
    size: 'sm',
    tone: 'custom',
    className: 'bg-amber-100 text-amber-800',
    children: 'design',
  },
}
