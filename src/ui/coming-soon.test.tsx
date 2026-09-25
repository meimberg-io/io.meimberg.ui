import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComingSoon } from './coming-soon'
import { UiI18nProvider } from '../i18n/context'
import { comingSoonCard as comingSoonCardDe } from '../i18n/de/comingSoonCard'

describe('ComingSoon (ui)', () => {
  it('renders the English default without a title', () => {
    render(<ComingSoon />)
    expect(screen.getByRole('status', { name: 'Coming soon' })).toBeInTheDocument()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('names the feature in the accessible name when a title is given', () => {
    render(<ComingSoon title='Reports' description='Available next quarter.' />)
    expect(screen.getByRole('status', { name: '"Reports" is coming soon' })).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Available next quarter.')).toBeInTheDocument()
  })

  it('labels prop overrides the defaults', () => {
    render(<ComingSoon labels={{ comingSoon: 'Planned' }} />)
    expect(screen.getByRole('status', { name: 'Planned' })).toBeInTheDocument()
  })

  it('reads German labels from UiI18nProvider', () => {
    render(
      <UiI18nProvider messages={{ comingSoonCard: comingSoonCardDe }}>
        <ComingSoon title='Berichte' />
      </UiI18nProvider>,
    )
    expect(screen.getByRole('status', { name: '„Berichte“ kommt später' })).toBeInTheDocument()
  })
})
