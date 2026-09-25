import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'

export interface ScrollableContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * ScrollableContent — gescrollter Long-Content-Container für Detail-
 * Dialog-Bodies. Fixer `bg-muted/40`-Frame mit zartem Border, ruhigem Padding
 * und `max-h-96` + `overflow-y-auto`-Clamp.
 *
 * Content-agnostisch: der eigentliche Inhalt (MarkdownRenderer, sanitisiertes
 * HTML, …) kommt als `children` vom Call-Site.
 *
 * @example
 *   <ScrollableContent>
 *     <MarkdownRenderer value={body} />
 *   </ScrollableContent>
 */
export function ScrollableContent({className, children, ...rest}: ScrollableContentProps) {
  return (
    <div
      className={cn(
        'bg-muted/40 border border-border/60 rounded-md px-4 py-3 max-h-96 overflow-y-auto',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
