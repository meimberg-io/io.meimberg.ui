'use client'

// PUL-352 · Shared Popover-Positionierung für die Form-Atoms (RichSelect,
// TagTrigger). Berechnet absolute Viewport-Koordinaten + Auto-Flip aus den
// Bounds des Triggers — damit funktionieren Popover auch innerhalb von
// `overflow: hidden`-Containern (z. B. unserer FormDialog-Shell), weil sie
// via Portal ans <body> gehen.
//
// Vertrag:
// - Konsument hängt `triggerRef` an den Trigger-Wrapper (das DIV mit data-
//   open-Attribut).
// - Konsument rendert das Popover via createPortal an document.body mit
//   `position: fixed` + die hier zurückgegebenen `top`/`left`/`width` als
//   Style. `width` wird vom Hook geliefert: entweder dynamisch =
//   Trigger-Breite, oder fix in px.
// - `direction` ist `'down' | 'up'` — Konsument darf optional eine Open-
//   Animation (rs-open-down / rs-open-up) daran ankoppeln.

import {useEffect, useRef, useState} from 'react'

interface Options {
  open: boolean
  /** `'trigger'` → Popover-Breite = Trigger-Breite (z. B. RichSelect).
   *  Zahl → feste Breite in px (z. B. TagPicker = 280). */
  width: 'trigger' | number
  /** Geschätzte Popover-Höhe für die Flip-Entscheidung. */
  estimatedHeight: number
  /** Horizontale Ausrichtung wenn `width` fest ist:
   *  - `'start'` → linke Trigger-Kante
   *  - `'end'` → rechte Trigger-Kante (right-aligned) */
  align?: 'start' | 'end'
  /** Sicherheits-Padding zum Viewport-Rand (default 24 px). */
  safe?: number
}

export interface PopoverPosition {
  /** Viewport-relativ (für `position: fixed`). */
  top: number
  left: number
  /** Effektive Popover-Breite. */
  width: number
}

export function usePopoverPosition({
  open,
  width,
  estimatedHeight,
  align = 'start',
  safe = 24,
}: Options) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<PopoverPosition | null>(null)
  const [direction, setDirection] = useState<'up' | 'down'>('down')

  useEffect(() => {
    if (!open || !triggerRef.current) {
      setPosition(null)
      return
    }
    const compute = () => {
      const node = triggerRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const w = width === 'trigger' ? rect.width : width
      const below = window.innerHeight - rect.bottom - safe
      const above = rect.top - safe
      const flipUp = below < estimatedHeight && above > below
      const top = flipUp ? rect.top - estimatedHeight - 6 : rect.bottom + 6
      let left: number
      if (width === 'trigger') {
        left = rect.left
      } else if (align === 'end') {
        left = rect.right - w
      } else {
        left = rect.left
      }
      // Viewport-Clamp: nicht über die linke / rechte Kante hinaus.
      const clampedLeft = Math.max(safe, Math.min(window.innerWidth - w - safe, left))
      // Identitäts-Check: setPosition mit identischen Werten würde sonst einen
      // Re-Render auslösen → Playwright sieht das als „layout-shift" und
      // wartet endlos auf Stabilität.
      setPosition(prev =>
        prev && prev.top === top && prev.left === clampedLeft && prev.width === w
          ? prev
          : {top, left: clampedLeft, width: w},
      )
      setDirection(prev => (prev === (flipUp ? 'up' : 'down') ? prev : flipUp ? 'up' : 'down'))
    }
    compute()
    // Scroll capture=true → catchet auch Scroll-Events von inneren Containern
    // (z. B. dem scrollbaren Modal-Body). Resize re-positioniert beim Layout-
    // Wechsel (Window-Resize, Browser-Zoom, Mobile-Keyboard).
    //
    // Debounced via rAF damit identische Re-Renders nicht in einem Loop
    // hängenbleiben — Playwright sieht „not stable" wenn `setPosition`
    // synchron mit Layout-Events feuert, auch wenn Werte gleich sind.
    let raf = 0
    const onScrollOrResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open, width, estimatedHeight, align, safe])

  return {triggerRef, popoverRef, position, direction}
}
