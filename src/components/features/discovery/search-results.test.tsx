import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../../test/render-with-router'
import { SearchResults } from './search-results'

it('provides a native keyboard-accessible GET form and finite kind-specific result links', async () => {
  await renderWithRouter(
    <SearchResults
      query="hooks"
      entries={[
        {
          kind: 'course',
          slug: 'react-interfaces',
          title: 'React interfaces',
          description: 'Hooks explained',
          tags: [],
          category: 'react',
        },
        {
          kind: 'journal',
          slug: 'hooks-notes',
          title: 'Hooks notes',
          description: 'Notes',
          tags: [],
          category: '',
        },
      ]}
    />,
  )
  expect(
    screen.getByRole('searchbox', { name: /search courses and journal/i }),
  ).toHaveValue('hooks')
  expect(screen.getByRole('search')).toHaveAttribute('method', 'get')
  expect(
    screen.getByRole('link', { name: 'React interfaces' }),
  ).toHaveAttribute('href', '/courses/react-interfaces')
  expect(screen.getByRole('link', { name: 'Hooks notes' })).toHaveAttribute(
    'href',
    '/journal/hooks-notes',
  )
})
it('reports an empty search without displaying unrelated entries', async () => {
  await renderWithRouter(<SearchResults query="" entries={[]} />)
  expect(screen.getByText(/enter a topic/i)).toBeInTheDocument()
  expect(screen.queryAllByRole('article')).toHaveLength(0)
})
