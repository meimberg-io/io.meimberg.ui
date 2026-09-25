import type {Meta, StoryObj} from '@storybook/react-vite'
import {ItemActionsMenu} from './ItemActionsMenu'
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu'
import {ArrowRight, DeleteIcon, EditIcon, FolderKanban} from '../atoms/icons'

const meta: Meta<typeof ItemActionsMenu> = {
  title: 'Molecules/ItemActionsMenu',
  component: ItemActionsMenu,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof ItemActionsMenu>

export const Default: Story = {
  render: () => (
    <ItemActionsMenu>
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
  name: 'size="xs" (compact trigger)',
  render: () => (
    <ItemActionsMenu size="xs">
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
    <ItemActionsMenu>
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
    <ItemActionsMenu>
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
