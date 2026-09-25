import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Dropdown} from './Dropdown'

const OPTIONS = [
  {value: 'open', label: 'Open'},
  {value: 'done', label: 'Done'},
]

describe('Dropdown', () => {
  it('prefixes the aria-label with allLabel when a value is selected', () => {
    render(<Dropdown value="open" onChange={() => {}} options={OPTIONS} allLabel="All statuses" />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'All statuses: Open')
  })

  it('uses only the selected label as aria-label without allLabel', () => {
    render(<Dropdown value="done" onChange={() => {}} options={OPTIONS} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Done')
  })

  it('does not set an empty aria-label without allLabel and selection', () => {
    render(<Dropdown value={null} onChange={() => {}} options={OPTIONS} placeholder="Status" />)
    const trigger = screen.getByRole('combobox')
    expect(trigger).not.toHaveAttribute('aria-label')
    expect(trigger).toHaveTextContent('Status')
  })
})
