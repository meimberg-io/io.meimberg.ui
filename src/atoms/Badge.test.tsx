import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Badge, BadgeDot} from './Badge'

describe('Badge', () => {
  it('renders a span with pill geometry, soft neutral by default', () => {
    render(<Badge>Draft</Badge>)
    const badge = screen.getByText('Draft').parentElement as HTMLElement
    expect(badge.tagName).toBe('SPAN')
    expect(badge.className).toContain('pill')
    expect(badge.className).toContain('font-medium')
    expect(badge.className).toContain('tabular-nums')
    expect(badge.className).toContain('bg-surface-2')
    expect(badge.className).toContain('text-muted-foreground')
  })

  it.each([
    ['solid', 'primary', ['bg-primary', 'text-primary-foreground']],
    ['solid', 'neutral', ['bg-secondary', 'text-secondary-foreground']],
    ['soft', 'success', ['bg-success/10', 'text-success']],
    ['soft', 'neutral', ['bg-surface-2', 'text-muted-foreground']],
    ['outline', 'warning', ['border-warning/30', 'text-warning']],
    ['outline', 'neutral', ['border-border', 'text-foreground']],
    ['outline', 'info', ['border-info/30', 'text-info']],
    ['plain', 'destructive', ['text-destructive', 'border-0', 'bg-transparent']],
  ] as const)('%s × %s → %j', (variant, tone, classes) => {
    render(<Badge variant={variant} tone={tone}>x</Badge>)
    const badge = screen.getByText('x').parentElement as HTMLElement
    for (const cls of classes) expect(badge.className).toContain(cls)
  })

  it('plain neutral inherits the text color', () => {
    render(<Badge variant="plain">x</Badge>)
    expect((screen.getByText('x').parentElement as HTMLElement).className).not.toMatch(/\btext-(foreground|muted-foreground)\b/)
  })

  it('shape rounded and compact', () => {
    render(<Badge shape="rounded" compact>5</Badge>)
    const badge = screen.getByText('5').parentElement as HTMLElement
    expect(badge.className).toContain('rounded-md')
    expect(badge.className).toContain('min-w-5')
    expect(badge.className).toContain('px-1.5')
  })

  it('renders leading and trailing slots', () => {
    render(<Badge leading={<i data-testid="lead" />} trailing={<i data-testid="trail" />}>Label</Badge>)
    expect(screen.getByTestId('lead')).toBeInTheDocument()
    expect(screen.getByTestId('trail')).toBeInTheDocument()
  })

  it('iconOnly hides the label visually, moves it to title and drops trailing', () => {
    render(<Badge iconOnly leading={<i data-testid="lead" />} trailing={<i data-testid="trail" />}>Repository</Badge>)
    const label = screen.getByText('Repository')
    expect(label.className).toContain('sr-only')
    expect(label.parentElement).toHaveAttribute('title', 'Repository')
    expect(screen.queryByTestId('trail')).toBeNull()
  })

  it('href renders a new-tab link', () => {
    render(<Badge href="https://example.com">Site</Badge>)
    const link = screen.getByRole('link', {name: 'Site'})
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })

  it('passes data-*/aria-* and className through', () => {
    render(<Badge data-testid="b" aria-live="polite" className="ml-auto">x</Badge>)
    const badge = screen.getByTestId('b')
    expect(badge).toHaveAttribute('aria-live', 'polite')
    expect(badge.className).toContain('ml-auto')
  })

  it('className overrides the tone (domain tints)', () => {
    render(<Badge variant="outline" className="border-sky-500/30 text-sky-600">x</Badge>)
    const badge = screen.getByText('x').parentElement as HTMLElement
    expect(badge.className).toContain('text-sky-600')
    expect(badge.className).not.toContain('text-foreground')
  })
})

describe('BadgeDot', () => {
  it('renders a decorative current-color dot', () => {
    const {container} = render(<BadgeDot className="extra" />)
    const dot = container.firstElementChild as HTMLElement
    expect(dot).toHaveAttribute('aria-hidden')
    expect(dot.className).toContain('bg-current')
    expect(dot.className).toContain('extra')
  })
})
