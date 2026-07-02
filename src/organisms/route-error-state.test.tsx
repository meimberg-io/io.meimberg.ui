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

  it('renders the German title and description', () => {
    renderWithProviders(
      <RouteErrorState error={new Error('boom')} reset={vi.fn()} />,
    )
    expect(screen.getByRole('heading', { name: /Etwas ist schiefgegangen/ })).toBeInTheDocument()
    expect(screen.getByText(/Die Seite konnte nicht geladen werden/)).toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error))
  })

  it('calls reset when the action button is clicked', async () => {
    const reset = vi.fn()
    renderWithProviders(
      <RouteErrorState error={new Error('boom')} reset={reset} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Erneut laden/ }))
    expect(reset).toHaveBeenCalledOnce()
  })
})
