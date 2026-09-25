import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {FilterBar} from './FilterBar'

describe('FilterBar', () => {
  it('renders children inside the card', () => {
    const {container} = render(<FilterBar><span>Status</span></FilterBar>)
    const content = container.querySelector('[data-slot="content"]')
    expect(content).toContainElement(screen.getByText('Status'))
    expect(content!.className).toContain('flex-wrap')
  })

  it('uses the border token without a tint', () => {
    const {container} = render(<FilterBar>x</FilterBar>)
    const content = container.querySelector<HTMLElement>('[data-slot="content"]')!
    expect(content.className).toContain('border-border')
    expect(content.style.borderColor).toBe('')
  })

  it('applies the tint as border colour', () => {
    const {container} = render(<FilterBar tint="rgb(255, 0, 0)">x</FilterBar>)
    const content = container.querySelector<HTMLElement>('[data-slot="content"]')!
    expect(content.style.borderColor).toBe('rgb(255, 0, 0)')
  })

  it('renders the below row outside the card', () => {
    const {container} = render(<FilterBar below={<div>Active filters</div>}>x</FilterBar>)
    const content = container.querySelector('[data-slot="content"]')
    const below = screen.getByText('Active filters')
    expect(content).not.toContainElement(below)
    expect(container.firstElementChild).toContainElement(below)
  })

  it('merges className, contentClassName and passes HTML attributes through', () => {
    const {container} = render(
      <FilterBar className="mb-0" contentClassName="gap-x-1" data-testid="bar" aria-label="Filters">
        x
      </FilterBar>,
    )
    const root = screen.getByTestId('bar')
    expect(root).toHaveAttribute('aria-label', 'Filters')
    expect(root.className).toContain('mb-0')
    expect(root.className).not.toContain('mb-5')
    const content = container.querySelector('[data-slot="content"]')!
    expect(content.className).toContain('gap-x-1')
    expect(content.className).not.toContain('gap-x-3')
  })
})
