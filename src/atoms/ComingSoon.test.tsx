import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {ComingSoon} from './ComingSoon'
import {UiI18nProvider} from '../i18n/context'
import {comingSoon as comingSoonDe} from '../i18n/de/comingSoon'

describe('ComingSoon', () => {
  it('renders the English default description as text and accessible name', () => {
    render(<ComingSoon />)
    expect(screen.getByRole('status', {name: 'Coming soon'})).toBeInTheDocument()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('names the feature in the accessible name when a string title is given', () => {
    render(<ComingSoon title="Reports" description="Available next quarter." />)
    expect(screen.getByRole('status', {name: '"Reports" is coming soon'})).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Available next quarter.')).toBeInTheDocument()
  })

  it('prefers the description prop over labels', () => {
    render(<ComingSoon description="In progress" labels={{description: 'Ignored'}} />)
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument()
  })

  it('overrides labels via the labels prop', () => {
    render(<ComingSoon title="Feed" labels={{description: 'Planned', titledStatus: t => `${t} planned`}} />)
    expect(screen.getByRole('status', {name: 'Feed planned'})).toBeInTheDocument()
    expect(screen.getByText('Planned')).toBeInTheDocument()
  })

  it('reads German labels from UiI18nProvider', () => {
    render(
      <UiI18nProvider messages={{comingSoon: comingSoonDe}}>
        <ComingSoon title="Berichte" />
      </UiI18nProvider>,
    )
    expect(screen.getByRole('status', {name: '„Berichte“ kommt später'})).toBeInTheDocument()
    expect(screen.getByText('Kommt später')).toBeInTheDocument()
  })

  it.each([
    ['sm', 'min-h-24'],
    ['md', 'min-h-40'],
    ['lg', 'min-h-64'],
  ] as const)('reserves the height for size=%s', (size, cls) => {
    render(<ComingSoon size={size} />)
    expect(screen.getByRole('status').className).toContain(cls)
  })

  it('defaults to size md', () => {
    render(<ComingSoon />)
    expect(screen.getByRole('status').className).toContain('min-h-40')
  })

  it('passes className and HTML attributes through', () => {
    render(<ComingSoon className="col-span-2" data-testid="placeholder" id="slot" />)
    const el = screen.getByRole('status')
    expect(el).toHaveClass('col-span-2')
    expect(el).toHaveAttribute('data-testid', 'placeholder')
    expect(el).toHaveAttribute('id', 'slot')
  })

  it('renders a decorative icon', () => {
    const {container} = render(<ComingSoon />)
    expect(container.querySelector('svg[aria-hidden]')).toBeTruthy()
  })
})
