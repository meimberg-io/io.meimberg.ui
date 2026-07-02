import type {Meta, StoryObj} from '@storybook/react-vite'
import {AppShell} from './AppShell'
import {AppSidebar, type SidebarNavGroup} from './AppSidebar'
import {Breadcrumbs} from './Breadcrumbs'
import {House, Inbox, Radio} from '../atoms/icons'
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
    label: 'Pipeline',
    items: [
      {label: 'Home', href: '/', icon: <House className="h-4 w-4" />},
      {label: 'Inbox', href: '/inbox', icon: <Inbox className="h-4 w-4" />},
      {label: 'Signals', href: '/signals', icon: <Radio className="h-4 w-4" />},
    ],
  },
]

export const Default: Story = {
  render: () => (
    <AppShell
      sidebar={
        <AppSidebar
          groups={groups}
          currentPath="/inbox"
          header={collapsed => (collapsed ? <span className="font-bold">M</span> : <span className="body font-bold">Meimberg</span>)}
        />
      }
      headerStart={
        <Breadcrumbs
          className="hidden md:block"
          rootLabel="Home"
          items={[{label: 'Inbox'}]}
        />
      }
      headerEnd={<ThemeToggle />}
    >
      <div className="p-8">
        <h1 className="heading-1">Inbox</h1>
        <p className="body text-muted-foreground mt-2">Main-Content-Bereich.</p>
      </div>
    </AppShell>
  ),
}
