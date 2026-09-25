import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SearchInput, type SearchInputSize} from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'Atoms/SearchInput',
  component: SearchInput,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof SearchInput>

function Controlled({
  initial = '',
  placeholder,
  debounceMs,
  size,
}: {initial?: string; placeholder?: string; debounceMs?: number; size?: SearchInputSize}) {
  const [value, setValue] = useState(initial)
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <SearchInput value={value} onChange={setValue} placeholder={placeholder} debounceMs={debounceMs} size={size} />
      <span className="caption text-muted-foreground">value: {JSON.stringify(value)}</span>
    </div>
  )
}

export const Empty: Story = {
  render: () => <Controlled placeholder="Search…" />,
}

export const Filled: Story = {
  render: () => <Controlled initial="Quarterly report" placeholder="Search…" />,
}

export const CustomPlaceholder: Story = {
  render: () => <Controlled placeholder="Search documents…" />,
}

export const Debounced: Story = {
  render: () => <Controlled placeholder="Search (300ms debounce)…" debounceMs={300} />,
}

/** `xs`: borderless 26 px filter-bar look — sits in a row of pills inside a `FilterBar`. */
export const SizeXs: Story = {
  name: 'Size xs (filter bar)',
  render: () => <Controlled size="xs" placeholder="Search" />,
}

export const SizeXsFilled: Story = {
  name: 'Size xs, filled',
  render: () => <Controlled size="xs" initial="report" placeholder="Search" />,
}
