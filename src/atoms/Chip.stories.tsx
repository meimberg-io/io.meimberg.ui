import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Chip} from './Chip'
import {Folder, Sparkles, Check} from './icons'

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  args: {
    children: 'Today',
    active: false,
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Inactive: Story = {}

export const Active: Story = {args: {active: true, children: 'Today'}}

export const WithIcon: Story = {
  args: {active: true, icon: Folder, children: 'Projects'},
}

export const WithCount: Story = {
  args: {active: true, icon: Sparkles, count: 3, children: 'Urgent'},
}

export const Toggleable: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState(false)
      return (
        <Chip
          active={active}
          icon={Check}
          onClick={() => setActive(v => !v)}
        >
          Toggle me
        </Chip>
      )
    }
    return <Demo />
  },
}

/**
 * `size='md'` für Property-Bars in Editor-Surfaces. Rounded-md, 32 px
 * hoch, 14 px Font — aligned zu Form-Triggern (Dropdown/DatePicker size='sm').
 * Default bleibt `sm` (Pill, 24 px) für Filter-Bars.
 */
export const SizeMedium: Story = {
  args: {size: 'md', icon: Check, children: 'Done', active: true},
}

export const SizeMediumInactive: Story = {
  args: {size: 'md', icon: Check, children: 'Open', active: false},
}

export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="sm" icon={Check} active>Done (sm)</Chip>
      <Chip size="md" icon={Check} active>Done (md)</Chip>
    </div>
  ),
}
