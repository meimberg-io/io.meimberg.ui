import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {SectionCardHeader} from './SectionCardHeader'

describe('SectionCardHeader', () => {
  it('renders the title as h2 with the heading-3 default size', () => {
    render(<SectionCardHeader title="Projects" />)
    expect(screen.getByRole('heading', {level: 2, name: 'Projects'}).className).toContain('heading-3')
  })

  it('titleSize base uses the compact title style', () => {
    render(<SectionCardHeader title="Projects" titleSize="base" />)
    expect(screen.getByRole('heading', {name: 'Projects'}).className).toContain('text-base')
  })

  it('renders the subtitle', () => {
    render(<SectionCardHeader title="Projects" subtitle="3 active" />)
    expect(screen.getByText('3 active')).toBeInTheDocument()
  })

  it('stacks vertically without action', () => {
    render(<SectionCardHeader title="Projects" data-testid="header" />)
    expect(screen.getByTestId('header').className).not.toContain('justify-between')
  })

  it('renders the action on the right and switches to a row layout', () => {
    render(<SectionCardHeader title="Projects" subtitle="3 active" action={<a href="/projects">View all</a>} data-testid="header" />)
    const header = screen.getByTestId('header')
    expect(header.className).toContain('justify-between')
    expect(screen.getByRole('link', {name: 'View all'}).parentElement).toBe(header)
  })

  it('treats false/null action as absent', () => {
    render(<SectionCardHeader title="Projects" action={false} data-testid="header" />)
    expect(screen.getByTestId('header').className).not.toContain('justify-between')
  })

  it('merges className and passes HTML attributes through', () => {
    render(<SectionCardHeader title="Projects" className="mb-0" aria-label="Section" data-testid="header" />)
    const header = screen.getByTestId('header')
    expect(header.tagName).toBe('HEADER')
    expect(header.className).toContain('mb-0')
    expect(header.className).not.toContain('mb-3')
    expect(header).toHaveAttribute('aria-label', 'Section')
  })
})
