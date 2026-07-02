'use client'

// PUL-352 / PUL-462 · SelectableTile — horizontale Mini-Card mit Icon-Slab links und
// Label rechts. Aktiv: Primary-Border + 3px Glow + Checkmark-Pille. Quelle:
// docs/frontend/redesign/source/v3/mission/Buckets.html § .prov-tile.
//
// Generisch über `glyph`-Slot — Konsumenten füllen den Icon-Slab mit dem
// passenden Glyph (z. B. Pulse: `<ProviderGlyph provider="jira" />`).

import type {ReactNode} from 'react'

interface Props {
  /** Label rechts vom Icon. */
  label: ReactNode
  /** Inhalt des Icon-Slabs (50px breit, full-height, randlos). */
  glyph: ReactNode
  /** Optional: Hintergrundfarbe für den Icon-Slab (Brand-Color). Wenn nicht
   *  gesetzt, transparent. Akzeptiert jeden CSS color-Wert. */
  glyphBackground?: string
  /** Optional: Textfarbe innerhalb des Icon-Slabs (default: inherit). */
  glyphColor?: string
  active: boolean
  onClick: () => void
  disabled?: boolean
  title?: string
  /** Test-Hook, z. B. `bucket-provider-jira`. */
  'data-testid'?: string
}

export function SelectableTile({
  label,
  glyph,
  glyphBackground,
  glyphColor,
  active,
  onClick,
  disabled,
  title,
  'data-testid': testId,
}: Props) {
  return (
    <button
      type="button"
      data-on={active}
      data-disabled={disabled || undefined}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      title={title}
      // PUL-420 (G5): Look inline gekapselt (war `.prov-tile` etc. in
      // globals.css). `group` + `group-data-[on=true]:`-Varianten bilden die
      // früheren `.prov-tile[data-on] .prov-label/.prov-check`-Parent-State-
      // Selektoren ab.
      className="group relative flex min-h-[52px] cursor-pointer items-stretch overflow-hidden rounded-[10px] border-[1.5px] border-border bg-card text-left transition-[border-color,box-shadow,background-color] duration-150 hover:border-muted-foreground/40 hover:shadow-[0_4px_12px_-6px_hsl(var(--foreground)/0.1)] data-[on=true]:border-primary data-[on=true]:shadow-[0_0_0_3px_hsl(var(--primary)/0.1),0_4px_12px_-6px_hsl(var(--primary)/0.2)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-55"
    >
      <span
        className="flex w-[50px] shrink-0 items-center justify-center border-r border-[hsl(var(--foreground)/0.06)]"
        style={{
          background: glyphBackground,
          color: glyphColor,
        }}
      >
        {glyph}
      </span>
      <span className="flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap px-3 text-[13.5px] font-medium text-foreground [text-overflow:ellipsis] group-data-[on=true]:font-semibold">
        {label}
      </span>
      <span
        className="-ml-1 mr-2.5 flex size-4 shrink-0 scale-50 items-center justify-center self-center rounded-full bg-primary text-white opacity-0 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.4,1.4,0.5,1)] group-data-[on=true]:scale-100 group-data-[on=true]:opacity-100"
        aria-hidden="true"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </button>
  )
}
