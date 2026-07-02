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
  name: 'size="sm" (kompakter Trigger)',
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
  name: 'Mit Separator (destructive unten)',
  render: () => (
    <ItemActionsMenu testId="story-separator-actions">
      <DropdownMenuItem>
        <ArrowRight className="mr-2 size-4" />
        Evolve to Seed
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
  name: 'Mit Submenü (Move to Mission)',
  render: () => (
    <ItemActionsMenu testId="story-submenu-actions">
      <DropdownMenuItem>
        <ArrowRight className="mr-2 size-4" />
        Evolve to Seed
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FolderKanban className="mr-2 size-4" />
          Move to Mission
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
          <DropdownMenuItem>Pulse Q1</DropdownMenuItem>
          <DropdownMenuItem>Side Mission</DropdownMenuItem>
          <DropdownMenuItem>Garden</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </ItemActionsMenu>
  ),
}
