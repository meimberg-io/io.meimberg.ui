import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconByName} from './IconByName'

const meta: Meta<typeof IconByName> = {
  title: 'Atoms/IconByName',
  component: IconByName,
  args: {name: 'flask-conical', size: 'md'},
  argTypes: {
    size: {control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg']},
  },
}
export default meta

type Story = StoryObj<typeof IconByName>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      <IconByName name="lightbulb" size="xs" />
      <IconByName name="lightbulb" size="sm" />
      <IconByName name="lightbulb" size="md" />
      <IconByName name="lightbulb" size="lg" />
    </div>
  ),
}

export const UnknownName: Story = {
  name: 'Unknown name (renders nothing)',
  args: {name: 'no-such-icon'},
}
