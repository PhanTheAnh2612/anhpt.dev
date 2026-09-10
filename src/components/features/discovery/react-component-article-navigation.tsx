import { Link } from '@tanstack/react-router'
import { reactComponentJournalPath } from '../../../content/react-component-journal-path'
import type { ContentEntry } from '../../../lib/content'

export function ReactComponentArticleNavigation({
  entry,
  entries,
}: {
  entry: ContentEntry
  entries: ContentEntry[]
}) {
  const index = reactComponentJournalPath.findIndex(
    (step) => step.slug === entry.slug,
  )
  if (index < 0) return null

  const previous =
    index > 0
      ? entries.find(
          (candidate) =>
            candidate.slug === reactComponentJournalPath[index - 1].slug,
        )
      : undefined
  const next =
    index < reactComponentJournalPath.length - 1
      ? entries.find(
          (candidate) =>
            candidate.slug === reactComponentJournalPath[index + 1].slug,
        )
      : undefined

  return (
    <nav
      className="article-series-navigation"
      aria-label="React component design syllabus"
    >
      <header>
        <p className="eyebrow">
          REACT COMPONENT ROUTE · STEP {index + 1} OF{' '}
          {reactComponentJournalPath.length}
        </p>
        <h2>Continue through the syllabus</h2>
        <p>{reactComponentJournalPath[index].reason}</p>
      </header>
      <div className="article-series-navigation__links">
        {previous ? (
          <Link to="/journal/$slug" params={{ slug: previous.slug }}>
            <span>← Previous concept</span>
            <strong>{previous.title}</strong>
          </Link>
        ) : (
          <div className="article-series-navigation__boundary">
            <span>Starting point</span>
            <strong>Begin with the interface states</strong>
          </div>
        )}
        {next ? (
          <Link to="/journal/$slug" params={{ slug: next.slug }}>
            <span>Next concept →</span>
            <strong>{next.title}</strong>
            <small>{reactComponentJournalPath[index + 1].reason}</small>
          </Link>
        ) : (
          <Link to="/journal" search={{ tag: 'ReactJS' }}>
            <span>Route complete</span>
            <strong>Explore more React notes</strong>
          </Link>
        )}
      </div>
    </nav>
  )
}
