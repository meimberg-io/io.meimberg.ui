import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithUi} from '../testing'
import {SearchInput} from './SearchInput'

describe('SearchInput', () => {
  it('renders with the default placeholder', () => {
    renderWithUi(<SearchInput value='' onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument()
  })

  it('respects a custom placeholder', () => {
    renderWithUi(<SearchInput value='' onChange={vi.fn()} placeholder='Find…' />)
    expect(screen.getByPlaceholderText('Find…')).toBeInTheDocument()
  })

  it('overrides labels via the labels prop', () => {
    renderWithUi(<SearchInput value='x' onChange={vi.fn()} labels={{clear: 'Reset'}} />)
    expect(screen.getByRole('button', {name: 'Reset'})).toBeInTheDocument()
  })

  it('calls onChange immediately when debounceMs is 0', async () => {
    const onChange = vi.fn()
    const {user} = renderWithUi(<SearchInput value='' onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'X')
    expect(onChange).toHaveBeenCalledWith('X')
  })

  it('eventually calls onChange when debounceMs is set', async () => {
    const onChange = vi.fn()
    const {user} = renderWithUi(
      <SearchInput value='' onChange={onChange} debounceMs={50} />,
    )
    await user.type(screen.getByRole('textbox'), 'a')
    // Wait for the debounce timer (real timers — keep it short).
    await new Promise(r => setTimeout(r, 100))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows the clear button only when there is text', () => {
    const {rerender} = renderWithUi(<SearchInput value='' onChange={vi.fn()} />)
    expect(screen.queryByRole('button', {name: /Clear search/})).not.toBeInTheDocument()
    rerender(<SearchInput value='hello' onChange={vi.fn()} />)
    expect(screen.getByRole('button', {name: /Clear search/})).toBeInTheDocument()
  })

  it('clears the input when the clear button is clicked', async () => {
    const onChange = vi.fn()
    const {user} = renderWithUi(<SearchInput value='hello' onChange={onChange} />)
    await user.click(screen.getByRole('button', {name: /Clear search/}))
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('defaults to size lg (bordered field)', () => {
    renderWithUi(<SearchInput value='' onChange={vi.fn()} />)
    expect(screen.getByRole('textbox').parentElement).toHaveAttribute('data-size', 'lg')
    expect(screen.getByRole('textbox').className).toContain('border')
  })

  it('size xs renders the borderless 26px filter-bar look', () => {
    renderWithUi(<SearchInput size='xs' value='' onChange={vi.fn()} />)
    const wrapper = screen.getByRole('textbox').parentElement!
    expect(wrapper).toHaveAttribute('data-size', 'xs')
    expect(wrapper.className).toContain('md:w-[200px]')
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('h-6.5')
    expect(input.className).toContain('bg-transparent')
    expect(input.className).not.toMatch(/\bborder\b/)
    expect(wrapper.querySelector('svg')!.getAttribute('class')).toContain('size-3.5')
  })

  it('uses the placeholder as accessible name unless aria-label is given', () => {
    const {rerender} = renderWithUi(<SearchInput size='xs' value='' onChange={vi.fn()} placeholder='Filter tasks' />)
    expect(screen.getByRole('textbox', {name: 'Filter tasks'})).toBeInTheDocument()
    rerender(<SearchInput size='xs' value='' onChange={vi.fn()} placeholder='Filter tasks' aria-label='Search tasks' />)
    expect(screen.getByRole('textbox', {name: 'Search tasks'})).toBeInTheDocument()
  })

  it('renders the clear button at size xs', () => {
    renderWithUi(<SearchInput size='xs' value='x' onChange={vi.fn()} />)
    expect(screen.getByRole('button', {name: 'Clear search'}).className).toContain('size-6.5')
  })

  it('passes data attributes through to the input and className to the wrapper', () => {
    renderWithUi(
      <SearchInput value='' onChange={vi.fn()} data-testid='task-search' className='ml-auto' />,
    )
    const input = screen.getByTestId('task-search')
    expect(input.tagName).toBe('INPUT')
    expect(input.parentElement!.className).toContain('ml-auto')
  })
})
