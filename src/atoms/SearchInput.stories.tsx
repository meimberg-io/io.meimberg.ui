import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SearchInput} from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Atoms/SearchInput',
  component: SearchInput,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof SearchInput>

function Controlled({initial = '', placeholder, debounceMs}: {initial?: string; placeholder?: string; debounceMs?: number}) {
  const [value, setValue] = useState(initial)
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <SearchInput value={value} onChange={setValue} placeholder={placeholder} debounceMs={debounceMs} />
      <span className="caption text-muted-foreground">value: {JSON.stringify(value)}</span>
    </div>
  )
}

export const Empty: Story = {
  render: () => <Controlled placeholder="Search…" />,
}

export const Filled: Story = {
  render: () => <Controlled initial="Pulse" placeholder="Search…" />,
}

export const GermanPlaceholder: Story = {
  render: () => <Controlled placeholder="Items durchsuchen…" />,
}

export const Debounced: Story = {
  render: () => <Controlled placeholder="Suchen (300ms debounce)…" debounceMs={300} />,
}
