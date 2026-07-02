import type {Meta, StoryObj} from '@storybook/react-vite'
import {SelectedItemsBar} from './SelectedItemsBar'
import {Pill} from '../index'

const meta: Meta<typeof SelectedItemsBar> = {
  title: 'Molecules/SelectedItemsBar',
  component: SelectedItemsBar,
  args: {
    onClearAll: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SelectedItemsBar>

export const MultipleItems: Story = {
  render: args => (
    <SelectedItemsBar {...args}>
      <Pill className="bg-surface-2 text-foreground">design</Pill>
      <Pill className="bg-surface-2 text-foreground">research</Pill>
      <Pill className="bg-surface-2 text-foreground">backlog</Pill>
    </SelectedItemsBar>
  ),
}

export const SingleItem: Story = {
  render: args => (
    <SelectedItemsBar {...args}>
      <Pill className="bg-surface-2 text-foreground">design</Pill>
    </SelectedItemsBar>
  ),
}
