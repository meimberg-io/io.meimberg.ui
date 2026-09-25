'use client'

// Form dialog — the complete modal pattern in one component. Consumers only
// supply header metadata and body sections; the dialog owns overlay, hero
// header (optional tint gradient + preview slot), sticky footer with
// Cancel + Submit, Escape/outside closing and focus trap (Radix Dialog).
//
// If a form doesn't fit this pattern, extend this component rather than
// bending the form.

import {forwardRef} from 'react'
import type {ReactNode} from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {Info, Loader2, X} from '../atoms/icons'
import {Button} from '../ui/button'
import {useIsMobile} from '../hooks/use-mobile'
import {useLabels} from '../i18n/context'
import {cn} from '../lib/cn'

type SubmitVariant = 'primary' | 'success' | 'destructive'

export interface FormDialogLabels {
  /** Footer cancel button in form mode. */
  cancel: string
  /** Footer button in view-only mode (no `submitLabel`). */
  close: string
  /** aria-label of the close X in the hero header. */
  closeHero: string
}

const defaultLabels: FormDialogLabels = {
  cancel: 'Cancel',
  close: 'Close',
  closeHero: 'Close dialog',
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Caption above the title in the hero (e.g. "Create project"). */
  caption?: ReactNode
  /** Heading in the hero. */
  title: ReactNode
  /** HSL channel string (without `hsl()`), e.g. `"4 55% 50%"` — renders the
   *  radial gradient at the top right of the hero. */
  heroTint?: string | null
  /** Arbitrary slot below the hero header (e.g. a live preview card). */
  hero?: ReactNode
  /** Max width in px (default 620). */
  maxWidth?: number
  /** Escape hatch: keeps the centred dialog below `md` instead of the
   *  bottom sheet. */
  disableMobileSheet?: boolean
  /** When omitted → view-only mode: no submit button, the cancel button
   *  becomes a "Close" button. */
  submitLabel?: ReactNode
  submitVariant?: SubmitVariant
  submitDisabled?: boolean
  submitPending?: boolean
  /** Optional submit icon override (default: checkmark for `success`,
   *  none otherwise). */
  submitIcon?: ReactNode
  /** Footer cancel label. Takes precedence over `labels.cancel` /
   *  `labels.close`. */
  cancelLabel?: ReactNode
  /** Info note on the left of the footer (small text with info icon). */
  footerInfo?: ReactNode
  /** Extra buttons in the footer's right group, left of Cancel/Submit —
   *  for detail dialogs with several actions. */
  footerActions?: ReactNode
  /** Required in form mode (with `submitLabel`), ignored in view-only mode. */
  onSubmit?: () => void | Promise<void>
  onCancel?: () => void
  /** Body — usually several `<FormSection>`s. */
  children: ReactNode
  /** Test hook on the submit button. */
  submitTestId?: string
  labels?: Partial<FormDialogLabels>
}

