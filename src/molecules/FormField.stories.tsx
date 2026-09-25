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
    children: <TextField placeholder="Jane Doe" />,
  },
}

export const Required: Story = {
  args: {
    label: 'Title',
    required: true,
    children: <TextField placeholder="Required" />,
  },
}

export const WithHint: Story = {
  args: {
    label: 'Short label',
    hint: '(optional)',
    children: <TextField placeholder="ABC" />,
  },
}

export const WithDescription: Story = {
  args: {
    label: 'API token',
    description: 'Stored encrypted; cannot be read again after saving.',
    children: <TextField type="password" />,
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Please enter a valid email address.',
    children: <TextField defaultValue="not-valid" />,
  },
}

export const Combined: Story = {
  args: {
    label: 'List name',
    required: true,
    hint: 'max. 40 characters',
    description: 'Shown as the list title.',
    error: 'A list with this name already exists.',
    children: <TextField defaultValue="Backlog" />,
  },
}

/** A single raw element without `id` receives the field id via `cloneElement`. */
export const RawTextarea: Story = {
  args: {
    label: 'Notes',
    children: <textarea className="field-shell focus-ring h-24 py-2" placeholder="Plain <textarea>" />,
  },
}
