import type {Meta, StoryObj} from '@storybook/react-vite'
import {SidebarProvider} from '../ui/sidebar'
import {AppSidebar, type SidebarNavGroup} from './AppSidebar'
import {Badge} from '../atoms/Badge'
import {House, FolderKanban, ListTodo, Settings} from '../atoms/icons'

const meta: Meta<typeof AppSidebar> = {
  title: 'Organisms/AppSidebar',
  component: AppSidebar,
  parameters: {layout: 'fullscreen'},
  decorators: [
    Story => (
      <SidebarProvider>
        <div style={{display: 'flex', minHeight: 400}}>
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof meta>

const groups: SidebarNavGroup[] = [
  {
    label: 'Workspace',
    items: [
      {label: 'Home', href: '/', icon: <House className="h-4 w-4" />},
      {label: 'Projects', href: '/projects', icon: <FolderKanban className="h-4 w-4" />, badge: <Badge compact>5</Badge>},
      {label: 'Tasks', href: '/tasks', icon: <ListTodo className="h-4 w-4" />, badge: <Badge compact>12</Badge>},
    ],
  },
  {
    items: [{label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" />}],
  },
]

export const Default: Story = {
  render: () => (
    <AppSidebar
      groups={groups}
      currentPath="/projects"
      header={({collapsed}) => (collapsed ? <span className="font-bold">A</span> : <span className="body font-bold">Acme</span>)}
      footer={() => <div className="caption text-muted-foreground">v1.0</div>}
    />
  ),
}
