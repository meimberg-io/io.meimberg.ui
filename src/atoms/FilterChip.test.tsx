import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FilterChip} from './FilterChip'

describe('FilterChip', () => {
  it('renders label and children', () => {
    render(<FilterChip label="Mission:" onRemove={vi.fn()} ariaLabel="entfernen">Q3</FilterChip>)
    expect(screen.getByText('Mission:')).toBeInTheDocument()
    expect(screen.getByText('Q3')).toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const onRemove = vi.fn()
    render(<FilterChip label="Tag" onRemove={onRemove} ariaLabel="Filter entfernen">x</FilterChip>)
    await userEvent.click(screen.getByRole('button', {name: 'Filter entfernen'}))
    expect(onRemove).toHaveBeenCalledOnce()
  })
})
