import type {Meta, StoryObj} from '@storybook/react-vite'
import {SelectedItemsBar} from './SelectedItemsBar'
import {Badge} from '../index'

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
      <Badge>design</Badge>
      <Badge>research</Badge>
      <Badge>backlog</Badge>
    </SelectedItemsBar>
  ),
}

export const SingleItem: Story = {
  render: args => (
    <SelectedItemsBar {...args}>
      <Badge>design</Badge>
    </SelectedItemsBar>
  ),
}
