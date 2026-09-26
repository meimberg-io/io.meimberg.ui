// Below `md` every group wraps and the search takes the full width. Set the
// Storybook viewport below 768px to see it.
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {FilterBar} from './FilterBar'
import {Button} from '../atoms/Button'
import {Chip} from '../atoms/Chip'
import {SearchInput} from '../atoms/SearchInput'
import {SegmentedControl} from '../atoms/SegmentedControl'
import {Select} from '../atoms/Select'
import {Download, LayoutGrid, List} from '../atoms/icons'

const meta: Meta<typeof FilterBar> = {
  title: 'Molecules/FilterBar',
  component: FilterBar,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof FilterBar>

type Status = 'open' | 'done'
type Sort = 'due' | 'created' | 'title'
type View = 'list' | 'board'

// Full bar: every slot filled. Order is fixed by the component.
function TaskFilterBar({tint, below, withView = true, withActions = true}: {
  tint?: string
  below?: boolean
  withView?: boolean
  withActions?: boolean
}) {
  const [status, setStatus] = useState<Status | null>(null)
  const [sort, setSort] = useState<Sort>('due')
  const [mine, setMine] = useState(false)
  const [view, setView] = useState<View>('list')
  const [query, setQuery] = useState('')
  return (
    <FilterBar
      tint={tint}
      filters={
        <>
          <Select
            variant="pill"
            value={status}
            onChange={setStatus}
            clearLabel="All statuses"
            options={[{value: 'open', label: 'Open'}, {value: 'done', label: 'Done'}]}
          />
          <Select
            variant="pill"
            value={sort}
            onChange={setSort}
            options={[
              {value: 'due', label: 'By due date'},
              {value: 'created', label: 'Newest first'},
              {value: 'title', label: 'Alphabetical'},
            ]}
          />
          <Chip active={mine} onClick={() => setMine(m => !m)}>Assigned to me</Chip>
        </>
      }
      view={
        withView ? (
          <SegmentedControl
            size="xs"
            value={view}
            onChange={setView}
            aria-label="View"
            options={[{value: 'list', label: 'List', icon: List}, {value: 'board', label: 'Board', icon: LayoutGrid}]}
          />
        ) : undefined
      }
      search={<SearchInput size="xs" value={query} onChange={setQuery} placeholder="Search tasks" />}
      actions={withActions ? <Button variant="ghost" size="xs" icon={Download}>Export</Button> : undefined}
      below={
        below ? (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <Chip onRemove={() => undefined} prefix="Tag">Customer</Chip>
            <Chip onRemove={() => undefined} prefix="Tag">Urgent</Chip>
          </div>
        ) : undefined
      }
    />
  )
}

export const Default: Story = {
  render: () => <TaskFilterBar />,
}

export const FiltersAndSearch: Story = {
  render: () => <TaskFilterBar withView={false} withActions={false} />,
}

export const Tinted: Story = {
  render: () => <TaskFilterBar tint="hsl(var(--primary))" />,
}

export const WithBelowRow: Story = {
  render: () => <TaskFilterBar below />,
}
