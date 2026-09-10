import { Link } from '@tanstack/react-router'
import {
  authJournalPath,
  getAuthJournalOrder,
} from '../../../content/auth-journal-path'
import {
  getReactComponentJournalOrder,
  reactComponentJournalPath,
} from '../../../content/react-component-journal-path'
import { PixelBubble } from '../../shared/pixel-bubble'
import { portfolioPages } from '../../../content/portfolio-pages'
import type { ContentEntry } from '../../../lib/content'
import { JournalSyllabus } from './journal-syllabus'

const canonicalizeTag = (tag: string) => {
  if (tag.toLowerCase() === 'auth') return 'Auth'
  if (tag.toLowerCase() === 'react') return 'ReactJS'
  return tag
}

export function JournalList({
  entries,
  activeTag,
}: {
  entries: ReadonlyArray<ContentEntry>
  activeTag?: string
}) {
  const copy = portfolioPages.journal
  const tags = [
    ...new Set(entries.flatMap((entry) => entry.tags.map(canonicalizeTag))),
  ].sort()
  const selectedTag = activeTag ? canonicalizeTag(activeTag) : undefined
  const isAuthSyllabus = selectedTag === 'Auth'
  const isReactSyllabus = selectedTag === 'ReactJS'
  const visibleEntries = entries
    .filter(
      (entry) =>
        !selectedTag ||
        entry.tags.some((tag) => canonicalizeTag(tag) === selectedTag),
    )
    .toSorted((a, b) => {
      if (isAuthSyllabus) {
        return getAuthJournalOrder(a.slug) - getAuthJournalOrder(b.slug)
      }
      if (isReactSyllabus) {
        const aOrder = getReactComponentJournalOrder(a.slug)
        const bOrder = getReactComponentJournalOrder(b.slug)
        if (aOrder < 0 && bOrder < 0) return b.date.localeCompare(a.date)
        if (aOrder < 0) return 1
        if (bOrder < 0) return -1
        return aOrder - bOrder
      }
      return 0
    })
  return (
    <main className="page-shell portfolio-journal">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </header>
      <nav className="tag-filter" aria-label="Filter journal entries by tag">
        <Link
          aria-current={!selectedTag ? 'page' : undefined}
          search={{ tag: undefined }}
          to="/journal"
        >
          <PixelBubble icon="*" label="All notes" />
        </Link>
        {tags.map((tag) => (
          <Link
            aria-current={selectedTag === tag ? 'page' : undefined}
            key={tag}
            search={{ tag }}
            to="/journal"
          >
            <PixelBubble icon={tag.slice(0, 2).toUpperCase()} label={tag} />
          </Link>
        ))}
      </nav>
      {isReactSyllabus && (
        <JournalSyllabus
          entries={entries}
          hint="Start with interface states, then reveal the route when you need the next concept."
          id="react-syllabus"
          label="React component syllabus"
          steps={reactComponentJournalPath}
          title="Design, plan, implement, then optimize"
        />
      )}
      {isAuthSyllabus && (
        <JournalSyllabus
          entries={entries}
          hint="Start with the field guide, then reveal the route when you need the next security concept."
          id="auth-syllabus"
          label="Auth learning path"
          steps={authJournalPath}
          title="From browser sessions to workload identity"
        />
      )}
      <div className="portfolio-entry-grid">
        {visibleEntries.map((entry) => (
          <article className="portfolio-entry" key={entry.slug}>
            {entry.thumbnail && (
              <Link
                aria-label={`Read entry: ${entry.title}`}
                className="portfolio-entry__thumbnail"
                params={{ slug: entry.slug }}
                to="/journal/$slug"
              >
                <img alt="" height="675" src={entry.thumbnail} width="1200" />
              </Link>
            )}
            <p className="eyebrow">
              {isReactSyllabus &&
                getReactComponentJournalOrder(entry.slug) >= 0 && (
                  <>
                    STEP {getReactComponentJournalOrder(entry.slug) + 1} OF{' '}
                    {reactComponentJournalPath.length} ·{' '}
                  </>
                )}
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
