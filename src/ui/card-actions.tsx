'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../lib/cn'

type Position = 'top-right' | 'inline'

interface Props {
  children: ReactNode
  position?: Position
  permanent?: boolean
  className?: string
}

interface ClickableProps {
  onClick?: (e: MouseEvent) => void
  onPointerDown?: (e: PointerEvent) => void
  onMouseDown?: (e: MouseEvent) => void
}

function stopThen<E extends { stopPropagation: () => void }>(
  original: ((e: E) => void) | undefined,
): (e: E) => void {
  return e => {
    e.stopPropagation()
    original?.(e)
  }
}

function wrapChild(child: ReactNode): ReactNode {
  if (!isValidElement(child)) return child
  const element = child as ReactElement<ClickableProps>
  const { onClick, onPointerDown, onMouseDown } = element.props
  if (!onClick && !onPointerDown && !onMouseDown) return child
  return cloneElement(element, {
    ...(onClick && { onClick: stopThen(onClick) }),
    ...(onPointerDown && { onPointerDown: stopThen(onPointerDown) }),
    ...(onMouseDown && { onMouseDown: stopThen(onMouseDown) }),
  })
}

export function CardActions({
  children,
  position = 'top-right',
  permanent = false,
  className,
}: Props) {
  const wrapped = Children.map(children, wrapChild)
  return (
    <div
      className={cn(
        'flex items-center gap-1 transition-opacity',
        position === 'top-right' && 'absolute top-2 right-2 z-10',
        permanent
          ? 'opacity-100'
          : 'opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100',
        className,
      )}
    >
      {wrapped}
    </div>
  )
}
