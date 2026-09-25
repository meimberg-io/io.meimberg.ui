import {fireEvent, render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {WeightDots} from './WeightDots'

describe('WeightDots atom', () => {
  it('renders 5 dots by default as radio buttons', () => {
    const {getAllByRole} = render(<WeightDots value={3} />)
    expect(getAllByRole('radio')).toHaveLength(5)
  })

  it('marks dots 1..value as aria-checked=true at value position', () => {
    const {getAllByRole} = render(<WeightDots value={3} onChange={vi.fn()} />)
    const dots = getAllByRole('radio')
    expect(dots[2].getAttribute('aria-checked')).toBe('true')
    expect(dots[0].getAttribute('aria-checked')).toBe('false')
    expect(dots[4].getAttribute('aria-checked')).toBe('false')
  })

  it('click on dot n fires onChange(n)', () => {
    const onChange = vi.fn()
    const {getAllByRole} = render(<WeightDots value={2} onChange={onChange} />)
    fireEvent.click(getAllByRole('radio')[3])
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('read-only mode disables click', () => {
    const onChange = vi.fn()
    const {getAllByRole} = render(
      <WeightDots value={2} onChange={onChange} readOnly />,
    )
    fireEvent.click(getAllByRole('radio')[4])
    expect(onChange).not.toHaveBeenCalled()
  })

  it('without onChange behaves like read-only (no error)', () => {
    const {getAllByRole} = render(<WeightDots value={3} />)
    expect(() => fireEvent.click(getAllByRole('radio')[0])).not.toThrow()
  })

  it('stops click propagation so parent rows do not toggle', () => {
    const onParent = vi.fn()
    const onChange = vi.fn()
    const {getAllByRole} = render(
      <div onClick={onParent}>
        <WeightDots value={2} onChange={onChange} />
      </div>,
    )
    fireEvent.click(getAllByRole('radio')[3])
    expect(onChange).toHaveBeenCalledOnce()
    expect(onParent).not.toHaveBeenCalled()
  })

  it('aria-label for the group is descriptive by default', () => {
    const {getByRole} = render(<WeightDots value={4} />)
    expect(getByRole('group').getAttribute('aria-label')).toContain('4')
  })

  it('per-dot aria-labels use the English default label', () => {
    const {getAllByRole} = render(<WeightDots value={3} />)
    const dots = getAllByRole('radio')
    expect(dots[0].getAttribute('aria-label')).toBe('Weight 1')
    expect(dots[4].getAttribute('aria-label')).toBe('Weight 5')
  })

  it('overrides labels via the labels prop', () => {
    const {getAllByRole, getByRole} = render(<WeightDots value={2} labels={{label: 'Priority'}} />)
    expect(getAllByRole('radio')[0].getAttribute('aria-label')).toBe('Priority 1')
    expect(getByRole('group').getAttribute('aria-label')).toBe('Priority 2 / 5')
  })

  it('renders `max` dots', () => {
    const onChange = vi.fn()
    const {getAllByRole} = render(<WeightDots value={2} max={10} onChange={onChange} />)
    const dots = getAllByRole('radio')
    expect(dots).toHaveLength(10)
    fireEvent.click(dots[7])
    expect(onChange).toHaveBeenCalledWith(8)
  })

  it('passes data-testid through', () => {
    const {getByTestId} = render(<WeightDots value={1} data-testid="weight" />)
    expect(getByTestId('weight')).toBeTruthy()
  })

  it('filled dots use bg-primary, empty dots use neutral border', () => {
    const {getAllByRole} = render(<WeightDots value={3} />)
    const dots = getAllByRole('radio')
    expect(dots[0].className).toContain('bg-primary')
    expect(dots[4].className).toContain('bg-transparent')
  })

  it('cursor-pointer is set in interactive mode, not in read-only', () => {
    const {getAllByRole, rerender} = render(
      <WeightDots value={3} onChange={vi.fn()} />,
    )
    expect(getAllByRole('radio')[0].className).toContain('cursor-pointer')
    rerender(<WeightDots value={3} readOnly />)
    expect(getAllByRole('radio')[0].className).not.toContain('cursor-pointer')
  })

  it('passes arbitrary HTML attributes to the group', () => {
    const {getByRole} = render(<WeightDots value={2} id="weight" aria-describedby="hint" />)
    const group = getByRole('group')
    expect(group).toHaveAttribute('id', 'weight')
    expect(group).toHaveAttribute('aria-describedby', 'hint')
  })
})
