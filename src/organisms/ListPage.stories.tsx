import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {ListPage} from './ListPage'
import {Badge} from '../atoms/Badge'
import {Button} from '../atoms/Button'
import {Chip} from '../atoms/Chip'
import {SearchInput} from '../atoms/SearchInput'
import {SegmentedControl} from '../atoms/SegmentedControl'
import {Select} from '../atoms/Select'
import {DashboardCard} from '../molecules/DashboardCard'
import {EmptyState} from '../molecules/EmptyState'
import {KpiTile} from '../molecules/KpiTile'
import {Download, LayoutGrid, List, ListTodo, Plus} from '../atoms/icons'

const meta: Meta<typeof ListPage> = {
  title: 'Organisms/ListPage',
  component: ListPage,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof ListPage>

type Status = 'open' | 'done'
type Sort = 'due' | 'created' | 'title'
type View = 'list' | 'board'

interface Task {
  id: number
  title: string
  status: Status
  due: string
}

const TASKS: Task[] = [
  {id: 1, title: 'Draft the release notes', status: 'open', due: '2026-10-02'},
  {id: 2, title: 'Review onboarding copy', status: 'open', due: '2026-10-05'},
  {id: 3, title: 'Archive old invoices', status: 'done', due: '2026-09-20'},
  {id: 4, title: 'Book the team offsite', status: 'open', due: '2026-10-12'},
]

const SORTERS: Record<Sort, (a: Task, b: Task) => number> = {
  due: (a, b) => a.due.localeCompare(b.due),
  created: (a, b) => b.id - a.id,
  title: (a, b) => a.title.localeCompare(b.title),
}

function TaskListPage({withIntro = false, withFilters = true}: {withIntro?: boolean; withFilters?: boolean}) {
  const [status, setStatus] = useState<Status | null>(null)
  const [sort, setSort] = useState<Sort>('due')
  const [overdue, setOverdue] = useState(false)
  const [view, setView] = useState<View>('list')
  const [query, setQuery] = useState('')

  const rows = TASKS
    .filter(t => status == null || t.status === status)
    .filter(t => !overdue || t.due < '2026-09-26')
    .filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    .sort(SORTERS[sort])

  return (
    <ListPage
      title="Tasks"
      description={`${rows.length} of ${TASKS.length} tasks`}
      actions={<Button icon={Plus}>New task</Button>}
      intro={
        withIntro ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiTile label="Open" value={3} />
            <KpiTile label="Due this week" value={2} tone="warning" />
            <KpiTile label="Overdue" value={0} tone="success" />
            <KpiTile label="Done" value={1} delta={{value: 12, direction: 'up'}} />
          </div>
        ) : undefined
      }
      filters={
        withFilters ? (
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
            <Chip active={overdue} onClick={() => setOverdue(o => !o)}>Overdue</Chip>
          </>
        ) : undefined
      }
      view={
        withFilters ? (
          <SegmentedControl
            size="xs"
            value={view}
            onChange={setView}
            aria-label="View"
            options={[{value: 'list', label: 'List', icon: List}, {value: 'board', label: 'Board', icon: LayoutGrid}]}
          />
        ) : undefined
      }
      search={withFilters ? <SearchInput size="xs" value={query} onChange={setQuery} placeholder="Search tasks" /> : undefined}
      filterActions={withFilters ? <Button variant="ghost" size="xs" icon={Download}>Export</Button> : undefined}
    >
      {rows.length === 0 ? (
        <EmptyState icon={ListTodo} title="No tasks" description="Nothing matches the active filters." />
      ) : (
        <div className={view === 'board' ? 'grid gap-3 md:grid-cols-2' : 'flex flex-col gap-2'}>
          {rows.map(t => (
            <DashboardCard key={t.id} padding="compact">
              <div className="flex items-center justify-between gap-3">
                <span>{t.title}</span>
                <Badge tone={t.status === 'done' ? 'success' : 'neutral'} variant="soft">{t.status}</Badge>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </ListPage>
  )
}

export const Default: Story = {
  render: () => <TaskListPage />,
}

export const WithIntroKpis: Story = {
  render: () => <TaskListPage withIntro />,
}

// No filter slot → no FilterBar.
export const WithoutFilters: Story = {
  render: () => <TaskListPage withFilters={false} />,
}
