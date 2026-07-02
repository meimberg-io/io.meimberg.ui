import type {SVGProps} from 'react'

export interface DonutSegment {
  /** Anteil-Wert (numeric, beliebige Einheit — Summe wird normiert). */
  value: number
  /** Segment-Farbe als CSS-Color-String. */
  color: string
}

export interface DonutProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  segments: DonutSegment[]
  /** Quadratische Größe in px. Default: 64. */
  size?: number
  /** Strich-Dicke in px. Default: 8. */
  strokeWidth?: number
}

/**
 * Pulse-Donut-Atom — minimaler SVG-Donut für kleine Verteilungs-Visualisierungen
 * (Prio-Verteilung, Status-Anteile).
 *
 * Pure Geometrie — Legend, Label, Hover-Tooltip kommen in F-04 dazu.
 *
 * @example
 *   <Donut segments={[
 *     { value: 4, color: 'hsl(var(--p1))' },
 *     { value: 6, color: 'hsl(var(--p2))' },
 *     { value: 12, color: 'hsl(var(--p3))' },
 *   ]} />
 */
export function Donut({
  segments,
  size = 64,
  strokeWidth = 8,
  ...rest
}: DonutProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  const cx = size / 2
  const cy = size / 2
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r

  if (total <= 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden {...rest}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }

  // Cumulative offset pro Segment ohne Mutation (react-hooks/immutability).
  const offsets = segments.reduce<number[]>((acc, seg) => {
    const prev = acc[acc.length - 1] ?? 0
    return [...acc, prev + (seg.value / total) * circumference]
  }, [0])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{transform: 'rotate(-90deg)'}}
      {...rest}
    >
      {segments.map((seg, i) => {
        const fraction = seg.value / total
        const dash = fraction * circumference
        const gap = circumference - dash
        const dashOffset = -offsets[i]
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={dashOffset}
          />
        )
      })}
    </svg>
  )
}
