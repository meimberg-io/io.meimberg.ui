import {afterEach, describe, expect, it, vi} from 'vitest'
import {screen, waitFor, within} from '@testing-library/react'
import {renderWithUi} from '../testing'
import {SidebarProvider} from '../ui/sidebar'
import {AppShell} from './AppShell'
import {AppSidebar, type AppSidebarSlotContext, type SidebarNavGroup} from './AppSidebar'

const groups: SidebarNavGroup[] = [
  {
    label: 'Workspace',
    items: [
      {label: 'Home', href: '/', icon: <svg data-testid="icon-home" />},
      {label: 'Projects', href: '/projects', badge: <span>5</span>},
    ],
  },
  {items: [{label: 'Settings', href: '/settings'}]},
]

const DESKTOP_WIDTH = 1024
const MOBILE_WIDTH = 500

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {configurable: true, writable: true, value: width})
}

afterEach(() => setViewport(DESKTOP_WIDTH))

describe('AppSidebar', () => {
  it('renders group labels, items, icons and badges', () => {
    renderWithUi(
      <SidebarProvider>
        <AppSidebar groups={groups} currentPath="/" />
      </SidebarProvider>,
    )
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(screen.getByRole('link', {name: /Projects/})).toHaveAttribute('href', '/projects')
    expect(screen.getByTestId('icon-home')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('marks the active item with aria-current (prefix match, exact for /)', () => {
    renderWithUi(
      <SidebarProvider>
        <AppSidebar groups={groups} currentPath="/projects/42" />
      </SidebarProvider>,
    )
    expect(screen.getByRole('link', {name: /Projects/})).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', {name: /Home/})).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', {name: /Settings/})).not.toHaveAttribute('aria-current')
  })

  it('uses a custom isActive heuristic', () => {
    renderWithUi(
      <SidebarProvider>
        <AppSidebar groups={groups} currentPath="/anything" isActive={href => href === '/settings'} />
      </SidebarProvider>,
    )
    expect(screen.getByRole('link', {name: /Settings/})).toHaveAttribute('aria-current', 'page')
  })

  it('renders links through the linkComponent slot and calls onNavigate', async () => {
    const onNavigate = vi.fn()
    const {user} = renderWithUi(
      <SidebarProvider>
        <AppSidebar
          groups={groups}
          currentPath="/"
          onNavigate={onNavigate}
          linkComponent={({href, children, ...rest}) => (
            <a href={href} data-router-link {...rest} onClick={e => { e.preventDefault(); rest.onClick?.() }}>
              {children}
            </a>
          )}
        />
      </SidebarProvider>,
    )
    const link = screen.getByRole('link', {name: /Settings/})
    expect(link).toHaveAttribute('data-router-link')
    await user.click(link)
    expect(onNavigate).toHaveBeenCalledOnce()
  })

  it('passes the expanded desktop context to header and footer', () => {
    const header = vi.fn((ctx: AppSidebarSlotContext) => <span>{ctx.collapsed ? 'A' : 'Acme'}</span>)
    const footer = vi.fn(() => <span>Footer</span>)
    renderWithUi(
      <SidebarProvider>
        <AppSidebar groups={groups} currentPath="/" header={header} footer={footer} />
      </SidebarProvider>,
    )
    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
    expect(header).toHaveBeenLastCalledWith(expect.objectContaining({collapsed: false, isMobile: false}))
    expect(footer).toHaveBeenLastCalledWith(expect.objectContaining({collapsed: false, isMobile: false}))
  })

  it('collapsed: hides labels and badges, header gets collapsed=true', () => {
    renderWithUi(
      <SidebarProvider defaultOpen={false}>
        <AppSidebar groups={groups} currentPath="/" header={({collapsed}) => <span>{collapsed ? 'A' : 'Acme'}</span>} />
      </SidebarProvider>,
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.queryByText('Acme')).not.toBeInTheDocument()
    expect(screen.queryByText('Projects')).not.toBeInTheDocument()
    expect(screen.queryByText('5')).not.toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })

  it('mobile: ctx.closeMobile closes the off-canvas sheet', async () => {
    setViewport(MOBILE_WIDTH)
    const {user} = renderWithUi(
      <AppShell
        sidebar={
          <AppSidebar
            groups={groups}
            currentPath="/"
            footer={({isMobile, closeMobile}) => (
              <button type="button" onClick={closeMobile}>
                {isMobile ? 'Close mobile' : 'Desktop'}
              </button>
            )}
          />
        }
      >
        content
      </AppShell>,
    )
    await user.click(screen.getByRole('button', {name: 'Toggle sidebar'}))
    const sheet = await screen.findByRole('dialog')
    await user.click(within(sheet).getByRole('button', {name: 'Close mobile'}))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('mobile: navigating closes the off-canvas sheet', async () => {
    setViewport(MOBILE_WIDTH)
    const {user} = renderWithUi(
      <AppShell
        sidebar={
          <AppSidebar
            groups={groups}
            currentPath="/"
            linkComponent={({href, children, ...rest}) => (
              <a href={href} {...rest} onClick={e => { e.preventDefault(); rest.onClick?.() }}>{children}</a>
            )}
          />
        }
      >
        content
      </AppShell>,
    )
    await user.click(screen.getByRole('button', {name: 'Toggle sidebar'}))
    const sheet = await screen.findByRole('dialog')
    await user.click(within(sheet).getByRole('link', {name: /Settings/}))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
