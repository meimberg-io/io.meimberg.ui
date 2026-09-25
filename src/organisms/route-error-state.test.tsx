import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../test/render'
import { RouteErrorState } from './route-error-state'

describe('RouteErrorState', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Component logs the error via console.error in a useEffect by design;
    // silence it in tests so the suite output stays clean.
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('renders the default title and description', () => {
    renderWithProviders(
      <RouteErrorState error={new Error('boom')} reset={vi.fn()} />,
    )
    expect(screen.getByRole('heading', { name: /Something went wrong/ })).toBeInTheDocument()
    expect(screen.getByText(/The page could not be loaded/)).toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error))
  })

  it('calls reset when the action button is clicked', async () => {
    const reset = vi.fn()
    renderWithProviders(
      <RouteErrorState error={new Error('boom')} reset={reset} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Try again/ }))
    expect(reset).toHaveBeenCalledOnce()
  })

  it('overrides labels via the labels prop', () => {
    renderWithProviders(
      <RouteErrorState error={new Error('boom')} reset={vi.fn()} labels={{ title: 'Oops', retry: 'Reload' }} />,
    )
    expect(screen.getByRole('heading', { name: 'Oops' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('merges className on the root', () => {
    renderWithProviders(
      <RouteErrorState error={new Error('boom')} reset={vi.fn()} className='py-8' />,
    )
    const root = screen.getByRole('heading').parentElement!
    expect(root.className).toContain('py-8')
    expect(root.className).not.toContain('py-16')
  })
})
