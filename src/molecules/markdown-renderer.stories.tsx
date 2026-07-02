import type {Meta, StoryObj} from '@storybook/react-vite'
import {MarkdownRenderer} from './markdown-renderer'

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'Molecules/MarkdownRenderer',
  component: MarkdownRenderer,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof MarkdownRenderer>

export const Empty: Story = {args: {value: ''}}

export const SimpleText: Story = {
  args: {
    value:
      'Pulse ist ein **Cockpit** für alle Tickets, Tasks und Inbox-Items aus den verschiedenen Tools, mit denen ich täglich arbeite.',
  },
}

export const HeadingsAndLists: Story = {
  args: {
    value: `# Heading 1

## Heading 2

- erstens
- zweitens
- drittens mit *italic* und **bold**

1. Eins
2. Zwei
3. Drei`,
  },
}

export const CodeAndLinks: Story = {
  args: {
    value: `Verlinkung: [Linear-Issue PUL-398](https://linear.app/meimbergio/issue/PUL-398)

Inline-\`code\` und Blockcode:

\`\`\`ts
function hello(name: string) {
  return \`Hello, \${name}!\`
}
\`\`\``,
  },
}

export const TableAndTaskList: Story = {
  args: {
    value: `| Stage | Status |
| --- | --- |
| Signal | new |
| Seed | refined |
| Sprout | ready |

- [x] Mock-Daten gesammelt
- [x] Story-File angelegt
- [ ] Review durch User`,
  },
}

export const BlockquoteAndStrikethrough: Story = {
  args: {
    value: `> Pulse hält den Workflow zusammen — nicht den Wochenplan.

~~Veraltete Annahme~~ wurde gestrichen.`,
  },
}

export const RelativeAttachmentUrl: Story = {
  args: {
    value: 'Foto: ![Inbox-Screenshot](/api/attachments/00000000-0000-0000-0000-000000000000)',
  },
}
