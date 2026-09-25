import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {FormDialog} from './FormDialog'
import {FormSection} from '../molecules/FormSection'
import {FormRow} from '../molecules/FormRow'
import {FormField} from '../molecules/FormField'
import {FormHelpText} from '../molecules/FormHelpText'
import {TextField} from '../atoms/TextField'
import {SegmentedControl, type SegmentedControlOption} from '../atoms/SegmentedControl'
import {Button, type ButtonTone} from '../atoms/Button'
import {Star} from '../atoms/icons'
import type {IconComponent} from '../lib/variants'

const meta: Meta<typeof FormDialog> = {
  title: 'Organisms/FormDialog',
  component: FormDialog,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof FormDialog>

type ProjectType = 'internal' | 'client'
const PROJECT_TYPES: ReadonlyArray<SegmentedControlOption<ProjectType>> = [
  {value: 'internal', label: 'Internal'},
  {value: 'client', label: 'Client'},
]

function Trigger({label, onClick}: {label: string; onClick: () => void}) {
  return (
    <div className="p-6">
      <Button size="lg" onClick={onClick}>{label}</Button>
    </div>
  )
}

function SimpleDialog({
  submitTone = 'primary',
  submitBusy = false,
  submitDisabled = false,
  submitIcon,
  viewOnly = false,
  footerInfo,
}: {
  submitTone?: ButtonTone
  submitBusy?: boolean
  submitDisabled?: boolean
  submitIcon?: IconComponent
  viewOnly?: boolean
  footerInfo?: string
}) {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('Website relaunch')
  const [type, setType] = useState<ProjectType>('internal')
  return (
    <>
      <Trigger label="Open dialog" onClick={() => setOpen(true)} />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        caption="New project"
        title="Configure project"
        submitLabel={viewOnly ? undefined : 'Create project'}
        submitTone={submitTone}
        submitBusy={submitBusy}
        submitDisabled={submitDisabled}
        submitIcon={submitIcon}
        footerInfo={footerInfo}
        onSubmit={() => setOpen(false)}
      >
        <FormSection title="Basics">
          <FormField label="Name" required>
            <TextField value={name} onChange={e => setName(e.target.value)} />
          </FormField>
          <FormRow cols={2}>
            <FormField label="Type">
              <SegmentedControl value={type} options={PROJECT_TYPES} onChange={setType} />
            </FormField>
            <FormField label="Short code" hint="(optional)">
              <TextField placeholder="WEB" />
            </FormField>
          </FormRow>
          <FormHelpText>Internal projects are only visible to your team.</FormHelpText>
        </FormSection>
      </FormDialog>
    </>
  )
}

export const Default: Story = {
  render: () => <SimpleDialog footerInfo="Members are notified after creation" />,
}

export const SuccessTone: Story = {
  render: () => <SimpleDialog submitTone="success" footerInfo="Goes live immediately" />,
}

export const CustomSubmitIcon: Story = {
  render: () => <SimpleDialog submitIcon={Star} />,
}

export const DestructiveTone: Story = {
  render: () => {
    function DestructiveDemo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Open dialog" onClick={() => setOpen(true)} />
          <FormDialog
            open={open}
            onOpenChange={setOpen}
            caption="Delete project"
            title="Delete “Website relaunch”?"
            submitLabel="Delete permanently"
            submitTone="destructive"
            onSubmit={() => setOpen(false)}
          >
            <p className="body-sm text-muted-foreground">
              All tasks in this project will be archived. This action cannot be undone.
            </p>
          </FormDialog>
        </>
      )
    }
    return <DestructiveDemo />
  },
}

export const Busy: Story = {
  render: () => <SimpleDialog submitTone="success" submitBusy />,
}

export const SubmitDisabled: Story = {
  render: () => <SimpleDialog submitDisabled footerInfo="Required fields are missing" />,
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
          <Trigger label="Open dialog" onClick={() => setOpen(true)} />
          <FormDialog
            open={open}
            onOpenChange={setOpen}
            caption="New project"
            title="Website relaunch"
            heroTint="220 100% 50%"
            hero={
              <div className="rounded-lg border border-border bg-card p-3 caption text-muted-foreground">
                Preview slot — e.g. a live preview card.
              </div>
            }
            submitLabel="Create project"
            submitTone="success"
            onSubmit={() => setOpen(false)}
          >
            <FormSection title="Source">
              <FormField label="Repository">
                <TextField placeholder="github.com/acme/website" />
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
          <Trigger label="Open dialog" onClick={() => setOpen(true)} />
          <FormDialog
            open={open}
            onOpenChange={setOpen}
            caption="Request"
            title="How should this be handled?"
            cancelLabel="Close"
            footerActions={
              <>
                <Button variant="outline">
                  Approve
                </Button>
                <Button variant="outline">
                  Assign
                </Button>
                <Button tone="destructive">
                  Delete
                </Button>
              </>
            }
          >
            <p className="body-sm text-muted-foreground">
              Multi-action footer for detail dialogs with several parallel actions.
            </p>
          </FormDialog>
        </>
      )
    }
    return <ActionsDemo />
  },
}
