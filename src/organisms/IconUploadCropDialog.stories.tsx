import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {IconUploadCropDialog} from './IconUploadCropDialog'
import {Button} from '../atoms/Button'

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
      <Button size="lg" onClick={() => setOpen(true)}>{label}</Button>
      {submittedSize !== null && (
        <p className="caption text-muted-foreground">
          Last submit: {submittedSize} bytes
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

export const Default: Story = {render: () => <Trigger label="Upload icon" />}

export const CustomTitle: Story = {
  render: () => <Trigger label="Change team icon" title="Upload team icon" />,
}

function ClosedDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-6">
      <p className="body-sm text-muted-foreground mb-3">
        The dialog drives the file picker itself — this story only renders the open trigger.
      </p>
      <Button size="lg" variant="outline" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <IconUploadCropDialog open={open} onOpenChange={setOpen} onSubmit={() => {}} />
    </div>
  )
}

export const Closed: Story = {render: () => <ClosedDemo />}
