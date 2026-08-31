import { createTanStackMarkdownHighlighter } from '@tanstack/highlight/markdown'
import { renderHtml } from '@tanstack/markdown/html'
import { parseMarkdown } from '@tanstack/markdown/parser'
import { highlighter } from './highlighter'
import { isCourseCategory } from './learning-path'

import type { CourseCategory } from './learning-path'

export type ContentKind = 'journal' | 'course'
export type ContentEntry = {
  body: string
  category: CourseCategory | ''
  date: string
  description: string
  kind: ContentKind
  order: number
  slug: string
  tags: string[]
  title: string
}

const modules = import.meta.glob<string>('../content/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const readField = (source: string, field: string) =>
  source
    .match(new RegExp(`^${field}:\\s*["']?(.+?)["']?\\s*$`, 'm'))?.[1]
    ?.trim() ?? ''
const readList = (source: string, field: string) =>
  readField(source, field)
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((value) => value.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
const toEntry = (path: string, source: string): ContentEntry => {
  const parsed = parseMarkdown(source, { frontmatter: true, headingIds: true })
  const frontmatter = parsed.frontmatter ?? ''
  const slug = path.split('/').at(-1)?.replace(/\.md$/, '') ?? ''
  const category = readField(frontmatter, 'category')
  return {
    body: source,
    category: isCourseCategory(category) ? category : '',
    date: readField(frontmatter, 'date'),
    description: readField(frontmatter, 'description'),
    kind: path.includes('/courses/') ? 'course' : 'journal',
    order: Number(readField(frontmatter, 'order') || '0'),
    slug,
    tags: readList(frontmatter, 'tags'),
    title: readField(frontmatter, 'title') || slug,
  }
}
export const content = Object.entries(modules)
  .map(([path, source]) => toEntry(path, source))
  .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order)
export const getContent = (kind: ContentKind, slug: string) =>
  content.find((entry) => entry.kind === kind && entry.slug === slug)
export const getContentByKind = (kind: ContentKind) =>
  content.filter((entry) => entry.kind === kind)
export const renderContent = (entry: ContentEntry) =>
  renderHtml(entry.body, {
    codeLineNumbers: true,
    highlighter: createTanStackMarkdownHighlighter(highlighter),
    headingAnchors: { ariaHidden: true, content: '#', tabIndex: -1 },
  })
