import type {Meta, StoryObj} from '@storybook/react-vite'
import {ItemActionsMenu} from './ItemActionsMenu'
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu'
import {EditIcon, DeleteIcon} from '../ui/action-icons'
import {ArrowRight, FolderKanban} from '../atoms/icons'

const meta: Meta<typeof ItemActionsMenu> = {
  title: 'Molecules/ItemActionsMenu',
  component: ItemActionsMenu,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof ItemActionsMenu>

export const Default: Story = {
  render: () => (
    <ItemActionsMenu testId="story-default-actions">
      <DropdownMenuItem>
        <EditIcon className="mr-2 size-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem className="text-destructive">
        <DeleteIcon className="mr-2 size-4" />
        Delete
      </DropdownMenuItem>
    </ItemActionsMenu>
  ),
}

export const CompactSize: Story = {
  name: 'size="sm" (compact trigger)',
  render: () => (
    <ItemActionsMenu testId="story-sm-actions" size="sm">
      <DropdownMenuItem>
        <EditIcon className="mr-2 size-4" />
        Edit
      </DropdownMenuItem>
    </ItemActionsMenu>
  ),
}

export const WithSeparator: Story = {
  name: 'With separator (destructive last)',
  render: () => (
    <ItemActionsMenu testId="story-separator-actions">
      <DropdownMenuItem>
        <ArrowRight className="mr-2 size-4" />
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuItem>
        <EditIcon className="mr-2 size-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive">
        <DeleteIcon className="mr-2 size-4" />
        Delete
      </DropdownMenuItem>
    </ItemActionsMenu>
  ),
}

export const WithSubMenu: Story = {
  name: 'With submenu (Move to project)',
  render: () => (
    <ItemActionsMenu testId="story-submenu-actions">
      <DropdownMenuItem>
        <ArrowRight className="mr-2 size-4" />
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FolderKanban className="mr-2 size-4" />
          Move to project
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
          <DropdownMenuItem>Website relaunch</DropdownMenuItem>
          <DropdownMenuItem>Q3 planning</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </ItemActionsMenu>
  ),
}
