import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {DetailDialogWrapper} from './detail-dialog-wrapper'
import {Button} from '../ui/button'
import {MetaPill} from '../atoms/MetaPill'
import {Zap, Rocket, FileText} from '../atoms/icons'

const meta: Meta<typeof DetailDialogWrapper> = {
  title: 'Organisms/DetailDialogWrapper',
  component: DetailDialogWrapper,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof DetailDialogWrapper>

function Trigger({label, onClick}: {label: string; onClick: () => void}) {
  return (
    <div className="p-6">
      <Button onClick={onClick}>{label}</Button>
    </div>
  )
}

function BasicDialog({
  size = 'md' as 'sm' | 'md' | 'lg' | 'xl',
  withIcon = false,
  withFooter = false,
  withHeaderAside = false,
}) {
  const [open, setOpen] = useState(true)
  return (
    <>
      <Trigger label="Open dialog" onClick={() => setOpen(true)} />
      <DetailDialogWrapper
        open={open}
        onOpenChange={setOpen}
        size={size}
        icon={withIcon ? <Zap className="size-5 text-foreground" /> : undefined}
        title="Bug report: sorting resets after filter change"
        description="Reported May 17 · alex@example.com · #support"
        headerAside={
          withHeaderAside ? (
            <Button size="sm" variant="outline">
              Open in tracker
            </Button>
          ) : undefined
        }
        footer={
          withFooter ? (
            <div className="flex w-full justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Accept</Button>
            </div>
          ) : undefined
        }
      >
        <p className="body-sm text-muted-foreground">
          The list order flips after resetting the filters. Seen on the mobile layout.
        </p>
        <p className="body-sm text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </DetailDialogWrapper>
    </>
  )
}

export const Default: Story = {render: () => <BasicDialog />}

export const WithIcon: Story = {render: () => <BasicDialog withIcon />}

export const WithFooter: Story = {render: () => <BasicDialog withIcon withFooter />}

export const WithHeaderAside: Story = {
  render: () => <BasicDialog withIcon withHeaderAside withFooter />,
}

export const SizeSm: Story = {render: () => <BasicDialog size="sm" withIcon />}

export const SizeLg: Story = {render: () => <BasicDialog size="lg" withIcon withFooter />}

export const SizeXl: Story = {render: () => <BasicDialog size="xl" withIcon withFooter />}

export const TintedIconBg: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Open dialog" onClick={() => setOpen(true)} />
          <DetailDialogWrapper
            open={open}
            onOpenChange={setOpen}
            icon={<Rocket className="size-5 text-success" />}
            iconBgClass="bg-success/15"
            title="Release 2.4"
            description="Status: ready to ship"
          >
            <p className="body-sm text-muted-foreground">
              All checks passed. Ready for the next deployment window.
            </p>
          </DetailDialogWrapper>
        </>
      )
    }
    return <Demo />
  },
}

// `description` carries block content (a row of pills) instead of a string.
// Thanks to asChild the wrapper renders a <div> instead of a <p> — otherwise
// the nested <div>/<span> would be invalid HTML (hydration error).
export const BlockDescription: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Open dialog" onClick={() => setOpen(true)} />
          <DetailDialogWrapper
            open={open}
            onOpenChange={setOpen}
            icon={<FileText className="size-5 text-primary" />}
            iconBgClass="bg-primary/10"
            size="lg"
            title="Document: Thursday planning"
            description={
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <MetaPill icon={<FileText size={12} />}>Note</MetaPill>
                <span className="caption text-muted-foreground">Shared drive · 14:32</span>
                <MetaPill title="Linked items">→ 2</MetaPill>
              </div>
            }
          >
            <p className="body-sm">Please review the demo script first thing tomorrow.</p>
          </DetailDialogWrapper>
        </>
      )
    }
    return <Demo />
  },
}

export const ItemPreview: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Open item" onClick={() => setOpen(true)} />
          <DetailDialogWrapper
            open={open}
            onOpenChange={setOpen}
            icon={<FileText className="size-5 text-primary" />}
            iconBgClass="bg-primary/10"
            size="lg"
            title="Document: Thursday planning"
            description="Shared drive · 14:32 · unread"
            footer={
              <div className="flex w-full justify-between">
                <Button variant="ghost" size="sm">
                  Archive
                </Button>
                <Button size="sm">Convert to task</Button>
              </div>
            }
          >
            <div className="space-y-3">
              <p className="body-sm">Please review the demo script first thing tomorrow.</p>
            </div>
          </DetailDialogWrapper>
        </>
      )
    }
    return <Demo />
  },
}
