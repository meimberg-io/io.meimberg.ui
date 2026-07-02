'use client'

// PUL-464 (S2): UserMenu — Avatar-Trigger mit Popover (Name/E-Mail + Menü).
//
// Generisch: Identität (name/email/avatarUrl) + Menü-Links kommen als Props,
// die Abmelden-Aktion als `footer`-Slot (Server-Action/Auth bleibt beim
// Consumer — das Package kennt kein Auth). Initialen werden aus dem Namen
// abgeleitet. Link-Renderer als Slot (Default `<a>`).

import type {ComponentType, ReactNode} from 'react'
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar'
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover'
import {Separator} from '../ui/separator'
import {cn} from '../lib/cn'

export interface UserMenuItem {
  label: string
  href: string
  icon?: ReactNode
}

export type UserMenuLinkComponent = ComponentType<{
  href: string
  onClick?: () => void
  className?: string
  children: ReactNode
}>

export interface UserMenuProps {
  name: string
  email: string
  avatarUrl?: string | null
  /** Collapsed-Sidebar: nur Avatar, kein Name/E-Mail im Trigger. */
  collapsed?: boolean
  items?: UserMenuItem[]
  linkComponent?: UserMenuLinkComponent
  onNavigate?: () => void
  /** Footer im Popover (z. B. Abmelden-<form action={signOut}>). */
  footer?: ReactNode
}

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
}: UserMenuProps) {
  const label = name.trim().length > 0 ? name : email
  const initialsLabel = initials(name, email)

  const avatar = (size: string) => (
    <Avatar className={size}>
      {avatarUrl ? <AvatarImage src={avatarUrl} alt={label} /> : null}
      <AvatarFallback className="bg-primary/15 text-primary caption font-bold">{initialsLabel}</AvatarFallback>
    </Avatar>
  )

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-2 py-2 transition-colors cursor-pointer',
          'hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
        aria-label="User menu"
      >
        {avatar('h-8 w-8')}
        {!collapsed && (
          <div className="min-w-0 flex-1 text-left">
            <p className="body font-medium text-sidebar-accent-foreground truncate">{label}</p>
            <p className="caption text-muted-foreground truncate">{email}</p>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent side="right" align="end" sideOffset={8} className="w-64 p-0">
        <div className="flex items-center gap-3 p-3">
          {avatar('h-10 w-10')}
          <div className="min-w-0">
            <p className="body font-semibold truncate">{label}</p>
            <p className="caption text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        {(items.length > 0 || footer) && <Separator />}
        <div className="flex flex-col p-1">
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-2 rounded-sm px-2 py-2 body hover:bg-accent focus-visible:outline-none focus-visible:bg-accent"
            >
              {item.icon ? <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span> : null}
              {item.label}
            </Link>
          ))}
          {items.length > 0 && footer ? <Separator className="my-1" /> : null}
          {footer}
        </div>
      </PopoverContent>
    </Popover>
  )
}
