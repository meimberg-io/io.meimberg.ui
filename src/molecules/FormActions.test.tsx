import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CancelButton, SaveButton } from './FormActions'

describe('CancelButton / SaveButton', () => {
  it('render English default labels', () => {
    render(
      <>
        <CancelButton />
        <SaveButton />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('type', 'button')
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit')
  })

  it('children take precedence over labels', () => {
    render(<SaveButton labels={{ save: 'Store' }}>Create</SaveButton>)
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('labels prop overrides the defaults', () => {
    render(
      <>
        <CancelButton labels={{ cancel: 'Discard' }} />
        <SaveButton labels={{ save: 'Apply' }} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
  })

  it('busy marks the save button, announces the saving label and ignores clicks', async () => {
    const onClick = vi.fn()
    render(<SaveButton busy onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'Saving…' })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).not.toBeDisabled()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
