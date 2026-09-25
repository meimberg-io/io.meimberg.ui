'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { cn } from '../lib/cn';
import type { IconComponent } from '../lib/variants';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  title: ReactNode;
  /**
   * Untertitel unter dem Titel. String oder JSX-Fragment (für inline-Counts,
   * Highlight-Spans wie `text-destructive font-medium`, etc.). Bleibt im
   * `body-sm text-muted-foreground`-Wrapper gerendert — Style-Konsistenz
   * pro PageHeader, Inhalt frei.
   */
  description?: ReactNode;
  /** Glyph/Avatar vor dem Titelblock. */
  leading?: ReactNode;
  /** Zeile unter der Beschreibung (z. B. Badges, Meta-Infos). */
  meta?: ReactNode;
  actionLabel?: string;
  actionIcon?: IconComponent;
  onAction?: () => void;
  /**
   * Zusätzliche Action-Slots rechts neben dem Default-Action-Button (z. B.
   * sekundäre Buttons, Toggles, Counter). Werden vor dem Default-Action-
   * Button gerendert.
   */
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  leading,
  meta,
  actionLabel,
  actionIcon,
  onAction,
  children,
  className,
  ...rest
}: PageHeaderProps) {
  const hasActions = children != null || (actionLabel && onAction);
  return (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8', className)}
      {...rest}
    >
      <div className="flex min-w-0 items-center gap-3">
        {leading != null && <div data-slot="leading" className="shrink-0">{leading}</div>}
        <div className="min-w-0">
          <h1 className="heading-1 text-foreground tracking-tight">{title}</h1>
          {description && (
            <p className="body-sm text-muted-foreground mt-1.5">{description}</p>
          )}
          {meta != null && <div data-slot="meta" className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
      </div>
      {hasActions && (
        <div className="flex items-center gap-2">
          {children}
          {actionLabel && onAction && (
            <Button onClick={onAction} icon={actionIcon}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
