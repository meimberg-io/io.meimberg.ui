import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {EditableInlineHeading} from './EditableInlineHeading'

async function startEditing() {
  await userEvent.click(screen.getByRole('button', {name: 'Titel bearbeiten'}))
  return screen.getByRole('textbox')
}

describe('EditableInlineHeading', () => {
  it('speichert bei Enter', async () => {
    const onSave = vi.fn()
    render(<EditableInlineHeading value="Alt" onSave={onSave} />)
    const field = await startEditing()
    await userEvent.clear(field)
    await userEvent.type(field, 'Neu{Enter}')
    expect(onSave).toHaveBeenCalledWith('Neu')
  })

  it('verwirft bei Escape', async () => {
    const onSave = vi.fn()
    render(<EditableInlineHeading value="Alt" onSave={onSave} />)
    const field = await startEditing()
    await userEvent.clear(field)
    await userEvent.type(field, 'Neu{Escape}')
    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByText('Alt')).toBeInTheDocument()
  })

  it('speichert, wenn der Fokus die Edit-Zeile verlässt', async () => {
    const onSave = vi.fn()
    render(
      <>
        <EditableInlineHeading value="Alt" onSave={onSave} />
        <button type="button">Signal</button>
      </>,
    )
    const field = await startEditing()
    await userEvent.clear(field)
    await userEvent.type(field, 'Neu')
    await userEvent.click(screen.getByRole('button', {name: 'Signal'}))
    expect(onSave).toHaveBeenCalledWith('Neu')
  })

  it('speichert nicht, wenn der Fokus auf den Abbrechen-Button wandert', async () => {
    const onSave = vi.fn()
    const onCancel = vi.fn()
    render(<EditableInlineHeading value="Alt" onSave={onSave} onCancel={onCancel} />)
    const field = await startEditing()
    await userEvent.clear(field)
    await userEvent.type(field, 'Neu')
    await userEvent.click(screen.getByRole('button', {name: 'Abbrechen'}))
    expect(onSave).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
