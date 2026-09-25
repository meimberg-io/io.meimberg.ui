import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {IconPicker} from './IconPicker'

const meta: Meta<typeof IconPicker> = {
  title: 'Molecules/IconPicker',
  component: IconPicker,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof IconPicker>

function Demo({initial}: {initial: string | null}) {
  const [value, setValue] = useState<string | null>(initial)
  return <IconPicker value={value} onChange={setValue} />
}

export const Empty: Story = {
  render: () => <Demo initial={null} />,
}

export const WithValue: Story = {
  render: () => <Demo initial="lightbulb" />,
}
