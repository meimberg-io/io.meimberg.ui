import type {Meta, StoryObj} from '@storybook/react-vite'
import {ComingSoon} from './ComingSoon'

const meta: Meta<typeof ComingSoon> = {
  title: 'Atoms/ComingSoon',
  component: ComingSoon,
  parameters: {layout: 'padded'},
  args: {title: 'Activity feed'},
  argTypes: {size: {control: 'inline-radio', options: ['sm', 'md', 'lg']}},
  render: args => (
    <div className="w-[420px]">
      <ComingSoon {...args} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof ComingSoon>

export const Default: Story = {}

export const WithoutTitle: Story = {
  args: {title: undefined},
}

export const CustomDescription: Story = {
  args: {title: 'Reports', description: 'Available in the next release'},
}

export const Sizes: Story = {
  render: () => (
    <div className="grid w-[420px] gap-3">
      <ComingSoon size="sm" title="Small" />
      <ComingSoon size="md" title="Medium" />
      <ComingSoon size="lg" title="Large" />
    </div>
  ),
}
