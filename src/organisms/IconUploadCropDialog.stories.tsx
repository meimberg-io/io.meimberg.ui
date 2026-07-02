import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {IconUploadCropDialog} from './IconUploadCropDialog'
import {Button} from '../ui/button'

const meta: Meta<typeof IconUploadCropDialog> = {
  title: 'Organisms/IconUploadCropDialog',
  component: IconUploadCropDialog,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof IconUploadCropDialog>

function Trigger({label, title}: {label: string; title?: string}) {
  const [open, setOpen] = useState(false)
  const [submittedSize, setSubmittedSize] = useState<number | null>(null)
  return (
    <div className="p-6 space-y-3">
      <Button onClick={() => setOpen(true)}>{label}</Button>
      {submittedSize !== null && (
        <p className="caption text-muted-foreground">
          Letzter Submit: {submittedSize} bytes
        </p>
      )}
      <IconUploadCropDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        onSubmit={file => {
          setSubmittedSize(file.size)
        }}
      />
    </div>
  )
}

export const Default: Story = {render: () => <Trigger label="Icon hochladen" />}

export const CustomTitle: Story = {
  render: () => <Trigger label="Org-Icon ändern" title="Org-Icon hochladen" />,
}

function ClosedDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-6">
      <p className="body-sm text-muted-foreground mb-3">
        Dialog steuert den File-Picker selbst — Story rendert nur den Open-Trigger.
      </p>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <IconUploadCropDialog open={open} onOpenChange={setOpen} onSubmit={() => {}} />
    </div>
  )
}

export const Closed: Story = {render: () => <ClosedDemo />}
