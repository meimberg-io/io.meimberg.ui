import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CancelButton, SaveButton } from './form-actions'

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

  it('loading disables the save button and announces the saving label', () => {
    render(<SaveButton loading />)
    const button = screen.getByRole('button', { name: 'Saving…' })
    expect(button).toBeDisabled()
  })
})
