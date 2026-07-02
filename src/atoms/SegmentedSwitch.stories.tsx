import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SegmentedSwitch, type SegmentedOption} from './SegmentedSwitch'
import {Inbox, CheckSquare, Sparkles} from '../atoms/icons'

const meta: Meta<typeof SegmentedSwitch> = {
  title: 'Atoms/SegmentedSwitch',
  component: SegmentedSwitch,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

type BucketType = 'inbox' | 'task'
const BUCKET_TYPE_OPTIONS: ReadonlyArray<SegmentedOption<BucketType>> = [
  {value: 'inbox', label: 'Inbox', icon: <Inbox width={13} height={13} />},
  {value: 'task', label: 'Task', icon: <CheckSquare width={13} height={13} />},
]

type Priority = 'low' | 'medium' | 'high'
const PRIORITY_OPTIONS: ReadonlyArray<SegmentedOption<Priority>> = [
  {value: 'low', label: 'Niedrig'},
  {value: 'medium', label: 'Mittel'},
  {value: 'high', label: 'Hoch'},
]

type Stage = 'idea' | 'plan' | 'do' | 'review'
const STAGE_OPTIONS: ReadonlyArray<SegmentedOption<Stage>> = [
  {value: 'idea', label: 'Idee', icon: <Sparkles width={13} height={13} />},
  {value: 'plan', label: 'Plan'},
  {value: 'do', label: 'Do'},
  {value: 'review', label: 'Review'},
]

function TwoOptionsDemo() {
  const [value, setValue] = useState<BucketType>('inbox')
  return (
    <div style={{width: 220}}>
      <SegmentedSwitch value={value} options={BUCKET_TYPE_OPTIONS} onChange={setValue} />
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
        value="inbox"
        options={BUCKET_TYPE_OPTIONS}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
}
