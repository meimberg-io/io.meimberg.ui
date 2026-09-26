import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {FilterBar} from './FilterBar'

function slot(container: HTMLElement, name: string) {
  return container.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

describe('FilterBar', () => {
  it('renders the slots in the fixed order filters → view → search → actions', () => {
    // Props passed in reverse on purpose: the order comes from the component.
    render(
      <FilterBar
        actions={<span>Export</span>}
        search={<span>Search</span>}
        view={<span>View</span>}
        filters={<span>Status</span>}
      />,
    )
    const order = ['Status', 'View', 'Search', 'Export'].map(t => screen.getByText(t))
    for (let i = 1; i < order.length; i++) {
      expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
  })

  it('wraps each slot in its data-slot group inside the card', () => {
    const {container} = render(
      <FilterBar filters="f" view="v" search="s" actions="a" />,
    )
    const content = slot(container, 'content')!
    expect(content.className).toContain('flex-wrap')
    for (const name of ['filters', 'view', 'end']) expect(content).toContainElement(slot(container, name))
    const end = slot(container, 'end')!
    expect(end.className).toContain('ml-auto')
    expect(end).toContainElement(slot(container, 'search'))
    expect(end).toContainElement(slot(container, 'actions'))
  })

  it('omits groups for empty slots', () => {
    const {container} = render(<FilterBar filters="f" />)
    expect(slot(container, 'filters')).not.toBeNull()
    for (const name of ['view', 'end', 'search', 'actions']) expect(slot(container, name)).toBeNull()
  })

  it('makes the end group full width below md only when it holds the search', () => {
    const {container: withSearch} = render(<FilterBar search="s" />)
    expect(slot(withSearch, 'end')!.className).toContain('max-md:w-full')
    const {container: actionsOnly} = render(<FilterBar actions="a" />)
    expect(slot(actionsOnly, 'end')!.className).not.toContain('max-md:w-full')
  })

  it('uses the border token without a tint', () => {
    const {container} = render(<FilterBar filters="x" />)
    const content = slot(container, 'content')!
    expect(content.className).toContain('border-border')
    expect(content.style.borderColor).toBe('')
  })

  it('applies the tint as border colour', () => {
    const {container} = render(<FilterBar tint="rgb(255, 0, 0)" filters="x" />)
    expect(slot(container, 'content')!.style.borderColor).toBe('rgb(255, 0, 0)')
  })

  it('renders the below row outside the card', () => {
    const {container} = render(<FilterBar below={<div>Active filters</div>} filters="x" />)
    const below = screen.getByText('Active filters')
    expect(slot(container, 'content')).not.toContainElement(below)
    expect(container.firstElementChild).toContainElement(below)
  })

  it('merges className, contentClassName and passes HTML attributes through', () => {
    const {container} = render(
      <FilterBar className="mb-0" contentClassName="gap-x-1" data-testid="bar" aria-label="Filters" filters="x" />,
    )
    const root = screen.getByTestId('bar')
    expect(root).toHaveAttribute('aria-label', 'Filters')
    expect(root.className).toContain('mb-0')
    expect(root.className).not.toContain('mb-5')
    const content = slot(container, 'content')!
    expect(content.className).toContain('gap-x-1')
    expect(content.className).not.toContain('gap-x-3')
  })
})
