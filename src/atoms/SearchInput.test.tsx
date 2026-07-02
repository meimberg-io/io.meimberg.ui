import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {SearchInput} from './SearchInput'

describe('SearchInput', () => {
  it('renders with the default placeholder', () => {
    renderWithProviders(<SearchInput value='' onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument()
  })

  it('respects a custom placeholder', () => {
    renderWithProviders(<SearchInput value='' onChange={vi.fn()} placeholder='Find…' />)
    expect(screen.getByPlaceholderText('Find…')).toBeInTheDocument()
  })

  it('calls onChange immediately when debounceMs is 0', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(<SearchInput value='' onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'X')
    expect(onChange).toHaveBeenCalledWith('X')
  })

  it('eventually calls onChange when debounceMs is set', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(
      <SearchInput value='' onChange={onChange} debounceMs={50} />,
    )
    await user.type(screen.getByRole('textbox'), 'a')
    // Wait for the debounce timer (real timers — keep it short).
    await new Promise(r => setTimeout(r, 100))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows the clear button only when there is text', () => {
    const {rerender} = renderWithProviders(<SearchInput value='' onChange={vi.fn()} />)
    expect(screen.queryByRole('button', {name: /Suche leeren/})).not.toBeInTheDocument()
    rerender(<SearchInput value='hello' onChange={vi.fn()} />)
    expect(screen.getByRole('button', {name: /Suche leeren/})).toBeInTheDocument()
  })

  it('clears the input when the clear button is clicked', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(<SearchInput value='hello' onChange={onChange} />)
    await user.click(screen.getByRole('button', {name: /Suche leeren/}))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
