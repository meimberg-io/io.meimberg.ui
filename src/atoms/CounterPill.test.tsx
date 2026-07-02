import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {CounterPill} from './CounterPill'

describe('CounterPill', () => {
  it('renders its value', () => {
    render(<CounterPill>12</CounterPill>)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<CounterPill tone="primary">5 ungelesen</CounterPill>)
    expect(screen.getByText('5 ungelesen')).toBeInTheDocument()
  })

  it('applies the compact size class', () => {
    const {container} = render(<CounterPill size="compact">3</CounterPill>)
    expect(container.querySelector('.min-w-\\[20px\\]')).not.toBeNull()
  })
})
