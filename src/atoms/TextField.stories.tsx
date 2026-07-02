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
  args: {placeholder: 'Pulse'},
}

export const Filled: Story = {
  args: {defaultValue: 'Pulse-Backlog'},
}

export const Disabled: Story = {
  args: {defaultValue: 'Read-only', disabled: true},
}

export const WithLeadingIcon: Story = {
  args: {
    placeholder: 'Suchen…',
    leadingIcon: <Search width={14} height={14} />,
  },
}

export const WithTrailingIcon: Story = {
  args: {
    defaultValue: 'wird geprüft',
    trailingIcon: <Loader2 width={14} height={14} className="animate-spin" />,
  },
}

export const WithBothIcons: Story = {
  args: {
    placeholder: 'wird geprüft…',
    leadingIcon: <Search width={14} height={14} />,
    trailingIcon: <Loader2 width={14} height={14} className="animate-spin" />,
  },
}

export const Textarea: Story = {
  args: {
    as: 'textarea',
    rows: 3,
    placeholder: 'Beschreibung…',
  },
}

export const TextareaFilled: Story = {
  args: {
    as: 'textarea',
    rows: 4,
    defaultValue:
      'Pulse ist ein Cockpit für alle Tickets, Tasks, Inbox-Items und Ideen aus den verschiedenen Tools, mit denen ich täglich arbeite.',
  },
}
