import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {EditableSection} from './EditableSection'

describe('EditableSection', () => {
  it('renders title and subtitle', () => {
    render(<EditableSection title="Buckets" subtitle="3 aktiv" />)
    expect(screen.getByText('Buckets')).toBeInTheDocument()
    expect(screen.getByText('3 aktiv')).toBeInTheDocument()
  })

  it('renders an add button and calls onAdd', async () => {
    const onAdd = vi.fn()
    render(<EditableSection title="Buckets" onAdd={onAdd} addLabel="Bucket hinzufügen" />)
    await userEvent.click(screen.getByRole('button', {name: 'Bucket hinzufügen'}))
    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('renders an edit toggle and calls onToggleEdit', async () => {
    const onToggleEdit = vi.fn()
    render(<EditableSection title="Buckets" editing={false} onToggleEdit={onToggleEdit} editLabel="Bearbeiten" />)
    await userEvent.click(screen.getByRole('button', {name: 'Bearbeiten'}))
    expect(onToggleEdit).toHaveBeenCalledOnce()
  })
})
