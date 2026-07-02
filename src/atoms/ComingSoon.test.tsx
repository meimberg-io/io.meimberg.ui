import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {ComingSoon} from './ComingSoon'

describe('ComingSoon atom', () => {
  it('renders the label', () => {
    const {getByText} = render(<ComingSoon label="Posteingang" />)
    expect(getByText(/Posteingang/)).toBeTruthy()
  })

  it('has role=status and a descriptive aria-label', () => {
    const {getByRole} = render(<ComingSoon label="Posteingang" />)
    const el = getByRole('status')
    expect(el.getAttribute('aria-label')).toBe('Kommt bald: Posteingang')
  })

  it('renders the dashlet identifier as data-attr', () => {
    const {getByRole} = render(
      <ComingSoon label="Posteingang" dashlet="inbox" />,
    )
    expect(getByRole('status').getAttribute('data-dashlet')).toBe('inbox')
  })

  it('uses dashed border + muted-foreground (look)', () => {
    const {getByRole} = render(<ComingSoon label="x" />)
    const cls = getByRole('status').className
    expect(cls).toContain('border-dashed')
    expect(cls).toContain('text-muted-foreground')
  })

  it('applies aspectRatio when given', () => {
    const {getByRole} = render(
      <ComingSoon label="x" aspectRatio="16 / 9" />,
    )
    const style = getByRole('status').getAttribute('style') ?? ''
    expect(style).toContain('aspect-ratio')
  })

  it('renders a Sparkles icon', () => {
    const {container} = render(<ComingSoon label="x" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
