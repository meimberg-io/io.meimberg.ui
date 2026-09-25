import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {Breadcrumbs} from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders root link, intermediate links and the current page', () => {
    renderWithProviders(
      <Breadcrumbs rootLabel="Home" items={[{label: 'Settings', href: '/settings'}, {label: 'Team'}]} />,
    )
    expect(screen.getByRole('navigation', {name: 'Breadcrumb'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', {name: 'Settings'})).toHaveAttribute('href', '/settings')
    expect(screen.getByText('Team')).toHaveAttribute('aria-current', 'page')
  })

  it('overrides the nav label via the labels prop', () => {
    renderWithProviders(<Breadcrumbs items={[{label: 'Projects'}]} labels={{navigation: 'You are here'}} />)
    expect(screen.getByRole('navigation', {name: 'You are here'})).toBeInTheDocument()
  })
})
