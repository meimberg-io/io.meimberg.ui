import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {FormHelpText} from './FormHelpText'

describe('FormHelpText', () => {
  it('renders the children text', () => {
    render(<FormHelpText>Only items from the selected folder are synced.</FormHelpText>)
    expect(screen.getByText('Only items from the selected folder are synced.')).toBeInTheDocument()
  })

  it('prefixes the text with an aria-hidden arrow glyph', () => {
    const {container} = render(<FormHelpText>Note</FormHelpText>)
    const arrow = container.querySelector('[aria-hidden="true"]')
    expect(arrow).not.toBeNull()
    expect(arrow?.textContent).toBe('↗')
  })

  it('honors a custom className', () => {
    const {container} = render(<FormHelpText className="custom-class">x</FormHelpText>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
