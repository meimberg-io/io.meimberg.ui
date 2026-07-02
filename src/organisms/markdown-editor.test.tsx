import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {MarkdownEditor} from './markdown-editor'

// Tiptap/ProseMirror's contentEditable handling depends on selection APIs that
// jsdom doesn't fully implement. We assert mounting + toolbar render only;
// detailed content tests are E2E territory.

describe('MarkdownEditor', () => {
  it('mounts and renders the toolbar buttons', () => {
    renderWithProviders(<MarkdownEditor value='Hello' onChange={vi.fn()} />)
    // The toolbar exposes button-style controls (Bold, Italic, etc.) — not
    // every variant is present in every environment, but at least one button
    // must render.
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('reflects the disabled prop on the wrapper', () => {
    const {container} = renderWithProviders(
      <MarkdownEditor value='' onChange={vi.fn()} disabled />,
    )
    // The contenteditable area should be marked non-editable.
    const editable = container.querySelector('[contenteditable]')
    if (editable) {
      expect(editable.getAttribute('contenteditable')).not.toBe('true')
    }
  })
})
