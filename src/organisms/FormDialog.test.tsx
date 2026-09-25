import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Star} from '../atoms/icons'
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

  it('marks the submit busy, spins the icon and ignores clicks while submitBusy', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" submitBusy onSubmit={onSubmit}>
        body
      </FormDialog>,
    )
    const submit = screen.getByRole('button', {name: 'OK'})
    expect(submit).toHaveAttribute('aria-busy', 'true')
    expect(submit).toHaveAttribute('data-busy', 'true')
    // Busy is not disabled — no disabled look, clicks are swallowed by Button.
    expect(submit).not.toBeDisabled()
    expect(submit.querySelector('svg.animate-spin')).toBeTruthy()
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeDisabled()
    await user.click(submit)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not fire onSubmit when submitDisabled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" submitDisabled onSubmit={onSubmit}>
        body
      </FormDialog>,
    )
    expect(screen.getByRole('button', {name: 'OK'})).toBeDisabled()
    await user.click(screen.getByRole('button', {name: 'OK'}))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('applies submitTone and shows the default Check icon only for success', () => {
    const {rerender} = render(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" submitTone="success" onSubmit={() => {}}>
        body
      </FormDialog>,
    )
    let submit = screen.getByRole('button', {name: 'OK'})
    expect(submit).toHaveClass('bg-success')
    expect(submit.querySelector('svg.lucide-check')).toBeTruthy()

    rerender(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" submitTone="destructive" onSubmit={() => {}}>
        body
      </FormDialog>,
    )
    submit = screen.getByRole('button', {name: 'OK'})
    expect(submit).toHaveClass('bg-destructive')
    expect(submit.querySelector('svg')).toBeNull()
  })

  it('defaults to a primary submit without icon', () => {
    render(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" onSubmit={() => {}}>
        body
      </FormDialog>,
    )
    const submit = screen.getByRole('button', {name: 'OK'})
    expect(submit).toHaveClass('bg-primary')
    expect(submit.querySelector('svg')).toBeNull()
  })

  it('renders a custom submitIcon and replaces it with the spinner while busy', () => {
    const {rerender} = render(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" submitIcon={Star} onSubmit={() => {}}>
        body
      </FormDialog>,
    )
    expect(screen.getByRole('button', {name: 'OK'}).querySelector('svg.lucide-star')).toBeTruthy()
    rerender(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" submitIcon={Star} submitBusy onSubmit={() => {}}>
        body
      </FormDialog>,
    )
    const submit = screen.getByRole('button', {name: 'OK'})
    expect(submit.querySelector('svg.lucide-star')).toBeNull()
    expect(submit.querySelector('svg.animate-spin')).toBeTruthy()
  })

  it('renders both footer buttons at size md, Cancel as ghost', () => {
    render(
      <FormDialog open onOpenChange={() => {}} title="t" submitLabel="OK" onSubmit={() => {}}>
        body
      </FormDialog>,
    )
    expect(screen.getByRole('button', {name: 'OK'})).toHaveClass('h-9')
    const cancel = screen.getByRole('button', {name: 'Cancel'})
    expect(cancel).toHaveClass('h-9')
    expect(cancel).not.toHaveClass('bg-primary')
  })

  it('puts submitTestId on the submit button and className on the shell', () => {
    render(
      <FormDialog
        open
        onOpenChange={() => {}}
        title="t"
        submitLabel="OK"
        submitTestId="save-project"
        className="custom-shell"
        onSubmit={() => {}}
      >
        body
      </FormDialog>,
    )
    expect(screen.getByTestId('save-project')).toHaveAccessibleName('OK')
    expect(screen.getByRole('dialog')).toHaveClass('custom-shell', 'form-dialog-shell')
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
