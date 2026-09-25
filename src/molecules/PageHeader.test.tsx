import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {Plus} from '../atoms/icons'
import {renderWithProviders} from '../test/render'
import {PageHeader} from './PageHeader'

describe('PageHeader', () => {
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
    const button = screen.getByRole('button', {name: /Add/})
    expect(button).not.toHaveAttribute('data-testid')
    expect(button.querySelector('svg')).not.toBeNull()
    await user.click(button)
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('renders no action area without actions', () => {
    renderWithProviders(<PageHeader title='X' />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders leading and meta slots', () => {
    const {container} = renderWithProviders(
      <PageHeader title='Project' leading={<span>Glyph</span>} meta={<span>3 members</span>} />,
    )
    expect(container.querySelector('[data-slot="leading"]')).toHaveTextContent('Glyph')
    expect(container.querySelector('[data-slot="meta"]')).toHaveTextContent('3 members')
  })

  it('passes className and HTML attributes through to the root', () => {
    renderWithProviders(<PageHeader title='X' className='mb-4' data-testid='header' />)
    const root = screen.getByTestId('header')
    expect(root.className).toContain('mb-4')
    expect(root.className).not.toContain('mb-8')
  })
})
