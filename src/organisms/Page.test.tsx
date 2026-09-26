import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Page} from './Page'

describe('Page', () => {
  it('wraps header and content in the PageContainer by default', () => {
    const {container} = render(<Page title="Tasks"><p>Body</p></Page>)
    const root = container.firstElementChild!
    expect(root.className).toContain('max-w-[1440px]')
    const heading = screen.getByRole('heading', {level: 1, name: 'Tasks'})
    expect(root).toContainElement(heading)
    expect(root).toContainElement(screen.getByText('Body'))
    expect(heading.compareDocumentPosition(screen.getByText('Body')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders no PageContainer when contained is false', () => {
    const {container} = render(<Page title="Profile" contained={false}>x</Page>)
    expect(container.querySelector('[class*="max-w-[1440px]"]')).toBeNull()
    expect(container.firstElementChild).toHaveAttribute('data-slot', 'page')
    expect(screen.getByRole('heading', {name: 'Profile'})).toBeInTheDocument()
  })

  it('renders actions in the header action area', () => {
    render(<Page title="Tasks" actions={<button type="button">New task</button>}>x</Page>)
    const button = screen.getByRole('button', {name: 'New task'})
    expect(button.closest('[data-slot="actions"]')).not.toBeNull()
  })

  it('passes description, leading, meta and HTML attributes through', () => {
    render(
      <Page
        title="Tasks"
        description="All open tasks"
        leading={<span>Glyph</span>}
        meta={<span>3 overdue</span>}
        className="gap-2"
        data-testid="page"
      >
        x
      </Page>,
    )
    expect(screen.getByText('All open tasks')).toBeInTheDocument()
    expect(screen.getByText('Glyph').closest('[data-slot="leading"]')).not.toBeNull()
    expect(screen.getByText('3 overdue').closest('[data-slot="meta"]')).not.toBeNull()
    expect(screen.getByTestId('page').className).toContain('gap-2')
  })
})
