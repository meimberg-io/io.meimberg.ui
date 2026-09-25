import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {renderWithProviders} from '../test/render'
import {FilterBar, type FilterField, type FilterBarValue} from './FilterBar'

describe('FilterBar', () => {
  it('renders a search input and forwards input', async () => {
    const onChange = vi.fn()
    const fields: FilterField[] = [{kind: 'search', key: 'q', placeholder: 'Search'}]
    renderWithProviders(<FilterBar fields={fields} value={{q: ''}} onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Search'), 'a')
    expect(onChange).toHaveBeenLastCalledWith({q: 'a'})
  })

  it('renders a select field with the all-label', () => {
    const onChange = vi.fn()
    const fields: FilterField[] = [
      {kind: 'select', key: 'status', label: 'Status', allLabel: 'All statuses', options: [{value: 'open', label: 'Open'}]},
    ]
    renderWithProviders(<FilterBar fields={fields} value={{status: null}} onChange={onChange} />)
    expect(screen.getByText('All statuses')).toBeInTheDocument()
  })

  it('renders a custom field via the render slot and wires its setter', async () => {
    const onChange = vi.fn()
    const fields: FilterField[] = [
      {
        kind: 'custom',
        key: 'ctx',
        render: (value, setValue) => (
          <button type="button" onClick={() => setValue('x')}>
            ctx:{String(value)}
          </button>
        ),
      },
    ]
    renderWithProviders(<FilterBar fields={fields} value={{ctx: null}} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', {name: /ctx:/}))
    expect(onChange).toHaveBeenCalledWith({ctx: 'x'})
  })

  it('renders a toggle field and emits boolean changes', async () => {
    const onChange = vi.fn()
    const fields: FilterField[] = [{kind: 'toggle', key: 'done', label: 'Show completed'}]
    renderWithProviders(<FilterBar fields={fields} value={{done: false} as FilterBarValue} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith({done: true})
  })

  it('renders a reset button when onReset is given and calls it on click', async () => {
    const onReset = vi.fn()
    renderWithProviders(<FilterBar fields={[]} value={{}} onChange={vi.fn()} onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', {name: /Reset filters/}))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('renders custom actions in the actions slot', () => {
    renderWithProviders(<FilterBar fields={[]} value={{}} onChange={vi.fn()} actions={<button>New</button>} />)
    expect(screen.getByRole('button', {name: 'New'})).toBeInTheDocument()
  })

  it('overrides the reset label via the labels prop', () => {
    renderWithProviders(<FilterBar fields={[]} value={{}} onChange={vi.fn()} onReset={vi.fn()} labels={{reset: 'Clear'}} />)
    expect(screen.getByRole('button', {name: 'Clear'})).toBeInTheDocument()
  })
})
