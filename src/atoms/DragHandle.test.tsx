import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {createRef} from 'react'
import {DragHandle} from './DragHandle'
import {UiI18nProvider} from '../i18n/context'
import {de} from '../i18n/de'

describe('DragHandle', () => {
  it('renders a 24×32 grab button with the English default label', () => {
    render(<DragHandle />)
    const button = screen.getByRole('button', {name: 'Drag to reorder'})
    expect(button).toHaveAttribute('type', 'button')
    expect(button.className).toContain('w-6')
    expect(button.className).toContain('h-8')
    expect(button.className).toContain('cursor-grab')
    expect(button.className).toContain('touch-none')
    expect(button.className).toContain('pointer-coarse:min-h-tap')
  })

  it('resolves the German label from the messages', () => {
    render(<UiI18nProvider messages={de.messages}><DragHandle /></UiI18nProvider>)
    expect(screen.getByRole('button', {name: 'Zum Sortieren ziehen'})).toBeInTheDocument()
  })

  it('forwards spread props (dnd-kit attributes/listeners) and ref', () => {
    const ref = createRef<HTMLButtonElement>()
    const attributes = {role: 'button', tabIndex: 0, 'aria-roledescription': 'sortable', 'aria-describedby': 'dnd-desc'}
    const onPointerDown = () => {}
    render(<DragHandle ref={ref} {...attributes} onPointerDown={onPointerDown} labels={{label: 'Move task'}} />)
    const button = screen.getByRole('button', {name: 'Move task'})
    expect(button).toHaveAttribute('aria-roledescription', 'sortable')
    expect(button).toHaveAttribute('aria-describedby', 'dnd-desc')
    expect(ref.current).toBe(button)
  })
})
