import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {SelectedItemsBar} from './SelectedItemsBar'

describe('SelectedItemsBar', () => {
  it('renders English default labels and the items', () => {
    render(
      <SelectedItemsBar onClearAll={() => {}}>
        <span>design</span>
      </SelectedItemsBar>,
    )
    expect(screen.getByText('Selected:')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /Clear all/})).toBeInTheDocument()
    expect(screen.getByText('design')).toBeInTheDocument()
  })

  it('fires onClearAll', async () => {
    const user = userEvent.setup()
    const onClearAll = vi.fn()
    render(
      <SelectedItemsBar onClearAll={onClearAll}>
        <span>design</span>
      </SelectedItemsBar>,
    )
    await user.click(screen.getByRole('button'))
    expect(onClearAll).toHaveBeenCalledOnce()
  })

  it('labels prop overrides the defaults', () => {
    render(
      <SelectedItemsBar onClearAll={() => {}} labels={{selected: 'Filters:', clearAll: 'Reset'}}>
        <span>x</span>
      </SelectedItemsBar>,
    )
    expect(screen.getByText('Filters:')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /Reset/})).toBeInTheDocument()
  })

  it('specific props take precedence over labels', () => {
    render(
      <SelectedItemsBar
        onClearAll={() => {}}
        label="Tags:"
        clearLabel="Remove tags"
        labels={{selected: 'Filters:', clearAll: 'Reset'}}
      >
        <span>x</span>
      </SelectedItemsBar>,
    )
    expect(screen.getByText('Tags:')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /Remove tags/})).toBeInTheDocument()
  })
})
