import { render, screen, within } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { getContent } from '../../../lib/content'
import type { ContentEntry } from '../../../lib/content'
import { directiveContract } from '../../../lib/markdown-extensions'
import { markdownComponents } from './content-directives'
import { MarkdownContent } from './markdown-content'
import type { MarkdownContentProps } from './markdown-content'

vi.mock('../../../generated/sprite-manifest', () => ({
  spriteManifest: {
    'trainer-idle': {
      atlas: 'character',
      durationMs: 480,
      fallback: 0,
      frames: [{ height: 24, width: 16, x: 0, y: 0 }],
      loop: true,
    },
  },
}))

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

    expect(screen.getByRole('region', { name: 'Quest' })).toHaveTextContent(
      'Complete this route.Keep your notes nearby.',
    )
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
    expect(notes[0]).toHaveTextContent(
      'Outer note opening.Inner note detail.Outer note closing.',
    )
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

  it('migrates course and journal routes away from HTML-string injection', () => {
    const routes = ['courses/$slug.tsx', 'journal/$slug.tsx'].map((route) =>
      readFileSync(resolve(process.cwd(), 'src/routes', route), 'utf8'),
    )

    expect(routes).not.toContainEqual(
      expect.stringContaining('dangerouslySetInnerHTML'),
    )
    expect(routes).toEqual(
      expect.arrayContaining([
        expect.stringContaining('<MarkdownContent entry={entry} />'),
      ]),
    )
  })
})
