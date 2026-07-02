import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {SegmentedSwitch} from './SegmentedSwitch'

const options = [
  {value: 'inbox' as const, label: 'Inbox'},
  {value: 'task' as const, label: 'Task'},
]

describe('SegmentedSwitch', () => {
  it('renders all options as radio buttons', () => {
    render(<SegmentedSwitch value="inbox" options={options} onChange={() => {}} />)
    expect(screen.getByRole('radio', {name: /inbox/i})).toBeInTheDocument()
    expect(screen.getByRole('radio', {name: /task/i})).toBeInTheDocument()
  })

  it('marks the active option with aria-checked', () => {
    render(<SegmentedSwitch value="task" options={options} onChange={() => {}} />)
    expect(screen.getByRole('radio', {name: /task/i})).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', {name: /inbox/i})).toHaveAttribute('aria-checked', 'false')
  })

  it('fires onChange when a different option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedSwitch value="inbox" options={options} onChange={onChange} />)
    await user.click(screen.getByRole('radio', {name: /task/i}))
    expect(onChange).toHaveBeenCalledWith('task')
  })

  it('sets --seg-count and --seg-index CSS vars for thumb positioning', () => {
    const {container} = render(
      <SegmentedSwitch value="task" options={options} onChange={() => {}} />,
    )
    const wrapper = container.querySelector('[role="radiogroup"]') as HTMLElement
    expect(wrapper.style.getPropertyValue('--seg-count')).toBe('2')
    expect(wrapper.style.getPropertyValue('--seg-index')).toBe('1')
  })
})
