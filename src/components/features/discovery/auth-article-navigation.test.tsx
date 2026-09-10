import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { getContentByKind } from '../../../lib/content'
import { renderWithRouter } from '../../../test/render-with-router'
import { AuthArticleNavigation } from './auth-article-navigation'

const entries = getContentByKind('journal')

it('guides an auth reader to the prerequisite and next concept', async () => {
  const entry = entries.find(
    (candidate) => candidate.slug === 'auth-authorization-models',
  )!
  await renderWithRouter(
    <AuthArticleNavigation entry={entry} entries={entries} />,
  )

  expect(
    screen.getByText(/auth learning path · step 3 of 10/i),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', {
      name: /review prerequisite.*password authentication/i,
    }),
  ).toHaveAttribute('href', '/journal/auth-passwords-and-sessions')
  expect(
    screen.getByRole('link', { name: /next concept.*jwt/i }),
  ).toHaveAttribute('href', '/journal/auth-jwt-access-refresh-tokens')
})

it('marks the first article as the starting point', async () => {
  const entry = entries.find(
    (candidate) => candidate.slug === 'auth-field-guide',
  )!
  await renderWithRouter(
    <AuthArticleNavigation entry={entry} entries={entries} />,
  )

  expect(screen.getByText('No prerequisite article')).toBeInTheDocument()
  expect(screen.queryByText('Review prerequisite')).not.toBeInTheDocument()
})

it('does not add the auth path to unrelated journal entries', async () => {
  const entry = entries.find(
    (candidate) => !candidate.slug.startsWith('auth-'),
  )!
  const { container } = await renderWithRouter(
    <AuthArticleNavigation entry={entry} entries={entries} />,
  )
  expect(container).toBeEmptyDOMElement()
})
