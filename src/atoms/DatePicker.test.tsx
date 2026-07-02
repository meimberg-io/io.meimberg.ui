import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {DatePicker} from './DatePicker'

describe('DatePicker', () => {
  it('renders the placeholder when value is null', () => {
    render(
      <DatePicker value={null} onChange={() => {}} placeholder="Datum wählen…" />,
    )
    expect(screen.getByText('Datum wählen…')).toBeInTheDocument()
  })

  it('renders the formatted value when value is set (YYYY-MM-DD)', () => {
    render(<DatePicker value="2026-05-19" onChange={() => {}} />)
    // formatAbsoluteDate(..., 'list') uses de-DE Intl → "19. Mai 2026"
    expect(screen.getByRole('button', {name: /Mai 2026/})).toBeInTheDocument()
  })

  it('opens the calendar popover on trigger click', async () => {
    const user = userEvent.setup()
    render(<DatePicker value="2026-05-19" onChange={() => {}} />)
    await user.click(screen.getByRole('button'))
    // react-day-picker rendert <table role="grid">
    expect(await screen.findByRole('grid')).toBeInTheDocument()
  })

  it('calls onChange with YYYY-MM-DD when a day is picked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker value="2026-05-19" onChange={onChange} />)
    await user.click(screen.getByRole('button'))
    // react-day-picker v9 rendert pro Tag einen Button mit accessible name
    // = formattiertes Datum (z. B. "Wednesday, May 20th, 2026" in en oder
    // "Mittwoch, 20. Mai 2026" in de-DE). Wir treffen ihn über die Day-Zahl
    // im Namen und filtern den 20. von 21./22./… ab (Wort-Grenze).
    const grid = await screen.findByRole('grid')
    const dayButtons = grid.querySelectorAll('button')
    const day20 = Array.from(dayButtons).find(b => {
      const text = b.textContent?.trim()
      return text === '20'
    })
    expect(day20).toBeDefined()
    await user.click(day20!)
    expect(onChange).toHaveBeenCalled()
    const arg = onChange.mock.calls[0][0]
    expect(arg).toMatch(/^\d{4}-\d{2}-20$/)
  })

  it('shows a clear button when allowClear and value is set; fires onChange(null) on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker value="2026-05-19" onChange={onChange} allowClear />)
    const clearButton = screen.getByRole('button', {name: 'Datum löschen'})
    await user.click(clearButton)
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('does not render the clear button when allowClear is false', () => {
    render(<DatePicker value="2026-05-19" onChange={() => {}} />)
    expect(screen.queryByRole('button', {name: 'Datum löschen'})).not.toBeInTheDocument()
  })

  it('does not render the clear button when value is null', () => {
    render(<DatePicker value={null} onChange={() => {}} allowClear />)
    expect(screen.queryByRole('button', {name: 'Datum löschen'})).not.toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<DatePicker value="2026-05-19" onChange={() => {}} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
