import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './PageHeader'
import {Button} from '../ui/button'
import {Plus, Inbox, FolderKanban} from '../atoms/icons'

const meta: Meta<typeof PageHeader> = {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof PageHeader>

export const TitleOnly: Story = {
  args: {title: 'Posteingang'},
}

export const WithDescription: Story = {
  args: {
    title: 'Posteingang',
    description: 'Alle ungelesenen Inbox-Items aus deinen verknüpften Konten.',
  },
}

export const WithActionButton: Story = {
  args: {
    title: 'Missions',
    description: 'Übersicht deiner aktiven Missions und Cluster.',
    actionLabel: 'Mission anlegen',
    actionIcon: Plus,
    onAction: () => {},
  },
}

export const WithActionNoIcon: Story = {
  args: {
    title: 'Tasks',
    actionLabel: 'Synchronisieren',
    onAction: () => {},
  },
}

export const WithChildren: Story = {
  render: () => (
    <PageHeader title="Inbox" description="Filter rechts in der Topbar">
      <Button variant="outline" size="sm">
        <Inbox className="size-4" />
        Filter
      </Button>
      <Button size="sm">
        <Plus className="size-4" />
        Neu
      </Button>
    </PageHeader>
  ),
}

export const WithChildrenAndAction: Story = {
  render: () => (
    <PageHeader
      title="Garden"
      description="Signals · Seeds · Sprouts · Cluster · Missions"
      actionLabel="Promote"
      actionIcon={FolderKanban}
      onAction={() => {}}
    >
      <Button variant="ghost" size="sm">
        Export
      </Button>
    </PageHeader>
  ),
}

// PUL-413 (G1c): description als ReactNode-Beispiel — Counts inline mit
// Highlight-Spans, wie im Todo-View nach der G1c-Migration verwendet.
export const WithJsxDescription: Story = {
  name: 'description als JSX (counts + highlights)',
  render: () => (
    <PageHeader
      title="Todo"
      description={
        <>
          42 aktuell ·{' '}
          <span className="text-destructive font-medium">3 überfällig</span>
          {' · '}
          <span className="text-warning font-medium">7 heute</span>
          {' · alle Kontexte'}
        </>
      }
    >
      <Button variant="outline" size="sm">
        Sync
      </Button>
      <Button size="sm">Quick-Capture</Button>
    </PageHeader>
  ),
}
