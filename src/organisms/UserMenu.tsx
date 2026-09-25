'use client'

// User menu — avatar trigger with a popover (name/email + menu).
//
// Identity (name/email/avatarUrl) and menu links come in as props, the
// sign-out action as `footer` slot (auth stays with the consumer — the
// package knows nothing about auth). Initials are derived from the name.
// Link renderer as slot (default `<a>`). Items are either links (`href`) or
// actions (`onSelect`, optionally `tone="destructive"`); activating any item
// closes the popover.

import {useState, type ComponentType, type ReactNode} from 'react'
import {Avatar} from '../atoms/Avatar'
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover'
import {Separator} from '../ui/separator'
import {useLabels} from '../i18n/context'
import {cn} from '../lib/cn'
import type {IconComponent} from '../lib/variants'

export type UserMenuItem =
  | {label: string; icon?: IconComponent; href: string; onSelect?: undefined; tone?: undefined}
  | {label: string; icon?: IconComponent; onSelect: () => void; tone?: 'neutral' | 'destructive'; href?: undefined}

export type UserMenuLinkComponent = ComponentType<{
  href: string
  onClick?: () => void
  className?: string
  children: ReactNode
}>

export interface UserMenuLabels {
  /** aria-label of the trigger button. */
  trigger: string
}

const defaultLabels: UserMenuLabels = {
  trigger: 'User menu',
}

export interface UserMenuProps {
  name: string
  email: string
  avatarUrl?: string | null
  /** Collapsed sidebar: avatar only, no name/email in the trigger. */
  collapsed?: boolean
  items?: UserMenuItem[]
  linkComponent?: UserMenuLinkComponent
  onNavigate?: () => void
  /** Footer in the popover (e.g. a sign-out `<form action={signOut}>`). */
  footer?: ReactNode
  /** Extra classes for the trigger button. */
  className?: string
  labels?: Partial<UserMenuLabels>
}

const ITEM_CLS =
  'flex w-full items-center gap-2 rounded-sm px-2 py-2 body text-left cursor-pointer focus-visible:outline-none'
const ITEM_TONE_CLS = {
  neutral: 'hover:bg-accent focus-visible:bg-accent',
  destructive: 'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10',
} as const

const DefaultLink: UserMenuLinkComponent = ({href, children, ...rest}) => (
  <a href={href} {...rest}>
    {children}
  </a>
)

function initials(name: string, fallback: string): string {
  const source = (name.trim().length > 0 ? name : fallback).trim()
  if (!source) return '·'
  return source
    .split(/\s+/)
    .map(part => part[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function UserMenu({
  name,
  email,
  avatarUrl,
  collapsed = false,
  items = [],
  linkComponent: Link = DefaultLink,
  onNavigate,
  footer,
  className,
  labels,
}: UserMenuProps) {
  const l = useLabels('userMenu', defaultLabels, labels)
  const [open, setOpen] = useState(false)
  const label = name.trim().length > 0 ? name : email
  const initialsLabel = initials(name, email)

  const avatar = (size: 'md' | 'lg') => (
    <Avatar src={avatarUrl} initials={initialsLabel} label={label} size={size} shape="circle" tone="primary" showTitle={false} />
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-2 py-2 transition-colors cursor-pointer',
          'hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        aria-label={l.trigger}
      >
        {avatar('md')}
        {!collapsed && (
          <div className="min-w-0 flex-1 text-left">
            <p className="body font-medium text-sidebar-accent-foreground truncate">{label}</p>
            <p className="caption text-muted-foreground truncate">{email}</p>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent side="right" align="end" sideOffset={8} className="w-64 p-0">
        <div className="flex items-center gap-3 p-3">
          {avatar('lg')}
          <div className="min-w-0">
            <p className="body font-semibold truncate">{label}</p>
            <p className="caption text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        {(items.length > 0 || footer) && <Separator />}
        <div className="flex flex-col p-1">
          {items.map((item, i) => {
            const ItemIcon = item.icon
            const content = (
              <>
                {ItemIcon ? <ItemIcon className="size-4 shrink-0" /> : null}
                {item.label}
              </>
            )
            if (item.href !== undefined) {
              return (
                <Link
                  key={`${i}-${item.href}`}
                  href={item.href}
                  onClick={() => {
                    setOpen(false)
                    onNavigate?.()
                  }}
                  className={cn(ITEM_CLS, ITEM_TONE_CLS.neutral)}
                >
                  {content}
                </Link>
              )
            }
            const {onSelect} = item
            return (
              <button
                key={`${i}-${item.label}`}
                type="button"
                onClick={() => {
                  setOpen(false)
                  onSelect()
                }}
                className={cn(ITEM_CLS, ITEM_TONE_CLS[item.tone ?? 'neutral'])}
              >
                {content}
              </button>
            )
          })}
          {items.length > 0 && footer ? <Separator className="my-1" /> : null}
          {footer}
        </div>
      </PopoverContent>
    </Popover>
  )
}
