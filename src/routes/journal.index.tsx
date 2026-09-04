import { createFileRoute } from '@tanstack/react-router'
import { JournalList } from '../components/features/discovery/journal-list'
import { getContentByKind } from '../lib/content'

export const Route = createFileRoute('/journal/')({
  validateSearch: (search: Record<string, unknown>): { tag?: string } => ({
    tag: typeof search.tag === 'string' ? search.tag : undefined,
  }),
  component: JournalPage,
})
function JournalPage() {
  const { tag } = Route.useSearch()
  return <JournalList entries={getContentByKind('journal')} activeTag={tag} />
}
