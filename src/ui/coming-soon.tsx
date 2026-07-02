import { cn } from '../lib/cn'
import { Sparkles } from 'lucide-react'

interface ComingSoonProps {
  /**
   * Identifier des Dashlets — wird per Lint-Regel ausgewertet, sobald die
   * echte Komponente verfügbar ist (R-01-Drift-Schutz, siehe
   * docs/frontend/redesign-analysis.md § 7 R-01).
   */
  dashlet: string
  /** Optional: kurze Headline statt des Dashlet-Slug. */
  title?: string
  /** Optional: Begleittext unter der Headline. */
  description?: string
  /** Optional: Höhe der leeren Datenfläche; default `md`. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const heightMap = {
  sm: 'min-h-24',
  md: 'min-h-40',
  lg: 'min-h-64',
}

/**
 * Platzhalter-Hülle für noch nicht implementierte Redesign-Dashlets.
 * Sieht zum Endzustand passend aus (Card-Hülle, Surface, Border), zeigt
 * aber nur einen dezenten Hinweis. Wird durch das jeweilige F-Ticket
 * ersetzt, sobald die echte Komponente da ist.
 *
 * Quelle: docs/frontend/redesign-analysis.md § 5a.5.
 */
export function ComingSoon({
  dashlet,
  title,
  description,
  size = 'md',
  className,
}: ComingSoonProps) {
  const displayTitle = title ?? humanize(dashlet)
  return (
    <div
      role='status'
      aria-label={`Dashlet "${displayTitle}" kommt später.`}
      data-dashlet={dashlet}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center',
        heightMap[size],
        className,
      )}
    >
      <Sparkles className='size-5 text-muted-foreground' aria-hidden />
      <div className='caption font-medium text-muted-foreground'>{displayTitle}</div>
      <div className='caption text-muted-foreground/80'>
        {description ?? 'Kommt später.'}
      </div>
    </div>
  )
}

function humanize(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}
