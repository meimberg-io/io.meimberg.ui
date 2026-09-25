import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {FilterBar, type FilterField, type FilterBarValue} from './FilterBar'

const meta: Meta<typeof FilterBar> = {
  title: 'Organisms/FilterBar',
  component: FilterBar,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof meta>

const fields: FilterField[] = [
  {kind: 'search', key: 'q', placeholder: 'Search…'},
  {
    kind: 'select',
    key: 'status',
    label: 'Status',
    options: [
      {value: 'open', label: 'Open'},
      {value: 'done', label: 'Done'},
    ],
  },
  {
    kind: 'chipsMulti',
    key: 'prio',
    label: 'Priority',
    options: [
      {value: 'p1', label: 'P1'},
      {value: 'p2', label: 'P2'},
      {value: 'p3', label: 'P3'},
    ],
  },
  {
    kind: 'segmented',
    key: 'due',
    options: [
      {value: 'overdue', label: 'Overdue'},
      {value: 'today', label: 'Today'},
    ],
  },
  {kind: 'toggle', key: 'mine', label: 'Only mine'},
]

export const Default: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<FilterBarValue>({})
      return <FilterBar fields={fields} value={value} onChange={setValue} onReset={() => setValue({})} />
    }
    return <Demo />
  },
}

export const WithCustomField: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<FilterBarValue>({})
      const withCustom: FilterField[] = [
        {kind: 'search', key: 'q', placeholder: 'Search…'},
        {
          kind: 'custom',
          key: 'team',
          render: (v, set) => (
            <select
              value={typeof v === 'string' ? v : ''}
              onChange={e => set(e.target.value || null)}
              className="h-8 rounded-md border border-border bg-card px-2 body"
            >
              <option value="">All teams</option>
              <option value="a">Team A</option>
              <option value="b">Team B</option>
            </select>
          ),
        },
      ]
      return <FilterBar fields={withCustom} value={value} onChange={setValue} />
    }
    return <Demo />
  },
}
