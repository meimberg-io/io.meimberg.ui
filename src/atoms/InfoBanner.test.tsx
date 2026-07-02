import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {InfoBanner} from './InfoBanner'

describe('InfoBanner', () => {
  it('renders its content', () => {
    render(<InfoBanner>Hinweis-Text</InfoBanner>)
    expect(screen.getByText('Hinweis-Text')).toBeInTheDocument()
  })

  it('renders with a tone', () => {
    render(<InfoBanner tone="subtle">Info</InfoBanner>)
    expect(screen.getByText('Info')).toBeInTheDocument()
  })
})
