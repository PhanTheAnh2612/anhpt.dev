import { cleanup, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getContent } from '../../../lib/content'
import { parseContentMarkdown } from '../../../lib/markdown-extensions'
import { renderWithRouter } from '../../../test/render-with-router'
import { LessonLayout } from './lesson-layout'

vi.mock('../../../generated/sprite-manifest', async () => ({
  spriteManifest: (await import('../markdown/sprite-manifest.fixture'))
    .spriteManifestFixture,
}))

const react = getContent('course', 'react-interfaces')!
const source =
  '<!-- ::start:trainer-tip pose="think" -->\nKeep state close.\n<!-- ::end:trainer-tip -->\n\n```ts\nconst count = 1\n```'
const current = {
  ...react,
  body: source,
  document: parseContentMarkdown(source),
}
const earlier = { ...react, slug: 'earlier', title: 'Earlier lesson', order: 1 }
const later = { ...react, slug: 'later', title: 'Later lesson', order: 3 }
afterEach(cleanup)

describe('LessonLayout', () => {
  it('derives category navigation in order, marks only the current lesson, and preserves Markdown', async () => {
    const { container } = await renderWithRouter(
      <LessonLayout
        entry={current}
        entries={[
          later,
          getContent('course', 'frontend-foundations')!,
          current,
          earlier,
        ]}
      />,
    )

    const content = within(
      screen.getByRole('navigation', { name: 'Lesson content' }),
    )
    const links = content.getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      'Earlier lesson',
      'React interfaces',
      'Later lesson',
    ])
    expect(links[1]).toHaveAttribute('aria-current', 'page')
    expect(links[0]).not.toHaveAttribute('aria-current')
    expect(
      screen.getByRole('link', { name: /previous: earlier lesson/i }),
    ).toHaveAttribute('href', '/courses/earlier?category=react')
    expect(
      screen.getByRole('link', { name: /next: later lesson/i }),
    ).toHaveAttribute('href', '/courses/later?category=react')
    expect(screen.getByRole('note', { name: 'Trainer tip' })).toHaveTextContent(
      'Keep state close.',
    )
    expect(container.querySelector('.th-keyword')).toHaveTextContent('const')
  })

  it('does not invent previous or next lessons at category boundaries', async () => {
    await renderWithRouter(<LessonLayout entry={react} entries={[react]} />)

    expect(
      screen.queryByRole('link', { name: /previous:/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /next:/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /topic mastery/i }),
    ).toHaveAttribute(
      'href',
      '/courses/react-interfaces/mastery?category=react',
    )
  })
})
