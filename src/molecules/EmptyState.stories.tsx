import type {Meta, StoryObj} from '@storybook/react-vite'
import {EmptyState} from './EmptyState'
import {Inbox, Search, FolderKanban, Zap} from '../atoms/icons'

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: {layout: 'fullscreen'},
  args: {
    icon: Inbox,
    title: 'No messages yet',
    description: 'New messages will show up here as soon as they arrive.',
  },
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    icon: FolderKanban,
    title: 'No projects yet',
    description: 'Create your first project to group related tasks.',
    actionLabel: 'Create project',
    onAction: () => {},
  },
}

export const SearchNoResults: Story = {
  args: {
    icon: Search,
    title: 'No results',
    description: 'Try a different search term or clear your filters.',
  },
}

export const AutomationsEmpty: Story = {
  args: {
    icon: Zap,
    title: 'No automations yet',
    description: 'Automations run actions for you whenever a trigger fires.',
    actionLabel: 'Create automation',
    onAction: () => {},
  },
}

export const Dashed: Story = {
  name: 'Dashed (filtered list empty)',
  args: {
    tone: 'dashed',
    icon: Search,
    title: 'No results',
    description: 'Nothing matches the active filters. Reset filters.',
  },
}

export const DashedWithLinkAction: Story = {
  name: 'Dashed + link action',
  args: {
    tone: 'dashed',
    icon: FolderKanban,
    title: 'No projects',
    description: 'Create the first project in this workspace.',
    action: (
      <a href="#" className="text-sm font-medium text-primary hover:underline cursor-pointer">
        Create first project
      </a>
    ),
  },
}
