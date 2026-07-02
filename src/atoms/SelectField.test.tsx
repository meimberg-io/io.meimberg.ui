import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {SelectField, type SelectFieldOption} from './SelectField'

type Stage = 'seed' | 'sprout' | 'cluster'
const OPTIONS: ReadonlyArray<SelectFieldOption<Stage>> = [
  {value: 'seed', label: 'Seeds'},
  {value: 'sprout', label: 'Sprouts'},
  {value: 'cluster', label: 'Clusters', disabled: true},
]

describe('SelectField', () => {
  it('renders the placeholder when value is null', () => {
    render(
      <SelectField<Stage>
        value={null}
        options={OPTIONS}
        onChange={() => {}}
        placeholder="Stage wählen"
      />,
    )
    expect(screen.getByText('Stage wählen')).toBeInTheDocument()
  })

  it('renders the selected option label in the trigger', () => {
    render(<SelectField<Stage> value="sprout" options={OPTIONS} onChange={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Sprouts')
  })

  it('fires onChange with the new value when an option is picked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SelectField<Stage> value="seed" options={OPTIONS} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', {name: 'Sprouts'}))
    expect(onChange).toHaveBeenCalledWith('sprout')
  })

  it('does not fire onChange for a disabled option (click is no-op)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SelectField<Stage> value="seed" options={OPTIONS} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    const disabled = await screen.findByRole('option', {name: 'Clusters'})
    expect(disabled).toHaveAttribute('data-disabled')
    // Radix unterdrückt den Click intern — onChange darf nicht feuern.
    await user.click(disabled)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('respects disabled prop on the trigger', () => {
    render(<SelectField<Stage> value="seed" options={OPTIONS} onChange={() => {}} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('renders sm size with h-8 class', () => {
    render(
      <SelectField<Stage> value="seed" options={OPTIONS} onChange={() => {}} size="sm" />,
    )
    expect(screen.getByRole('combobox')).toHaveClass('h-8')
  })
})
