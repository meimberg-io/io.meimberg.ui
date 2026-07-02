import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {IconBadge} from './IconBadge'

describe('IconBadge', () => {
  it('renders leading slot and label', () => {
    render(<IconBadge leading={<span data-testid='lead' />}>Label</IconBadge>)
    expect(screen.getByTestId('lead')).toBeInTheDocument()
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('hides label but keeps leading when iconOnly, exposing label as title', () => {
    render(
      <IconBadge iconOnly leading={<span data-testid='lead' />}>
        Konto
      </IconBadge>,
    )
    expect(screen.getByTestId('lead')).toBeInTheDocument()
    expect(screen.queryByText('Konto')).not.toBeInTheDocument()
    expect(screen.getByTitle('Konto')).toBeInTheDocument()
  })

  it('renders as a link with target/rel when href is set', () => {
    render(
      <IconBadge variant='chip' href='https://example.com'>
        Öffnen
      </IconBadge>,
    )
    const link = screen.getByRole('link', {name: 'Öffnen'})
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('omits trailing slot in iconOnly mode', () => {
    render(
      <IconBadge iconOnly leading={<span />} trailing={<span data-testid='trail' />}>
        X
      </IconBadge>,
    )
    expect(screen.queryByTestId('trail')).not.toBeInTheDocument()
  })
})
