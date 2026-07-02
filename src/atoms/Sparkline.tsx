import type {SVGProps} from 'react'

export interface SparklineProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'fill' | 'values'> {
  /** Daten-Reihe. Mindestens 2 Werte. */
  values: number[]
  /** Strich- und (falls `fill`) Flächenfarbe. CSS-Color-String. Default: `currentColor`. */
  color?: string
  /** SVG-Breite in px. Default: 120. */
  width?: number
  /** SVG-Höhe in px. Default: 36. */
  height?: number
  /** Wenn `true`, zeichnet eine 12 %-getintete Fläche unter der Linie. Default: `true`. */
  fill?: boolean
}

/**
 * Pulse-Sparkline-Atom — minimale SVG-Linie für Trend-Visualisierungen in
 * KPI-Tiles und ProjectCards.
 *
 * Hover/Tooltip/Achsen sind bewusst **nicht** Teil von R-01 — kommen in F-01
 * (KPI-Strip) dazu, wenn echter Bedarf besteht.
 *
 * @example
 *   <Sparkline values={[3, 5, 4, 8, 6, 9]} />
 *   <Sparkline values={data} color="hsl(var(--success))" width={88} height={32} fill={false} />
 */
export function Sparkline({
  values,
  color = 'currentColor',
  width = 120,
  height = 36,
  fill = true,
  ...rest
}: SparklineProps) {
  if (values.length < 2) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden {...rest} />
    )
  }

  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const stepX = width / (values.length - 1)
  const points = values.map((v, i): [number, number] => [
    i * stepX,
    height - ((v - min) / range) * (height - 4) - 2,
  ])
  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className="block"
      {...rest}
    >
      {fill ? <path d={area} fill={color} fillOpacity="0.12" /> : null}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
