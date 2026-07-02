import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Kinder werden im zentrierten Page-Container gerendert.
   */
  children: ReactNode
  /**
   * Setzt horizontales + vertikales Padding (`px-4 md:px-8 py-6 md:py-7`).
   * Default `true`. Auf `false` setzen, wenn das Page-Body eigenes Padding
   * mitbringt (z. B. weil interne Sektionen die volle Breite ohne Innenrand
   * brauchen, vgl. `missions-view.tsx`).
   */
  padded?: boolean
}

/**
 * Pulse-PageContainer-Atom — kanonischer Wrapper für jede Top-Level-Page.
 *
 * Kapselt die Default-Geometrie `max-w-[1440px] mx-auto w-full`, das
 * responsive Page-Padding (`px-4 md:px-8 py-6 md:py-7`) und den globalen
 * `animate-fade-in`-Mount-Effekt. Mobile + Small-Tablet (`<md`) bekommen
 * 16 px Horizontal-Padding (passend zur AppShell-Top-Bar `px-4`), ab `md`
 * (≥768 px) gilt das volle Desktop-Padding mit 32 px.
 *
 * Single Source of Truth für Page-Padding: AppShell-`<main>` selbst hat
 * **kein** Padding mehr (PUL-421). Wer eine Page baut, wrapt sie in genau
 * einen `<PageContainer>`. Kein Stack mit weiteren `p-*`-Wrappern.
 *
 * PUL-421: das Klassen-Bündel `max-w-[1440px]` lebt ausschließlich in
 * diesem Atom (Drift-Schutz via ESLint `no-restricted-syntax`).
 *
 * @example
 *   <PageContainer>
 *     <h1>…</h1>
 *   </PageContainer>
 *
 *   // Page bringt eigenes Padding mit → kein doppeltes:
 *   <PageContainer padded={false}>
 *     …
 *   </PageContainer>
 */
export function PageContainer({
  children,
  padded = true,
  className,
  ...rest
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'max-w-[1440px] mx-auto w-full animate-fade-in',
        padded && 'px-4 md:px-8 py-6 md:py-7',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
