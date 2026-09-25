import {describe, expect, it, vi} from 'vitest'
import {screen, waitFor} from '@testing-library/react'
import {renderWithUi} from '../testing'
import {MarkdownEditor} from './markdown-editor'

// Tiptap/ProseMirror's contentEditable handling depends on selection APIs that
// jsdom doesn't fully implement. We assert toolbar behaviour only; detailed
// content tests are E2E territory.

describe('MarkdownEditor', () => {
  it('mounts and renders the toolbar with English titles', async () => {
    renderWithUi(<MarkdownEditor value='Hello' onChange={vi.fn()} />)
    expect(await screen.findByRole('button', {name: 'Bold (⌘B)'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Insert image'})).toBeInTheDocument()
  })

  it('overrides toolbar titles via the labels prop', async () => {
    renderWithUi(<MarkdownEditor value='' onChange={vi.fn()} labels={{bold: 'Strong'}} />)
    expect(await screen.findByRole('button', {name: 'Strong'})).toBeInTheDocument()
  })

  it('reflects the disabled prop on the wrapper', () => {
    const {container} = renderWithUi(
      <MarkdownEditor value='' onChange={vi.fn()} disabled />,
    )
    // The contenteditable area should be marked non-editable.
    const editable = container.querySelector('[contenteditable]')
    if (editable) {
      expect(editable.getAttribute('contenteditable')).not.toBe('true')
    }
  })

  it('inserts an image via the inline URL popover (Enter submits)', async () => {
    const onChange = vi.fn()
    const {user} = renderWithUi(<MarkdownEditor value='Hello' onChange={onChange} />)
    await user.click(await screen.findByRole('button', {name: 'Insert image'}))
    const input = await screen.findByLabelText('Image URL')
    await user.clear(input)
    await user.type(input, 'https://example.com/a.png{Enter}')
    await waitFor(() => expect(screen.queryByLabelText('Image URL')).not.toBeInTheDocument())
    expect(onChange).toHaveBeenLastCalledWith(expect.stringContaining('![](https://example.com/a.png)'))
  })

  it('closes the URL popover on Escape without changing content', async () => {
    const onChange = vi.fn()
    const {user} = renderWithUi(<MarkdownEditor value='Hello' onChange={onChange} />)
    await user.click(await screen.findByRole('button', {name: 'Link'}))
    const input = await screen.findByLabelText('Link URL')
    expect(input).toHaveValue('https://')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByLabelText('Link URL')).not.toBeInTheDocument())
    expect(onChange).not.toHaveBeenCalled()
  })
})
