import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {SegControl} from './SegControl'

const options = [
  {value: 'list', label: 'Liste'},
  {value: 'grid', label: 'Grid'},
] as const

describe('SegControl', () => {
  it('renders options as radios with the active one checked', () => {
    render(<SegControl value="list" options={options} onChange={vi.fn()} />)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)
    expect(screen.getByRole('radio', {name: 'Liste'})).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', {name: 'Grid'})).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with the clicked value', async () => {
    const onChange = vi.fn()
    render(<SegControl value="list" options={options} onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', {name: 'Grid'}))
    expect(onChange).toHaveBeenCalledWith('grid')
  })
})
