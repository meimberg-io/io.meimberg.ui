import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {KpiTile, type KpiTone} from './KpiTile'
import {Inbox} from '../atoms/icons'
import {UiI18nProvider} from '../i18n/context'
import {kpiTile as kpiTileDe} from '../i18n/de/kpiTile'

const delta = (container: HTMLElement) => container.querySelector('[data-slot="delta"]') as HTMLElement

const baseProps = {
  label: 'OPEN',
  value: 42,
  sparklineValues: [3, 5, 4, 8, 6, 9, 12, 10, 11, 8, 7, 9, 11, 14],
  delta: {value: 4, direction: 'up' as const, isPositive: true},
}

describe('KpiTile', () => {
  it('renders label and value', () => {
    render(<KpiTile {...baseProps} />)
    expect(screen.getByText('OPEN')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders sublabel when provided', () => {
    render(<KpiTile {...baseProps} sublabel="Tasks" />)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  it('renders delta with sign', () => {
    const {container} = render(<KpiTile {...baseProps} />)
    const d = delta(container)
    expect(d.textContent).toContain('+4')
    expect(d.textContent).toContain('vs. previous period')
  })

  it('renders flat-delta as placeholder text', () => {
    const {container} = render(
      <KpiTile
        {...baseProps}
        delta={{value: 0, direction: 'flat', isPositive: false}}
      />,
    )
    expect(delta(container).textContent).toContain('—')
  })

  it('renders all tones via data-attribute', () => {
    const tones: KpiTone[] = ['neutral', 'success', 'warning', 'destructive']
    for (const tone of tones) {
      const {unmount} = render(<KpiTile {...baseProps} tone={tone} data-testid="kpi" />)
      expect(screen.getByTestId('kpi').getAttribute('data-tone')).toBe(tone)
      unmount()
    }
  })

  it('skips sparkline when fewer than 2 values', () => {
    const {container} = render(<KpiTile {...baseProps} sparklineValues={[5]} />)
    expect(container.querySelector('polyline')).toBeNull()
  })

  it('accepts string values', () => {
    render(<KpiTile label="Rate" value="87 %" />)
    expect(screen.getByText('87 %')).toBeInTheDocument()
  })

  it('renders without sparkline and without delta (both optional)', () => {
    const {container} = render(<KpiTile label="Projects" value={4} />)
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('[data-slot="delta"]')).toBeNull()
  })

  it('renders the icon component at 12 px in the tone chip', () => {
    const {container} = render(<KpiTile label="Projects" value={4} icon={Inbox} />)
    const icon = container.querySelector('svg')
    expect(icon).not.toBeNull()
    expect(icon!.getAttribute('class')).toContain('size-3')
    expect(icon!.parentElement!.className).toContain('rounded-md')
  })

  it('accent takes precedence over icon in the chip slot', () => {
    const {container} = render(
      <KpiTile
        label="Tasks"
        value={4}
        icon={Inbox}
        accent={<span data-testid="kpi-accent" />}
      />,
    )
    expect(container.querySelector('[data-testid="kpi-accent"]')).not.toBeNull()
    expect(container.querySelector('svg')).toBeNull()
  })

  it('variant="emphasis" applies the success ring', () => {
    const {container} = render(
      <KpiTile label="Active" value={3} variant="emphasis" />,
    )
    const tile = container.firstElementChild as HTMLElement
    expect(tile.className).toContain('ring-success/30')
    expect(tile.getAttribute('data-variant')).toBe('emphasis')
  })

  it('variant="muted" greys the value and hides the sparkline', () => {
    const {container} = render(
      <KpiTile
        label="Done"
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
    const {container} = render(
      <KpiTile
        label="OPEN"
        value={1}
        delta={{value: 1, direction: 'up'}}
      />,
    )
    expect(delta(container).className).toContain('text-success')
  })

  it('labels prop overrides the comparison text', () => {
    const {container} = render(<KpiTile {...baseProps} labels={{comparison: 'vs. last month'}} />)
    expect(delta(container).textContent).toContain('vs. last month')
  })

  it('reads German labels from UiI18nProvider', () => {
    const {container} = render(
      <UiI18nProvider messages={{kpiTile: kpiTileDe}}>
        <KpiTile {...baseProps} />
      </UiI18nProvider>,
    )
    expect(delta(container).textContent).toContain('vs. letzte Woche')
  })

  it('wires no test ids by default and passes data-testid through to the root', () => {
    const {container, rerender} = render(<KpiTile {...baseProps} />)
    expect(container.querySelector('[data-testid]')).toBeNull()
    rerender(<KpiTile {...baseProps} data-testid="revenue-kpi" />)
    expect(screen.getByTestId('revenue-kpi')).toBe(container.firstElementChild)
  })
})
