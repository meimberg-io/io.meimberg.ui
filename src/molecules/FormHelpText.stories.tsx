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
  args: {children: 'Items werden auf INBOX eingeschränkt.'},
}

export const Long: Story = {
  args: {
    children:
      'Der erste Sync läuft direkt nach dem Anlegen. Danach wird der Bucket alle 10 Minuten aktualisiert; existierende Items werden nicht überschrieben.',
  },
}
