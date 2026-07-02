import type {Meta, StoryObj} from '@storybook/react-vite'
import {UserMenu} from './UserMenu'
import {User, Settings, LogOut} from '../atoms/icons'

const meta: Meta<typeof UserMenu> = {
  title: 'Organisms/UserMenu',
  component: UserMenu,
  parameters: {layout: 'padded'},
  decorators: [Story => <div style={{width: 240}}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const items = [
  {label: 'Profil bearbeiten', href: '/settings/profile', icon: <User className="h-4 w-4" />},
  {label: 'Einstellungen', href: '/settings', icon: <Settings className="h-4 w-4" />},
]

const signOut = (
  <button
    type="button"
    className="flex w-full items-center gap-2 rounded-sm px-2 py-2 body text-destructive hover:bg-destructive/10 cursor-pointer"
  >
    <LogOut className="h-4 w-4" />
    Abmelden
  </button>
)

export const Expanded: Story = {
  render: () => (
    <UserMenu name="Oliver Meimberg" email="oli@meimberg.io" items={items} footer={signOut} />
  ),
}

export const Collapsed: Story = {
  render: () => (
    <div style={{width: 56}}>
      <UserMenu name="Oliver Meimberg" email="oli@meimberg.io" collapsed items={items} footer={signOut} />
    </div>
  ),
}

export const WithAvatarImage: Story = {
  render: () => (
    <UserMenu
      name="Oliver Meimberg"
      email="oli@meimberg.io"
      avatarUrl="https://avatars.githubusercontent.com/u/9919?s=80"
      items={items}
      footer={signOut}
    />
  ),
}
