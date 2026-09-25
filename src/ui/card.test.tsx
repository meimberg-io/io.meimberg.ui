import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Card} from './card'

describe('Card', () => {
  it('is not interactive by default', () => {
    render(<Card data-testid="card" />)
    expect(screen.getByTestId('card').className).not.toContain('hover-card')
  })

  it('interactive adds the hover accent and pointer cursor', () => {
    render(<Card data-testid="card" interactive />)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('hover-card')
    expect(card.className).toContain('cursor-pointer')
    expect(card).not.toHaveAttribute('interactive')
  })
})
