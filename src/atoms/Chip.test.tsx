import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {renderWithProviders} from '../test/render'
import {de} from '../i18n/de'
import {Chip} from './Chip'
import {Folder} from './icons'

describe('Chip — toggle', () => {
  it('renders a type=button with aria-pressed=false by default', () => {
    render(<Chip>Today</Chip>)
    const chip = screen.getByRole('button', {name: 'Today'})
    expect(chip).toHaveAttribute('type', 'button')
    expect(chip).toHaveAttribute('aria-pressed', 'false')
    expect(chip.className).toContain('cursor-pointer')
    expect(chip.className).toContain('border-border')
  })

  it('active tints in primary by default', () => {
    render(<Chip active>Today</Chip>)
    const chip = screen.getByRole('button')
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    expect(chip.className).toContain('bg-primary/10')
    expect(chip.className).toContain('text-primary')
  })

  it('active applies the tone', () => {
    render(<Chip active tone="warning">Due</Chip>)
    const chip = screen.getByRole('button')
    expect(chip.className).toContain('bg-warning/10')
    expect(chip.className).toContain('text-warning')
    expect(chip.className).not.toContain('text-primary')
  })

  it('tone is only visible when active', () => {
    render(<Chip tone="warning">Due</Chip>)
    expect(screen.getByRole('button').className).not.toContain('text-warning')
  })

  it('maps sizes to 26/32 px', () => {
    const {rerender} = render(<Chip>x</Chip>)
    expect(screen.getByRole('button').className).toContain('h-6.5')
    rerender(<Chip size="sm">x</Chip>)
    expect(screen.getByRole('button').className).toContain('h-8')
  })

  it('renders icon and count', () => {
    const {container} = render(<Chip icon={Folder} count={3}>Projects</Chip>)
    expect(container.querySelector('svg')).toBeTruthy()
    expect(container.querySelector('[data-slot="count"]')?.textContent).toBe('3')
  })

  it('calls onClick', async () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick}>x</Chip>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('compactBelow hides the label below the breakpoint but keeps icon and accessible name', () => {
    const {container} = render(<Chip icon={Folder} compactBelow="md">Projects</Chip>)
    const label = container.querySelector('[data-slot="label"]') as HTMLElement
    expect(label.className).toContain('hidden')
    expect(label.className).toContain('md:inline-flex')
    expect(container.querySelector('svg')).toBeTruthy()
    expect(screen.getByRole('button', {name: 'Projects'})).toHaveAttribute('aria-label', 'Projects')
  })

  it('without compactBelow, no aria-label and no hidden label', () => {
    const {container} = render(<Chip>Projects</Chip>)
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-label')
    expect(container.querySelector('[data-slot="label"]')?.className ?? '').not.toContain('hidden')
  })

  it('explicit aria-label wins over the compact name', () => {
    render(<Chip compactBelow="sm" aria-label="Show projects">Projects</Chip>)
    expect(screen.getByRole('button', {name: 'Show projects'})).toBeTruthy()
  })
})

describe('Chip — removable', () => {
  it('renders a span (no pressed button) with a remove button, tinted', () => {
    const {container} = render(<Chip onRemove={() => {}}>Alpha</Chip>)
    const root = container.firstElementChild as HTMLElement
    expect(root.tagName).toBe('SPAN')
    expect(root.className).toContain('bg-primary/10')
    expect(root.className).toContain('border-primary/30')
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAccessibleName('Remove filter')
    expect(buttons[0]).not.toHaveAttribute('aria-pressed')
  })

  it('calls onRemove', async () => {
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>Alpha</Chip>)
    await userEvent.click(screen.getByRole('button', {name: 'Remove filter'}))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('renders the prefix muted before the value', () => {
    render(<Chip onRemove={() => {}} prefix="Project:">Alpha</Chip>)
    const prefix = screen.getByText('Project:')
    expect(prefix.className).toContain('text-muted-foreground')
    expect(prefix.parentElement?.textContent).toBe('Project:Alpha')
  })

  it('applies tone and className override', () => {
    const {container} = render(<Chip onRemove={() => {}} tone="success" className="bg-sky-100">x</Chip>)
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain('text-success')
    expect(root.className).toContain('bg-sky-100')
    expect(root.className).not.toContain('bg-success/10')
  })

  it('compactBelow hides label and sets title', () => {
    const {container} = render(<Chip onRemove={() => {}} icon={Folder} compactBelow="lg">Alpha</Chip>)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('title', 'Alpha')
    expect((container.querySelector('[data-slot="label"]') as HTMLElement).className).toContain('lg:inline-flex')
  })

  it('overrides labels per instance', () => {
    render(<Chip onRemove={() => {}} labels={{remove: 'Clear'}}>x</Chip>)
    expect(screen.getByRole('button', {name: 'Clear'})).toBeTruthy()
  })

  it('uses the German package via UiI18nProvider', () => {
    renderWithProviders(<Chip onRemove={() => {}}>x</Chip>, {messages: de.messages})
    expect(screen.getByRole('button', {name: 'Filter entfernen'})).toBeTruthy()
  })

  it('instance labels win over app messages', () => {
    renderWithProviders(<Chip onRemove={() => {}} labels={{remove: 'Weg'}}>x</Chip>, {messages: de.messages})
    expect(screen.getByRole('button', {name: 'Weg'})).toBeTruthy()
  })
})
