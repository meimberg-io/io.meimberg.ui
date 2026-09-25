import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconPicker } from './IconPicker'

describe('IconPicker', () => {
  it('renders the English trigger label without a value', () => {
    render(<IconPicker value={null} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Choose icon…' })).toBeInTheDocument()
  })

  it('triggerLabel takes precedence over labels', () => {
    render(<IconPicker value={null} onChange={() => {}} triggerLabel='Pick' labels={{ trigger: 'Select' }} />)
    expect(screen.getByRole('button', { name: 'Pick' })).toBeInTheDocument()
  })

  it('labels prop overrides the popover texts', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <IconPicker
        value='lightbulb'
        onChange={onChange}
        labels={{ searchPlaceholder: 'Find…', clear: 'Clear', noResults: 'Nothing' }}
      />,
    )
    await user.click(screen.getByRole('button', { name: /lightbulb/ }))
    const search = screen.getByPlaceholderText('Find…')
    await user.type(search, 'zzzzzz-no-such-icon')
    expect(screen.getByText('Nothing')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
