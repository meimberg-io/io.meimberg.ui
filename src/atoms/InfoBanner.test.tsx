import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {InfoBanner} from './InfoBanner'

describe('InfoBanner', () => {
  it('renders its content with the muted default variant, italic', () => {
    render(<InfoBanner>Hint text</InfoBanner>)
    const el = screen.getByText('Hint text')
    expect(el.className).toContain('bg-muted/40')
    expect(el.className).toContain('italic')
  })

  it('variant subtle uses the card surface', () => {
    render(<InfoBanner variant="subtle" italic={false}>Info</InfoBanner>)
    const el = screen.getByText('Info')
    expect(el.className).toContain('bg-card')
    expect(el.className).not.toContain('italic')
  })

  it('merges className and passes HTML attributes through', () => {
    render(<InfoBanner className="mt-2" data-testid="hint" role="note">Info</InfoBanner>)
    const el = screen.getByTestId('hint')
    expect(el.className).toContain('mt-2')
    expect(el).toHaveAttribute('role', 'note')
  })
})
