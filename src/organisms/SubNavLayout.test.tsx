import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {SubNavLayout, type SubNavItem} from './SubNavLayout'

const items: SubNavItem[] = [
  {label: 'Profile', href: '/settings/profile'},
  {label: 'Team', href: '/settings/team'},
]

describe('SubNavLayout', () => {
  it('marks the current item and uses the default nav label', () => {
    renderWithProviders(
      <SubNavLayout items={items} currentPath="/settings/team/members">
        content
      </SubNavLayout>,
    )
    const nav = screen.getByRole('navigation', {name: 'Section navigation'})
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Team'})).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', {name: 'Profile'})).not.toHaveAttribute('aria-current')
  })

  it('overrides the nav label via the labels prop, ariaLabel wins over labels', () => {
    const {rerender} = renderWithProviders(
      <SubNavLayout items={items} currentPath="/" labels={{navigation: 'Settings'}}>
        content
      </SubNavLayout>,
    )
    expect(screen.getByRole('navigation', {name: 'Settings'})).toBeInTheDocument()
    rerender(
      <SubNavLayout items={items} currentPath="/" ariaLabel="Account" labels={{navigation: 'Settings'}}>
        content
      </SubNavLayout>,
    )
    expect(screen.getByRole('navigation', {name: 'Account'})).toBeInTheDocument()
  })
})
