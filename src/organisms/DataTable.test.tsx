import {afterEach, describe, expect, it} from 'vitest'
import {render, screen, within} from '@testing-library/react'
import {DataTable, type DataTableColumn} from './DataTable'

interface Row {
  id: string
  name: string
  owner: string
}

const rows: Row[] = [
  {id: '1', name: 'Alpha', owner: 'Ada'},
  {id: '2', name: 'Beta', owner: 'Grace'},
]

const columns: DataTableColumn<Row>[] = [
  {key: 'name', header: 'Name', cell: r => r.name, cellClassName: 'font-medium'},
  {key: 'owner', header: 'Owner', cardLabel: 'Owned by', cell: r => r.owner},
  {key: 'actions', header: 'Actions', hideOnCard: true, cell: r => <button type="button">Open {r.name}</button>},
]

const DESKTOP_WIDTH = 1024
const MOBILE_WIDTH = 500

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {configurable: true, writable: true, value: width})
}

afterEach(() => setViewport(DESKTOP_WIDTH))

describe('DataTable', () => {
  it('desktop: renders a table with headers, one row per item and cell classes', () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={r => r.id} />)
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('columnheader').map(h => h.textContent)).toEqual(['Name', 'Owner', 'Actions'])
    // header row + 2 body rows
    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(screen.getByRole('cell', {name: 'Alpha'}).className).toContain('font-medium')
    expect(screen.getByRole('button', {name: 'Open Beta'})).toBeInTheDocument()
  })

  it('desktop: merges className on the frame', () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={r => r.id} className="mt-4" />)
    expect(screen.getByRole('table').closest('.mt-4')).not.toBeNull()
  })

  it('mobile: renders one card per row with label:value pairs', () => {
    setViewport(MOBILE_WIDTH)
    const {container} = render(<DataTable columns={columns} rows={rows} getRowKey={r => r.id} className="mt-4" />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    const list = container.firstElementChild as HTMLElement
    expect(list.className).toContain('mt-4')
    expect(list.children).toHaveLength(2)
    const first = list.children[0] as HTMLElement
    expect(within(first).getByText('Name')).toBeInTheDocument()
    // cardLabel wins over header
    expect(within(first).getByText('Owned by')).toBeInTheDocument()
    expect(within(first).queryByText('Owner')).not.toBeInTheDocument()
    // hideOnCard: value without label
    expect(within(first).queryByText('Actions')).not.toBeInTheDocument()
    expect(within(first).getByRole('button', {name: 'Open Alpha'})).toBeInTheDocument()
  })

  it('renders nothing but the frame for empty rows', () => {
    render(<DataTable columns={columns} rows={[]} getRowKey={r => r.id} />)
    expect(screen.getAllByRole('row')).toHaveLength(1)
  })
})
