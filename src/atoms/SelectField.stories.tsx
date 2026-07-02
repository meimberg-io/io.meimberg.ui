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

type Stage = 'seed' | 'sprout' | 'cluster'
const STAGES: ReadonlyArray<SelectFieldOption<Stage>> = [
  {value: 'seed', label: 'Seeds'},
  {value: 'sprout', label: 'Sprouts'},
  {value: 'cluster', label: 'Clusters'},
]

type Priority = 'none' | 'low' | 'medium' | 'high' | 'critical'
const PRIORITIES: ReadonlyArray<SelectFieldOption<Priority>> = [
  {value: 'none', label: '— Keine —'},
  {value: 'low', label: 'Niedrig'},
  {value: 'medium', label: 'Mittel'},
  {value: 'high', label: 'Hoch'},
  {value: 'critical', label: 'Kritisch'},
]

type LongOpt = `opt-${number}`
const LONG_LIST: ReadonlyArray<SelectFieldOption<LongOpt>> = Array.from({length: 50}, (_, i) => ({
  value: `opt-${i}` as LongOpt,
  label: `Option ${i + 1}`,
}))

function StageDemo({initial, size}: {initial?: Stage | null; size?: 'sm' | 'md'}) {
  const [value, setValue] = useState<Stage | null>(initial ?? null)
  return (
    <div style={{width: 220}}>
      <SelectField<Stage>
        value={value}
        options={STAGES}
        onChange={setValue}
        placeholder="Stage wählen…"
        size={size}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <StageDemo initial="sprout" />,
}

export const Empty: Story = {
  render: () => <StageDemo initial={null} />,
}

export const Small: Story = {
  render: () => <StageDemo initial="seed" size="sm" />,
}

export const Disabled: Story = {
  render: () => (
    <div style={{width: 220}}>
      <SelectField<Stage>
        value="cluster"
        options={STAGES}
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
            placeholder="Priorität…"
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
      const items: ReadonlyArray<SelectFieldOption<Stage>> = [
        {value: 'seed', label: 'Seeds'},
        {value: 'sprout', label: 'Sprouts (in Vorbereitung)', disabled: true},
        {value: 'cluster', label: 'Clusters'},
      ]
      const [value, setValue] = useState<Stage | null>('seed')
      return (
        <div style={{width: 240}}>
          <SelectField<Stage> value={value} options={items} onChange={setValue} />
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
            placeholder="Aus 50 Optionen wählen…"
          />
        </div>
      )
    }
    return <Demo />
  },
}
