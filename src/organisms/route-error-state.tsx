'use client'

import { useEffect } from 'react'
import { AlertTriangle } from '../atoms/icons'
import { Button } from '../atoms/Button'
import { useLabels } from '../i18n/context'
import { cn } from '../lib/cn'

export interface RouteErrorStateLabels {
  title: string
  description: string
  retry: string
  /** Summary of the collapsible technical details (dev only). */
  details: string
}

const defaultLabels: RouteErrorStateLabels = {
  title: 'Something went wrong',
  description: 'The page could not be loaded. Try again or reload the app.',
  retry: 'Try again',
  details: 'Technical details',
}

export interface RouteErrorStateProps {
  error: Error & { digest?: string }
  reset: () => void
  className?: string
  labels?: Partial<RouteErrorStateLabels>
}

export function RouteErrorState({ error, reset, className, labels }: RouteErrorStateProps) {
  const l = useLabels('routeErrorState', defaultLabels, labels)

  useEffect(() => {
    console.error(error)
  }, [error])

  // `process` is injected by bundlers like Next; guard for environments without it.
  const isDev = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-4', className)}>
      <div className='flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-4'>
        <AlertTriangle className='size-6' />
      </div>
      <h2 className='heading-2 font-semibold mb-2'>{l.title}</h2>
      <p className='body text-muted-foreground max-w-md mb-6'>
        {l.description}
      </p>
      <Button size='lg' onClick={reset}>{l.retry}</Button>
      {isDev && (
        <details className='mt-6 w-full max-w-2xl text-left'>
          <summary className='caption text-muted-foreground cursor-pointer'>{l.details}</summary>
          <pre className='caption font-mono mt-2 whitespace-pre-wrap break-all bg-surface-2 p-3 rounded'>
            {error.message}
            {error.digest ? `\n\ndigest: ${error.digest}` : ''}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
        </details>
      )}
    </div>
  )
}
