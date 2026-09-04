import { cleanup, render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { getContent } from '../../../lib/content'
import type { ContentEntry } from '../../../lib/content'
import { directiveContract } from '../../../lib/markdown-extensions'
import { markdownComponents } from './content-directives'
import { MarkdownContent } from './markdown-content'
import type { MarkdownContentProps } from './markdown-content'

vi.mock('../../../generated/sprite-manifest', async () => ({
  spriteManifest: (await import('./sprite-manifest.fixture'))
    .spriteManifestFixture,
}))
afterEach(cleanup)

describe('MarkdownContent', () => {
  it('accepts exactly one supported content input shape', () => {
    expectTypeOf<MarkdownContentProps>().toEqualTypeOf<
      | { entry: ContentEntry; source?: never }
      | { entry?: never; source: string }
    >()
  })

  it('renders trainer tips as an accessible semantic note', () => {
    render(
      <MarkdownContent
        source={`<!-- ::start:trainer-tip pose="teach" -->
Keep the public API **small**.
<!-- ::end:trainer-tip -->`}
      />,
    )

    expect(screen.getByRole('note', { name: 'Trainer tip' })).toHaveTextContent(
      'Keep the public API small.',
    )
  })

  it('renders nested editable directive content', () => {
    render(
      <MarkdownContent
        source={`<!-- ::start:quest difficulty="beginner" -->
Complete this route.

<!-- ::start:note -->
Keep your notes nearby.
<!-- ::end:note -->
<!-- ::end:quest -->`}
      />,
    )

    const quest = within(screen.getByRole('region', { name: 'Quest' }))
    expect(quest.getByText('Complete this route.')).toBeInTheDocument()
    expect(quest.getByText('Keep your notes nearby.')).toBeInTheDocument()
    expect(screen.getByRole('note', { name: 'Note' })).toBeInTheDocument()
  })

  it('preserves same-name nested directive content without rendering an end marker', () => {
    const { container } = render(
      <MarkdownContent
        source={`<!-- ::start:note -->
Outer note opening.

<!-- ::start:note -->
Inner note detail.
<!-- ::end:note -->

Outer note closing.
<!-- ::end:note -->`}
      />,
    )

    const notes = within(container).getAllByRole('note', { name: 'Note' })

    expect(notes).toHaveLength(2)
    expect(
      within(notes[0]).getByText('Outer note opening.'),
    ).toBeInTheDocument()
    expect(
      within(notes[0]).getByText('Outer note closing.'),
    ).toBeInTheDocument()
    expect(notes[1]).toHaveTextContent('Inner note detail.')
    expect(container).not.toHaveTextContent('::end:note')
  })

  it('keeps raw HTML as text', () => {
    const { container } = render(
      <MarkdownContent source={'<img src=x onerror=alert(1)>'} />,
    )

    expect(container.querySelector('img')).toBeNull()
    expect(container).toHaveTextContent('<img src=x onerror=alert(1)>')
  })

  it('keeps the TanStack highlighter integration for fenced code', () => {
    const { container } = render(
      <MarkdownContent source={'```ts\nconst answer = 42\n```'} />,
    )

    expect(container.querySelector('.th-keyword')).toHaveTextContent('const')
  })

  it('keeps every directive contract entry mapped to React semantics', () => {
    expect(Object.keys(markdownComponents).sort()).toEqual(
      Object.keys(directiveContract)
        .map((name) => `content-${name}`)
        .sort(),
    )
  })

  it('renders every directive and highlighted code during server rendering', () => {
    const directiveAttributes: Record<string, string> = {
      'trainer-tip': 'pose="teach"',
      badge: 'icon="trainer-idle"',
      challenge: 'difficulty="beginner"',
      quest: 'difficulty="beginner" reward="trainer-idle"',
      reward: 'icon="trainer-idle"',
    }
    const directiveSource = Object.keys(directiveContract)
      .map((name) =>
        [
          `<!-- ::start:${name}${directiveAttributes[name] ? ` ${directiveAttributes[name]}` : ''} -->`,
          `${name} server content.`,
          `<!-- ::end:${name} -->`,
        ].join('\n'),
      )
      .join('\n\n')
    const html = renderToString(
      <MarkdownContent
        source={`${directiveSource}\n\n\`\`\`ts\nconst serverAnswer = 42\n\`\`\``}
      />,
    )

    for (const name of Object.keys(directiveContract)) {
      expect(html).toContain(`data-directive="${name}"`)
      expect(html).toContain(`${name} server content.`)
    }
    expect(html).toContain('th-keyword')
  })

  it('uses a stable source label for malformed direct Markdown input', () => {
    expect(() =>
      render(<MarkdownContent source={'<!-- ::start:note -->'} />),
    ).toThrow(
      '<MarkdownContent source>:1:1: directive boundary: missing closing directive "note"',
    )
  })

  it('renders the serializable parsed document stored on a content entry', () => {
    const entry = getContent('course', 'frontend-foundations')

    expect(entry?.document).toMatchObject({ children: expect.any(Array) })
  })

  it('renders a real course entry and its directives without losing code highlighting', () => {
    const entry = getContent('course', 'frontend-foundations')!
    const { container } = render(<MarkdownContent entry={entry} />)
    expect(
      screen.getByRole('heading', { name: 'Frontend foundations' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('note', { name: 'Note' })).toHaveTextContent(
      'Headings, navigation links, and form labels',
    )
    expect(container.querySelector('.th-keyword')).toHaveTextContent('const')
  })
})
