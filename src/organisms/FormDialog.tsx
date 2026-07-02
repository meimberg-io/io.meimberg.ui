'use client'

// PUL-352 · Form-Dialog — das komplette Modal-Pattern in einer Komponente.
// Konsumenten liefern nur Header-Metadaten + Body-Sections — das Modal
// kümmert sich um Overlay, Hero-Header (mit optionalem Tint-Gradient + Live-
// Preview-Slot), sticky Footer mit Cancel + Submit, Escape-/Outside-Schließen,
// Focus-Trap (via Radix-Dialog).
//
// Wer ein Form anlegt, muss NICHT mehr nachdenken über:
// - Wo der Cancel-Button hingehört (immer im Footer links neben Submit)
// - Wie sticky Footer + scrollbarer Body zusammenspielen
// - Wie der Submit-Button bei Pending aussieht
// - Wie der Close-X positioniert ist
// - Welche Submit-Variants es gibt (primary / success / destructive)
//
// Wenn ein Form das nicht abdeckt, ist DAS hier zu erweitern, nicht das
// Form selbst zu verbiegen.

import {forwardRef} from 'react'
import type {ReactNode} from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {Info, Loader2, X} from '../atoms/icons'
import {Button} from '../ui/button'
import {useIsMobile} from '../hooks/use-mobile'
import {cn} from '../lib/cn'

