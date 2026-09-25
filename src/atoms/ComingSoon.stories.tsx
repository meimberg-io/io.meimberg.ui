import type {Meta, StoryObj} from '@storybook/react-vite'
import {ComingSoon} from './ComingSoon'

const meta: Meta<typeof ComingSoon> = {
  title: 'Atoms/ComingSoon',
  component: ComingSoon,
  args: {
    title: 'Activity feed',
  },
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

export const Wide: Story = {
  args: {title: 'Throughput', aspectRatio: '16 / 5'},
  render: args => (
    <div className="w-[480px]">
      <ComingSoon {...args} />
    </div>
  ),
}

export const Square: Story = {
  args: {title: 'Donut', aspectRatio: '1 / 1'},
  render: args => (
    <div className="w-[200px]">
      <ComingSoon {...args} />
    </div>
  ),
}
