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
      'A **dashboard** that brings together tickets, tasks and messages from all the tools you use every day.',
  },
}

export const HeadingsAndLists: Story = {
  args: {
    value: `# Heading 1

## Heading 2

- first
- second
- third with *italic* and **bold**

1. One
2. Two
3. Three`,
  },
}

export const CodeAndLinks: Story = {
  args: {
    value: `Link: [Example issue](https://example.com/issues/42)

Inline \`code\` and a code block:

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
| Draft | new |
| Review | in progress |
| Release | ready |

- [x] Collect sample data
- [x] Write the story
- [ ] Get a review`,
  },
}

export const BlockquoteAndStrikethrough: Story = {
  args: {
    value: `> Keep the workflow together, not the weekly plan.

~~Outdated assumption~~ was removed.`,
  },
}
