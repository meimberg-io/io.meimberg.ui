import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {SegmentedControl, type SegmentedControlOption, type SegmentedControlSize} from './SegmentedControl'
import {Moon, Sun} from './icons'

type V = 'a' | 'b' | 'c'
const OPTIONS: ReadonlyArray<SegmentedControlOption<V>> = [
  {value: 'a', label: 'Alpha'},
  {value: 'b', label: 'Beta'},
  {value: 'c', label: 'Gamma'},
]

function Controlled({onChange, size}: {onChange?: (v: V) => void; size?: SegmentedControlSize}) {
  const [value, setValue] = useState<V>('a')
  return (
    <SegmentedControl
      value={value}
      options={OPTIONS}
      size={size}
      aria-label="Kind"
      onChange={v => { setValue(v); onChange?.(v) }}
    />
  )
}

describe('SegmentedControl', () => {
  it('renders a labelled radiogroup with radio segments', () => {
    render(<Controlled />)
    expect(screen.getByRole('radiogroup', {name: 'Kind'})).toBeTruthy()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', {name: 'Alpha'})).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', {name: 'Beta'})).toHaveAttribute('aria-checked', 'false')
  })

  it('uses a roving tabindex on the checked segment', () => {
    render(<Controlled />)
    expect(screen.getByRole('radio', {name: 'Alpha'})).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', {name: 'Beta'})).toHaveAttribute('tabindex', '-1')
  })

  it('clicking a segment calls onChange', async () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', {name: 'Gamma'}))
    expect(onChange).toHaveBeenCalledWith('c')
    expect(screen.getByRole('radio', {name: 'Gamma'})).toHaveAttribute('aria-checked', 'true')
  })

  it('does not call onChange when clicking the checked segment', async () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', {name: 'Alpha'}))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('arrow keys move the selection and focus, wrapping around', async () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    const alpha = screen.getByRole('radio', {name: 'Alpha'})
    alpha.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenLastCalledWith('b')
    expect(screen.getByRole('radio', {name: 'Beta'})).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(onChange).toHaveBeenLastCalledWith('c')
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenLastCalledWith('a')
    await userEvent.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenLastCalledWith('c')
    await userEvent.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenLastCalledWith('b')
  })

  it('Home/End jump to the first/last segment', async () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    screen.getByRole('radio', {name: 'Alpha'}).focus()
    await userEvent.keyboard('{End}')
    expect(onChange).toHaveBeenLastCalledWith('c')
    await userEvent.keyboard('{Home}')
    expect(onChange).toHaveBeenLastCalledWith('a')
  })

  it('disabled disables every segment and ignores keys', () => {
    const onChange = vi.fn()
    render(<SegmentedControl value="a" options={OPTIONS} onChange={onChange} disabled />)
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()
    fireEvent.keyDown(screen.getByRole('radiogroup'), {key: 'ArrowRight'})
    expect(onChange).not.toHaveBeenCalled()
  })

  it('positions the thumb via --seg-count/--seg-index', () => {
    render(<SegmentedControl value="b" options={OPTIONS} onChange={() => {}} />)
    const group = screen.getByRole('radiogroup')
    expect(group.style.getPropertyValue('--seg-count')).toBe('3')
    expect(group.style.getPropertyValue('--seg-index')).toBe('1')
    expect(group.querySelector('[data-slot="thumb"]')).toBeTruthy()
  })

  it('maps sizes lg (default) → h-10 and xs → h-6.5', () => {
    const {rerender} = render(<SegmentedControl value="a" options={OPTIONS} onChange={() => {}} />)
    expect(screen.getByRole('radiogroup').className).toContain('h-10')
    rerender(<SegmentedControl value="a" options={OPTIONS} onChange={() => {}} size="xs" />)
    expect(screen.getByRole('radiogroup').className).toContain('h-6.5')
  })

  it('icon-only options use ariaLabel as name and title', () => {
    const {container} = render(
      <SegmentedControl
        value="light"
        options={[{value: 'light', icon: Sun, ariaLabel: 'Light'}, {value: 'dark', icon: Moon, ariaLabel: 'Dark'}]}
        onChange={() => {}}
      />,
    )
    const light = screen.getByRole('radio', {name: 'Light'})
    expect(light).toHaveAttribute('title', 'Light')
    expect(container.querySelectorAll('svg')).toHaveLength(2)
  })

  it('merges className', () => {
    render(<SegmentedControl value="a" options={OPTIONS} onChange={() => {}} className="w-64" />)
    expect(screen.getByRole('radiogroup').className).toContain('w-64')
  })
})
