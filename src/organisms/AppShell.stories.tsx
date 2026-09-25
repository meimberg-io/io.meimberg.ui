import type {Meta, StoryObj} from '@storybook/react-vite'
import {AppShell} from './AppShell'
import {AppSidebar, type SidebarNavGroup} from './AppSidebar'
import {Breadcrumbs} from './Breadcrumbs'
import {House, FolderKanban, ListTodo, Settings} from '../atoms/icons'
import {ThemeToggle} from '../atoms/ThemeToggle'

const meta: Meta<typeof AppShell> = {
  title: 'Organisms/AppShell',
  component: AppShell,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof meta>

const groups: SidebarNavGroup[] = [
  {
    label: 'Workspace',
    items: [
      {label: 'Home', href: '/', icon: <House className="h-4 w-4" />},
      {label: 'Projects', href: '/projects', icon: <FolderKanban className="h-4 w-4" />},
      {label: 'Tasks', href: '/tasks', icon: <ListTodo className="h-4 w-4" />},
    ],
  },
  {
    items: [{label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" />}],
  },
]

export const Default: Story = {
  render: () => (
    <AppShell
      sidebar={
        <AppSidebar
          groups={groups}
          currentPath="/projects"
          header={({collapsed}) => (collapsed ? <span className="font-bold">A</span> : <span className="body font-bold">Acme</span>)}
        />
      }
      headerStart={
        <Breadcrumbs
          className="hidden md:block"
          rootLabel="Home"
          items={[{label: 'Projects'}]}
        />
      }
      headerEnd={<ThemeToggle />}
    >
      <div className="p-8">
        <h1 className="heading-1">Projects</h1>
        <p className="body text-muted-foreground mt-2">Main content area.</p>
      </div>
    </AppShell>
  ),
}
