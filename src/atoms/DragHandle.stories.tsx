import type {Meta, StoryObj} from '@storybook/react-vite'
import {DragHandle} from './DragHandle'

const meta: Meta<typeof DragHandle> = {
  title: 'Atoms/DragHandle',
  component: DragHandle,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof DragHandle>

export const Default: Story = {}

export const InList: Story = {
  render: () => (
    <ul className="flex max-w-sm flex-col gap-1">
      {['First item', 'Second item', 'Third item'].map(item => (
        <li key={item} className="flex items-center gap-2 rounded-md border border-border px-2 py-1">
          <DragHandle />
          <span className="body-sm">{item}</span>
        </li>
      ))}
    </ul>
  ),
}

export const Disabled: Story = {
  args: {disabled: true},
}
