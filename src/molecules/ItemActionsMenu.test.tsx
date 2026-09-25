import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {ItemActionsMenu} from './ItemActionsMenu'
import {DropdownMenuItem} from '../ui/dropdown-menu'

describe('ItemActionsMenu', () => {
  it('renders the trigger with the English default label', () => {
    render(
      <ItemActionsMenu testId="row-actions">
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    expect(screen.getByRole('button', {name: 'Actions'})).toHaveAttribute('data-testid', 'row-actions')
  })

  it('labels prop overrides the trigger label', () => {
    render(
      <ItemActionsMenu testId="row-actions" labels={{trigger: 'More options'}}>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    expect(screen.getByRole('button', {name: 'More options'})).toBeInTheDocument()
  })

  it('ariaLabel takes precedence over labels', () => {
    render(
      <ItemActionsMenu testId="row-actions" ariaLabel="Row actions" labels={{trigger: 'More options'}}>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    expect(screen.getByRole('button', {name: 'Row actions'})).toBeInTheDocument()
  })
})
