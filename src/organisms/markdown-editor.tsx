'use client'

// Tiptap-based rich-text editor with Markdown I/O. Full Markdown feature set
// (bold/italic/code, headings, lists, task lists, links, blockquote, tables,
// images via URL, HR, undo/redo).

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Markdown, type MarkdownStorage } from 'tiptap-markdown'
import type { Node as PMNode } from '@tiptap/pm/model'
import type { MarkdownSerializerState } from 'prosemirror-markdown'
import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverAnchor, PopoverContent } from '../ui/popover'
import { TextField } from '../atoms/TextField'
import { useLabels } from '../i18n/context'
import { cn } from '../lib/cn'
import {
  Bold, Italic, Code, Code2, Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks, Quote, Link as LinkIcon, Image as ImageIcon,
  Minus, Table as TableIcon, Undo, Redo,
} from '../atoms/icons'

export interface MarkdownEditorLabels {
  bold: string
  italic: string
  inlineCode: string
  heading1: string
  heading2: string
  heading3: string
  bulletList: string
  orderedList: string
  taskList: string
  blockquote: string
  codeBlock: string
  link: string
  image: string
  table: string
  horizontalRule: string
  undo: string
  redo: string
  /** Label of the URL input when adding/editing a link. */
  linkUrl: string
  /** Label of the URL input when inserting an image. */
  imageUrl: string
  apply: string
  cancel: string
  removeLink: string
}

const defaultLabels: MarkdownEditorLabels = {
  bold: 'Bold (⌘B)',
  italic: 'Italic (⌘I)',
  inlineCode: 'Inline code',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  bulletList: 'Bullet list',
  orderedList: 'Numbered list',
  taskList: 'Task list',
  blockquote: 'Blockquote',
  codeBlock: 'Code block',
  link: 'Link',
  image: 'Insert image',
  table: 'Table (3×3)',
  horizontalRule: 'Horizontal rule',
  undo: 'Undo',
  redo: 'Redo',
  linkUrl: 'Link URL',
  imageUrl: 'Image URL',
  apply: 'Apply',
  cancel: 'Cancel',
  removeLink: 'Remove link',
}

