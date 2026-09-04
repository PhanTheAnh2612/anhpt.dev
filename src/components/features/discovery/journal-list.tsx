import { Link } from '@tanstack/react-router'
import { PixelBubble } from '../../shared/pixel-bubble'
import { portfolioPages } from '../../../content/portfolio-pages'
import type { ContentEntry } from '../../../lib/content'

export function JournalList({
  entries,
  activeTag,
}: {
  entries: ReadonlyArray<ContentEntry>
  activeTag?: string
}) {
  const copy = portfolioPages.journal
  const tags = [...new Set(entries.flatMap((entry) => entry.tags))].sort()
  const visibleEntries = entries.filter(
    (entry) => !activeTag || entry.tags.includes(activeTag),
  )
  return (
    <main className="page-shell portfolio-journal">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </header>
      <nav className="tag-filter" aria-label="Filter journal entries by tag">
        <Link
          aria-current={!activeTag ? 'page' : undefined}
          search={{ tag: undefined }}
          to="/journal"
        >
          <PixelBubble icon="*" label="All notes" />
        </Link>
        {tags.map((tag) => (
          <Link
            aria-current={activeTag === tag ? 'page' : undefined}
            key={tag}
            search={{ tag }}
            to="/journal"
          >
            <PixelBubble icon={tag.slice(0, 2).toUpperCase()} label={tag} />
          </Link>
        ))}
      </nav>
      <div className="portfolio-entry-grid">
        {visibleEntries.map((entry) => (
          <article className="portfolio-entry" key={entry.slug}>
            <p className="eyebrow">
              <time dateTime={entry.date}>{entry.date}</time>
            </p>
            <h2>
              <Link to="/journal/$slug" params={{ slug: entry.slug }}>
                {entry.title}
              </Link>
            </h2>
            <p>{entry.description}</p>
            <ul className="portfolio-tags" aria-label="Tags">
              {entry.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
            <Link
              className="text-link"
              aria-label={`Read entry: ${entry.title}`}
              to="/journal/$slug"
              params={{ slug: entry.slug }}
            >
              Read entry →
            </Link>
          </article>
        ))}
      </div>
      {visibleEntries.length === 0 && (
        <p role="status" className="portfolio-empty">
          {copy.empty}
        </p>
      )}
    </main>
  )
}
