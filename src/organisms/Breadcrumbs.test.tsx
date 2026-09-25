import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithUi} from '../testing'
import {breadcrumbs as breadcrumbsDe} from '../i18n/de/breadcrumbs'
import {Breadcrumbs} from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders root link, intermediate links and the current page', () => {
    renderWithUi(
      <Breadcrumbs rootLabel="Home" items={[{label: 'Settings', href: '/settings'}, {label: 'Team'}]} />,
    )
    expect(screen.getByRole('navigation', {name: 'Breadcrumb'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', {name: 'Settings'})).toHaveAttribute('href', '/settings')
    expect(screen.getByText('Team')).toHaveAttribute('aria-current', 'page')
  })

  it('overrides the nav label via the labels prop', () => {
    renderWithUi(<Breadcrumbs items={[{label: 'Projects'}]} labels={{navigation: 'You are here'}} />)
    expect(screen.getByRole('navigation', {name: 'You are here'})).toBeInTheDocument()
  })

  it('renders links through the linkComponent slot (root + intermediate, not the current page)', () => {
    const {container} = renderWithUi(
      <Breadcrumbs
        rootLabel="Home"
        rootHref="/start"
        items={[{label: 'Settings', href: '/settings'}, {label: 'Team', href: '/settings/team'}]}
        linkComponent={({href, children, className}) => (
          <a href={href} className={className} data-router-link>
            {children}
          </a>
        )}
      />,
    )
    // BreadcrumbPage is a span[role=link][aria-disabled] — real links are <a>.
    const links = Array.from(container.querySelectorAll('a'))
    expect(links.map(a => a.getAttribute('href'))).toEqual(['/start', '/settings'])
    links.forEach(a => {
      expect(a).toHaveAttribute('data-router-link')
      expect(a.className).toContain('text-muted-foreground')
    })
    // last entry is the current page even with href
    expect(screen.getByText('Team')).toHaveAttribute('aria-current', 'page')
  })

  it('renders entries without href as plain text and omits the root without rootLabel', () => {
    const {container} = renderWithUi(<Breadcrumbs items={[{label: 'Projects'}, {label: 'Alpha'}]} />)
    expect(container.querySelectorAll('a')).toHaveLength(0)
    expect(screen.getByText('Alpha')).toHaveAttribute('aria-current', 'page')
  })

  it('reads app-wide German labels', () => {
    renderWithUi(<Breadcrumbs items={[{label: 'Projekte'}]} />, {messages: {breadcrumbs: breadcrumbsDe}})
    expect(screen.getByRole('navigation', {name: breadcrumbsDe.navigation})).toBeInTheDocument()
  })

  it('merges className on the nav', () => {
    renderWithUi(<Breadcrumbs items={[{label: 'Projects'}]} className="hidden md:block" />)
    expect(screen.getByRole('navigation').className).toContain('md:block')
  })
})
