import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FilterChip} from './FilterChip'

describe('FilterChip', () => {
  it('renders label and children', () => {
    render(<FilterChip label="Project:" onRemove={vi.fn()}>Q3</FilterChip>)
    expect(screen.getByText('Project:')).toBeInTheDocument()
    expect(screen.getByText('Q3')).toBeInTheDocument()
  })

  it('calls onRemove when the remove button (English default label) is clicked', async () => {
    const onRemove = vi.fn()
    render(<FilterChip label="Tag" onRemove={onRemove}>x</FilterChip>)
    await userEvent.click(screen.getByRole('button', {name: 'Remove filter'}))
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('prefers ariaLabel over labels', () => {
    render(<FilterChip onRemove={vi.fn()} ariaLabel="Remove tag" labels={{remove: 'Ignored'}}>x</FilterChip>)
    expect(screen.getByRole('button', {name: 'Remove tag'})).toBeInTheDocument()
  })

  it('overrides labels via the labels prop', () => {
    render(<FilterChip onRemove={vi.fn()} labels={{remove: 'Drop'}}>x</FilterChip>)
    expect(screen.getByRole('button', {name: 'Drop'})).toBeInTheDocument()
  })
})
