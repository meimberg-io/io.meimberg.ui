import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SelectField, type SelectFieldOption} from './SelectField'

const meta: Meta<typeof SelectField> = {
  title: 'Atoms/SelectField',
  component: SelectField,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

type Status = 'draft' | 'review' | 'published'
const STATUSES: ReadonlyArray<SelectFieldOption<Status>> = [
  {value: 'draft', label: 'Draft'},
  {value: 'review', label: 'In review'},
  {value: 'published', label: 'Published'},
]

type Priority = 'none' | 'low' | 'medium' | 'high' | 'critical'
const PRIORITIES: ReadonlyArray<SelectFieldOption<Priority>> = [
  {value: 'none', label: '— None —'},
  {value: 'low', label: 'Low'},
  {value: 'medium', label: 'Medium'},
  {value: 'high', label: 'High'},
  {value: 'critical', label: 'Critical'},
]

type LongOpt = `opt-${number}`
const LONG_LIST: ReadonlyArray<SelectFieldOption<LongOpt>> = Array.from({length: 50}, (_, i) => ({
  value: `opt-${i}` as LongOpt,
  label: `Option ${i + 1}`,
}))

function StatusDemo({initial, size}: {initial?: Status | null; size?: 'sm' | 'md'}) {
  const [value, setValue] = useState<Status | null>(initial ?? null)
  return (
    <div style={{width: 220}}>
      <SelectField<Status>
        value={value}
        options={STATUSES}
        onChange={setValue}
        placeholder="Select status…"
        size={size}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <StatusDemo initial="review" />,
}

export const Empty: Story = {
  render: () => <StatusDemo initial={null} />,
}

export const Small: Story = {
  render: () => <StatusDemo initial="draft" size="sm" />,
}

export const Disabled: Story = {
  render: () => (
    <div style={{width: 220}}>
      <SelectField<Status>
        value="published"
        options={STATUSES}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
}

export const WithSentinelClearOption: Story = {
  render: () => {
    function PriorityDemo() {
      const [value, setValue] = useState<Priority | null>('medium')
      return (
        <div style={{width: 220}}>
          <SelectField<Priority>
            value={value}
            options={PRIORITIES}
            onChange={setValue}
            placeholder="Priority…"
          />
        </div>
      )
    }
    return <PriorityDemo />
  },
}

export const WithDisabledOption: Story = {
  render: () => {
    function Demo() {
      const items: ReadonlyArray<SelectFieldOption<Status>> = [
        {value: 'draft', label: 'Draft'},
        {value: 'review', label: 'In review (coming soon)', disabled: true},
        {value: 'published', label: 'Published'},
      ]
      const [value, setValue] = useState<Status | null>('draft')
      return (
        <div style={{width: 240}}>
          <SelectField<Status> value={value} options={items} onChange={setValue} />
        </div>
      )
    }
    return <Demo />
  },
}

export const LongList: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<LongOpt | null>(null)
      return (
        <div style={{width: 240}}>
          <SelectField<LongOpt>
            value={value}
            options={LONG_LIST}
            onChange={setValue}
            placeholder="Pick one of 50 options…"
          />
        </div>
      )
    }
    return <Demo />
  },
}
