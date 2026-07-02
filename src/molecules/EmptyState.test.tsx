import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {Inbox} from '../atoms/icons'
import {renderWithProviders} from '../test/render'
import {EmptyState} from './EmptyState'

describe('EmptyState — smoke', () => {
  it('renders title and description', () => {
    renderWithProviders(
      <EmptyState icon={Inbox} title='No items' description='Add your first one' />,
    )
    expect(screen.getByRole('heading', {name: 'No items'})).toBeInTheDocument()
    expect(screen.getByText('Add your first one')).toBeInTheDocument()
  })

  it('renders the action button only when actionLabel + onAction are given', async () => {
    const onAction = vi.fn()
    const {user} = renderWithProviders(
      <EmptyState
        icon={Inbox}
        title='Empty'
        description='Add'
        actionLabel='Add new'
        onAction={onAction}
      />,
    )
    await user.click(screen.getByRole('button', {name: /Add new/}))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('hides the action button when onAction is missing', () => {
    renderWithProviders(<EmptyState icon={Inbox} title='Empty' description='Add' />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
