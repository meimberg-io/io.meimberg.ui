import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {Plus} from '../atoms/icons'
import {renderWithProviders} from '../test/render'
import {PageHeader} from './PageHeader'

describe('PageHeader — smoke', () => {
  it('renders the title', () => {
    renderWithProviders(<PageHeader title='My page' />)
    expect(screen.getByRole('heading', {name: 'My page'})).toBeInTheDocument()
  })

  it('renders the description', () => {
    renderWithProviders(<PageHeader title='X' description='A description' />)
    expect(screen.getByText('A description')).toBeInTheDocument()
  })

  it('renders the action button when actionLabel + onAction are given', async () => {
    const onAction = vi.fn()
    const {user} = renderWithProviders(
      <PageHeader title='X' actionLabel='Add' actionIcon={Plus} onAction={onAction} />,
    )
    await user.click(screen.getByRole('button', {name: /Add/}))
    expect(onAction).toHaveBeenCalledOnce()
  })
})
