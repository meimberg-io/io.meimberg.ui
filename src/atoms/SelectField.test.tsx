import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {SelectField, type SelectFieldOption} from './SelectField'

type Status = 'draft' | 'review' | 'published'
const OPTIONS: ReadonlyArray<SelectFieldOption<Status>> = [
  {value: 'draft', label: 'Draft'},
  {value: 'review', label: 'In review'},
  {value: 'published', label: 'Published', disabled: true},
]

describe('SelectField', () => {
  it('renders the placeholder when value is null', () => {
    render(
      <SelectField<Status>
        value={null}
        options={OPTIONS}
        onChange={() => {}}
        placeholder="Select status"
      />,
    )
    expect(screen.getByText('Select status')).toBeInTheDocument()
  })

  it('renders the selected option label in the trigger', () => {
    render(<SelectField<Status> value="review" options={OPTIONS} onChange={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('In review')
  })

  it('fires onChange with the new value when an option is picked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SelectField<Status> value="draft" options={OPTIONS} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', {name: 'In review'}))
    expect(onChange).toHaveBeenCalledWith('review')
  })

  it('does not fire onChange for a disabled option (click is no-op)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SelectField<Status> value="draft" options={OPTIONS} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    const disabled = await screen.findByRole('option', {name: 'Published'})
    expect(disabled).toHaveAttribute('data-disabled')
    // Radix unterdrückt den Click intern — onChange darf nicht feuern.
    await user.click(disabled)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('respects disabled prop on the trigger', () => {
    render(<SelectField<Status> value="draft" options={OPTIONS} onChange={() => {}} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('renders sm size with h-8 class', () => {
    render(
      <SelectField<Status> value="draft" options={OPTIONS} onChange={() => {}} size="sm" />,
    )
    expect(screen.getByRole('combobox')).toHaveClass('h-8')
  })
})
