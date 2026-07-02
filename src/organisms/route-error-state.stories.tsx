import type {Meta, StoryObj} from '@storybook/react-vite'
import {RouteErrorState} from './route-error-state'

const meta: Meta<typeof RouteErrorState> = {
  title: 'Organisms/RouteErrorState',
  component: RouteErrorState,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof RouteErrorState>

const baseError = Object.assign(new Error('Failed to fetch /api/contexts/123/kpi'), {
  digest: 'a1b2c3d4',
})

export const Default: Story = {
  args: {error: baseError, reset: () => {}},
}

export const WithoutDigest: Story = {
  args: {
    error: Object.assign(new Error('Unknown route boundary failure'), {digest: undefined}),
    reset: () => {},
  },
}

export const LongStack: Story = {
  args: {
    error: (() => {
      const e = new Error('Hydration mismatch in /todo')
      e.stack = [
        'Error: Hydration mismatch in /todo',
        '  at Suspense (react-dom/server.browser.js:1234)',
        '  at TodoPage (app/(app)/todo/page.tsx:42)',
        '  at AppShell (app/(app)/layout.tsx:18)',
      ].join('\n')
      return Object.assign(e, {digest: 'h1m2'})
    })(),
    reset: () => {},
  },
}
