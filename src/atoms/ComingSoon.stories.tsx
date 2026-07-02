import type {Meta, StoryObj} from '@storybook/react-vite'
import {ComingSoon} from './ComingSoon'

const meta: Meta<typeof ComingSoon> = {
  title: 'Atoms/ComingSoon',
  component: ComingSoon,
  args: {
    label: 'KPI-Strip',
    dashlet: 'context-kpi-strip',
  },
}

export default meta
type Story = StoryObj<typeof ComingSoon>

export const Default: Story = {}

export const Wide: Story = {
  args: {label: 'Throughput', aspectRatio: '16 / 5'},
  render: args => (
    <div className="w-[480px]">
      <ComingSoon {...args} />
    </div>
  ),
}

export const Square: Story = {
  args: {label: 'Donut', aspectRatio: '1 / 1'},
  render: args => (
    <div className="w-[200px]">
      <ComingSoon {...args} />
    </div>
  ),
}
