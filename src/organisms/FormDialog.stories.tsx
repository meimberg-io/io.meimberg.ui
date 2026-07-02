import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {FormDialog} from './FormDialog'
import {FormSection} from '../molecules/FormSection'
import {FormRow} from '../molecules/FormRow'
import {FormField} from '../molecules/FormField'
import {FormHelpText} from '../molecules/FormHelpText'
import {TextField} from '../atoms/TextField'
import {SegmentedSwitch, type SegmentedOption} from '../atoms/SegmentedSwitch'
import {Button} from '../ui/button'

const meta: Meta<typeof FormDialog> = {
  title: 'Organisms/FormDialog',
  component: FormDialog,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof FormDialog>

type BucketType = 'inbox' | 'task'
const BUCKET_TYPES: ReadonlyArray<SegmentedOption<BucketType>> = [
  {value: 'inbox', label: 'Inbox'},
  {value: 'task', label: 'Task'},
]

function Trigger({label, onClick}: {label: string; onClick: () => void}) {
  return (
    <div className="p-6">
      <Button onClick={onClick}>{label}</Button>
    </div>
  )
}

function SimpleDialog({
  submitVariant = 'primary',
  submitPending = false,
  submitDisabled = false,
  viewOnly = false,
  footerInfo,
}: {
  submitVariant?: 'primary' | 'success' | 'destructive'
  submitPending?: boolean
  submitDisabled?: boolean
  viewOnly?: boolean
  footerInfo?: string
}) {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('Pulse-Backlog')
  const [type, setType] = useState<BucketType>('inbox')
  return (
    <>
      <Trigger label="Dialog öffnen" onClick={() => setOpen(true)} />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        caption="Neuen Bucket anlegen"
        title="Bucket konfigurieren"
        submitLabel={viewOnly ? undefined : 'Bucket anlegen'}
        submitVariant={submitVariant}
        submitPending={submitPending}
        submitDisabled={submitDisabled}
        footerInfo={footerInfo}
        onSubmit={() => setOpen(false)}
      >
        <FormSection title="Stammdaten">
          <FormField label="Name" required>
            <TextField value={name} onChange={e => setName(e.target.value)} />
          </FormField>
          <FormRow cols={2}>
            <FormField label="Bucket-Typ">
              <SegmentedSwitch value={type} options={BUCKET_TYPES} onChange={setType} />
            </FormField>
            <FormField label="Short-Label" hint="(optional)">
              <TextField placeholder="PUL" />
            </FormField>
          </FormRow>
          <FormHelpText>Items werden auf INBOX eingeschränkt.</FormHelpText>
        </FormSection>
      </FormDialog>
    </>
  )
}

export const Default: Story = {
  render: () => <SimpleDialog footerInfo="Erster Sync direkt nach Anlegen" />,
}

export const SuccessVariant: Story = {
  render: () => <SimpleDialog submitVariant="success" footerInfo="Wird sofort live" />,
}

export const DestructiveVariant: Story = {
  render: () => {
    function DestructiveDemo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Dialog öffnen" onClick={() => setOpen(true)} />
          <FormDialog
            open={open}
            onOpenChange={setOpen}
            caption="Bucket löschen"
            title="Pulse-Backlog wirklich löschen?"
            submitLabel="Endgültig löschen"
            submitVariant="destructive"
            onSubmit={() => setOpen(false)}
          >
            <p className="body-sm text-muted-foreground">
              Alle in diesem Bucket gesammelten Items werden archiviert. Diese Aktion kann nicht
              rückgängig gemacht werden.
            </p>
          </FormDialog>
        </>
      )
    }
    return <DestructiveDemo />
  },
}

export const Pending: Story = {
  render: () => <SimpleDialog submitPending />,
}

export const SubmitDisabled: Story = {
  render: () => <SimpleDialog submitDisabled footerInfo="Pflichtfelder fehlen noch" />,
}

export const ViewOnly: Story = {
  render: () => <SimpleDialog viewOnly />,
}

export const WithHeroTint: Story = {
  render: () => {
    function TintedDemo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Dialog öffnen" onClick={() => setOpen(true)} />
          <FormDialog
            open={open}
            onOpenChange={setOpen}
            caption="Neuen Bucket anlegen"
            title="Pulse-Backlog"
            heroTint="220 100% 50%"
            hero={
              <div className="rounded-lg border border-border bg-card p-3 caption text-muted-foreground">
                Live-Preview-Slot — z. B. <code>BucketLivePreview</code>.
              </div>
            }
            submitLabel="Bucket anlegen"
            submitVariant="success"
            onSubmit={() => setOpen(false)}
          >
            <FormSection title="Quelle">
              <FormField label="Account">
                <TextField placeholder="meimberg.atlassian.net" />
              </FormField>
            </FormSection>
          </FormDialog>
        </>
      )
    }
    return <TintedDemo />
  },
}

export const WithFooterActions: Story = {
  render: () => {
    function ActionsDemo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Dialog öffnen" onClick={() => setOpen(true)} />
          <FormDialog
            open={open}
            onOpenChange={setOpen}
            caption="Inbox-Item"
            title="Was wird das?"
            cancelLabel="Schließen"
            footerActions={
              <>
                <Button size="sm" variant="outline">
                  Signal
                </Button>
                <Button size="sm" variant="outline">
                  Task
                </Button>
                <Button size="sm" variant="destructive">
                  Löschen
                </Button>
              </>
            }
          >
            <p className="body-sm text-muted-foreground">
              Multi-Action-Footer für Detail-Dialoge mit mehreren parallelen Aktionen.
            </p>
          </FormDialog>
        </>
      )
    }
    return <ActionsDemo />
  },
}
