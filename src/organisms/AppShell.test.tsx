import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithUi} from '../testing'
import {appShell as appShellDe} from '../i18n/de/appShell'
import {AppShell} from './AppShell'

describe('AppShell', () => {
  it('renders slots, main content and the sidebar toggle', () => {
    renderWithUi(
      <AppShell sidebar={<aside>nav</aside>} headerStart={<span>crumbs</span>} headerEnd={<span>actions</span>}>
        <p>content</p>
      </AppShell>,
    )
    expect(screen.getByRole('button', {name: 'Toggle sidebar'})).toBeInTheDocument()
    expect(screen.getByText('crumbs')).toBeInTheDocument()
    expect(screen.getByText('actions')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveTextContent('content')
  })

  it('overrides the toggle label via the labels prop', () => {
    renderWithUi(
      <AppShell sidebar={null} labels={{toggleSidebar: 'Menu'}}>
        content
      </AppShell>,
    )
    expect(screen.getByRole('button', {name: 'Menu'})).toBeInTheDocument()
  })

  it('uses app-wide German messages from the render helper', () => {
    renderWithUi(<AppShell sidebar={null}>content</AppShell>, {messages: {appShell: appShellDe}})
    expect(screen.getByRole('button', {name: appShellDe.toggleSidebar})).toBeInTheDocument()
  })

  it('merges className on the frame', () => {
    renderWithUi(<AppShell sidebar={null} className='bg-background'>content</AppShell>)
    expect(screen.getByRole('main').parentElement!.parentElement!.className).toContain('bg-background')
  })
})
