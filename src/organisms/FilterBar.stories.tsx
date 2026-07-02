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
  {kind: 'search', key: 'q', placeholder: 'Suchen…'},
  {
    kind: 'select',
    key: 'status',
    label: 'Status',
    options: [
      {value: 'open', label: 'Offen'},
      {value: 'done', label: 'Erledigt'},
    ],
  },
  {
    kind: 'chipsMulti',
    key: 'prio',
    label: 'Prio',
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
      {value: 'overdue', label: 'Überfällig'},
      {value: 'today', label: 'Heute'},
    ],
  },
  {kind: 'toggle', key: 'mine', label: 'Nur meine'},
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
        {kind: 'search', key: 'q', placeholder: 'Suchen…'},
        {
          kind: 'custom',
          key: 'ctx',
          render: (v, set) => (
            <select
              value={typeof v === 'string' ? v : ''}
              onChange={e => set(e.target.value || null)}
              className="h-8 rounded-md border border-border bg-card px-2 body"
            >
              <option value="">Alle Kontexte</option>
              <option value="a">Kontext A</option>
              <option value="b">Kontext B</option>
            </select>
          ),
        },
      ]
      return <FilterBar fields={withCustom} value={value} onChange={setValue} />
    }
    return <Demo />
  },
}
