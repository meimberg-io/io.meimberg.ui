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

  it('reflects the editing state via aria-pressed on the icon-only toggle', () => {
    const {rerender} = render(<EditableSection title="Projects" editing={false} onToggleEdit={vi.fn()} />)
    expect(screen.getByRole('button', {name: 'Edit'})).toHaveAttribute('aria-pressed', 'false')
    rerender(<EditableSection title="Projects" editing onToggleEdit={vi.fn()} />)
    const toggle = screen.getByRole('button', {name: 'Edit'})
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(toggle).toHaveClass('text-primary')
  })

  it('merges className into the header', () => {
    render(<EditableSection title="Projects" className="mb-0" />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('mb-0')
    expect(header).not.toHaveClass('mb-3')
  })
})
