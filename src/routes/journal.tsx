import { Link, createFileRoute } from '@tanstack/react-router'
import { getContentByKind } from '../lib/content'

export const Route = createFileRoute('/journal')({ component: Journal })
function Journal() {
  const entries = getContentByKind('journal')
  return (
    <main className="page-shell">
      <p className="eyebrow">FIELD NOTES</p>
      <h1>Journal</h1>
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
            <span>Read entry →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
