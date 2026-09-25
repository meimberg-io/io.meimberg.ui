import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {FilterBar} from './FilterBar'
import {Button} from '../atoms/Button'
import {SearchInput} from '../atoms/SearchInput'
import {ChevronDown} from '../atoms/icons'

const meta: Meta<typeof FilterBar> = {
  title: 'Molecules/FilterBar',
  component: FilterBar,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof FilterBar>

// Stand-in controls: real bars use Select pills and Chips (size xs).
function Controls() {
  const [query, setQuery] = useState('')
  return (
    <>
      <Button variant="outline" size="xs">Status <ChevronDown /></Button>
      <Button variant="outline" size="xs">Owner <ChevronDown /></Button>
      <Button variant="outline" size="xs">Due date <ChevronDown /></Button>
      <SearchInput size="xs" value={query} onChange={setQuery} placeholder="Search" className="md:ml-auto" />
    </>
  )
}

export const Default: Story = {
  render: () => (
    <FilterBar>
      <Controls />
    </FilterBar>
  ),
}

export const Tinted: Story = {
  render: () => (
    <FilterBar tint="hsl(var(--primary))">
      <Controls />
    </FilterBar>
  ),
}

export const WithBelowRow: Story = {
  render: () => (
    <FilterBar
      below={
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <Button variant="ghost" size="xs">Tag: Customer</Button>
          <Button variant="ghost" size="xs">Tag: Urgent</Button>
        </div>
      }
    >
      <Controls />
    </FilterBar>
  ),
}
