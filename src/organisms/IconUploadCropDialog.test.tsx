import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'

// react-easy-crop relies on Canvas / IntersectionObserver / getBoundingClientRect
// — way too involved to bring up under jsdom. Stub the import so the dialog can
// at least mount without exploding.
vi.mock('react-easy-crop', () => ({
  default: () => <div data-testid='crop-stub' />,
}))

import {IconUploadCropDialog} from './IconUploadCropDialog'

describe('IconUploadCropDialog', () => {
  // The dialog renders nothing visible until a file is picked through the
  // hidden file input. Triggering that flow requires Canvas + DataTransfer
  // primitives that jsdom doesn't fully support — we'd need E2E for a full
  // path test. Smoke-only here.
  it('renders nothing when closed', () => {
    renderWithProviders(
      <IconUploadCropDialog open={false} onOpenChange={vi.fn()} onSubmit={vi.fn()} />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the dialog hidden until a file is picked (open + no file)', () => {
    // open=true alone is not sufficient — the dialog only opens once a file
    // has been selected. This guards the user flow contract.
    renderWithProviders(
      <IconUploadCropDialog open onOpenChange={vi.fn()} onSubmit={vi.fn()} />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mounts a hidden file input that accepts the documented mime types', () => {
    const {container} = renderWithProviders(
      <IconUploadCropDialog open onOpenChange={vi.fn()} onSubmit={vi.fn()} />,
    )
    const input = container.querySelector('input[type="file"]')
    expect(input).not.toBeNull()
    expect(input?.getAttribute('accept')).toContain('image/png')
    expect(input?.getAttribute('accept')).toContain('image/jpeg')
    expect(input?.getAttribute('accept')).toContain('image/webp')
    expect(input?.getAttribute('accept')).toContain('image/svg+xml')
  })
})
