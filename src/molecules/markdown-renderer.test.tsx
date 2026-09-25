import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {MarkdownRenderer} from './markdown-renderer'

describe('MarkdownRenderer', () => {
  it('renders empty when value is empty', () => {
    const {container} = render(<MarkdownRenderer value='' />)
    expect(container.querySelector('h1, h2, p')).toBeNull()
  })

  it('renders headings', () => {
    render(<MarkdownRenderer value='# Title' />)
    expect(screen.getByRole('heading', {level: 1, name: 'Title'})).toBeInTheDocument()
  })

  it('renders paragraphs', () => {
    render(<MarkdownRenderer value='Hello world' />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders external links with safe href', () => {
    render(<MarkdownRenderer value='[link](https://example.test)' />)
    const link = screen.getByRole('link', {name: 'link'})
    expect(link).toHaveAttribute('href', 'https://example.test')
  })

  it('strips javascript: URLs (sanitization)', () => {
    render(<MarkdownRenderer value='[bad](javascript:alert(1))' />)
    const link = screen.queryByRole('link')
    // rehype-sanitize keeps the anchor but neutralizes the href.
    if (link) {
      expect(link.getAttribute('href') ?? '').not.toContain('javascript:')
    }
  })

  it('renders GFM tables', () => {
    render(<MarkdownRenderer value={'| a | b |\n| - | - |\n| 1 | 2 |'} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders task list items', () => {
    render(<MarkdownRenderer value={'- [ ] todo\n- [x] done'} />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).toBeChecked()
  })

  it('keeps relative URLs', () => {
    render(<MarkdownRenderer value='![alt](/files/123) [doc](docs/intro)' />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/files/123')
    expect(screen.getByText('doc').closest('a')).toHaveAttribute('href', 'docs/intro')
  })

  it('drops unsafe schemes', () => {
    render(<MarkdownRenderer value='[x](javascript:alert(1))' />)
    expect(screen.getByText('x').closest('a')?.getAttribute('href') ?? '').toBe('')
  })

  it('keeps in-page anchors', () => {
    render(<MarkdownRenderer value='[top](#top)' />)
    expect(screen.getByRole('link', {name: 'top'}).getAttribute('href')).toContain('#')
  })
})
