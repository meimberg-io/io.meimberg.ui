import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {DetailDialogWrapper} from './detail-dialog-wrapper'
import {Button} from '../ui/button'
import {MetaPill} from '../atoms/MetaPill'
import {Zap, Sprout, Inbox} from '../atoms/icons'

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
      <Trigger label="Dialog öffnen" onClick={() => setOpen(true)} />
      <DetailDialogWrapper
        open={open}
        onOpenChange={setOpen}
        size={size}
        icon={withIcon ? <Zap className="size-5 text-foreground" /> : undefined}
        title="Signal: Bug-Report aus Slack"
        description="Eingegangen 17. Mai · oli@meimberg.io · #pulse-bugs"
        headerAside={
          withHeaderAside ? (
            <Button size="sm" variant="outline">
              Im Provider öffnen
            </Button>
          ) : undefined
        }
        footer={
          withFooter ? (
            <div className="flex w-full justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => setOpen(false)}>Übernehmen</Button>
            </div>
          ) : undefined
        }
      >
        <p className="body-sm text-muted-foreground">
          Die Sortierung der Inbox-Items dreht sich nach dem Filter-Reset um. Aufgetreten in der
          Mobile-Ansicht.
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
          <Trigger label="Dialog öffnen" onClick={() => setOpen(true)} />
          <DetailDialogWrapper
            open={open}
            onOpenChange={setOpen}
            icon={
               
              <Sprout className="size-5 text-sprout" />
            }
             
            iconBgClass="bg-sprout/15"
            title="Seed: Topic-Routing"
            description="Reifegrad: refined"
          >
            <p className="body-sm text-muted-foreground">
              Promoted aus Signal #218. Bereit für nächsten Lifecycle-Schritt.
            </p>
          </DetailDialogWrapper>
        </>
      )
    }
    return <Demo />
  },
}

// `description` trägt Block-Inhalt (Meta-Pill-Reihe) statt eines Strings.
// Dank asChild rendert der Wrapper hier einen <div> statt <p> — sonst wäre
// der verschachtelte <div>/<span> ungültiges HTML (Hydration-Error).
export const BlockDescription: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Dialog öffnen" onClick={() => setOpen(true)} />
          <DetailDialogWrapper
            open={open}
            onOpenChange={setOpen}
            icon={<Inbox className="size-5 text-primary" />}
            iconBgClass="bg-primary/10"
            size="lg"
            title="Inbox-Item: Tagesplanung Donnerstag"
            description={
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <MetaPill icon={<Inbox size={12} />}>Notiz</MetaPill>
                <span className="caption text-muted-foreground">Microsoft Graph · 14:32</span>
                <MetaPill title="Abgeleitete Items">→ 2</MetaPill>
              </div>
            }
          >
            <p className="body-sm">Bitte morgen früh die Pulse-Demo durchgehen.</p>
          </DetailDialogWrapper>
        </>
      )
    }
    return <Demo />
  },
}

export const InboxItemPreview: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Trigger label="Inbox-Item öffnen" onClick={() => setOpen(true)} />
          <DetailDialogWrapper
            open={open}
            onOpenChange={setOpen}
            icon={<Inbox className="size-5 text-primary" />}
            iconBgClass="bg-primary/10"
            size="lg"
            title="Inbox-Item: Tagesplanung Donnerstag"
            description="Microsoft Graph · 14:32 · ungelesen"
            footer={
              <div className="flex w-full justify-between">
                <Button variant="ghost" size="sm">
                  Archivieren
                </Button>
                <Button size="sm">Als Task übernehmen</Button>
              </div>
            }
          >
            <div className="space-y-3">
              <p className="body-sm">Bitte morgen früh die Pulse-Demo durchgehen.</p>
            </div>
          </DetailDialogWrapper>
        </>
      )
    }
    return <Demo />
  },
}
