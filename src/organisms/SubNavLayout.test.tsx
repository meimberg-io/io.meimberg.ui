import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithUi} from '../testing'
import {SubNavLayout, type SubNavItem} from './SubNavLayout'

const items: SubNavItem[] = [
  {label: 'Profile', href: '/settings/profile'},
  {label: 'Team', href: '/settings/team'},
]

describe('SubNavLayout', () => {
  it('marks the current item and uses the default nav label', () => {
    renderWithUi(
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
    const {rerender} = renderWithUi(
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

  it('navigates via the mobile select', async () => {
    const onNavigate = vi.fn()
    const {user} = renderWithUi(
      <SubNavLayout items={items} currentPath="/settings/profile" onNavigate={onNavigate}>
        content
      </SubNavLayout>,
    )
    const select = screen.getByRole('combobox')
    expect(select).toHaveTextContent('Profile')
    await user.click(select)
    await user.click(screen.getByRole('option', {name: 'Team'}))
    expect(onNavigate).toHaveBeenCalledWith('/settings/team')
  })
})
