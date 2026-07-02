'use client'

import { useEffect } from 'react'
import { AlertTriangle } from '../atoms/icons'
import { Button } from '../ui/button'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export function RouteErrorState({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isDev = process.env.NODE_ENV !== 'production'

  return (
    <div className='flex flex-col items-center justify-center text-center py-16 px-4'>
      <div className='flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-4'>
        <AlertTriangle className='size-6' />
      </div>
      <h2 className='heading-2 font-semibold mb-2'>Etwas ist schiefgegangen</h2>
      <p className='body text-muted-foreground max-w-md mb-6'>
        Die Seite konnte nicht geladen werden. Versuche es nochmal oder lade die App neu.
      </p>
      <Button onClick={reset}>Erneut laden</Button>
      {isDev && (
        <details className='mt-6 w-full max-w-2xl text-left'>
          <summary className='caption text-muted-foreground cursor-pointer'>Technische Details</summary>
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
