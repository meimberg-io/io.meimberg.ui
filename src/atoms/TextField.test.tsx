import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {TextField} from './TextField'

describe('TextField', () => {
  it('renders as <input> by default with field-shell class', () => {
    render(<TextField placeholder="Test" />)
    const input = screen.getByPlaceholderText('Test')
    expect(input.tagName).toBe('INPUT')
    expect(input.className).toContain('field-shell')
  })

  it('renders as <textarea> when as="textarea"', () => {
    render(<TextField as="textarea" placeholder="Notes" />)
    const ta = screen.getByPlaceholderText('Notes')
    expect(ta.tagName).toBe('TEXTAREA')
    expect(ta.className).toContain('field-shell')
  })

  it('forwards onChange for input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TextField placeholder="x" onChange={onChange} />)
    await user.type(screen.getByPlaceholderText('x'), 'ab')
    expect(onChange).toHaveBeenCalled()
  })

  it('merges custom className with field-shell', () => {
    render(<TextField placeholder="x" className="font-mono" />)
    const el = screen.getByPlaceholderText('x')
    expect(el.className).toContain('field-shell')
    expect(el.className).toContain('font-mono')
  })
})
