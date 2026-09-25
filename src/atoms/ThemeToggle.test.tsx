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
  it('renders three segments Light / Dark / System after mount', async () => {
    renderWithProviders(<ThemeToggle />)
    const light = await screen.findByRole('radio', {name: /Light mode/})
    expect(light).toBeTruthy()
    expect(screen.getByRole('radio', {name: /Dark mode/})).toBeTruthy()
    expect(screen.getByRole('radio', {name: /System/})).toBeTruthy()
  })

  it('marks the active segment according to `theme`', async () => {
    mockedTheme = 'dark'
    renderWithProviders(<ThemeToggle />)
    const dark = await screen.findByRole('radio', {name: /Dark mode/})
    expect(dark.getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('radio', {name: /Light mode/}).getAttribute('aria-checked')).toBe('false')
  })

  it('treats undefined `theme` as "system"', async () => {
    mockedTheme = undefined
    renderWithProviders(<ThemeToggle />)
    const system = await screen.findByRole('radio', {name: /System/})
    expect(system.getAttribute('aria-checked')).toBe('true')
  })

  it('clicking a segment calls setTheme with its value', async () => {
    mockedTheme = 'system'
    const {user} = renderWithProviders(<ThemeToggle />)
    await user.click(await screen.findByRole('radio', {name: /Light mode/}))
    expect(setTheme).toHaveBeenCalledWith('light')
    await user.click(screen.getByRole('radio', {name: /Dark mode/}))
    expect(setTheme).toHaveBeenCalledWith('dark')
    await user.click(screen.getByRole('radio', {name: /System/}))
    expect(setTheme).toHaveBeenCalledWith('system')
  })

  it('segments are clickable (cursor-pointer)', async () => {
    renderWithProviders(<ThemeToggle />)
    const light = await screen.findByRole('radio', {name: /Light mode/})
    expect(light.className).toContain('cursor-pointer')
  })

  it('overrides labels via the labels prop', async () => {
    renderWithProviders(<ThemeToggle labels={{dark: 'Night'}} />)
    expect(await screen.findByRole('radio', {name: 'Night'})).toBeTruthy()
  })
})
