import { Link } from '@tanstack/react-router'
import { authJournalPath } from '../../../content/auth-journal-path'
import type { ContentEntry } from '../../../lib/content'

export function AuthArticleNavigation({
  entry,
  entries,
}: {
  entry: ContentEntry
  entries: ContentEntry[]
}) {
  const index = authJournalPath.findIndex((step) => step.slug === entry.slug)
  if (index < 0) return null

  const previous =
    index > 0
      ? entries.find(
          (candidate) => candidate.slug === authJournalPath[index - 1].slug,
        )
      : undefined
  const next =
    index < authJournalPath.length - 1
      ? entries.find(
          (candidate) => candidate.slug === authJournalPath[index + 1].slug,
        )
      : undefined
  const current = authJournalPath[index]

  return (
    <nav className="article-series-navigation" aria-label="Auth learning path">
      <header>
        <p className="eyebrow">
          AUTH LEARNING PATH · STEP {index + 1} OF {authJournalPath.length}
        </p>
        <h2>Continue in concept order</h2>
        <p>{current.reason}</p>
      </header>
      <div className="article-series-navigation__links">
        {previous ? (
          <Link to="/journal/$slug" params={{ slug: previous.slug }}>
            <span>← Review prerequisite</span>
            <strong>{previous.title}</strong>
          </Link>
        ) : (
          <div className="article-series-navigation__boundary">
            <span>Starting point</span>
            <strong>No prerequisite article</strong>
          </div>
        )}
        {next ? (
          <Link to="/journal/$slug" params={{ slug: next.slug }}>
            <span>Next concept →</span>
            <strong>{next.title}</strong>
            <small>{authJournalPath[index + 1].reason}</small>
          </Link>
        ) : (
          <Link to="/journal" search={{ tag: 'Auth' }}>
            <span>Path complete</span>
            <strong>Return to the Auth journal</strong>
          </Link>
        )}
      </div>
    </nav>
  )
}
