import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {DashboardCard} from './DashboardCard'

describe('DashboardCard', () => {
  it('renders children with the default dashboard padding', () => {
    render(<DashboardCard data-testid="card">Body</DashboardCard>)
    const card = screen.getByTestId('card')
    expect(card).toHaveTextContent('Body')
    expect(card.className).toContain('p-5')
  })

  it.each([
    ['compact', 'p-4'],
    ['none', ''],
  ] as const)('padding=%s', (padding, cls) => {
    render(<DashboardCard data-testid="card" padding={padding}>Body</DashboardCard>)
    const card = screen.getByTestId('card')
    expect(card.className).not.toContain('p-5')
    if (cls) expect(card.className).toContain(cls)
  })

  it('merges className and forwards interactive to the card', () => {
    render(<DashboardCard data-testid="card" className="lg:col-span-2" interactive>Body</DashboardCard>)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('lg:col-span-2')
    expect(card.className).toContain('hover-card')
  })
})
