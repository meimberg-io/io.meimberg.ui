import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {EditableInlineHeading} from './EditableInlineHeading'
import {IconButton} from '../ui/icon-button'
import {DeleteIcon} from '../ui/action-icons'

const meta: Meta<typeof EditableInlineHeading> = {
  title: 'Atoms/EditableInlineHeading',
}

export default meta
type Story = StoryObj<typeof EditableInlineHeading>

function BasicDemo() {
  const [value, setValue] = useState('Bezahlung Rechnung März')
  return <EditableInlineHeading value={value} onSave={setValue} />
}

function MultilineDemo() {
  const [value, setValue] = useState('Ein längerer Titel, der über mehrere Zeilen umbrechen kann')
  return <EditableInlineHeading value={value} onSave={setValue} size="heading-3" multiline />
}

function WithDisplayActionsDemo() {
  const [value, setValue] = useState('Override-Titel')
  return (
    <EditableInlineHeading
      value={value}
      onSave={setValue}
      displayActions={
        <IconButton variant="destructive" size="sm" aria-label="Override entfernen" title="Override entfernen">
          <DeleteIcon aria-hidden="true" />
        </IconButton>
      }
    />
  )
}

export const Basic: Story = {render: () => <BasicDemo />}
export const Multiline: Story = {name: 'Multiline (heading-3)', render: () => <MultilineDemo />}
export const WithDisplayActions: Story = {
  name: 'Mit displayActions (Reset-Button)',
  render: () => <WithDisplayActionsDemo />,
}
