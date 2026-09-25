import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {UserMenu} from './UserMenu'

describe('UserMenu', () => {
  it('renders the trigger with name, email and the default aria-label', () => {
    renderWithProviders(<UserMenu name="Alex Morgan" email="alex@example.com" />)
    expect(screen.getByRole('button', {name: 'User menu'})).toBeInTheDocument()
    expect(screen.getByText('alex@example.com')).toBeInTheDocument()
  })

  it('shows menu items when opened', async () => {
    const {user} = renderWithProviders(
      <UserMenu name="Alex Morgan" email="alex@example.com" items={[{label: 'Settings', href: '/settings'}]} />,
    )
    await user.click(screen.getByRole('button', {name: 'User menu'}))
    expect(await screen.findByRole('link', {name: 'Settings'})).toHaveAttribute('href', '/settings')
  })

  it('overrides the trigger label via the labels prop', () => {
    renderWithProviders(<UserMenu name="Alex" email="a@example.com" labels={{trigger: 'Account'}} />)
    expect(screen.getByRole('button', {name: 'Account'})).toBeInTheDocument()
  })
})
