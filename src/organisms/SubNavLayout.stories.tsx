import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SubNavLayout, type SubNavItem} from './SubNavLayout'
import {Bell, KeyRound, User, Users} from '../atoms/icons'

const meta: Meta<typeof SubNavLayout> = {
  title: 'Organisms/SubNavLayout',
  component: SubNavLayout,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof meta>

const items: SubNavItem[] = [
  {label: 'Profile', href: '/settings/profile', icon: <User className="size-4" />},
  {label: 'Team', href: '/settings/team', icon: <Users className="size-4" />},
  {label: 'Notifications', href: '/settings/notifications', icon: <Bell className="size-4" />},
  {label: 'Security', href: '/settings/security', icon: <KeyRound className="size-4" />},
]

export const Default: Story = {
  render: () => {
    function Demo() {
      const [path, setPath] = useState('/settings/team')
      return (
        <SubNavLayout
          items={items}
          currentPath={path}
          onNavigate={setPath}
          ariaLabel="Settings"
          mobilePlaceholder="Settings"
          // Story link: set local state instead of navigating.
          linkComponent={({href, children, ...rest}) => (
            <a href={href} onClick={e => { e.preventDefault(); setPath(href) }} {...rest}>{children}</a>
          )}
        >
          <div className="rounded-lg border border-border p-6">
            <h2 className="heading-2">{items.find(i => path.startsWith(i.href))?.label}</h2>
            <p className="body text-muted-foreground mt-2">Sub-page content ({path}).</p>
          </div>
        </SubNavLayout>
      )
    }
    return <Demo />
  },
}
