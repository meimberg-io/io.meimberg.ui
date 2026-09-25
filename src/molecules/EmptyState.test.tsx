import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {Inbox} from '../atoms/icons'
import {renderWithUi} from '../testing'
import {EmptyState} from './EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    renderWithUi(
      <EmptyState icon={Inbox} title='No items' description='Add your first one' />,
    )
    expect(screen.getByRole('heading', {name: 'No items'})).toBeInTheDocument()
    expect(screen.getByText('Add your first one')).toBeInTheDocument()
  })

  it('renders the action button only when actionLabel + onAction are given', async () => {
    const onAction = vi.fn()
    const {user} = renderWithUi(
      <EmptyState icon={Inbox} title='Empty' description='Add' actionLabel='Add new' onAction={onAction} />,
    )
    const button = screen.getByRole('button', {name: /Add new/})
    expect(button).not.toHaveAttribute('data-testid')
    await user.click(button)
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('hides the action button when onAction is missing', () => {
    renderWithUi(<EmptyState icon={Inbox} title='Empty' description='Add' />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('the action slot wins over actionLabel/onAction', () => {
    renderWithUi(
      <EmptyState title='Empty' description='Add' actionLabel='Add' onAction={vi.fn()} action={<a href='/new'>Create</a>} />,
    )
    expect(screen.getByRole('link', {name: 'Create'})).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('variant defaults to plain; dashed renders the dashed frame', () => {
    const {rerender} = renderWithUi(<EmptyState data-testid='empty' title='T' description='D' />)
    expect(screen.getByTestId('empty').className).not.toContain('border-dashed')
    rerender(<EmptyState data-testid='empty' variant='dashed' title='T' description='D' />)
    expect(screen.getByTestId('empty').className).toContain('border-dashed')
  })

  it('merges className on both variants', () => {
    const {rerender} = renderWithUi(<EmptyState data-testid='empty' className='py-8' title='T' description='D' />)
    expect(screen.getByTestId('empty').className).toContain('py-8')
    rerender(<EmptyState data-testid='empty' variant='dashed' className='p-6' title='T' description='D' />)
    expect(screen.getByTestId('empty').className).toContain('p-6')
    expect(screen.getByTestId('empty').className).not.toContain('p-12')
  })
})
