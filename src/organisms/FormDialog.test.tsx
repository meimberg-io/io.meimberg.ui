import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {UiI18nProvider} from '../i18n/context'
import {formDialog as formDialogDe} from '../i18n/de/formDialog'
import {FormDialog} from './FormDialog'

describe('FormDialog', () => {
  it('renders caption, title and body when open', () => {
    render(
      <FormDialog
        open
        onOpenChange={() => {}}
        caption="New project"
        title="Configure project"
        submitLabel="Create"
        onSubmit={() => {}}
      >
        <p>Body content</p>
      </FormDialog>,
    )
    expect(screen.getByText('New project')).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: 'Configure project'})).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders submit + cancel buttons in form mode', () => {
    render(
      <FormDialog
        open
        onOpenChange={() => {}}
        title="t"
        submitLabel="Create"
        onSubmit={() => {}}
      >
        body
      </FormDialog>,
    )
    expect(screen.getByRole('button', {name: 'Create'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument()
  })

  it('omits the submit button in view-only mode (no submitLabel)', () => {
    render(
      <FormDialog open onOpenChange={() => {}} title="Details">
        body
      </FormDialog>,
    )
    expect(screen.queryByRole('button', {name: 'Create'})).not.toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument()
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
        footerInfo="Syncs right after creation"
        footerActions={<button type="button">Extra</button>}
      >
        body
      </FormDialog>,
    )
    expect(screen.getByText('Syncs right after creation')).toBeInTheDocument()
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
    await user.click(screen.getByRole('button', {name: 'Cancel'}))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('overrides labels via the labels prop', () => {
    render(
      <FormDialog open onOpenChange={() => {}} title="t" labels={{close: 'Done', closeHero: 'Dismiss'}}>
        body
      </FormDialog>,
    )
    expect(screen.getByRole('button', {name: 'Done'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Dismiss'})).toBeInTheDocument()
  })

  it('prefers an explicit cancelLabel over labels', () => {
    render(
      <FormDialog open onOpenChange={() => {}} title="t" cancelLabel="Back" labels={{close: 'Done'}}>
        body
      </FormDialog>,
    )
    expect(screen.getByRole('button', {name: 'Back'})).toBeInTheDocument()
  })

  it('renders German labels from the app-wide messages', () => {
    render(
      <UiI18nProvider messages={{formDialog: formDialogDe}}>
        <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" onSubmit={() => {}}>
          body
        </FormDialog>
      </UiI18nProvider>,
    )
    expect(screen.getByRole('button', {name: 'Abbrechen'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Dialog-Hero schließen'})).toBeInTheDocument()
  })
})
