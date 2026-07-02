// PUL-456: DataTable — responsives Daten-Grid. Desktop = Tabelle, < md = Cards.
// Die Mobile-Card-Variante wird über die Storybook-Viewport-Toolbar (Breite < 768px)
// sichtbar; `useIsMobile()` schaltet zur Laufzeit anhand der Fensterbreite um.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {DataTable, type DataTableColumn} from './DataTable'
import {Button} from '../ui/button'
import {Pill} from '../atoms/Pill'

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
  {id: '1', target: 'Notion-Inbox', status: 'done', http: 200, attempts: 1, created: '17.06.2026 14:02'},
  {id: '2', target: 'Jira-Sync', status: 'failed', http: 502, attempts: 3, created: '17.06.2026 13:40'},
  {id: '3', target: 'Raindrop-Export', status: 'queued', http: null, attempts: 0, created: '17.06.2026 13:31'},
]

const COLUMNS: DataTableColumn<Job>[] = [
  {key: 'target', header: 'Target', cell: r => r.target},
  {key: 'status', header: 'Status', cell: r => <Pill>{r.status}</Pill>},
  {key: 'http', header: 'HTTP', cell: r => <span className="caption">{r.http ?? '—'}</span>},
  {key: 'attempts', header: 'Attempts', cell: r => <span className="caption">{r.attempts}</span>},
  {
    key: 'created',
    header: 'Created',
    cell: r => <span className="caption text-muted-foreground">{r.created}</span>,
  },
  {
    key: 'actions',
    header: <span className="sr-only">Aktionen</span>,
    headerClassName: 'w-12 text-right',
    cellClassName: 'text-right',
    hideOnCard: true,
    cell: () => (
      <Button variant="ghost" size="sm">
        Re-Queue
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
