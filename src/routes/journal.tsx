import { Link, createFileRoute } from '@tanstack/react-router'
import { PixelBubble } from '../components/shared/pixel-bubble'
import { getContentByKind } from '../lib/content'

export const Route = createFileRoute('/journal')({
  validateSearch: (search: Record<string, unknown>) => ({
    tag: typeof search.tag === 'string' ? search.tag : undefined,
  }),
  component: Journal,
})
function Journal() {
  const { tag } = Route.useSearch()
  const journalEntries = getContentByKind('journal')
  const tags = [
    ...new Set(journalEntries.flatMap((entry) => entry.tags)),
  ].sort()
  const entries = journalEntries.filter(
    (entry) => !tag || entry.tags.includes(tag),
  )
  return (
    <main className="page-shell">
      <p className="eyebrow">FIELD NOTES</p>
      <h1>Journal</h1>
      <nav className="tag-filter" aria-label="Filter journal entries by tag">
        <Link activeOptions={{ exact: true }} search={{ tag: undefined }} to="/journal">
          <PixelBubble icon="*" label="All notes" />
        </Link>
        {tags.map((entryTag) => (
          <Link
            activeOptions={{ exact: true, includeSearch: true }}
            key={entryTag}
            search={{ tag: entryTag }}
            to="/journal"
          >
            <PixelBubble
              icon={entryTag.slice(0, 2).toUpperCase()}
              label={entryTag}
            />
          </Link>
        ))}
      </nav>
      <div className="entry-list">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            className="entry-card"
            to="/journal/$slug"
            params={{ slug: entry.slug }}
          >
            <p className="eyebrow">{entry.date}</p>
            <h2>{entry.title}</h2>
            <p>{entry.description}</p>
            <div className="entry-tags">
              {entry.tags.map((entryTag) => (
                <small key={entryTag}>#{entryTag}</small>
              ))}
            </div>
            <span>Read entry →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
