import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UiI18nProvider, useLabels, useUiLocale } from './context'
import type { SearchInputLabels } from '../atoms/SearchInput'

const defaults: SearchInputLabels = { placeholder: 'Search…', clear: 'Clear' }

function Probe({ labels }: { labels?: Partial<SearchInputLabels> }) {
  const l = useLabels('searchInput', defaults, labels)
  const locale = useUiLocale()
  return (
    <p>
      {l.placeholder} · {l.clear} · {locale}
    </p>
  )
}

describe('useLabels', () => {
  it('falls back to the defaults without a provider', () => {
    render(<Probe />)
    expect(screen.getByText('Search… · Clear · en-US')).toBeInTheDocument()
  })

  it('applies app-wide messages from the provider', () => {
    render(
      <UiI18nProvider locale="de-DE" messages={{ searchInput: { placeholder: 'Suchen…' } }}>
        <Probe />
      </UiI18nProvider>,
    )
    expect(screen.getByText('Suchen… · Clear · de-DE')).toBeInTheDocument()
  })

  it('lets the labels prop win over provider messages', () => {
    render(
      <UiI18nProvider messages={{ searchInput: { placeholder: 'Suchen…' } }}>
        <Probe labels={{ placeholder: 'Finden…' }} />
      </UiI18nProvider>,
    )
    expect(screen.getByText('Finden… · Clear · en-US')).toBeInTheDocument()
  })
})
