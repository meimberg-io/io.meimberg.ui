import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithUi} from '../testing'
import {DetailDialogWrapper} from './detail-dialog-wrapper'

describe('DetailDialogWrapper', () => {
  it('renders nothing when closed', () => {
    renderWithUi(
      <DetailDialogWrapper open={false} onOpenChange={vi.fn()} title="Details">
        Body
      </DetailDialogWrapper>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders title, description, icon, header aside, body and footer', () => {
    renderWithUi(
      <DetailDialogWrapper
        open
        onOpenChange={vi.fn()}
        title="Quarterly report"
        description={<span>Updated today</span>}
        icon={<svg data-testid="dialog-icon" />}
        headerAside={<span>Aside</span>}
        footer={<button type="button">Done</button>}
      >
        Body content
      </DetailDialogWrapper>,
    )
    const dialog = screen.getByRole('dialog', {name: 'Quarterly report'})
    expect(dialog).toHaveAccessibleDescription('Updated today')
    expect(screen.getByTestId('dialog-icon').parentElement!.className).toContain('bg-surface-2')
    expect(screen.getByText('Aside')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Done'})).toBeInTheDocument()
  })

  it('renders block content in the description without a <p> wrapper', () => {
    renderWithUi(
      <DetailDialogWrapper open onOpenChange={vi.fn()} title="T" description={<div>Block</div>}>
        Body
      </DetailDialogWrapper>,
    )
    expect(screen.getByText('Block').parentElement!.tagName).toBe('DIV')
  })

  it('applies size, iconBgClass and className', () => {
    renderWithUi(
      <DetailDialogWrapper
        open
        onOpenChange={vi.fn()}
        size="xl"
        title="T"
        icon={<svg data-testid="dialog-icon" />}
        iconBgClass="bg-primary/10"
        className="min-h-96"
      >
        Body
      </DetailDialogWrapper>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('max-w-5xl')
    expect(dialog.className).toContain('min-h-96')
    expect(screen.getByTestId('dialog-icon').parentElement!.className).toContain('bg-primary/10')
  })

  it('defaults to size md and omits the footer when not given', () => {
    renderWithUi(
      <DetailDialogWrapper open onOpenChange={vi.fn()} title="T">
        Body
      </DetailDialogWrapper>,
    )
    expect(screen.getByRole('dialog').className).toContain('max-w-lg')
    expect(screen.queryByText('Done')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) on Escape', async () => {
    const onOpenChange = vi.fn()
    const {user} = renderWithUi(
      <DetailDialogWrapper open onOpenChange={onOpenChange} title="T">
        Body
      </DetailDialogWrapper>,
    )
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