type SubmitVariant = 'primary' | 'success' | 'destructive'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Caption-Text über dem Titel im Hero (z. B. „Neuen Bucket anlegen"). */
  caption?: ReactNode
  /** Heading-2 im Hero. */
  title: ReactNode
  /** HSL-Token-String (ohne `hsl()`), z. B. `"4 55% 50%"` — rendert den
   *  Radial-Gradient oben rechts im Hero. */
  heroTint?: string | null
  /** Beliebiger Slot unter dem Hero-Header (z. B. Live-Preview-Card). */
  hero?: ReactNode
  /** Maximalbreite in px (default 620). */
  maxWidth?: number
  /** PUL-456 Escape-Hatch: erzwingt auch auf `< md` den zentrierten Dialog
   *  statt des Bottom-Sheets. */
  disableMobileSheet?: boolean
  /** Wenn weggelassen → View-Only-Mode: kein Submit-Button, Cancel-Button
   *  wird zum „Schließen"-Button (Variant default). Konsumenten wie das
   *  ItemDetailDialog nutzen das. */
  submitLabel?: ReactNode
  submitVariant?: SubmitVariant
  submitDisabled?: boolean
  submitPending?: boolean
  /** Optionaler Icon-Override im Submit (default: Checkmark für `success`,
   *  kein Icon sonst). */
  submitIcon?: ReactNode
  /** Footer-Cancel-Label. Default „Abbrechen" bei Form-Mode, „Schließen" bei
   *  View-Only-Mode (kein `submitLabel`). */
  cancelLabel?: ReactNode
  /** Info-Stempel links im Footer (kleiner Hinweistext mit Info-Icon). */
  footerInfo?: ReactNode
  /** Zusätzliche Buttons im Footer-Right-Group, links neben Cancel/Submit.
   *  Use-Case: Detail-Dialoge mit mehreren Aktionen (z. B. Inbox-Item:
   *  Signal/Task/Delete + Schließen). Konsument liefert eigene `<Button>`s. */
  footerActions?: ReactNode
  /** Pflicht im Form-Mode (mit `submitLabel`), ignoriert im View-Only-Mode. */
  onSubmit?: () => void | Promise<void>
  onCancel?: () => void
  /** Body — i. d. R. mehrere `<FormSection>`. */
  children: ReactNode
  /** Test-Hook auf dem Submit-Button. */
  submitTestId?: string
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
}: Props) {
  const viewOnly = submitLabel === undefined
  const effectiveCancelLabel = cancelLabel ?? (viewOnly ? 'Schließen' : 'Abbrechen')
  const handleCancel = () => {
    if (onCancel) onCancel()
    else onOpenChange(false)
  }
  const handleSubmit = () => {
    if (viewOnly || submitDisabled || submitPending) return
    if (onSubmit) void onSubmit()
  }

  // PUL-456: Auf `< md` fährt der Dialog als unten angedocktes Bottom-Sheet ein
  // (volle Breite, oben abgerundet, höher). Desktop bleibt zentriert wie zuvor.
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
          // PUL-360: Kein `transform: translateX(-50%)` mehr — der erzeugte
          // Stacking-Context blockt das Hit-Test des RichSelect-Listbox-Portals
          // (Chromium routet den Click an Dialog-Footer statt Item). Stattdessen
          // zentrieren wir per `inset-x-0` + `mx-auto` mit der `width`-Style-
          // Constraint — gleiche Optik, ohne Stacking-Context-Bruch.
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
            // Popover-Surfaces (RichSelect/TagTrigger via eigenes Portal mit
            // `data-portal-popover`, plus Radix-DropdownMenu/Select/Popover/
            // Tooltip via Radix-Popper-Wrapper `data-radix-popper-content-
            // wrapper`) sind DOM-mäßig außerhalb des DialogContent. Wenn
            // eines offen ist, soll Escape ZUERST nur das Popover schließen
            // (handled dort intern), nicht den Dialog selbst.
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
            // Click auf ein Portal-Popover (Tag-Auswahl, RichSelect-Option,
            // DropdownMenuItem, …) zählt für Radix als „outside DialogContent".
            // Ohne diesen Filter würde jeder Klick im Popover den ganzen
            // Dialog schließen — Symptom: DropdownMenuItem-Click via Inbox-
            // Triage triggert `setConfirm(...)`, aber der Dialog wird im
            // selben Frame geschlossen, also rendert TriageConfirmDialog nie.
            //
            // ⚠ Radix wrapped das DOM-Event in ein CustomEvent — `event.target`
            // ist die DialogContent selbst (immer „outside"), das echte Target
            // sitzt in `event.detail.originalEvent.target`.
            //
            // Selektor matched mehrere Konventionen:
            //   • `[data-portal-popover]` — eigenes Marker (RichSelect, TagTrigger)
            //   • `[data-radix-popper-content-wrapper]` — alle Radix-Floats
            //     (DropdownMenu, Select, Popover, Tooltip), solange der Wrapper
            //     noch im DOM ist
            //   • ARIA-Rollen, die typischerweise NUR in Popover-Surfaces
            //     vorkommen (menuitem/option/menu/listbox/menuitemcheckbox/
            //     menuitemradio). Fängt den Fall, dass das Popover sich beim
            //     Click selbst unmountet (Race: Radix-Dismissible schließt das
            //     Menu, bevor unser onInteractOutside den DOM inspizieren kann
            //     — Wrapper ist dann weg, aber `originalTarget` mit `role=
            //     "menuitem"` ist persistent über das Event).
            // `composedPath()` ist persistent zum Event-Zeitpunkt — auch wenn
            // Radix das Popover beim Click selbst unmountet (was es bei
            // DropdownMenuItem-Klicks tut), enthält der Pfad noch das menuitem
            // und seinen Popper-Wrapper. `event.target.closest(...)` allein
            // wäre race-anfällig: zum Zeitpunkt unseres Handlers könnte das
            // menuitem schon detached sein.
            // Radix DismissableLayer ruft `onInteractOutside` aus zwei
            // Quellen:
            //   1. `onPointerDownOutside` — User klickt außerhalb. Hier ist
            //      `originalEvent.type === 'pointerdown'/'mousedown'`.
            //   2. `onFocusOutside` — Focus springt aus dem Layer. Hier ist
            //      `originalEvent.type === 'focusin'`. Tritt z. B. auf, wenn
            //      ein DropdownMenu sich nach Item-Click selbst schließt und
            //      Focus kurzzeitig outside-springt. Das ist KEINE User-
            //      Intention den Dialog zu schließen — wir ignorieren `focusin`.
            const originalEvent = event.detail.originalEvent as Event
            if (originalEvent.type === 'focusin') {
              event.preventDefault()
              return
            }
            // `composedPath()` ist persistent zum Event-Zeitpunkt — auch wenn
            // Radix das Popover beim Click selbst unmountet, enthält der Pfad
            // noch das menuitem und seinen Popper-Wrapper.
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
          {/* Hero-Header — Radial-Gradient (optional) + Caption/Title + Close-X
             + optionaler Hero-Slot. `shrink-0`: Bei kleinen Viewports stösst
             die Shell gegen `max-height` — ohne shrink würden alle drei
             Flex-Kinder proportional schrumpfen und der Hero (overflow-hidden)
             seinen Inhalt abschneiden (PUL-408). */}
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
                  // Bewusst NICHT „Schließen" — vermeidet aria-label-Konflikt
                  // mit dem Footer-Cancel-Button (`Schließen` im View-Only-
                  // Mode), der per `getByRole({name: /Schließen/})` adressiert
                  // wird.
                  aria-label="Dialog-Hero schließen"
                >
                  <X width={18} height={18} />
                </button>
              </DialogPrimitive.Close>
            </div>
            {hero}
          </div>

          {/* Body — scrollbar, konstanter gap-6 zwischen Sections. */}
          <div className="form-dialog-body px-6 py-6 flex flex-col gap-6">{children}</div>

          {/* Sticky Footer — Info-Stempel links, Cancel + Submit rechts.
             `shrink-0`: siehe Hero-Header (PUL-408). */}
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
  // Default-Icon: Checkmark für success, sonst keins.
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
