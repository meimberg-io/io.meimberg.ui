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
    children: 'Kein Inhalt.',
  },
}

export const Subtle: Story = {
  args: {
    tone: 'subtle',
    italic: false,
    children: 'Keine weiteren Tags zum Eingrenzen verfügbar.',
  },
}
