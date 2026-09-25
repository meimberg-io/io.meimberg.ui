'use client'

import { RouteErrorState } from '@meimberg/ui'

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState {...props} />
}
