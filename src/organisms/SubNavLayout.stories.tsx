import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SubNavLayout, type SubNavItem} from './SubNavLayout'
import {Archive, KeyRound, Tags, User} from '../atoms/icons'

const meta: Meta<typeof SubNavLayout> = {
  title: 'Organisms/SubNavLayout',
  component: SubNavLayout,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof meta>

const items: SubNavItem[] = [
  {label: 'Buckets', href: '/settings/buckets', icon: <Archive className="size-4" />},
  {label: 'Konten', href: '/settings/accounts', icon: <KeyRound className="size-4" />},
  {label: 'Taxonomien', href: '/settings/taxonomies', icon: <Tags className="size-4" />},
  {label: 'Profil', href: '/settings/profile', icon: <User className="size-4" />},
]

export const Default: Story = {
  render: () => {
    function Demo() {
      const [path, setPath] = useState('/settings/accounts')
      return (
        <SubNavLayout
          items={items}
          currentPath={path}
          onNavigate={setPath}
          ariaLabel="Einstellungen"
          mobilePlaceholder="Einstellungen"
          // Story-Link: statt Navigation den lokalen State setzen.
          linkComponent={({href, children, ...rest}) => (
            <a href={href} onClick={e => { e.preventDefault(); setPath(href) }} {...rest}>{children}</a>
          )}
        >
          <div className="rounded-lg border border-border p-6">
            <h2 className="heading-2">{items.find(i => path.startsWith(i.href))?.label}</h2>
            <p className="body text-muted-foreground mt-2">Content der Sub-Page ({path}).</p>
          </div>
        </SubNavLayout>
      )
    }
    return <Demo />
  },
}
