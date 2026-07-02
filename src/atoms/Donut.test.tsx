import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Donut} from './Donut'

const segments = [
  {value: 4, color: 'red'},
  {value: 6, color: 'green'},
  {value: 10, color: 'blue'},
]

describe('Donut atom', () => {
  it('renders one circle per segment', () => {
    const {container} = render(<Donut segments={segments} />)
    expect(container.querySelectorAll('circle').length).toBe(segments.length)
  })

  it('renders empty-state circle when total is 0', () => {
    const {container} = render(<Donut segments={[]} />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(1)
    expect(circles[0].getAttribute('stroke-opacity')).toBe('0.15')
  })

  it('default size is 64', () => {
    const {container} = render(<Donut segments={segments} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('64')
    expect(svg?.getAttribute('height')).toBe('64')
  })

  it('respects custom size and strokeWidth', () => {
    const {container} = render(
      <Donut segments={segments} size={100} strokeWidth={12} />,
    )
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('100')
    const circle = container.querySelector('circle')
    expect(circle?.getAttribute('stroke-width')).toBe('12')
  })

  it('applies each segment color', () => {
    const {container} = render(<Donut segments={segments} />)
    const colors = Array.from(container.querySelectorAll('circle')).map(
      c => c.getAttribute('stroke'),
    )
    expect(colors).toEqual(['red', 'green', 'blue'])
  })

  it('is aria-hidden', () => {
    const {container} = render(<Donut segments={segments} />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })
})
