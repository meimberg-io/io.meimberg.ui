'use client';

import { Button } from '../ui/button';
import type { LucideIcon } from '../atoms/icons';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  /**
   * Untertitel unter dem Titel. String oder JSX-Fragment (für inline-Counts,
   * Highlight-Spans wie `text-destructive font-medium`, etc.). Bleibt im
   * `body-sm text-muted-foreground`-Wrapper gerendert — Style-Konsistenz
   * pro PageHeader, Inhalt frei.
   */
  description?: ReactNode;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  /**
   * Zusätzliche Action-Slots rechts neben dem Default-Action-Button (z. B.
   * sekundäre Buttons, Toggles, Counter). Werden vor dem Default-Action-
   * Button gerendert.
   */
  children?: ReactNode;
}

export function PageHeader({ title, description, actionLabel, actionIcon: ActionIcon, onAction, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="heading-1 text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="body-sm text-muted-foreground mt-1.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {actionLabel && onAction && (
          <Button onClick={onAction} size="sm" data-testid="page-header-action">
            {ActionIcon && <ActionIcon />}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
