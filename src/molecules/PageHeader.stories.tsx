import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './PageHeader'
import {Button} from '../atoms/Button'
import {Plus, Inbox, FolderKanban} from '../atoms/icons'

const meta: Meta<typeof PageHeader> = {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof PageHeader>

export const TitleOnly: Story = {
  args: {title: 'Messages'},
}

export const WithDescription: Story = {
  args: {
    title: 'Messages',
    description: 'All unread messages from your connected accounts.',
  },
}

export const WithActionButton: Story = {
  args: {
    title: 'Projects',
    description: 'Overview of your active projects.',
    actionLabel: 'Create project',
    actionIcon: Plus,
    onAction: () => {},
  },
}

export const WithActionNoIcon: Story = {
  args: {
    title: 'Tasks',
    actionLabel: 'Sync',
    onAction: () => {},
  },
}

export const WithChildren: Story = {
  render: () => (
    <PageHeader title="Messages" description="Filters on the right">
      <Button variant="outline" icon={Inbox}>
        Filter
      </Button>
      <Button icon={Plus}>
        New
      </Button>
    </PageHeader>
  ),
}

export const WithChildrenAndAction: Story = {
  render: () => (
    <PageHeader
      title="Library"
      description="Documents · Images · Videos"
      actionLabel="Organize"
      actionIcon={FolderKanban}
      onAction={() => {}}
    >
      <Button variant="ghost">
        Export
      </Button>
    </PageHeader>
  ),
}

// description as ReactNode: inline counts with highlight spans.
export const WithJsxDescription: Story = {
  name: 'description as JSX (counts + highlights)',
  render: () => (
    <PageHeader
      title="Todo"
      description={
        <>
          42 current ·{' '}
          <span className="text-destructive font-medium">3 overdue</span>
          {' · '}
          <span className="text-warning font-medium">7 today</span>
          {' · all workspaces'}
        </>
      }
    >
      <Button variant="outline">
        Sync
      </Button>
      <Button>Quick add</Button>
    </PageHeader>
  ),
}

export const WithLeading: Story = {
  name: 'leading (glyph before the title block)',
  args: {
    title: 'Marketing site',
    description: 'Project workspace',
    leading: (
      <div className="flex size-12 items-center justify-center rounded-xl bg-surface-2 border border-border">
        <FolderKanban className="size-6 text-muted-foreground" />
      </div>
    ),
  },
}

export const WithMeta: Story = {
  name: 'meta (row below the description)',
  args: {
    title: 'Marketing site',
    description: 'Relaunch of the public website.',
    meta: (
      <>
        <span className="caption text-muted-foreground">Updated 2 days ago</span>
        <span className="caption text-muted-foreground">·</span>
        <span className="caption text-muted-foreground">4 members</span>
      </>
    ),
    actionLabel: 'Edit',
    onAction: () => {},
  },
}
