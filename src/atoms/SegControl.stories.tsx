import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SegControl} from './SegControl'
import {LayoutList, Cloud} from './icons'

const meta: Meta<typeof SegControl> = {
  title: 'Atoms/SegControl',
}

export default meta
type Story = StoryObj<typeof SegControl>

function TextDemo() {
  const [value, setValue] = useState('count')
  return (
    <SegControl
      value={value}
      onChange={setValue}
      options={[
        {value: 'count', label: 'Frequency'},
        {value: 'alpha', label: 'Alphabetical'},
        {value: 'recent', label: 'Recent'},
      ]}
    />
  )
}

function IconDemo() {
  const [value, setValue] = useState('list')
  return (
    <SegControl
      value={value}
      onChange={setValue}
      options={[
        {value: 'list', label: 'List', icon: <LayoutList className="size-3" />, ariaLabel: 'List'},
        {value: 'cloud', label: 'Cloud', icon: <Cloud className="size-3" />, ariaLabel: 'Cloud'},
      ]}
    />
  )
}

export const TextOptions: Story = {
  name: 'Text options (sort toggle)',
  render: () => <TextDemo />,
}

export const IconOptions: Story = {
  name: 'Icon + label (display toggle)',
  render: () => <IconDemo />,
}
