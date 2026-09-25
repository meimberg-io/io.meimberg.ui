import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {createRef} from 'react'
import {Button, buttonVariants} from './Button'
import {AddIcon} from './icons'

describe('Button', () => {
  it('renders a button with md size and solid primary by default', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', {name: 'Save'})
    expect(button.className).toContain('h-9')
    expect(button.className).toContain('bg-primary')
  })

  it('maps sizes to the control scale', () => {
    const heights = [['xs', 'h-6.5'], ['sm', 'h-8'], ['md', 'h-9'], ['lg', 'h-10']] as const
    for (const [size, cls] of heights) {
      const {unmount} = render(<Button size={size}>Go</Button>)
      expect(screen.getByRole('button').className).toContain(cls)
      unmount()
    }
  })

  it('defaults the tone per variant (outline/ghost → neutral, solid/link → primary)', () => {
    expect(buttonVariants({variant: 'outline'})).toContain('border-input')
    expect(buttonVariants({variant: 'ghost'})).toContain('hover:bg-accent')
    expect(buttonVariants({variant: 'link'})).toContain('text-primary')
    expect(buttonVariants({tone: 'neutral'})).toContain('bg-secondary')
  })

  it('applies tone', () => {
    render(<Button tone="destructive">Delete</Button>)
    expect(screen.getByRole('button').className).toContain('bg-destructive')
  })

  it('renders the leading icon', () => {
    const {container} = render(<Button icon={AddIcon}>Add</Button>)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('busy sets aria-busy/data-busy, spins the icon and ignores clicks without disabling', async () => {
    const onClick = vi.fn()
    const {container} = render(<Button busy icon={AddIcon} onClick={onClick}>Add</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('data-busy', 'true')
    expect(button).not.toBeDisabled()
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('animate-spin')
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('busy submit button does not submit the form', async () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault())
    render(
      <form onSubmit={e => onSubmit(e.nativeEvent)}>
        <Button type="submit" busy>Save</Button>
      </form>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onClick when not busy', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('asChild renders the child element with button styling and the icon', () => {
    const {container} = render(
      <Button asChild icon={AddIcon}>
        <a href="/new">New</a>
      </Button>,
    )
    const link = screen.getByRole('link', {name: 'New'})
    expect(link.className).toContain('inline-flex')
    expect(link.querySelector('svg')).toBeTruthy()
    expect(container.querySelector('button')).toBeNull()
  })

  it('forwards ref as prop', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Go</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('passes data-* attributes through', () => {
    render(<Button data-testid="primary-action">Go</Button>)
    expect(screen.getByTestId('primary-action')).toBeInTheDocument()
  })
})
