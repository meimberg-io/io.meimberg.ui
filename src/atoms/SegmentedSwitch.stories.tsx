import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SegmentedSwitch, type SegmentedOption} from './SegmentedSwitch'
import {FileText, CheckSquare, Sparkles} from '../atoms/icons'

const meta: Meta<typeof SegmentedSwitch> = {
  title: 'Atoms/SegmentedSwitch',
  component: SegmentedSwitch,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

type ItemType = 'document' | 'task'
const ITEM_TYPE_OPTIONS: ReadonlyArray<SegmentedOption<ItemType>> = [
  {value: 'document', label: 'Document', icon: <FileText width={13} height={13} />},
  {value: 'task', label: 'Task', icon: <CheckSquare width={13} height={13} />},
]

type Priority = 'low' | 'medium' | 'high'
const PRIORITY_OPTIONS: ReadonlyArray<SegmentedOption<Priority>> = [
  {value: 'low', label: 'Low'},
  {value: 'medium', label: 'Medium'},
  {value: 'high', label: 'High'},
]

type Stage = 'idea' | 'plan' | 'do' | 'review'
const STAGE_OPTIONS: ReadonlyArray<SegmentedOption<Stage>> = [
  {value: 'idea', label: 'Idea', icon: <Sparkles width={13} height={13} />},
  {value: 'plan', label: 'Plan'},
  {value: 'do', label: 'Do'},
  {value: 'review', label: 'Review'},
]

function TwoOptionsDemo() {
  const [value, setValue] = useState<ItemType>('document')
  return (
    <div style={{width: 220}}>
      <SegmentedSwitch value={value} options={ITEM_TYPE_OPTIONS} onChange={setValue} />
    </div>
  )
}

function ThreeOptionsDemo() {
  const [value, setValue] = useState<Priority>('medium')
  return (
    <div style={{width: 280}}>
      <SegmentedSwitch value={value} options={PRIORITY_OPTIONS} onChange={setValue} />
    </div>
  )
}

function FourOptionsDemo() {
  const [value, setValue] = useState<Stage>('plan')
  return (
    <div style={{width: 360}}>
      <SegmentedSwitch value={value} options={STAGE_OPTIONS} onChange={setValue} />
    </div>
  )
}

export const TwoOptions: Story = {
  render: () => <TwoOptionsDemo />,
}

export const ThreeOptions: Story = {
  render: () => <ThreeOptionsDemo />,
}

export const FourOptions: Story = {
  render: () => <FourOptionsDemo />,
}

export const Disabled: Story = {
  render: () => (
    <div style={{width: 220}}>
      <SegmentedSwitch
        value="document"
        options={ITEM_TYPE_OPTIONS}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
}
