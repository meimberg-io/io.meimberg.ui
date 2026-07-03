import {describe, expect, it, vi, beforeEach} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {ThemeToggle} from './ThemeToggle'

// next-themes mocken: volle Kontrolle über `theme` und `setTheme`.
// Der echte ThemeProvider in `renderWithProviders` wird durch unseren Mock
// überlagert (Hook-Aufrufe gehen an `vi.fn()`).
const setTheme = vi.fn()
let mockedTheme: 'light' | 'dark' | 'system' | undefined = 'system'

vi.mock('next-themes', () => ({
  useTheme: () => ({theme: mockedTheme, setTheme}),
  ThemeProvider: ({children}: {children: React.ReactNode}) => children,
}))

beforeEach(() => {
  setTheme.mockClear()
  mockedTheme = 'system'
})

describe('ThemeToggle', () => {
  it('rendert nach Mount drei Segmente Light / Dark / System', async () => {
    renderWithProviders(<ThemeToggle />)
    const light = await screen.findByRole('radio', {name: /Light Mode/})
    expect(light).toBeTruthy()
    expect(screen.getByRole('radio', {name: /Dark Mode/})).toBeTruthy()
    expect(screen.getByRole('radio', {name: /System/})).toBeTruthy()
  })

  it('markiert das aktive Segment gemäß `theme`', async () => {
    mockedTheme = 'dark'
    renderWithProviders(<ThemeToggle />)
    const dark = await screen.findByRole('radio', {name: /Dark Mode/})
    expect(dark.getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('radio', {name: /Light Mode/}).getAttribute('aria-checked')).toBe('false')
  })

  it('behandelt undefined `theme` als "system"', async () => {
    mockedTheme = undefined
    renderWithProviders(<ThemeToggle />)
    const system = await screen.findByRole('radio', {name: /System/})
    expect(system.getAttribute('aria-checked')).toBe('true')
  })

  it('Klick auf ein Segment ruft setTheme mit dem Wert auf', async () => {
    mockedTheme = 'system'
    const {user} = renderWithProviders(<ThemeToggle />)
    await user.click(await screen.findByRole('radio', {name: /Light Mode/}))
    expect(setTheme).toHaveBeenCalledWith('light')
    await user.click(screen.getByRole('radio', {name: /Dark Mode/}))
    expect(setTheme).toHaveBeenCalledWith('dark')
    await user.click(screen.getByRole('radio', {name: /System/}))
    expect(setTheme).toHaveBeenCalledWith('system')
  })

  it('Segmente sind klickbar (cursor-pointer)', async () => {
    renderWithProviders(<ThemeToggle />)
    const light = await screen.findByRole('radio', {name: /Light Mode/})
    expect(light.className).toContain('cursor-pointer')
  })
})
