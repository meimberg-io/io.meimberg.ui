import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {WeightDots, type WeightValue} from './WeightDots'

const meta: Meta<typeof WeightDots> = {
  title: 'Atoms/WeightDots',
  component: WeightDots,
  args: {
    value: 3,
    readOnly: false,
  },
  argTypes: {
    value: {
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5],
    },
  },
}

export default meta
type Story = StoryObj<typeof WeightDots>

export const Default: Story = {}

export const ReadOnly: Story = {
  args: {value: 4, readOnly: true},
}

export const AllValues: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {([1, 2, 3, 4, 5] as WeightValue[]).map(v => (
        <div key={v} className="flex flex-col items-center gap-1">
          <WeightDots value={v} />
          <span className="caption text-muted-foreground">value={v}</span>
        </div>
      ))}
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<WeightValue>(3)
      return (
        <div className="flex flex-col items-start gap-2">
          <WeightDots value={value} onChange={setValue} />
          <span className="caption text-muted-foreground">value={value}</span>
        </div>
      )
    }
    return <Demo />
  },
}
