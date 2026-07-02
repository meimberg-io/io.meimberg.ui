import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {KpiTile} from './KpiTile'

// PUL-326/PUL-361 · Konsolidiertes KpiTile-Atom Smoke-Tests.

const baseProps = {
  label: 'OFFEN',
  value: 42,
  sparklineValues: [3, 5, 4, 8, 6, 9, 12, 10, 11, 8, 7, 9, 11, 14],
  delta: {value: 4, direction: 'up' as const, isPositive: true},
}

describe('KpiTile', () => {
  it('renders label and value', () => {
    render(<KpiTile {...baseProps} />)
    expect(screen.getByText('OFFEN')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders sublabel when provided', () => {
    render(<KpiTile {...baseProps} sublabel="Tasks" />)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  it('renders delta with sign', () => {
    render(<KpiTile {...baseProps} />)
    const delta = screen.getByTestId('kpi-tile-delta')
    expect(delta.textContent).toContain('+4')
    expect(delta.textContent).toContain('vs. letzte Woche')
  })

  it('renders flat-delta as placeholder text', () => {
    render(
      <KpiTile
        {...baseProps}
        delta={{value: 0, direction: 'flat', isPositive: false}}
      />,
    )
    expect(screen.getByTestId('kpi-tile-delta').textContent).toContain('—')
  })

  it('renders all tones via data-attribute', () => {
    const tones: Array<'neutral' | 'success' | 'warn' | 'danger'> = [
      'neutral',
      'success',
      'warn',
      'danger',
    ]
    for (const tone of tones) {
      const {unmount} = render(<KpiTile {...baseProps} tone={tone} />)
      expect(screen.getByTestId('kpi-tile').getAttribute('data-tone')).toBe(tone)
      unmount()
    }
  })

  it('skips sparkline when fewer than 2 values', () => {
    const {container} = render(<KpiTile {...baseProps} sparklineValues={[5]} />)
    expect(container.querySelector('polyline')).toBeNull()
  })

  // PUL-361 — neue API-Aspekte.

  it('accepts string values', () => {
    render(<KpiTile label="Quote" value="87 %" />)
    expect(screen.getByText('87 %')).toBeInTheDocument()
  })

  it('renders without sparkline and without delta (both optional)', () => {
    const {container} = render(<KpiTile label="Buckets" value={4} />)
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('[data-testid="kpi-tile-delta"]')).toBeNull()
  })

  it('renders icon chip when icon is provided', () => {
    const {container} = render(
      <KpiTile
        label="Buckets"
        value={4}
        icon={<svg data-testid="kpi-icon" />}
      />,
    )
    const icon = container.querySelector('[data-testid="kpi-icon"]')
    expect(icon).not.toBeNull()
    expect(icon!.parentElement!.className).toContain('rounded-md')
  })

  it('accent takes precedence over icon in the chip slot', () => {
    const {container} = render(
      <KpiTile
        label="Tasks"
        value={4}
        icon={<svg data-testid="kpi-icon" />}
        accent={<svg data-testid="kpi-accent" />}
      />,
    )
    expect(container.querySelector('[data-testid="kpi-accent"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="kpi-icon"]')).toBeNull()
  })

  it('variant="emphasis" applies the success ring', () => {
    const {container} = render(
      <KpiTile label="Aktiv" value={3} variant="emphasis" />,
    )
    const tile = container.querySelector('[data-testid="kpi-tile"]') as HTMLElement
    expect(tile.className).toContain('ring-success/30')
    expect(tile.getAttribute('data-variant')).toBe('emphasis')
  })

  it('variant="muted" greys the value and hides the sparkline', () => {
    const {container} = render(
      <KpiTile
        label="Erledigt"
        value={9}
        variant="muted"
        sparklineValues={[1, 2, 3]}
      />,
    )
    expect(container.querySelector('svg')).toBeNull()
    const valueEl = container.querySelector(
      'span.tabular-nums.font-semibold',
    ) as HTMLElement
    expect(valueEl.textContent).toBe('9')
    expect(valueEl.className).toContain('text-muted-foreground')
  })

  it('delta.isPositive defaults to direction==="up"', () => {
    render(
      <KpiTile
        label="OFFEN"
        value={1}
        delta={{value: 1, direction: 'up'}}
      />,
    )
    const delta = screen.getByTestId('kpi-tile-delta')
    expect(delta.className).toContain('text-success')
  })
})
