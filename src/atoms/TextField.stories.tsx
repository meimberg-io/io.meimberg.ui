import type {Meta, StoryObj} from '@storybook/react-vite'
import {TextField} from './TextField'
import {Search, Loader2} from '../atoms/icons'

const meta: Meta<typeof TextField> = {
  title: 'Atoms/TextField',
  component: TextField,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof TextField>

export const Default: Story = {
  args: {placeholder: 'Project name'},
}

export const Filled: Story = {
  args: {defaultValue: 'Product roadmap'},
}

export const Disabled: Story = {
  args: {defaultValue: 'Read-only', disabled: true},
}

export const WithLeadingIcon: Story = {
  args: {
    placeholder: 'Search…',
    leadingIcon: <Search width={14} height={14} />,
  },
}

export const WithTrailingIcon: Story = {
  args: {
    defaultValue: 'Checking',
    trailingIcon: <Loader2 width={14} height={14} className="animate-spin" />,
  },
}

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Checking…',
    leadingIcon: <Search width={14} height={14} />,
    trailingIcon: <Loader2 width={14} height={14} className="animate-spin" />,
  },
}

export const Textarea: Story = {
  args: {
    as: 'textarea',
    rows: 3,
    placeholder: 'Description…',
  },
}

export const TextareaFilled: Story = {
  args: {
    as: 'textarea',
    rows: 4,
    defaultValue:
      'A shared workspace for the team to collect tasks, documents and ideas from all the tools we use every day.',
  },
}