interface Props {
  value: string
  onChange: (markdown: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  labels?: Partial<MarkdownEditorLabels>
}

function getMarkdown(editor: Editor): string {
  const storage = editor.storage as unknown as { markdown?: MarkdownStorage }
  return storage.markdown?.getMarkdown() ?? ''
}

// tiptap-markdown 0.9 ships no table serialisation — unknown nodes would end
// up as `[table]` in the Markdown. GFM pipe tables are built straight from
// the Tiptap tree.
function cellText(cell: PMNode): string {
  let out = ''
  cell.descendants(node => {
    if (node.isText && node.text) out += node.text
  })
  return out.replace(/\|/g, '\\|').replace(/\s*\n+\s*/g, ' ').trim()
}

function serializeTable(state: MarkdownSerializerState, node: PMNode) {
  const rows: string[][] = []
  let hasHeader = false
  node.forEach(row => {
    const cells: string[] = []
    let rowIsHeader = false
    row.forEach(cell => {
      if (cell.type.name === 'tableHeader') rowIsHeader = true
      cells.push(cellText(cell) || ' ')
    })
    if (rowIsHeader) hasHeader = true
    rows.push(cells)
  })
  if (rows.length === 0) return
  const cols = Math.max(...rows.map(r => r.length))
  for (const r of rows) while (r.length < cols) r.push(' ')

  const writeRow = (r: string[]) => state.write('| ' + r.join(' | ') + ' |\n')
  if (hasHeader) {
    writeRow(rows[0])
    state.write('| ' + Array(cols).fill('---').join(' | ') + ' |\n')
    for (let i = 1; i < rows.length; i++) writeRow(rows[i])
  } else {
    // Headerless GFM tables are not valid — insert an empty header row so
    // renderers recognise the table.
    state.write('| ' + Array(cols).fill(' ').join(' | ') + ' |\n')
    state.write('| ' + Array(cols).fill('---').join(' | ') + ' |\n')
    for (const r of rows) writeRow(r)
  }
  state.closeBlock(node)
}

const noopSerializer = { serialize() {} }
const TableMd = Table.extend({
  addStorage() {
    return { ...this.parent?.(), markdown: { serialize: serializeTable } }
  },
})
const TableRowMd = TableRow.extend({ addStorage() { return { ...this.parent?.(), markdown: noopSerializer } } })
const TableHeaderMd = TableHeader.extend({ addStorage() { return { ...this.parent?.(), markdown: noopSerializer } } })
const TableCellMd = TableCell.extend({ addStorage() { return { ...this.parent?.(), markdown: noopSerializer } } })

export function MarkdownEditor({ value, onChange, placeholder, disabled, className, labels }: Props) {
  const l = useLabels('markdownEditor', defaultLabels, labels)
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      TableMd.configure({ resizable: false }),
      TableRowMd,
      TableHeaderMd,
      TableCellMd,
      TaskList,
      TaskItem.configure({ nested: true }),
      Markdown.configure({
        html: false,
        tightLists: true,
        transformPastedText: true,
        transformCopiedText: true,
        breaks: false,
        linkify: true,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(getMarkdown(editor))
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none',
          'min-h-[8rem] px-3 py-2 outline-none',
          'prose-headings:font-semibold prose-p:my-2',
          'prose-code:bg-surface-2 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
          'prose-pre:bg-surface-2 prose-img:rounded-lg',
        ),
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value !== getMarkdown(editor)) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  return (
    <div className={cn('rounded-md border border-input bg-background', className)}>
      <Toolbar editor={editor} disabled={disabled} labels={l} />
      <div className='border-t border-border/40'>
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  )
}

type UrlPromptKind = 'link' | 'image'

interface UrlPrompt {
  kind: UrlPromptKind
  initial: string
  /** Editing an existing link — offers "remove link". */
  hasExisting: boolean
}

function Toolbar({ editor, disabled, labels: l }: { editor: Editor | null; disabled?: boolean; labels: MarkdownEditorLabels }) {
  const [prompt, setPrompt] = useState<UrlPrompt | null>(null)
  if (!editor) {
    return <div className='h-10 border-b border-border/40' />
  }
  const can = !disabled

  function openLinkPrompt() {
    if (!editor) return
    const previous = editor.getAttributes('link').href as string | undefined
    setPrompt({ kind: 'link', initial: previous ?? 'https://', hasExisting: previous !== undefined })
  }

  function unsetLink() {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    setPrompt(null)
  }

  function applyUrl(url: string) {
    if (!editor || !prompt) return
    const trimmed = url.trim()
    if (prompt.kind === 'link') {
      if (trimmed === '') editor.chain().focus().extendMarkRange('link').unsetLink().run()
      else editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run()
    } else if (trimmed !== '') {
      editor.chain().focus().setImage({ src: trimmed }).run()
    }
    setPrompt(null)
  }

  function insertTable() {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <Popover open={prompt !== null} onOpenChange={open => { if (!open) setPrompt(null) }}>
      <PopoverAnchor asChild>
        <div className='flex flex-wrap items-center gap-0.5 px-1 py-1'>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}        active={editor.isActive('bold')}        disabled={!can} title={l.bold}><Bold className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}      active={editor.isActive('italic')}      disabled={!can} title={l.italic}><Italic className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()}        active={editor.isActive('code')}        disabled={!can} title={l.inlineCode}><Code className='size-4' /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} disabled={!can} title={l.heading1}><Heading1 className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} disabled={!can} title={l.heading2}><Heading2 className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} disabled={!can} title={l.heading3}><Heading3 className='size-4' /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive('bulletList')}  disabled={!can} title={l.bulletList}><List className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} disabled={!can} title={l.orderedList}><ListOrdered className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()}    active={editor.isActive('taskList')}    disabled={!can} title={l.taskList}><ListChecks className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive('blockquote')}  disabled={!can} title={l.blockquote}><Quote className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}   active={editor.isActive('codeBlock')}   disabled={!can} title={l.codeBlock}><Code2 className='size-4' /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={openLinkPrompt} active={editor.isActive('link')} disabled={!can} title={l.link}><LinkIcon className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => setPrompt({ kind: 'image', initial: 'https://', hasExisting: false })} disabled={!can} title={l.image}><ImageIcon className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={insertTable}  disabled={!can} title={l.table}><TableIcon className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={!can} title={l.horizontalRule}><Minus className='size-4' /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!can || !editor.can().undo()} title={l.undo}><Undo className='size-4' /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!can || !editor.can().redo()} title={l.redo}><Redo className='size-4' /></ToolbarButton>
        </div>
      </PopoverAnchor>
      <PopoverContent align='start' className='p-3'>
        {prompt && (
          <UrlForm
            // Remount per prompt so the input starts from the new initial value.
            key={`${prompt.kind}:${prompt.initial}`}
            label={prompt.kind === 'link' ? l.linkUrl : l.imageUrl}
            initial={prompt.initial}
            labels={l}
            onSubmit={applyUrl}
            onCancel={() => setPrompt(null)}
            onRemove={prompt.hasExisting ? unsetLink : undefined}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

interface UrlFormProps {
  label: string
  initial: string
  labels: MarkdownEditorLabels
  onSubmit: (url: string) => void
  onCancel: () => void
  onRemove?: () => void
}

// Enter submits (native form submit); Escape is handled by the popover.
function UrlForm({ label, initial, labels: l, onSubmit, onCancel, onRemove }: UrlFormProps) {
  const [url, setUrl] = useState(initial)
  const inputId = useId()
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(url)
  }
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <label htmlFor={inputId} className='caption text-muted-foreground'>{label}</label>
      <TextField id={inputId} type='url' value={url} onChange={e => setUrl(e.target.value)} autoFocus />
      <div className='flex items-center justify-end gap-2'>
        {onRemove && (
          <Button type='button' variant='ghost' size='sm' className='mr-auto' onClick={onRemove}>{l.removeLink}</Button>
        )}
        <Button type='button' variant='ghost' size='sm' onClick={onCancel}>{l.cancel}</Button>
        <Button type='submit' size='sm'>{l.apply}</Button>
      </div>
    </form>
  )
}

interface BtnProps {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: ReactNode
}

function ToolbarButton({ onClick, active, disabled, title, children }: BtnProps) {
  return (
    <Button
      type='button'
      variant={active ? 'secondary' : 'ghost'}
      size='icon'
      className='size-8'
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      {children}
    </Button>
  )
}

function Divider() {
  return <div className='mx-0.5 h-5 w-px bg-border/60' />
}
