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

export const WithLeading: Story = {
  args: {
    placeholder: 'Search…',
    leading: <Search width={14} height={14} />,
  },
}

export const WithTrailing: Story = {
  args: {
    defaultValue: 'Checking',
    trailing: <Loader2 width={14} height={14} className="animate-spin" />,
  },
}

export const WithLeadingAndTrailing: Story = {
  args: {
    placeholder: 'Checking…',
    leading: <Search width={14} height={14} />,
    trailing: <Loader2 width={14} height={14} className="animate-spin" />,
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
