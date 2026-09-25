import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {EditableSection} from './EditableSection'

describe('EditableSection', () => {
  it('renders title and subtitle', () => {
    render(<EditableSection title="Projects" subtitle="3 active" />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('3 active')).toBeInTheDocument()
  })

  it('renders an add button and calls onAdd', async () => {
    const onAdd = vi.fn()
    render(<EditableSection title="Projects" onAdd={onAdd} addLabel="Add project" />)
    await userEvent.click(screen.getByRole('button', {name: 'Add project'}))
    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('renders an edit toggle with the English default label and calls onToggleEdit', async () => {
    const onToggleEdit = vi.fn()
    render(<EditableSection title="Projects" editing={false} onToggleEdit={onToggleEdit} />)
    await userEvent.click(screen.getByRole('button', {name: 'Edit'}))
    expect(onToggleEdit).toHaveBeenCalledOnce()
  })

  it('overrides labels via the labels prop', () => {
    render(<EditableSection title="Projects" onAdd={vi.fn()} labels={{add: 'New'}} />)
    expect(screen.getByRole('button', {name: 'New'})).toBeInTheDocument()
  })
})
