import type {Meta, StoryObj} from '@storybook/react-vite'
import {Sparkline} from './Sparkline'

const meta: Meta<typeof Sparkline> = {
  title: 'Atoms/Sparkline',
  component: Sparkline,
  args: {
    values: [3, 5, 4, 8, 6, 9, 7, 10],
    width: 120,
    height: 36,
    fill: true,
  },
}

export default meta
type Story = StoryObj<typeof Sparkline>

export const Default: Story = {}

export const Filled: Story = {
  args: {fill: true},
  render: args => <div className="text-primary"><Sparkline {...args} /></div>,
}

export const LineOnly: Story = {
  args: {fill: false},
  render: args => <div className="text-success"><Sparkline {...args} /></div>,
}

export const Flat: Story = {
  args: {values: [5, 5, 5, 5, 5]},
}

export const Compact: Story = {
  args: {width: 70, height: 28},
  render: args => <div className="text-warning"><Sparkline {...args} /></div>,
}
