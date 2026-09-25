import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SegmentedControl, type SegmentedControlOption, type SegmentedControlSize} from './SegmentedControl'
import {LayoutGrid, List, Monitor, Moon, Sun} from './icons'

const meta: Meta<typeof SegmentedControl> = {
  title: 'Atoms/SegmentedControl',
  component: SegmentedControl,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof SegmentedControl>

type Kind = 'internal' | 'client' | 'partner'
const KINDS: ReadonlyArray<SegmentedControlOption<Kind>> = [
  {value: 'internal', label: 'Internal'},
  {value: 'client', label: 'Client'},
  {value: 'partner', label: 'Partner'},
]

function Demo<T extends string>({options, initial, size, disabled}: {
  options: ReadonlyArray<SegmentedControlOption<T>>
  initial: T
  size?: SegmentedControlSize
  disabled?: boolean
}) {
  const [value, setValue] = useState<T>(initial)
  return <SegmentedControl value={value} options={options} onChange={setValue} size={size} disabled={disabled} aria-label="Demo" />
}

export const Default: Story = {
  render: () => <Demo options={KINDS} initial="client" />,
}

export const ExtraSmall: Story = {
  render: () => (
    <Demo
      size="xs"
      initial="count"
      options={[{value: 'count', label: 'Frequency'}, {value: 'name', label: 'Name'}, {value: 'recent', label: 'Recent'}]}
    />
  ),
}

export const IconAndLabel: Story = {
  render: () => (
    <Demo
      size="xs"
      initial="list"
      options={[{value: 'list', label: 'List', icon: List}, {value: 'grid', label: 'Grid', icon: LayoutGrid}]}
    />
  ),
}

export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Demo
        initial="system"
        options={[
          {value: 'light', icon: Sun, ariaLabel: 'Light'},
          {value: 'dark', icon: Moon, ariaLabel: 'Dark'},
          {value: 'system', icon: Monitor, ariaLabel: 'System'},
        ]}
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => <Demo options={KINDS} initial="internal" disabled />,
}
