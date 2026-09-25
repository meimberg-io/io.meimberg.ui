'use client'

// Shared popover positioning for custom form popovers (e.g. RichSelect).
// Computes absolute viewport coordinates + auto-flip from the trigger bounds,
// so popovers work inside `overflow: hidden` containers (e.g. the FormDialog
// shell) because they are portalled to <body>.
//
// Contract:
// - The consumer attaches `triggerRef` to the trigger wrapper (the element
//   carrying the data-open attribute).
// - The consumer renders the popover via createPortal into document.body
//   with `position: fixed` and the returned `top`/`left`/`width` as style.
//   `width` is either the trigger width or a fixed px value.
// - `direction` is `'down' | 'up'` — consumers may hook an open animation
//   onto it.

import {useEffect, useRef, useState} from 'react'

interface Options {
  open: boolean
  /** `'trigger'` → popover width = trigger width.
   *  Number → fixed width in px. */
  width: 'trigger' | number
  /** Estimated popover height for the flip decision. */
  estimatedHeight: number
  /** Horizontal alignment when `width` is fixed:
   *  - `'start'` → left trigger edge
   *  - `'end'` → right trigger edge (right-aligned) */
  align?: 'start' | 'end'
  /** Safety padding to the viewport edge (default 24 px). */
  safe?: number
}

export interface PopoverPosition {
  /** Viewport-relative (for `position: fixed`). */
  top: number
  left: number
  /** Effective popover width. */
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
      // Clamp to the viewport: never past the left / right edge.
      const clampedLeft = Math.max(safe, Math.min(window.innerWidth - w - safe, left))
      // Identity check: setting identical values would still re-render, which
      // e2e tools see as a layout shift and wait forever for stability.
      setPosition(prev =>
        prev && prev.top === top && prev.left === clampedLeft && prev.width === w
          ? prev
          : {top, left: clampedLeft, width: w},
      )
      setDirection(prev => (prev === (flipUp ? 'up' : 'down') ? prev : flipUp ? 'up' : 'down'))
    }
    compute()
    // Scroll with capture=true also catches scroll events of inner containers
    // (e.g. a scrollable modal body). Resize repositions on layout changes
    // (window resize, browser zoom, mobile keyboard).
    //
    // Debounced via rAF so identical re-renders don't loop — e2e tools report
    // "not stable" when `setPosition` fires synchronously with layout events.
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
