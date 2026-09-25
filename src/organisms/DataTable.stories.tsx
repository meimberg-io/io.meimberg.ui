// Responsive data grid. Desktop = table, < md = cards. The mobile card variant
// shows up via the Storybook viewport toolbar (width < 768px); `useIsMobile()`
// switches at runtime based on the window width.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {DataTable, type DataTableColumn} from './DataTable'
import {Button} from '../atoms/Button'
import {Badge} from '../atoms/Badge'

const meta: Meta<typeof DataTable> = {
  title: 'Organisms/DataTable',
  component: DataTable,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof meta>

interface Job {
  id: string
  target: string
  status: string
  http: number | null
  attempts: number
  created: string
}

const ROWS: Job[] = [
  {id: '1', target: 'Webhook: Billing', status: 'done', http: 200, attempts: 1, created: '2026-06-17 14:02'},
  {id: '2', target: 'CRM export', status: 'failed', http: 502, attempts: 3, created: '2026-06-17 13:40'},
  {id: '3', target: 'Nightly backup', status: 'queued', http: null, attempts: 0, created: '2026-06-17 13:31'},
]

const COLUMNS: DataTableColumn<Job>[] = [
  {key: 'target', header: 'Target', cell: r => r.target},
  {key: 'status', header: 'Status', cell: r => <Badge variant="outline">{r.status}</Badge>},
  {key: 'http', header: 'HTTP', cell: r => <span className="caption">{r.http ?? '—'}</span>},
  {key: 'attempts', header: 'Attempts', cell: r => <span className="caption">{r.attempts}</span>},
  {
    key: 'created',
    header: 'Created',
    cell: r => <span className="caption text-muted-foreground">{r.created}</span>,
  },
  {
    key: 'actions',
    header: <span className="sr-only">Actions</span>,
    headerClassName: 'w-12 text-right',
    cellClassName: 'text-right',
    hideOnCard: true,
    cell: () => (
      <Button variant="ghost">
        Retry
      </Button>
    ),
  },
]

export const Default: Story = {
  render: () => <DataTable<Job> columns={COLUMNS} rows={ROWS} getRowKey={r => r.id} />,
}

export const Empty: Story = {
  render: () => <DataTable<Job> columns={COLUMNS} rows={[]} getRowKey={r => r.id} />,
}
