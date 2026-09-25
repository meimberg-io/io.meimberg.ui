import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {EditableInlineHeading} from './EditableInlineHeading'
import {IconButton} from '../ui/icon-button'
import {DeleteIcon} from '../ui/action-icons'

const meta: Meta<typeof EditableInlineHeading> = {
  title: 'Atoms/EditableInlineHeading',
  parameters: {
    docs: {
      description: {
        component:
          'Inline title editor. Clicking the title itself or the pencil icon next to it ' +
          'enters edit mode. Enter saves, Escape discards, losing focus saves.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof EditableInlineHeading>

function BasicDemo() {
  const [value, setValue] = useState('Quarterly planning review')
  return <EditableInlineHeading value={value} onSave={setValue} />
}

function MultilineDemo() {
  const [value, setValue] = useState('A longer title that can wrap across multiple lines when space runs out')
  return <EditableInlineHeading value={value} onSave={setValue} size="heading-3" multiline />
}

function WithDisplayActionsDemo() {
  const [value, setValue] = useState('Custom title')
  return (
    <EditableInlineHeading
      value={value}
      onSave={setValue}
      displayActions={
        <IconButton variant="destructive" size="sm" aria-label="Reset title" title="Reset title">
          <DeleteIcon aria-hidden="true" />
        </IconButton>
      }
    />
  )
}

export const Basic: Story = {render: () => <BasicDemo />}
export const Multiline: Story = {name: 'Multiline (heading-3)', render: () => <MultilineDemo />}
export const WithDisplayActions: Story = {
  name: 'With displayActions (reset button)',
  render: () => <WithDisplayActionsDemo />,
}
