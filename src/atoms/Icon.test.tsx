import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Icon} from './Icon'
import {Inbox, Radio} from './icons'

describe('Icon atom', () => {
  it('renders the given Lucide icon', () => {
    const {container} = render(<Icon icon={Inbox} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('applies size mapping (md = 16 px)', () => {
    const {container} = render(<Icon icon={Inbox} size="md" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('16')
    expect(svg?.getAttribute('height')).toBe('16')
  })

  it('xs / sm / md / lg map to 12 / 14 / 16 / 20 px', () => {
    const sizes = [
      ['xs', '12'],
      ['sm', '14'],
      ['md', '16'],
      ['lg', '20'],
    ] as const
    for (const [size, expected] of sizes) {
      const {container} = render(<Icon icon={Radio} size={size} />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('width')).toBe(expected)
    }
  })

  it('is aria-hidden by default (purely decorative)', () => {
    const {container} = render(<Icon icon={Inbox} />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('forwards className', () => {
    const {container} = render(<Icon icon={Inbox} className="text-primary" />)
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('text-primary')
  })

  it('re-exports Lucide icon components from atoms/icons', () => {
    expect(Inbox).toBeTypeOf('object')
    expect(Radio).toBeTypeOf('object')
  })
})
