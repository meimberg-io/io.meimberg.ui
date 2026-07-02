import type {Meta, StoryObj} from '@storybook/react-vite'
import {MetaPill} from './MetaPill'
import {Radio, ListTodo} from './icons'

const meta: Meta<typeof MetaPill> = {
  title: 'Atoms/MetaPill',
  component: MetaPill,
}

export default meta
type Story = StoryObj<typeof MetaPill>

export const WithIcon: Story = {
  args: {
    icon: <ListTodo size={12} />,
    children: 'Aufgabe',
  },
}

export const TextOnly: Story = {
  args: {
    children: 'Signal',
  },
}

export const DerivedCount: Story = {
  name: 'Derived-Count (→ counts, mit title)',
  render: () => (
    <MetaPill title="Aus diesem Inbox-Item erzeugte Items">
      →
      <span className="inline-flex items-center gap-1">
        <Radio size={12} />2
      </span>
      <span className="inline-flex items-center gap-1">
        <ListTodo size={12} />1
      </span>
    </MetaPill>
  ),
}
