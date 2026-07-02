import type {Meta, StoryObj} from '@storybook/react-vite'
import {FormField} from './FormField'
import {TextField} from '../atoms/TextField'

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    label: 'Name',
    children: <TextField placeholder="Pulse" />,
  },
}

export const Required: Story = {
  args: {
    label: 'Titel',
    required: true,
    children: <TextField placeholder="Pflichtfeld" />,
  },
}

export const WithHint: Story = {
  args: {
    label: 'Short-Label',
    hint: '(optional)',
    children: <TextField placeholder="PUL" />,
  },
}

export const WithDescription: Story = {
  args: {
    label: 'API-Token',
    description: 'Wird verschlüsselt in pgsodium abgelegt; nach dem Speichern nicht mehr lesbar.',
    children: <TextField type="password" />,
  },
}

export const WithError: Story = {
  args: {
    label: 'E-Mail',
    error: 'Bitte gültige E-Mail-Adresse angeben.',
    children: <TextField defaultValue="nicht-valide" />,
  },
}

export const Combined: Story = {
  args: {
    label: 'Bucket-Name',
    required: true,
    hint: 'max. 40 Zeichen',
    description: 'Wird im UI als Listen-Titel angezeigt.',
    error: 'Bucket-Name existiert bereits.',
    children: <TextField defaultValue="Pulse-Backlog" />,
  },
}
