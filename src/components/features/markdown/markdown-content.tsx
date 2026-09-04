import { createTanStackMarkdownHighlighter } from '@tanstack/highlight/markdown'
import { Markdown } from '@tanstack/markdown/react'
import type { ContentEntry } from '../../../lib/content'
import { highlighter } from '../../../lib/highlighter'
import { parseContentMarkdown } from '../../../lib/markdown-extensions'
import { markdownComponents } from './content-directives'

export type MarkdownContentProps =
  { entry: ContentEntry; source?: never } | { entry?: never; source: string }

const hasEntry = (
  props: MarkdownContentProps,
): props is Extract<MarkdownContentProps, { entry: ContentEntry }> =>
  props.entry !== undefined

export function MarkdownContent(props: MarkdownContentProps) {
  const document = hasEntry(props)
    ? props.entry.document
    : parseContentMarkdown(props.source)

  return (
    <Markdown
      codeLineNumbers
      components={markdownComponents}
      headingAnchors={{ ariaHidden: true, content: '#', tabIndex: -1 }}
      highlighter={createTanStackMarkdownHighlighter(highlighter)}
    >
      {document}
    </Markdown>
  )
}