export function FormDialog({
  open,
  onOpenChange,
  caption,
  title,
  heroTint,
  hero,
  maxWidth = 620,
  disableMobileSheet,
  submitLabel,
  submitVariant = 'primary',
  submitDisabled,
  submitPending,
  submitIcon,
  cancelLabel,
  footerInfo,
  footerActions,
  onSubmit,
  onCancel,
  children,
  submitTestId,
  labels,
}: Props) {
  const l = useLabels('formDialog', defaultLabels, labels)
  const viewOnly = submitLabel === undefined
  const effectiveCancelLabel = cancelLabel ?? (viewOnly ? l.close : l.cancel)
  const handleCancel = () => {
    if (onCancel) onCancel()
    else onOpenChange(false)
  }
  const handleSubmit = () => {
    if (viewOnly || submitDisabled || submitPending) return
    if (onSubmit) void onSubmit()
  }

  // Below `md` the dialog slides in as a bottom sheet (full width, rounded
  // top, taller). Desktop stays centred.
  const isMobile = useIsMobile()
  const mobileSheet = isMobile && !disableMobileSheet

  const heroStyle = heroTint
    ? {
        background: `radial-gradient(600px 200px at 100% 0%, hsl(${heroTint} / .12), transparent 70%), linear-gradient(180deg, hsl(var(--surface-2)) 0%, hsl(var(--card)) 100%)`,
      }
    : {background: 'linear-gradient(180deg, hsl(var(--surface-2)) 0%, hsl(var(--card)) 100%)'}

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="form-dialog-overlay" />
        <DialogPrimitive.Content
          // No `transform: translateX(-50%)`: the resulting stacking context
          // breaks hit-testing of portalled listboxes (Chromium routes the
          // click to the dialog footer instead of the item). Centring via
          // `inset-x-0` + `mx-auto` + width constraint looks the same.
          className={cn(
            'form-dialog-shell fixed z-50',
            mobileSheet
              ? 'inset-x-0 bottom-0 rounded-t-2xl rounded-b-none'
              : 'top-20 inset-x-0 mx-auto',
          )}
          style={
            mobileSheet
              ? {maxWidth: 'none', width: '100%', maxHeight: '92dvh'}
              : {maxWidth, width: 'calc(100vw - 32px)'}
          }
          onEscapeKeyDown={event => {
            // Popover surfaces (own portals marked `data-portal-popover`,
            // Radix floats inside `data-radix-popper-content-wrapper`) live
            // outside DialogContent in the DOM. While one is open, Escape
            // must only close the popover (handled there), not the dialog.
            if (
              document.querySelector(
                '[data-portal-popover],[data-radix-popper-content-wrapper]',
              )
            ) {
              event.preventDefault()
              return
            }
            handleCancel()
          }}
          onInteractOutside={event => {
            // A click inside a portalled popover (select option, dropdown
            // item, …) counts as "outside DialogContent" for Radix. Without
            // this filter every popover click would close the whole dialog.
            //
            // Radix wraps the DOM event in a CustomEvent — `event.target` is
            // DialogContent itself; the real target is in
            // `event.detail.originalEvent`.
            //
            // Matched conventions:
            //   • `[data-portal-popover]` — own marker for custom portals
            //   • `[data-radix-popper-content-wrapper]` — all Radix floats
            //   • ARIA roles that only occur in popover surfaces (menu,
            //     menuitem*, listbox, option) — covers popovers that unmount
            //     themselves on click before this handler runs.
            //
            // Radix calls `onInteractOutside` from pointer-down-outside and
            // from focus-outside. `focusin` happens e.g. when a dropdown
            // closes after an item click and focus briefly leaves the layer —
            // not a user intent to close the dialog, so it is ignored.
            const originalEvent = event.detail.originalEvent as Event
            if (originalEvent.type === 'focusin') {
              event.preventDefault()
              return
            }
            // `composedPath()` is fixed at event time — it still contains the
            // menu item and its popper wrapper even if the popover has
            // unmounted by now, unlike `event.target.closest(...)`.
            const path = (originalEvent.composedPath?.() as Element[]) ?? []
            const looksLikePopoverInteraction = path.some(el => {
              if (!(el instanceof Element)) return false
              if (el.hasAttribute('data-portal-popover')) return true
              if (el.hasAttribute('data-radix-popper-content-wrapper')) return true
              const role = el.getAttribute('role')
              return (
                role === 'menu' ||
                role === 'menuitem' ||
                role === 'menuitemcheckbox' ||
                role === 'menuitemradio' ||
                role === 'listbox' ||
                role === 'option'
              )
            })
            if (looksLikePopoverInteraction) {
              event.preventDefault()
              return
            }
            handleCancel()
          }}
          aria-describedby={undefined}
        >
          {/* Hero header — optional radial gradient + caption/title + close X
             + optional hero slot. `shrink-0`: on small viewports the shell
             hits `max-height`; without it all three flex children would
             shrink and the hero (overflow-hidden) would clip its content. */}
          <div
            className="px-6 pt-6 pb-5 relative overflow-hidden border-b border-border shrink-0"
            style={heroStyle}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0 flex-1">
                {caption && <div className="caption text-muted-foreground mb-1">{caption}</div>}
                <DialogPrimitive.Title className="heading-2 text-foreground truncate">
                  {title}
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground rounded p-1 cursor-pointer shrink-0"
                  // Deliberately distinct from `labels.close` so it doesn't
                  // clash with the footer button's accessible name in
                  // view-only mode.
                  aria-label={l.closeHero}
                >
                  <X width={18} height={18} />
                </button>
              </DialogPrimitive.Close>
            </div>
            {hero}
          </div>

          {/* Body — scrollable, constant gap between sections. */}
          <div className="form-dialog-body px-6 py-6 flex flex-col gap-6">{children}</div>

          {/* Sticky footer — info note left, Cancel + Submit right.
             `shrink-0`: see hero header. */}
          <div className="px-6 py-4 border-t border-border bg-surface-1 flex items-center justify-between gap-2 shrink-0">
            <div className="caption text-muted-foreground inline-flex items-center gap-1.5 min-w-0">
              {footerInfo && (
                <>
                  <Info width={12} height={12} className="shrink-0" />
                  <span className="truncate">{footerInfo}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {footerActions}
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={submitPending}
              >
                {effectiveCancelLabel}
              </Button>
              {!viewOnly && (
                <SubmitButton
                  variant={submitVariant}
                  disabled={submitDisabled || submitPending}
                  pending={submitPending}
                  icon={submitIcon}
                  onClick={handleSubmit}
                  testId={submitTestId}
                >
                  {submitLabel}
                </SubmitButton>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface SubmitButtonProps {
  variant: SubmitVariant
  disabled?: boolean
  pending?: boolean
  icon?: ReactNode
  onClick: () => void
  children: ReactNode
  testId?: string
}

const VARIANT_CLASS: Record<SubmitVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(function SubmitButton(
  {variant, disabled, pending, icon, onClick, children, testId},
  ref,
) {
  // Default icon: checkmark for success, none otherwise.
  const showIcon = icon ?? (variant === 'success' ? <CheckIcon /> : null)
  return (
    <button
      ref={ref}
      type="button"
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-2 rounded-md body-sm font-medium cursor-pointer transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_CLASS[variant],
      )}
    >
      {pending ? <Loader2 width={13} height={13} className="animate-spin" /> : showIcon}
      <span>{children}</span>
    </button>
  )
})

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
