import type {Meta, StoryObj} from '@storybook/react-vite'
import {SidebarProvider} from '../ui/sidebar'
import {AppSidebar, type SidebarNavGroup} from './AppSidebar'
import {CounterPill} from '../atoms/CounterPill'
import {House, Inbox, Radio, ListTodo, FolderKanban} from '../atoms/icons'

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
    label: 'Pipeline',
    items: [
      {label: 'Home', href: '/', icon: <House className="h-4 w-4" />},
      {label: 'Inbox', href: '/inbox', icon: <Inbox className="h-4 w-4" />, badge: <CounterPill size="compact">5</CounterPill>},
      {label: 'Signals', href: '/signals', icon: <Radio className="h-4 w-4" />},
      {label: 'Todo', href: '/todo', icon: <ListTodo className="h-4 w-4" />, badge: <CounterPill size="compact">12</CounterPill>},
      {label: 'Missions', href: '/missions', icon: <FolderKanban className="h-4 w-4" />},
    ],
  },
]

export const Default: Story = {
  render: () => (
    <AppSidebar
      groups={groups}
      currentPath="/inbox"
      header={collapsed => (collapsed ? <span className="font-bold">M</span> : <span className="body font-bold">Meimberg</span>)}
      footer={() => <div className="caption text-muted-foreground">v1.0</div>}
    />
  ),
}
