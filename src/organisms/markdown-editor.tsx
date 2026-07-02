'use client'

// MIPUL-186 · Tiptap-basierter Richtext-Editor mit Markdown-I/O.
// Voller Markdown-Funktionsumfang (Bold/Italic/Code, Headings, Listen,
// Tasklisten, Links, Blockquote, Tabellen, Bilder via URL, HR, Undo/Redo).

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
import { useEffect } from 'react'
import { Button } from '../ui/button'
import { cn } from '../lib/cn'
import {
  Bold, Italic, Code, Code2, Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks, Quote, Link as LinkIcon, Image as ImageIcon,
  Minus, Table as TableIcon, Undo, Redo,
} from '../atoms/icons'

interface Props {
  value: string
  onChange: (markdown: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function getMarkdown(editor: Editor): string {
  const storage = editor.storage as unknown as { markdown?: MarkdownStorage }
  return storage.markdown?.getMarkdown() ?? ''
}

// tiptap-markdown 0.9 ships keine Tabellen-Serialisierung — unbekannte Nodes
// landen sonst als `[table]` im Markdown. GFM-Pipe-Tabellen lassen sich aus
// dem Tiptap-Tree direkt aufbauen.
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
    // Headerless GFM-Tabellen sind nicht standardkonform — leere Header-Zeile
    // einsetzen, damit der Renderer die Tabelle erkennt.
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

export function MarkdownEditor({ value, onChange, placeholder, disabled, className }: Props) {
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
      <Toolbar editor={editor} disabled={disabled} />
      <div className='border-t border-border/40'>
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  )
}

function Toolbar({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) {
  if (!editor) {
    return <div className='h-10 border-b border-border/40' />
  }
  const can = !disabled

  function setLink() {
    if (!editor) return
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link-URL', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  function insertImage() {
    if (!editor) return
    const url = window.prompt('Bild-URL', 'https://')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }

  function insertTable() {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className='flex flex-wrap items-center gap-0.5 px-1 py-1'>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}        active={editor.isActive('bold')}        disabled={!can} title='Bold (⌘B)'><Bold className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}      active={editor.isActive('italic')}      disabled={!can} title='Italic (⌘I)'><Italic className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()}        active={editor.isActive('code')}        disabled={!can} title='Inline Code'><Code className='size-4' /></ToolbarButton>
      <Divider />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} disabled={!can} title='H1'><Heading1 className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} disabled={!can} title='H2'><Heading2 className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} disabled={!can} title='H3'><Heading3 className='size-4' /></ToolbarButton>
      <Divider />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive('bulletList')}  disabled={!can} title='Bullet List'><List className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} disabled={!can} title='Ordered List'><ListOrdered className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()}    active={editor.isActive('taskList')}    disabled={!can} title='Task List'><ListChecks className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive('blockquote')}  disabled={!can} title='Blockquote'><Quote className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}   active={editor.isActive('codeBlock')}   disabled={!can} title='Code Block'><Code2 className='size-4' /></ToolbarButton>
      <Divider />
      <ToolbarButton onClick={setLink}      active={editor.isActive('link')} disabled={!can} title='Link'><LinkIcon className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={insertImage}  disabled={!can} title='Bild einfügen'><ImageIcon className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={insertTable}  disabled={!can} title='Tabelle (3×3)'><TableIcon className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={!can} title='Horizontale Linie'><Minus className='size-4' /></ToolbarButton>
      <Divider />
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!can || !editor.can().undo()} title='Undo'><Undo className='size-4' /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!can || !editor.can().redo()} title='Redo'><Redo className='size-4' /></ToolbarButton>
    </div>
  )
}

interface BtnProps {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
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
