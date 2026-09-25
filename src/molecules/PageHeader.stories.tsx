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
      <Button variant="outline">
        <Inbox className="size-4" />
        Filter
      </Button>
      <Button>
        <Plus className="size-4" />
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
