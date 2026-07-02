import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FormDialog} from './FormDialog'

describe('FormDialog', () => {
  it('renders caption, title and body when open', () => {
    render(
      <FormDialog
        open
        onOpenChange={() => {}}
        caption="Neuen Bucket anlegen"
        title="Bucket konfigurieren"
        submitLabel="Anlegen"
        onSubmit={() => {}}
      >
        <p>Body-Inhalt</p>
      </FormDialog>,
    )
    expect(screen.getByText('Neuen Bucket anlegen')).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: 'Bucket konfigurieren'})).toBeInTheDocument()
    expect(screen.getByText('Body-Inhalt')).toBeInTheDocument()
  })

  it('renders submit + cancel buttons in form mode', () => {
    render(
      <FormDialog
        open
        onOpenChange={() => {}}
        title="t"
        submitLabel="Anlegen"
        onSubmit={() => {}}
      >
        body
      </FormDialog>,
    )
    expect(screen.getByRole('button', {name: 'Anlegen'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Abbrechen'})).toBeInTheDocument()
  })

  it('omits the submit button in view-only mode (no submitLabel)', () => {
    render(
      <FormDialog open onOpenChange={() => {}} title="Details">
        body
      </FormDialog>,
    )
    expect(screen.queryByRole('button', {name: 'Anlegen'})).not.toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Schließen'})).toBeInTheDocument()
  })

  it('fires onSubmit when the submit button is clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" onSubmit={onSubmit}>
        body
      </FormDialog>,
    )
    await user.click(screen.getByRole('button', {name: 'OK'}))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('does not fire onSubmit while pending', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <FormDialog
        open
        onOpenChange={() => {}}
        title="t"
        submitLabel="OK"
        submitPending
        onSubmit={onSubmit}
      >
        body
      </FormDialog>,
    )
    await user.click(screen.getByRole('button', {name: 'OK'}))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('renders footerInfo and footerActions', () => {
    render(
      <FormDialog
        open
        onOpenChange={() => {}}
        title="t"
        submitLabel="OK"
        onSubmit={() => {}}
        footerInfo="Erster Sync direkt nach Anlegen"
        footerActions={<button type="button">Extra</button>}
      >
        body
      </FormDialog>,
    )
    expect(screen.getByText('Erster Sync direkt nach Anlegen')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Extra'})).toBeInTheDocument()
  })

  it('calls onCancel (not onOpenChange) when explicit onCancel is provided', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <FormDialog
        open
        onOpenChange={onOpenChange}
        title="t"
        submitLabel="OK"
        onSubmit={() => {}}
        onCancel={onCancel}
      >
        body
      </FormDialog>,
    )
    await user.click(screen.getByRole('button', {name: 'Abbrechen'}))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
