import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {de} from 'date-fns/locale'
import {DatePicker} from './DatePicker'
import {UiI18nProvider} from '../i18n/context'
import {datePicker as datePickerDe} from '../i18n/de/datePicker'

describe('DatePicker', () => {
  it('renders the English default placeholder when value is null', () => {
    render(<DatePicker value={null} onChange={() => {}} />)
    expect(screen.getByText('Pick a date…')).toBeInTheDocument()
  })

  it('prefers the placeholder prop over labels', () => {
    render(
      <DatePicker value={null} onChange={() => {}} placeholder="Due date" labels={{placeholder: 'Ignored'}} />,
    )
    expect(screen.getByText('Due date')).toBeInTheDocument()
  })

  it('renders the formatted value when value is set (YYYY-MM-DD)', () => {
    render(<DatePicker value="2026-05-19" onChange={() => {}} />)
    // formatAbsoluteDate(..., 'list', 'en-US') → "May 19, 2026"
    expect(screen.getByRole('button', {name: /May 19, 2026/})).toBeInTheDocument()
  })

  it('overrides labels via the labels prop', async () => {
    const user = userEvent.setup()
    render(<DatePicker value={null} onChange={() => {}} labels={{today: 'Right now'}} />)
    await user.click(screen.getByRole('button'))
    expect(await screen.findByText('Right now')).toBeInTheDocument()
    expect(screen.getByText('Tomorrow')).toBeInTheDocument()
  })

  it('renders German labels and date format inside a German UiI18nProvider', async () => {
    const user = userEvent.setup()
    render(
      <UiI18nProvider locale="de-DE" dateLocale={de} messages={{datePicker: datePickerDe}}>
        <DatePicker value="2026-05-19" onChange={() => {}} />
      </UiI18nProvider>,
    )
    const trigger = screen.getByRole('button', {name: /19\. Mai 2026/})
    await user.click(trigger)
    expect(await screen.findByText('Heute')).toBeInTheDocument()
    expect(screen.getByText('Nächste Woche')).toBeInTheDocument()
    // Kalender-Caption in date-fns-de: "Mai 2026"
    expect(screen.getByText(/^Mai 2026$/)).toBeInTheDocument()
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
    // react-day-picker v9 rendert pro Tag einen Button; wir treffen den 20.
    // über den exakten Text.
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
    const clearButton = screen.getByRole('button', {name: 'Clear date'})
    await user.click(clearButton)
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('does not render the clear button when allowClear is false', () => {
    render(<DatePicker value="2026-05-19" onChange={() => {}} />)
    expect(screen.queryByRole('button', {name: 'Clear date'})).not.toBeInTheDocument()
  })

  it('does not render the clear button when value is null', () => {
    render(<DatePicker value={null} onChange={() => {}} allowClear />)
    expect(screen.queryByRole('button', {name: 'Clear date'})).not.toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<DatePicker value="2026-05-19" onChange={() => {}} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  // Regression: die Calendar-Nav-Chevrons sind `absolute top-0` positioniert.
  // In react-day-picker v9 sitzt die Nav als Sibling des Month (nicht mehr in
  // der Caption wie v8), also muss der `.rdp-root` selbst `position: relative`
  // tragen, sonst hängen sich die Buttons an den nächsten positionierten
  // Vorfahren (Radix PopoverContent) und überlappen die Shortcut-Liste oben.
  it('renders the calendar root as a positioning context for the nav buttons', async () => {
    const user = userEvent.setup()
    render(<DatePicker value="2026-05-19" onChange={() => {}} />)
    await user.click(screen.getByRole('button'))
    const grid = await screen.findByRole('grid')
    const root = grid.closest('.rdp-root')
    expect(root).not.toBeNull()
    expect(root).toHaveClass('relative')
  })
})
