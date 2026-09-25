import type {Meta, StoryObj} from '@storybook/react-vite'
import {MetaPill} from './MetaPill'
import {FileText, ListTodo} from './icons'

const meta: Meta<typeof MetaPill> = {
  title: 'Atoms/MetaPill',
  component: MetaPill,
}

export default meta
type Story = StoryObj<typeof MetaPill>

export const WithIcon: Story = {
  args: {
    icon: <ListTodo size={12} />,
    children: 'Task',
  },
}

export const TextOnly: Story = {
  args: {
    children: 'Draft',
  },
}

export const DerivedCount: Story = {
  name: 'Derived count (→ counts, with title)',
  render: () => (
    <MetaPill title="Items created from this document">
      →
      <span className="inline-flex items-center gap-1">
        <FileText size={12} />2
      </span>
      <span className="inline-flex items-center gap-1">
        <ListTodo size={12} />1
      </span>
    </MetaPill>
  ),
}
