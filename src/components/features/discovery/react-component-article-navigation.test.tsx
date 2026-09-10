import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { getContentByKind } from '../../../lib/content'
import { renderWithRouter } from '../../../test/render-with-router'
import { ReactComponentArticleNavigation } from './react-component-article-navigation'

const entries = getContentByKind('journal')

it('links each React component article to its surrounding concepts', async () => {
  const entry = entries.find(
    (candidate) =>
      candidate.slug === 'react-components-design-composition-apis',
  )!
  await renderWithRouter(
    <ReactComponentArticleNavigation entry={entry} entries={entries} />,
  )

  expect(
    screen.getByText(/react component route · step 3 of 19/i),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', {
      name: /previous concept.*plan react component boundaries/i,
    }),
  ).toHaveAttribute('href', '/journal/react-components-plan-boundaries')
  expect(
    screen.getByRole('link', {
      name: /next concept.*implement accessible typed react components/i,
    }),
  ).toHaveAttribute('href', '/journal/react-components-implement-accessibly')
})

it('marks the first article as the starting point', async () => {
  const entry = entries.find(
    (candidate) => candidate.slug === 'react-components-design-from-states',
  )!
  await renderWithRouter(
    <ReactComponentArticleNavigation entry={entry} entries={entries} />,
  )

  expect(
    screen.getByText('Begin with the interface states'),
  ).toBeInTheDocument()
  expect(screen.queryByText('Previous concept')).not.toBeInTheDocument()
})
