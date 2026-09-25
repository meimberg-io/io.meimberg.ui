import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {ComingSoon} from './ComingSoon'

describe('ComingSoon atom', () => {
  it('renders the English default description', () => {
    const {getByText} = render(<ComingSoon />)
    expect(getByText('Coming soon')).toBeTruthy()
  })

  it('renders the title', () => {
    const {getByText} = render(<ComingSoon title="Activity" />)
    expect(getByText('Activity')).toBeTruthy()
  })

  it('has role=status and a descriptive aria-label', () => {
    const {getByRole} = render(<ComingSoon title="Activity" />)
    expect(getByRole('status').getAttribute('aria-label')).toBe('Coming soon: Activity')
  })

  it('prefers the description prop', () => {
    const {getByText} = render(<ComingSoon description="In progress" labels={{description: 'Ignored'}} />)
    expect(getByText('In progress')).toBeTruthy()
  })

  it('overrides labels via the labels prop', () => {
    const {getByText} = render(<ComingSoon labels={{description: 'Soon'}} />)
    expect(getByText('Soon')).toBeTruthy()
  })

  it('passes through data attributes', () => {
    const {getByRole} = render(<ComingSoon data-testid="placeholder" />)
    expect(getByRole('status').getAttribute('data-testid')).toBe('placeholder')
  })

  it('uses dashed border + muted-foreground (look)', () => {
    const {getByRole} = render(<ComingSoon title="x" />)
    const cls = getByRole('status').className
    expect(cls).toContain('border-dashed')
    expect(cls).toContain('text-muted-foreground')
  })

  it('applies aspectRatio when given', () => {
    const {getByRole} = render(
      <ComingSoon title="x" aspectRatio="16 / 9" />,
    )
    const style = getByRole('status').getAttribute('style') ?? ''
    expect(style).toContain('aspect-ratio')
  })

  it('renders a Sparkles icon', () => {
    const {container} = render(<ComingSoon title="x" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
