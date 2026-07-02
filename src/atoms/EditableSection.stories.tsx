import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {EditableSection} from './EditableSection'

const meta: Meta<typeof EditableSection> = {
  title: 'Atoms/EditableSection',
  component: EditableSection,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof meta>

function Stateful({initialEditing = false}: {initialEditing?: boolean}) {
  const [editing, setEditing] = useState(initialEditing)
  return (
    <div className="w-[640px] rounded-lg border border-border bg-card p-4">
      <EditableSection
        title="Objectives"
        subtitle="Strukturieren die Mission in gewichtete Ziele"
        onAdd={() => alert('add')}
        addLabel="Add objective"
        editing={editing}
        onToggleEdit={() => setEditing(v => !v)}
        editLabel="Bearbeiten"
      />
      <p className="caption text-muted-foreground">
        Edit-Mode: {editing ? 'an' : 'aus'}
      </p>
    </div>
  )
}

export const ViewMode: Story = {render: () => <Stateful />}
export const EditMode: Story = {render: () => <Stateful initialEditing />}

export const NoEditToggle: Story = {
  render: () => (
    <div className="w-[640px] rounded-lg border border-border bg-card p-4">
      <EditableSection
        title="Buckets"
        subtitle="2 verknüpft"
        onAdd={() => alert('add')}
        addLabel="Bucket hinzufügen"
      />
    </div>
  ),
}
