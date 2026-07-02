import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {DatePicker} from './DatePicker'

const meta: Meta<typeof DatePicker> = {
  title: 'Atoms/DatePicker',
  component: DatePicker,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

function Demo({
  initial,
  allowClear,
  disabled,
  min,
  max,
}: {
  initial?: string | null
  allowClear?: boolean
  disabled?: boolean
  min?: string
  max?: string
}) {
  const [value, setValue] = useState<string | null>(initial ?? null)
  return (
    <div style={{width: 260}}>
      <DatePicker
        value={value}
        onChange={setValue}
        allowClear={allowClear}
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  )
}

export const Empty: Story = {
  render: () => <Demo initial={null} />,
}

export const Filled: Story = {
  render: () => <Demo initial="2026-05-19" />,
}

export const WithClear: Story = {
  render: () => <Demo initial="2026-06-01" allowClear />,
}

export const Disabled: Story = {
  render: () => <Demo initial="2026-05-19" disabled />,
}

export const WithMinMax: Story = {
  render: () => <Demo initial="2026-05-19" min="2026-05-01" max="2026-05-31" />,
}

// PUL-403-followup: kompakte Property-Bar-Variante. 32 px hoch, w-auto,
// text-sm — aligned zu Chip 'md' / OptionsDropdown 'chip'. Für
// ActionItem-Detail-Dialog & andere Editor-Property-Bars.
function SmDemo({initial, placeholder}: {initial: string | null; placeholder?: string}) {
  const [value, setValue] = useState<string | null>(initial)
  return (
    <div className='flex items-center gap-2 bg-card p-3 rounded-md border border-border'>
      <DatePicker
        value={value}
        onChange={setValue}
        size='sm'
        placeholder={placeholder}
        allowClear
      />
    </div>
  )
}

export const SmCompact: Story = {
  name: "size='sm' (Property-Bar)",
  render: () => <SmDemo initial='2026-05-19' />,
}

export const SmCompactEmpty: Story = {
  name: "size='sm' empty",
  render: () => <SmDemo initial={null} placeholder='Kein Datum' />,
}
