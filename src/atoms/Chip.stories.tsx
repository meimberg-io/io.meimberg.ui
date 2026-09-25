import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Chip} from './Chip'
import {BadgeDot} from './Badge'
import {Check, Flame, Folder} from './icons'

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  args: {children: 'Today'},
  argTypes: {
    tone: {control: 'inline-radio', options: ['neutral', 'primary', 'success', 'warning', 'info', 'destructive']},
    size: {control: 'inline-radio', options: ['xs', 'sm']},
  },
}
export default meta

type Story = StoryObj<typeof Chip>

export const Inactive: Story = {}

export const Active: Story = {args: {active: true}}

export const WithIconAndCount: Story = {
  args: {active: true, icon: Flame, count: 3, children: 'Urgent'},
}

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(['neutral', 'primary', 'success', 'warning', 'info', 'destructive'] as const).map(tone => (
        <Chip key={tone} tone={tone} active>{tone}</Chip>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="xs" icon={Check} active>xs · 26</Chip>
      <Chip size="sm" icon={Check} active>sm · 32</Chip>
    </div>
  ),
}

export const Toggleable: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState(false)
      return (
        <Chip active={active} icon={Check} onClick={() => setActive(v => !v)}>
          Toggle me
        </Chip>
      )
    }
    return <Demo />
  },
}

export const Removable: Story = {
  render: () => {
    const Demo = () => {
      const [filters, setFilters] = useState(['Alpha', 'Beta', 'Gamma'])
      return (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map(f => (
            <Chip key={f} prefix="Project:" onRemove={() => setFilters(prev => prev.filter(x => x !== f))}>
              {f}
            </Chip>
          ))}
          <Chip tone="neutral" leading={<BadgeDot className="text-success" />} onRemove={() => {}}>
            Status: open
          </Chip>
        </div>
      )
    }
    return <Demo />
  },
}

/** Resize the viewport below `md`: the label disappears, the icon stays. */
export const CompactBelow: Story = {
  args: {icon: Folder, compactBelow: 'md', active: true, children: 'Projects'},
}
