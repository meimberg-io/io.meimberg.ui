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
})
