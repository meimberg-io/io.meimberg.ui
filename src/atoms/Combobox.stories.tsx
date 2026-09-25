import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Combobox, type ComboboxItem} from './Combobox'
import {FormField} from '../molecules/FormField'
import {FormDialog} from '../organisms/FormDialog'
import {Button} from './Button'
import {Globe, Mail, MessageSquare, Users} from './icons'

const meta: Meta<typeof Combobox> = {
  title: 'Atoms/Combobox',
  parameters: {
    docs: {
      description: {
        component:
          'Single select for rich items (label + sub line, custom render slots) with optional search. ' +
          'Radix Popover with an own listbox (`aria-activedescendant`): ↑/↓ skip disabled items, Home/End, Enter selects, ' +
          'Escape/Tab close. Works inside dialogs (portal above the dialog layer).',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Combobox>

const PEOPLE: ComboboxItem[] = [
  {id: 'ada', label: 'Ada Lovelace', sub: 'Engineering'},
  {id: 'grace', label: 'Grace Hopper', sub: 'Research'},
  {id: 'alan', label: 'Alan Turing', sub: 'Research', disabled: true},
  {id: 'katherine', label: 'Katherine Johnson', sub: 'Operations'},
  {id: 'margaret', label: 'Margaret Hamilton', sub: 'Engineering'},
]

function BasicDemo({searchable}: {searchable?: boolean}) {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="w-80">
      <FormField label="Owner">
        <Combobox
          items={PEOPLE}
          value={value}
          onChange={setValue}
          searchable={searchable}
          leading={<Users className="size-3.5 text-muted-foreground shrink-0" />}
          placeholder="Pick an owner"
        />
      </FormField>
    </div>
  )
}

export const Default: Story = {
  render: () => <BasicDemo />,
}

export const Searchable: Story = {
  render: () => <BasicDemo searchable />,
}

interface Channel extends ComboboxItem {
  icon: typeof Mail
  tint: string
}

const CHANNELS: Channel[] = [
  {id: 'mail', label: 'Mail', sub: 'Shared inbox', icon: Mail, tint: 'bg-sky-500/15 text-sky-500'},
  {id: 'chat', label: 'Chat', sub: 'Team channel', icon: MessageSquare, tint: 'bg-violet-500/15 text-violet-500'},
  {id: 'web', label: 'Web', sub: 'Bookmarks', icon: Globe, tint: 'bg-emerald-500/15 text-emerald-500'},
]

function ChannelRow({item}: {item: Channel}) {
  const Icon = item.icon
  return (
    <>
      <span className={`grid size-7 shrink-0 place-items-center rounded-md ${item.tint}`}>
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block body-sm text-foreground truncate">{item.label}</span>
        <span className="block caption text-muted-foreground truncate">{item.sub}</span>
      </span>
    </>
  )
}

function RichDemo() {
  const [value, setValue] = useState<string | null>('chat')
  return (
    <div className="w-80">
      <FormField label="Channel">
        <Combobox
          items={CHANNELS}
          value={value}
          onChange={setValue}
          searchable
          filterItem={(item, query) => `${item.label} ${item.sub}`.toLowerCase().includes(query.toLowerCase())}
          renderSelected={item => (
            <span className="flex flex-1 items-center gap-2 min-w-0">
              <item.icon className="size-3.5 text-muted-foreground shrink-0" />
              <span className="body-sm font-medium truncate">{item.label}</span>
            </span>
          )}
          renderItem={item => <ChannelRow item={item} />}
        />
      </FormField>
    </div>
  )
}

export const RichItems: Story = {
  name: 'Rich items (renderItem / renderSelected)',
  render: () => <RichDemo />,
}

function EmptyDemo() {
  return (
    <div className="w-80">
      <Combobox items={[]} value={null} onChange={() => {}} />
    </div>
  )
}

export const Empty: Story = {
  render: () => <EmptyDemo />,
}

// Lang genug, dass die Liste im Dialog scrollt.
const MANY_PEOPLE: ComboboxItem[] = Array.from({length: 40}, (_, i) => ({
  id: `person-${i + 1}`,
  label: `Team member ${i + 1}`,
  sub: ['Engineering', 'Research', 'Operations', 'Design'][i % 4],
}))

function InDialogDemo() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | null>(null)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <FormDialog open={open} onOpenChange={setOpen} title="Assign owner" submitLabel="Save" onSubmit={() => setOpen(false)}>
        <FormField label="Owner">
          <Combobox items={MANY_PEOPLE} value={value} onChange={setValue} searchable />
        </FormField>
      </FormDialog>
    </>
  )
}

export const InsideFormDialog: Story = {
  name: 'Inside FormDialog',
  render: () => <InDialogDemo />,
}
