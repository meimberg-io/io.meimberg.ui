import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {createRef} from 'react'
import {IconButton} from './IconButton'
import {EditIcon} from './icons'

describe('IconButton', () => {
  it('renders type=button, sm box, quiet neutral by default', () => {
    render(<IconButton aria-label="Edit"><EditIcon /></IconButton>)
    const button = screen.getByRole('button', {name: 'Edit'})
    expect(button).toHaveAttribute('type', 'button')
    expect(button.className).toContain('size-8')
    expect(button.className).toContain('[&_svg]:size-3.5')
    expect(button.className).toContain('text-muted-foreground')
    expect(button.className).toContain('hover:text-foreground')
  })

  it('maps sizes to box and icon size', () => {
    const sizes = [
      ['xs', 'size-6.5', '[&_svg]:size-3'],
      ['sm', 'size-8', '[&_svg]:size-3.5'],
      ['md', 'size-9', '[&_svg]:size-4'],
      ['lg', 'size-10', '[&_svg]:size-4'],
    ] as const
    for (const [size, box, icon] of sizes) {
      const {unmount} = render(<IconButton size={size} aria-label="x"><EditIcon /></IconButton>)
      const cls = screen.getByRole('button').className
      expect(cls).toContain(box)
      expect(cls).toContain(icon)
      unmount()
    }
  })

  it('quiet shows the tone on hover only, ghost at rest', () => {
    const {rerender} = render(<IconButton tone="destructive" aria-label="x"><EditIcon /></IconButton>)
    expect(screen.getByRole('button').className).toContain('text-muted-foreground')
    expect(screen.getByRole('button').className).toContain('hover:text-destructive')
    rerender(<IconButton variant="ghost" tone="destructive" aria-label="x"><EditIcon /></IconButton>)
    expect(screen.getByRole('button').className).not.toContain('text-muted-foreground')
    expect(screen.getByRole('button').className).toContain('text-destructive')
  })

  it('busy sets aria-busy, spins the icon and ignores clicks', async () => {
    const onClick = vi.fn()
    render(<IconButton busy onClick={onClick} aria-label="Sync"><EditIcon /></IconButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('data-busy', 'true')
    expect(button.className).toContain('[&_svg]:animate-spin')
    expect(button).not.toBeDisabled()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('calls onClick and forwards ref', async () => {
    const onClick = vi.fn()
    const ref = createRef<HTMLButtonElement>()
    render(<IconButton ref={ref} onClick={onClick} aria-label="Edit"><EditIcon /></IconButton>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('maps variant × tone to rest and hover classes', () => {
    const cases = [
      ['outline', 'neutral', ['border', 'border-border', 'bg-card', 'text-muted-foreground', 'hover:text-foreground', 'hover:border-foreground/30', 'hover:bg-surface-2']],
      ['outline', 'primary', ['border-border', 'hover:text-primary', 'hover:border-primary/30', 'hover:bg-primary/10']],
      ['solid', 'neutral', ['bg-secondary', 'text-secondary-foreground']],
      ['solid', 'destructive', ['bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/90']],
      ['quiet', 'warning', ['text-muted-foreground', 'hover:text-warning', 'hover:bg-warning/10']],
      ['ghost', 'warning', ['text-warning', 'hover:bg-warning/10']],
      ['solid', 'warning', ['bg-warning', 'text-warning-foreground']],
    ] as const
    for (const [variant, tone, classes] of cases) {
      const {unmount} = render(<IconButton variant={variant} tone={tone} aria-label="x"><EditIcon /></IconButton>)
      const list = screen.getByRole('button').className.split(' ')
      for (const c of classes) expect(list).toContain(c)
      unmount()
    }
  })

  it('without pressed sets neither aria-pressed nor data-state', () => {
    render(<IconButton aria-label="x"><EditIcon /></IconButton>)
    const button = screen.getByRole('button')
    expect(button).not.toHaveAttribute('aria-pressed')
    expect(button).not.toHaveAttribute('data-state')
  })

  it('pressed sets aria-pressed/data-state and holds the tone at rest', () => {
    const {rerender} = render(<IconButton tone="primary" pressed={false} aria-label="Star"><EditIcon /></IconButton>)
    let button = screen.getByRole('button', {name: 'Star'})
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('data-state', 'off')
    expect(button.className.split(' ')).toContain('text-muted-foreground')

    rerender(<IconButton tone="primary" pressed aria-label="Star"><EditIcon /></IconButton>)
    button = screen.getByRole('button', {name: 'Star'})
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('data-state', 'on')
    const list = button.className.split(' ')
    expect(list).toContain('text-primary')
    expect(list).toContain('bg-primary/10')
    expect(list).not.toContain('text-muted-foreground')

    rerender(<IconButton variant="outline" tone="success" pressed aria-label="Star"><EditIcon /></IconButton>)
    const outline = screen.getByRole('button').className.split(' ')
    expect(outline).toEqual(expect.arrayContaining(['text-success', 'border-success/30', 'bg-success/10']))
    expect(outline).not.toContain('border-border')
    expect(outline).not.toContain('bg-card')

    rerender(<IconButton variant="solid" tone="primary" pressed aria-label="Star"><EditIcon /></IconButton>)
    const solid = screen.getByRole('button').className.split(' ')
    expect(solid).toEqual(expect.arrayContaining(['bg-primary', 'inset-ring-2', 'inset-ring-primary-foreground/25']))
  })

  it('asChild renders the child element with IconButton classes and no type', () => {
    render(
      <IconButton asChild variant="outline" aria-label="Open">
        <a href="/docs"><EditIcon /></a>
      </IconButton>,
    )
    const link = screen.getByRole('link', {name: 'Open'})
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/docs')
    expect(link).not.toHaveAttribute('type')
    expect(link.className).toContain('size-8')
    expect(link.className).toContain('border-border')
  })

  it('shape maps to rounded-md (default) or rounded-full', () => {
    const {rerender} = render(<IconButton aria-label="x"><EditIcon /></IconButton>)
    expect(screen.getByRole('button').className).toContain('rounded-md')
    rerender(<IconButton shape="circle" aria-label="x"><EditIcon /></IconButton>)
    const list = screen.getByRole('button').className.split(' ')
    expect(list).toContain('rounded-full')
    expect(list).not.toContain('rounded-md')
  })
})
