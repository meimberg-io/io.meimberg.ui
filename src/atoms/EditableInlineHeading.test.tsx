import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {EditableInlineHeading} from './EditableInlineHeading'

async function startEditing() {
  await userEvent.click(screen.getByRole('button', {name: 'Edit title'}))
  return screen.getByRole('textbox')
}

describe('EditableInlineHeading', () => {
  it('saves on Enter', async () => {
    const onSave = vi.fn()
    render(<EditableInlineHeading value="Old" onSave={onSave} />)
    const field = await startEditing()
    await userEvent.clear(field)
    await userEvent.type(field, 'New{Enter}')
    expect(onSave).toHaveBeenCalledWith('New')
  })

  it('enters edit mode when the title itself is clicked', async () => {
    const onSave = vi.fn()
    render(<EditableInlineHeading value="Old" onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', {name: 'Old'}))
    const field = screen.getByRole('textbox')
    await userEvent.clear(field)
    await userEvent.type(field, 'New{Enter}')
    expect(onSave).toHaveBeenCalledWith('New')
  })

  it('discards on Escape', async () => {
    const onSave = vi.fn()
    render(<EditableInlineHeading value="Old" onSave={onSave} />)
    const field = await startEditing()
    await userEvent.clear(field)
    await userEvent.type(field, 'New{Escape}')
    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByText('Old')).toBeInTheDocument()
  })

  it('saves when focus leaves the edit row', async () => {
    const onSave = vi.fn()
    render(
      <>
        <EditableInlineHeading value="Old" onSave={onSave} />
        <button type="button">Elsewhere</button>
      </>,
    )
    const field = await startEditing()
    await userEvent.clear(field)
    await userEvent.type(field, 'New')
    await userEvent.click(screen.getByRole('button', {name: 'Elsewhere'}))
    expect(onSave).toHaveBeenCalledWith('New')
  })

  it('does not save when focus moves to the cancel button', async () => {
    const onSave = vi.fn()
    const onCancel = vi.fn()
    render(<EditableInlineHeading value="Old" onSave={onSave} onCancel={onCancel} />)
    const field = await startEditing()
    await userEvent.clear(field)
    await userEvent.type(field, 'New')
    await userEvent.click(screen.getByRole('button', {name: 'Cancel'}))
    expect(onSave).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('overrides labels via the labels prop', () => {
    render(<EditableInlineHeading value="Old" onSave={vi.fn()} labels={{edit: 'Rename'}} />)
    expect(screen.getByRole('button', {name: 'Rename'})).toBeInTheDocument()
  })
})
