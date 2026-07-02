import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {RichSelect, type RichSelectItem} from './RichSelect'
import {Cloud, FileText, Zap, type LucideIcon} from '../atoms/icons'

const meta: Meta<typeof RichSelect> = {
  title: 'Atoms/RichSelect',
  component: RichSelect,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

interface AccountItem extends RichSelectItem {
  icon: LucideIcon
}

const ACCOUNTS: ReadonlyArray<AccountItem> = [
  {id: 'jira-mb', label: 'meimberg.atlassian.net', sub: 'Jira', icon: Cloud},
  {id: 'linear-mb', label: 'meimbergio', sub: 'Linear', icon: Zap},
  {id: 'notion-mb', label: 'meimberg-workspace', sub: 'Notion', icon: FileText},
]

const SHORT: ReadonlyArray<RichSelectItem> = [
  {id: 'a', label: 'Option A'},
  {id: 'b', label: 'Option B'},
]

function Demo({initial}: {initial: RichSelectItem | null}) {
  const [selected, setSelected] = useState<RichSelectItem | null>(initial)
  return (
    <div style={{width: 320}}>
      <RichSelect items={SHORT} selected={selected} onSelect={setSelected} />
    </div>
  )
}

export const Empty: Story = {
  render: () => <Demo initial={null} />,
}

export const Selected: Story = {
  render: () => <Demo initial={SHORT[0]} />,
}

export const Disabled: Story = {
  render: () => (
    <div style={{width: 320}}>
      <RichSelect items={SHORT} selected={SHORT[0]} onSelect={() => {}} disabled />
    </div>
  ),
}

export const WithSubText: Story = {
  render: () => {
    function AccountDemo() {
      const [selected, setSelected] = useState<AccountItem | null>(ACCOUNTS[1])
      return (
        <div style={{width: 360}}>
          <RichSelect<AccountItem>
            items={ACCOUNTS}
            selected={selected}
            onSelect={setSelected}
            renderSelected={item => (
              <span className="flex items-center gap-2 flex-1 min-w-0">
                <item.icon className="size-3.5 shrink-0" aria-hidden />
                <span className="body-sm text-foreground truncate font-medium">{item.label}</span>
              </span>
            )}
            renderItem={item => (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <item.icon className="size-4 shrink-0" aria-hidden />
                <div className="flex-1 min-w-0">
                  <div className="body-sm text-foreground truncate">{item.label}</div>
                  <div className="caption text-muted-foreground truncate">{item.sub}</div>
                </div>
              </div>
            )}
          />
        </div>
      )
    }
    return <AccountDemo />
  },
}

export const NoOptions: Story = {
  render: () => (
    <div style={{width: 320}}>
      <RichSelect items={[]} selected={null} onSelect={() => {}} placeholder="Keine Accounts" />
    </div>
  ),
}

export const DisabledItem: Story = {
  render: () => {
    function Demo() {
      const items: ReadonlyArray<RichSelectItem> = [
        {id: 'a', label: 'Option A'},
        {id: 'b', label: 'Option B (in Vorbereitung)', disabled: true},
        {id: 'c', label: 'Option C'},
      ]
      const [selected, setSelected] = useState<RichSelectItem | null>(items[0])
      return (
        <div style={{width: 320}}>
          <RichSelect items={items} selected={selected} onSelect={setSelected} />
        </div>
      )
    }
    return <Demo />
  },
}

// PUL-397: Searchable-Modus — Suchfeld am Top des Popovers. Default-Filter
// macht Substring-Match auf `label + sub`.
export const Searchable: Story = {
  render: () => {
    function SearchDemo() {
      const items: ReadonlyArray<RichSelectItem> = [
        'Berlin',
        'Hamburg',
        'München',
        'Köln',
        'Frankfurt am Main',
        'Stuttgart',
        'Düsseldorf',
        'Leipzig',
        'Dortmund',
        'Essen',
        'Bremen',
        'Dresden',
        'Hannover',
        'Nürnberg',
      ].map(city => ({id: city, label: city}))
      const [selected, setSelected] = useState<RichSelectItem | null>(null)
      return (
        <div style={{width: 320}}>
          <RichSelect
            items={items}
            selected={selected}
            onSelect={setSelected}
            searchable
            searchPlaceholder="Stadt suchen…"
            placeholder="Stadt wählen…"
          />
        </div>
      )
    }
    return <SearchDemo />
  },
}

export const SearchableWithSubText: Story = {
  render: () => {
    function SearchSubDemo() {
      const items: ReadonlyArray<RichSelectItem> = [
        {id: 'Europe/Berlin', label: 'Europe/Berlin', sub: 'UTC+1'},
        {id: 'Europe/London', label: 'Europe/London', sub: 'UTC+0'},
        {id: 'America/New_York', label: 'America/New York', sub: 'UTC-5'},
        {id: 'America/Los_Angeles', label: 'America/Los Angeles', sub: 'UTC-8'},
        {id: 'Asia/Tokyo', label: 'Asia/Tokyo', sub: 'UTC+9'},
        {id: 'Asia/Singapore', label: 'Asia/Singapore', sub: 'UTC+8'},
        {id: 'Australia/Sydney', label: 'Australia/Sydney', sub: 'UTC+11'},
      ]
      const [selected, setSelected] = useState<RichSelectItem | null>(items[0])
      return (
        <div style={{width: 360}}>
          <RichSelect
            items={items}
            selected={selected}
            onSelect={setSelected}
            searchable
            searchPlaceholder="Zeitzone suchen…"
            estimatedHeight={400}
          />
        </div>
      )
    }
    return <SearchSubDemo />
  },
}
