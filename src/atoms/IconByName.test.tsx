import {act, render, waitFor} from '@testing-library/react'
import type {ReactElement} from 'react'
import {describe, expect, it} from 'vitest'
import {IconByName} from './IconByName'

// The icon chunk loads via a dynamic import; rendering inside an awaited act
// lets React pick up the resolved promise.
async function renderLoaded(ui: ReactElement) {
  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(ui)
  })
  await waitFor(() => expect(result.container.querySelector('svg')).toBeTruthy(), {timeout: 5000})
  return result.container.querySelector('svg')
}

describe('IconByName', () => {
  it('renders nothing for null or unknown names', () => {
    const {container, rerender} = render(<IconByName name={null} />)
    expect(container).toBeEmptyDOMElement()
    rerender(<IconByName name="no-such-icon" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('loads the icon by kebab-case name at the default md size', async () => {
    const svg = await renderLoaded(<IconByName name="lightbulb" className="text-primary" />)
    expect(svg?.getAttribute('width')).toBe('16')
    expect(svg?.getAttribute('class')).toContain('text-primary')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('maps size to the Icon scale', async () => {
    const svg = await renderLoaded(<IconByName name="flask-conical" size="lg" />)
    expect(svg?.getAttribute('width')).toBe('20')
  })
})
