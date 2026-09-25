import type {Meta, StoryObj} from '@storybook/react-vite'
import {UserMenu, type UserMenuItem} from './UserMenu'
import {User, Settings, LogOut} from '../atoms/icons'

const meta: Meta<typeof UserMenu> = {
  title: 'Organisms/UserMenu',
  component: UserMenu,
  parameters: {layout: 'padded'},
  decorators: [Story => <div style={{width: 240}}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const items: UserMenuItem[] = [
  {label: 'Edit profile', href: '/settings/profile', icon: User},
  {label: 'Settings', href: '/settings', icon: Settings},
]

const signOut = (
  <button
    type="button"
    className="flex w-full items-center gap-2 rounded-sm px-2 py-2 body text-destructive hover:bg-destructive/10 cursor-pointer"
  >
    <LogOut className="h-4 w-4" />
    Sign out
  </button>
)

export const Expanded: Story = {
  render: () => (
    <UserMenu name="Alex Morgan" email="alex@example.com" items={items} footer={signOut} />
  ),
}

export const Collapsed: Story = {
  render: () => (
    <div style={{width: 56}}>
      <UserMenu name="Alex Morgan" email="alex@example.com" collapsed items={items} footer={signOut} />
    </div>
  ),
}

export const WithAvatarImage: Story = {
  render: () => (
    <UserMenu
      name="Alex Morgan"
      email="alex@example.com"
      avatarUrl="https://avatars.githubusercontent.com/u/9919?s=80"
      items={items}
      footer={signOut}
    />
  ),
}

/** Action items (`onSelect`) next to links; `tone="destructive"` for sign-out. */
export const WithActionItems: Story = {
  render: () => (
    <UserMenu
      name="Alex Morgan"
      email="alex@example.com"
      items={[
        ...items,
        {label: 'Keyboard shortcuts', onSelect: () => {}},
        {label: 'Sign out', icon: LogOut, onSelect: () => {}, tone: 'destructive'},
      ]}
    />
  ),
}
