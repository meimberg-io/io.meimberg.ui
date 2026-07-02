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
        {value: 'count', label: 'Häufigkeit'},
        {value: 'alpha', label: 'Alphabet'},
        {value: 'recent', label: 'Zuletzt'},
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
        {value: 'list', label: 'Liste', icon: <LayoutList className="size-3" />, ariaLabel: 'Liste'},
        {value: 'cloud', label: 'Wolke', icon: <Cloud className="size-3" />, ariaLabel: 'Wolke'},
      ]}
    />
  )
}

export const TextOptions: Story = {
  name: 'Text-Optionen (Sort-Toggle)',
  render: () => <TextDemo />,
}

export const IconOptions: Story = {
  name: 'Icon + Label (Display-Toggle)',
  render: () => <IconDemo />,
}
