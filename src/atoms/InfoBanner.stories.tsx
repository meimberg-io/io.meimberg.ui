import type {Meta, StoryObj} from '@storybook/react-vite'
import {InfoBanner} from './InfoBanner'

const meta: Meta<typeof InfoBanner> = {
  title: 'Atoms/InfoBanner',
  component: InfoBanner,
}

export default meta
type Story = StoryObj<typeof InfoBanner>

export const Muted: Story = {
  args: {
    children: 'No content.',
  },
}

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    italic: false,
    children: 'No more tags available to narrow down.',
  },
}
