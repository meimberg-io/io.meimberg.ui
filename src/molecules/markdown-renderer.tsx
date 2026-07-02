'use client'

// MIPUL-186 · Sanitized Markdown Renderer für Signal-Bodies und ähnliche
// Felder. react-markdown + GFM (Tabellen, Tasklisten, Strikethrough) +
// rehype-sanitize. Tailwind-Typography für Lesbarkeit.

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { cn } from '../lib/cn'

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), 'loading'],
    code: [...(defaultSchema.attributes?.code ?? []), ['className', /^language-/]],
    input: [
      ...(defaultSchema.attributes?.input ?? []),
      'checked',
      'disabled',
      'type',
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https'],
  },
  clobberPrefix: 'md-',
}

interface Props {
  value: string
  className?: string
}

export function MarkdownRenderer({ value, className }: Props) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-p:text-foreground prose-li:text-foreground',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-code:rounded prose-code:bg-surface-2 prose-code:px-1 prose-code:py-0.5',
        'prose-pre:bg-surface-2 prose-pre:border prose-pre:border-border/40',
        'prose-img:rounded-lg prose-img:border prose-img:border-border/40',
        'prose-table:body prose-th:text-foreground',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        urlTransform={url => {
          // Standard-URL-Filter aus react-markdown plus relative Pfade
          // /api/attachments/<uuid> für unsere Attachment-Route.
          if (url.startsWith('/api/attachments/')) return url
          return defaultUrlTransform(url)
        }}
      >
        {value || ''}
      </ReactMarkdown>
    </div>
  )
}

// Aus react-markdown's Default-urlTransform: erlaubt http/https/mailto/tel/relative.
function defaultUrlTransform(url: string): string {
  const safe = /^(https?:|mailto:|tel:|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
  return safe.test(url) ? url : ''
}
