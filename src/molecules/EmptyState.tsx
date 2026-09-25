'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { AddIcon } from '../atoms/icons';
import { cn } from '../lib/cn';
import type { IconComponent } from '../lib/variants';

export type EmptyStateVariant = 'plain' | 'dashed';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: IconComponent;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /**
   * Freier Action-Slot (Button, Link, …). Hat Vorrang vor
   * `actionLabel`/`onAction`. Für Sites mit Link- statt Button-Aktion.
   */
  action?: ReactNode;
  /**
   * Visuelle Form.
   * - `plain` (Default) — große, zentrierte Page-Hero (size-20-Icon, py-20).
   * - `dashed` — Section-Empty mit gestricheltem Border (`p-12`, 32px-Icon,
   *   heading-3). Für gefilterte Listen-/Grid-Leerzustände.
   */
  variant?: EmptyStateVariant;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  variant = 'plain',
  className,
  ...rest
}: EmptyStateProps) {
  const resolvedAction =
    action ??
    (actionLabel && onAction ? (
      <Button onClick={onAction} icon={AddIcon}>
        {actionLabel}
      </Button>
    ) : null);

  if (variant === 'dashed') {
    return (
      <div
        className={cn(
          'flex flex-col items-center rounded-lg border border-dashed border-border bg-card p-12 text-center',
          className,
        )}
        {...rest}
      >
        {Icon && <Icon className="size-8 text-muted-foreground mb-3" />}
        <h3 className="heading-3 text-foreground mb-1">{title}</h3>
        <p className="body-sm text-muted-foreground max-w-sm">{description}</p>
        {resolvedAction && <div className="mt-3">{resolvedAction}</div>}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)} {...rest}>
      {Icon && (
        <div className="relative mb-6">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-surface-2 border border-border">
            <Icon className="size-10 text-muted-foreground/60" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-primary/5 blur-xl -z-10" />
        </div>
      )}
      <h3 className="heading-2 font-semibold text-foreground mb-2">{title}</h3>
      <p className="body text-muted-foreground max-w-xs mb-6">{description}</p>
      {resolvedAction}
    </div>
  );
}
