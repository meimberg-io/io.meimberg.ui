import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Pill} from './Pill'

describe('Pill atom', () => {
  it('renders a span with pill class', () => {
    const {container} = render(<Pill>12</Pill>)
    const span = container.querySelector('span')
    expect(span).toBeTruthy()
    expect(span?.className).toContain('pill')
  })

  it('renders children', () => {
    const {getByText} = render(<Pill>42</Pill>)
    expect(getByText('42')).toBeTruthy()
  })

  it('merges custom className', () => {
    const {container} = render(<Pill className="bg-muted">x</Pill>)
    const cls = container.querySelector('span')?.className ?? ''
    expect(cls).toContain('pill')
    expect(cls).toContain('bg-muted')
  })

  it('forwards HTML props (title, data-*)', () => {
    const {container} = render(
      <Pill title="t" data-testid="pill-1">
        x
      </Pill>,
    )
    const span = container.querySelector('span')
    expect(span?.getAttribute('title')).toBe('t')
    expect(span?.getAttribute('data-testid')).toBe('pill-1')
  })
})
