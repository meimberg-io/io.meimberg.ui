import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState, type ReactNode} from 'react'
import {Select, type SelectOption} from './Select'
import {FormField} from '../molecules/FormField'
import {Archive, Building2, FileText, Folder, ListTodo, Tag, Users} from './icons'
import type {ControlSize} from '../lib/variants'

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  parameters: {
    docs: {
      description: {
        component:
          'Single select on Radix Select. `variant="field"` (default, `lg`) is the form-field look; ' +
          '`variant="pill"` (default `xs`) is the filter/property pill. ' +
          'Convenience `<Select options>` for plain lists, compound `<Select.Root><Select.Trigger>…<Select.Content><Select.Item>` ' +
          'for rich triggers (border-flush `Select.TriggerIcon`, `Select.IconTrigger`) and grouped content.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

const SIZES: ControlSize[] = ['xs', 'sm', 'md', 'lg']

function SizeRow({render}: {render: (size: ControlSize) => ReactNode}) {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {SIZES.map(size => (
        <div key={size} className="flex flex-col gap-1.5">
          <span className="caption text-muted-foreground">{size}</span>
          {render(size)}
        </div>
      ))}
    </div>
  )
}

type Status = 'open' | 'done' | 'blocked'
const STATUS: SelectOption<Status>[] = [
  {value: 'open', label: 'Open'},
  {value: 'done', label: 'Done'},
  {value: 'blocked', label: 'Blocked'},
]

const dot = (cls: string) => <span className={`inline-block size-2.5 rounded-full ${cls}`} />
type Priority = 'critical' | 'high' | 'medium' | 'low'
const PRIORITY: SelectOption<Priority>[] = [
  {value: 'critical', label: 'Critical', leading: dot('bg-rose-500'), meta: 'P0'},
  {value: 'high', label: 'High', leading: dot('bg-orange-500'), meta: 'P1'},
  {value: 'medium', label: 'Medium', leading: dot('bg-amber-400'), meta: 'P2'},
  {value: 'low', label: 'Low', leading: dot('bg-zinc-400'), meta: 'P3'},
]

type Kind = 'task' | 'team' | 'tag' | 'archived'
const KIND: SelectOption<Kind>[] = [
  {value: 'task', label: 'Task', leading: <ListTodo className="size-4" />},
  {value: 'team', label: 'Team', leading: <Users className="size-4" />},
  {value: 'tag', label: 'Tag', leading: <Tag className="size-4" />},
  {value: 'archived', label: 'Archived (locked)', disabled: true},
]

// ─── Field ────────────────────────────────────────────────────────────────

function FieldDemo({size}: {size?: ControlSize}) {
  const [value, setValue] = useState<Status | null>(null)
  return (
    <div className="w-64">
      <FormField label="Status">
        <Select value={value} onChange={setValue} options={STATUS} placeholder="Pick a status" size={size} />
      </FormField>
    </div>
  )
}

export const Field: Story = {
  render: () => <FieldDemo />,
}

export const FieldSizes: Story = {
  name: 'Field — sizes',
  render: () => <SizeRow render={size => <FieldDemo size={size} />} />,
}

function FieldWithLeadingDemo() {
  const [value, setValue] = useState<Priority | null>('high')
  return (
    <div className="w-64">
      <FormField label="Priority">
        <Select value={value} onChange={setValue} options={PRIORITY} />
      </FormField>
    </div>
  )
}

export const FieldWithLeadingAndMeta: Story = {
  name: 'Field — leading + meta',
  render: () => <FieldWithLeadingDemo />,
}

// ─── Pill ─────────────────────────────────────────────────────────────────

function PillDemo({size}: {size?: ControlSize}) {
  const [value, setValue] = useState<Status | null>(null)
  return <Select variant="pill" size={size} value={value} onChange={setValue} options={STATUS} clearLabel="All statuses" />
}

export const Pill: Story = {
  name: 'Pill — clear row',
  render: () => <PillDemo />,
}

export const PillSizes: Story = {
  name: 'Pill — sizes',
  render: () => <SizeRow render={size => <PillDemo size={size} />} />,
}

function PillLeadingDemo({size}: {size?: ControlSize}) {
  const [value, setValue] = useState<Kind | null>('task')
  return <Select variant="pill" size={size} value={value} onChange={setValue} options={KIND} clearLabel="All types" />
}

export const PillWithLeading: Story = {
  name: 'Pill — leading + disabled option',
  render: () => <SizeRow render={size => <PillLeadingDemo size={size} />} />,
}

function PillPlaceholderDemo() {
  const [value, setValue] = useState<Priority | null>(null)
  return <Select variant="pill" value={value} onChange={setValue} options={PRIORITY} placeholder="Priority" />
}

export const PillRequired: Story = {
  name: 'Pill — placeholder, no clear row',
  render: () => <PillPlaceholderDemo />,
}

function CompactDemo() {
  const [value, setValue] = useState<string | null>('docs')
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger
        variant="pill"
        compactBelow="md"
        leading={<Select.TriggerIcon><Folder /></Select.TriggerIcon>}
        aria-label="Folder"
      >
        {value === 'docs' ? 'Documents' : 'All folders'}
      </Select.Trigger>
      <Select.Content>
        <Select.ClearItem>All folders</Select.ClearItem>
        <Select.Item value="docs">Documents</Select.Item>
      </Select.Content>
    </Select.Root>
  )
}

export const CompactBelow: Story = {
  name: 'Pill — compactBelow="md" (resize to see icon-only)',
  render: () => <CompactDemo />,
}

// ─── Compound ─────────────────────────────────────────────────────────────

const FOLDERS = [
  {id: 'favorites', label: 'Favorites', icon: <Folder className="size-3.5 text-sky-500" />, tint: 'bg-sky-500/15 text-sky-500'},
  {id: 'documents', label: 'Documents', icon: <FileText className="size-3.5 text-violet-500" />, tint: 'bg-violet-500/15 text-violet-500'},
  {id: 'archive', label: 'Archive', icon: <Archive className="size-3.5 text-zinc-500" />, tint: 'bg-zinc-500/15 text-zinc-500'},
]

function CompoundDemo({size}: {size: ControlSize}) {
  const [value, setValue] = useState<string | null>(null)
  const selected = FOLDERS.find(f => f.id === value) ?? null
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger
        variant="pill"
        size={size}
        aria-label={selected ? `Folder: ${selected.label}` : 'All folders'}
        leading={
          selected
            ? <Select.TriggerIcon className={selected.tint}><Folder /></Select.TriggerIcon>
            : <Select.TriggerIcon tone="primary"><Folder /></Select.TriggerIcon>
        }
      >
        {selected ? selected.label : 'All folders'}
      </Select.Trigger>
      <Select.Content>
        <Select.ClearItem leading={<Folder className="size-3.5" />}>All folders</Select.ClearItem>
        <Select.Separator />
        <Select.GroupLabel>Folders</Select.GroupLabel>
        {FOLDERS.map(f => (
          <Select.Item key={f.id} value={f.id} leading={f.icon}>
            {f.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}

export const CompoundTriggerIcon: Story = {
  name: 'Compound — border-flush trigger icon',
  render: () => <SizeRow render={size => <CompoundDemo size={size} />} />,
}

function IconTriggerDemo() {
  const [value, setValue] = useState<string | null>('north')
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.IconTrigger tooltip="Switch workspace">
        <Building2 className="size-5" />
      </Select.IconTrigger>
      <Select.Content>
        <Select.GroupLabel>Workspaces</Select.GroupLabel>
        <Select.Item value="north">North Studio</Select.Item>
        <Select.Item value="south">South Lab</Select.Item>
        <Select.Item value="east" disabled>East Office (no access)</Select.Item>
      </Select.Content>
    </Select.Root>
  )
}

export const IconTrigger: Story = {
  name: 'Compound — icon trigger with tooltip',
  render: () => <IconTriggerDemo />,
}
