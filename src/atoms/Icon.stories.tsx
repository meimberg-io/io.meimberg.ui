import type {Meta, StoryObj} from '@storybook/react-vite'
import {Icon} from './Icon'
import {Inbox, Sparkles, Check, X} from './icons'

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  args: {
    icon: Inbox,
    size: 'md',
  },
  argTypes: {
    size: {control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg']},
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      <Icon icon={Inbox} size="xs" />
      <Icon icon={Inbox} size="sm" />
      <Icon icon={Inbox} size="md" />
      <Icon icon={Inbox} size="lg" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon={Inbox} size="md" />
      <Icon icon={Sparkles} size="md" className="text-primary" />
      <Icon icon={Check} size="md" className="text-success" />
      <Icon icon={X} size="md" className="text-destructive" />
    </div>
  ),
}
