import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { parseContentMarkdown } from '../../../lib/markdown-extensions'
import { renderWithRouter } from '../../../test/render-with-router'
import type { ContentEntry } from '../../../lib/content'
import { JournalArticleSidebar } from './journal-article-sidebar'

const entry = (slug: string, title: string): ContentEntry => ({
  body: '',
  category: '',
  date: '2026-09-10',
  description: 'A journal entry.',
  document: parseContentMarkdown(`# ${title}\n\n## First section\n\nText.`),
  kind: 'journal',
  level: 'core',
  order: 0,
  slug,
  socialImage: '',
  tags: [],
  thumbnail: '',
  title,
})

it('shows syllabus and content navigation for an entry in a learning path', async () => {
  const current = entry('auth-field-guide', 'Auth field guide')
  const next = entry('auth-passwords-and-sessions', 'Passwords and sessions')

  await renderWithRouter(
    <JournalArticleSidebar entry={current} entries={[current, next]} />,
  )

  expect(
    screen.getByRole('navigation', { name: /auth learning path syllabus/i }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'Auth field guide' }),
  ).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: 'First section' })).toHaveAttribute(
    'href',
    '#first-section',
  )
  expect(screen.getByText(/read a little, build a little/i)).toBeInTheDocument()
})

it('keeps section navigation but omits syllabus navigation for standalone entries', async () => {
  const standalone = entry('standalone-note', 'Standalone note')

  await renderWithRouter(
    <JournalArticleSidebar entry={standalone} entries={[standalone]} />,
  )

  expect(screen.queryByText('SYLLABUS')).not.toBeInTheDocument()
  expect(
    screen.getByRole('navigation', { name: 'Content sections' }),
  ).toBeInTheDocument()
})
