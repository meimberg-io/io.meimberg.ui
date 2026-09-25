import {describe, expect, it, vi} from 'vitest'
import {screen, waitFor} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {LogOut, Settings} from '../atoms/icons'
import {UserMenu} from './UserMenu'

describe('UserMenu', () => {
  it('renders the trigger with name, email and the default aria-label', () => {
    renderWithProviders(<UserMenu name="Alex Morgan" email="alex@example.com" />)
    expect(screen.getByRole('button', {name: 'User menu'})).toBeInTheDocument()
    expect(screen.getByText('alex@example.com')).toBeInTheDocument()
  })

  it('shows link items with their icon when opened', async () => {
    const {user} = renderWithProviders(
      <UserMenu name="Alex Morgan" email="alex@example.com" items={[{label: 'Settings', href: '/settings', icon: Settings}]} />,
    )
    await user.click(screen.getByRole('button', {name: 'User menu'}))
    const link = await screen.findByRole('link', {name: 'Settings'})
    expect(link).toHaveAttribute('href', '/settings')
    expect(link.querySelector('svg')!.getAttribute('class')).toContain('size-4')
  })

  it('closes the popover and calls onNavigate when a link item is activated', async () => {
    const onNavigate = vi.fn()
    const {user} = renderWithProviders(
      <UserMenu
        name="Alex"
        email="a@example.com"
        onNavigate={onNavigate}
        items={[{label: 'Settings', href: '/settings'}]}
        linkComponent={({href, children, ...rest}) => (
          <a href={href} {...rest} onClick={e => { e.preventDefault(); rest.onClick?.() }}>{children}</a>
        )}
      />,
    )
    await user.click(screen.getByRole('button', {name: 'User menu'}))
    await user.click(await screen.findByRole('link', {name: 'Settings'}))
    expect(onNavigate).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('link', {name: 'Settings'})).not.toBeInTheDocument())
  })

  it('renders onSelect items as buttons, calls onSelect and closes the popover', async () => {
    const onSelect = vi.fn()
    const {user} = renderWithProviders(
      <UserMenu name="Alex" email="a@example.com" items={[{label: 'Sign out', icon: LogOut, onSelect, tone: 'destructive'}]} />,
    )
    await user.click(screen.getByRole('button', {name: 'User menu'}))
    const item = await screen.findByRole('button', {name: 'Sign out'})
    expect(item.className).toContain('text-destructive')
    await user.click(item)
    expect(onSelect).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('button', {name: 'Sign out'})).not.toBeInTheDocument())
  })

  it('neutral onSelect items have no destructive styling', async () => {
    const {user} = renderWithProviders(
      <UserMenu name="Alex" email="a@example.com" items={[{label: 'Switch workspace', onSelect: vi.fn()}]} />,
    )
    await user.click(screen.getByRole('button', {name: 'User menu'}))
    expect((await screen.findByRole('button', {name: 'Switch workspace'})).className).not.toContain('text-destructive')
  })

  it('renders the footer slot', async () => {
    const {user} = renderWithProviders(<UserMenu name="Alex" email="a@example.com" footer={<span>Footer slot</span>} />)
    await user.click(screen.getByRole('button', {name: 'User menu'}))
    expect(await screen.findByText('Footer slot')).toBeInTheDocument()
  })

  it('collapsed hides name and email in the trigger', () => {
    renderWithProviders(<UserMenu name="Alex Morgan" email="alex@example.com" collapsed />)
    expect(screen.queryByText('alex@example.com')).not.toBeInTheDocument()
  })

  it('merges className on the trigger', () => {
    renderWithProviders(<UserMenu name="Alex" email="a@example.com" className="px-1" />)
    expect(screen.getByRole('button', {name: 'User menu'}).className).toContain('px-1')
  })

  it('overrides the trigger label via the labels prop', () => {
    renderWithProviders(<UserMenu name="Alex" email="a@example.com" labels={{trigger: 'Account'}} />)
    expect(screen.getByRole('button', {name: 'Account'})).toBeInTheDocument()
  })
})
