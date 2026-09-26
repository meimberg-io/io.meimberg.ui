import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {ListPage} from './ListPage'

const follows = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

describe('ListPage', () => {
  it('renders header → intro → filter bar → list in DOM order', () => {
    render(
      <ListPage
        title="Tasks"
        actions={<button type="button">New task</button>}
        intro={<div>KPIs</div>}
        filters={<span>Status</span>}
        view={<span>View</span>}
        search={<span>Search</span>}
        filterActions={<span>Export</span>}
      >
        <ul><li>Row</li></ul>
      </ListPage>,
    )
    const order = [
      screen.getByRole('heading', {name: 'Tasks'}),
      screen.getByText('KPIs'),
      screen.getByText('Status'),
      screen.getByText('View'),
      screen.getByText('Search'),
      screen.getByText('Export'),
      screen.getByText('Row'),
    ]
    for (let i = 1; i < order.length; i++) expect(follows(order[i - 1], order[i])).toBe(true)
    expect(screen.getByRole('button', {name: 'New task'}).closest('[data-slot="actions"]')).not.toBeNull()
  })

  it('passes the filter slots into the FilterBar', () => {
    const {container} = render(
      <ListPage title="Tasks" filters="f" search="s" filterActions="a" filterTint="rgb(255, 0, 0)" filterBelow={<div>Chips</div>}>
        x
      </ListPage>,
    )
    const content = container.querySelector<HTMLElement>('[data-slot="content"]')!
    expect(content.querySelector('[data-slot="filters"]')).toHaveTextContent('f')
    expect(content.querySelector('[data-slot="search"]')).toHaveTextContent('s')
    expect(content.querySelector('[data-slot="actions"]')).toHaveTextContent('a')
    expect(content.style.borderColor).toBe('rgb(255, 0, 0)')
    expect(content).not.toContainElement(screen.getByText('Chips'))
  })

  it('renders no FilterBar without filter slots', () => {
    const {container} = render(
      <ListPage title="Tasks" intro={<div>KPIs</div>} filterTint="red" filterBelow={<div>Chips</div>}>
        x
      </ListPage>,
    )
    expect(container.querySelector('[data-slot="content"]')).toBeNull()
    expect(screen.queryByText('Chips')).toBeNull()
    expect(screen.getByText('KPIs').closest('[data-slot="intro"]')).not.toBeNull()
  })

  it('renders each filter slot alone as a FilterBar', () => {
    for (const slot of ['filters', 'view', 'search', 'filterActions'] as const) {
      const {container, unmount} = render(<ListPage title="T" {...{[slot]: 'x'}}>y</ListPage>)
      expect(container.querySelector('[data-slot="content"]')).not.toBeNull()
      unmount()
    }
  })

  it('omits the intro wrapper without intro and honours contained', () => {
    const {container} = render(<ListPage title="Tasks" contained={false} filters="f">x</ListPage>)
    expect(container.querySelector('[data-slot="intro"]')).toBeNull()
    expect(container.querySelector('[class*="max-w-[1440px]"]')).toBeNull()
  })
})
