import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {MarkdownEditor} from './markdown-editor'

const meta: Meta<typeof MarkdownEditor> = {
  title: 'Organisms/MarkdownEditor',
  component: MarkdownEditor,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof MarkdownEditor>

function Controlled({initial = '', placeholder, disabled}: {initial?: string; placeholder?: string; disabled?: boolean}) {
  const [value, setValue] = useState(initial)
  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <MarkdownEditor value={value} onChange={setValue} placeholder={placeholder} disabled={disabled} />
      <details>
        <summary className="caption text-muted-foreground cursor-pointer">Markdown-Output</summary>
        <pre className="caption font-mono mt-2 whitespace-pre-wrap bg-surface-2 p-3 rounded">
          {value || '(empty)'}
        </pre>
      </details>
    </div>
  )
}

export const Empty: Story = {render: () => <Controlled placeholder="Schreib was…" />}

export const Prefilled: Story = {
  render: () => (
    <Controlled
      initial={`# Pulse-Backlog

Heute reduziert auf **P1** + Signals.

- [ ] PUL-398: Stories für molecules/
- [x] PUL-397: Tailwind-Sweep

\`make check-stories\` muss grün sein.`}
    />
  ),
}

export const Disabled: Story = {
  render: () => (
    <Controlled
      initial="Read-only Markdown — Toolbar ist deaktiviert."
      disabled
    />
  ),
}
