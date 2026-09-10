import { createFileRoute } from '@tanstack/react-router'
import { SearchResults } from '../components/features/discovery/search-results'
import { getContentByKind } from '../lib/content'
import { searchContent } from '../lib/search-content'

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  component: SearchPage,
})
function SearchPage() {
  const { q } = Route.useSearch()
  return (
    <SearchResults
      query={q ?? ''}
      entries={searchContent(getContentByKind('journal'), q ?? '')}
    />
  )
}
