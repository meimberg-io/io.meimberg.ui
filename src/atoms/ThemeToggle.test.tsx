import {describe, expect, it, vi, beforeEach} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {ThemeToggle} from './ThemeToggle'

// next-themes mocken: voller Kontrolle über `resolvedTheme` und `setTheme`.
// Der echte ThemeProvider in `renderWithProviders` wird durch unseren Mock
// überlagert (Hook-Aufrufe gehen an `vi.fn()`).
const setTheme = vi.fn()
let mockedTheme: 'light' | 'dark' = 'light'

vi.mock('next-themes', () => ({
  useTheme: () => ({resolvedTheme: mockedTheme, setTheme}),
  ThemeProvider: ({children}: {children: React.ReactNode}) => children,
}))

beforeEach(() => {
  setTheme.mockClear()
  mockedTheme = 'light'
})

describe('ThemeToggle', () => {
  it('rendert nach Mount den Moon-Icon-Button im Light-Mode', async () => {
    mockedTheme = 'light'
    renderWithProviders(<ThemeToggle />)
    const btn = await screen.findByRole('button', {name: /Dark Mode wechseln/})
    expect(btn).toBeTruthy()
    expect(btn.querySelector('svg')).toBeTruthy()
  })

  it('rendert nach Mount den Sun-Icon-Button im Dark-Mode', async () => {
    mockedTheme = 'dark'
    renderWithProviders(<ThemeToggle />)
    const btn = await screen.findByRole('button', {name: /Light Mode wechseln/})
    expect(btn).toBeTruthy()
  })

  it('Klick im Light-Mode ruft setTheme("dark") auf', async () => {
    mockedTheme = 'light'
    const {user} = renderWithProviders(<ThemeToggle />)
    const btn = await screen.findByRole('button', {name: /Dark Mode wechseln/})
    await user.click(btn)
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('Klick im Dark-Mode ruft setTheme("light") auf', async () => {
    mockedTheme = 'dark'
    const {user} = renderWithProviders(<ThemeToggle />)
    const btn = await screen.findByRole('button', {name: /Light Mode wechseln/})
    await user.click(btn)
    expect(setTheme).toHaveBeenCalledWith('light')
  })

  it('cursor-pointer ist in der Komponente verankert', async () => {
    renderWithProviders(<ThemeToggle />)
    const btn = await screen.findByRole('button', {name: /Mode wechseln/})
    expect(btn.className).toContain('cursor-pointer')
  })
})
