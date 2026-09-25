import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {ScrollableContent} from './ScrollableContent'

describe('ScrollableContent', () => {
  it('renders children in a clamped, scrollable frame', () => {
    render(<ScrollableContent data-testid="scroll">Long text</ScrollableContent>)
    const el = screen.getByTestId('scroll')
    expect(el).toHaveTextContent('Long text')
    expect(el.className).toContain('max-h-96')
    expect(el.className).toContain('overflow-y-auto')
  })

  it('merges className (overrides the height clamp) and passes attributes through', () => {
    render(
      <ScrollableContent data-testid="scroll" className="max-h-48" role="region" aria-label="Body">
        Text
      </ScrollableContent>,
    )
    const el = screen.getByRole('region', {name: 'Body'})
    expect(el.className).toContain('max-h-48')
    expect(el.className).not.toContain('max-h-96')
  })
})
