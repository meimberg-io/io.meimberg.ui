import type {Meta, StoryObj} from '@storybook/react-vite'
import {FormHelpText} from './FormHelpText'

const meta: Meta<typeof FormHelpText> = {
  title: 'Molecules/FormHelpText',
  component: FormHelpText,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof FormHelpText>

export const Default: Story = {
  args: {children: 'Only items from the selected folder are synced.'},
}

export const Long: Story = {
  args: {
    children:
      'The first sync starts right after saving. After that, data refreshes every 10 minutes; existing entries are never overwritten.',
  },
}
