import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Sparkline} from './Sparkline'

describe('Sparkline atom', () => {
  it('renders an SVG with default size 120 × 36', () => {
    const {container} = render(<Sparkline values={[1, 2, 3]} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('120')
    expect(svg?.getAttribute('height')).toBe('36')
  })

  it('renders a line path with as many segments as values - 1', () => {
    const {container} = render(<Sparkline values={[1, 2, 3, 4]} />)
    const paths = container.querySelectorAll('path')
    // expect at least one path (line); area path optional
    const line = Array.from(paths).find(p => p.getAttribute('fill') === 'none')
    expect(line).toBeTruthy()
    // 4 values → 3 segments → 4 commands (M + 3×L)
    const d = line!.getAttribute('d') ?? ''
    expect((d.match(/[ML]/g) ?? []).length).toBe(4)
  })

  it('renders area path by default (fill=true)', () => {
    const {container} = render(<Sparkline values={[1, 2, 3]} />)
    const filled = container.querySelector('path[fill]:not([fill="none"])')
    expect(filled).toBeTruthy()
  })

  it('omits area path when fill=false', () => {
    const {container} = render(<Sparkline values={[1, 2, 3]} fill={false} />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(1)
    expect(paths[0].getAttribute('fill')).toBe('none')
  })

  it('uses currentColor by default', () => {
    const {container} = render(<Sparkline values={[1, 2]} />)
    const line = container.querySelector('path[fill="none"]')
    expect(line?.getAttribute('stroke')).toBe('currentColor')
  })

  it('renders empty svg with < 2 values (no crash)', () => {
    const {container} = render(<Sparkline values={[]} />)
    expect(container.querySelector('svg')).toBeTruthy()
    expect(container.querySelectorAll('path').length).toBe(0)
  })

  it('is aria-hidden (decorative)', () => {
    const {container} = render(<Sparkline values={[1, 2, 3]} />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })
})
