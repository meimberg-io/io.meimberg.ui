import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ItemActionsMenu} from './ItemActionsMenu'
import {DropdownMenuItem} from '../ui/dropdown-menu'

describe('ItemActionsMenu', () => {
  it('renders the trigger with the English default label and no test id', () => {
    render(
      <ItemActionsMenu>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    expect(screen.getByRole('button', {name: 'Actions'})).not.toHaveAttribute('data-testid')
  })

  it('passes data-testid and className through to the trigger', () => {
    render(
      <ItemActionsMenu data-testid="row-actions" className="ml-auto">
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    const trigger = screen.getByTestId('row-actions')
    expect(trigger).toBe(screen.getByRole('button', {name: 'Actions'}))
    expect(trigger.className).toContain('ml-auto')
  })

  it('defaults to size sm and accepts the control scale', () => {
    const {rerender} = render(
      <ItemActionsMenu>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    expect(screen.getByRole('button').className).toContain('size-8')
    rerender(
      <ItemActionsMenu size="xs">
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    expect(screen.getByRole('button').className).toContain('size-6.5')
  })

  it('opens the menu content', async () => {
    const user = userEvent.setup()
    render(
      <ItemActionsMenu>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    await user.click(screen.getByRole('button', {name: 'Actions'}))
    expect(await screen.findByRole('menuitem', {name: 'Edit'})).toBeInTheDocument()
  })

  it('labels prop overrides the trigger label', () => {
    render(
      <ItemActionsMenu labels={{trigger: 'More options'}}>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    expect(screen.getByRole('button', {name: 'More options'})).toBeInTheDocument()
  })

  it('ariaLabel takes precedence over labels', () => {
    render(
      <ItemActionsMenu ariaLabel="Row actions" labels={{trigger: 'More options'}}>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </ItemActionsMenu>,
    )
    expect(screen.getByRole('button', {name: 'Row actions'})).toBeInTheDocument()
  })
})
