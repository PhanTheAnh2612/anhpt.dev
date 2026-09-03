import { Link } from '@tanstack/react-router'
import { portfolioPages } from '../../../content/portfolio-pages'
import type { SearchableEntry } from '../../../lib/search-content'

export function SearchResults({
  entries,
  query,
}: {
  entries: ReadonlyArray<SearchableEntry>
  query: string
}) {
  const copy = portfolioPages.search
  return (
    <main className="page-shell portfolio-search">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </header>
      <form
        action="/search"
        method="get"
        role="search"
        className="portfolio-search__form"
      >
        <label htmlFor="trail-query">Search courses and journal</label>
        <div>
          <input
            key={query}
            id="trail-query"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="React, TypeScript, learning…"
          />
          <button className="pixel-button" type="submit">
            Search
          </button>
        </div>
      </form>
      <p role="status" className="portfolio-search__summary">
        {query.trim()
          ? `${entries.length} ${entries.length === 1 ? 'result' : 'results'} for “${query}”`
          : copy.empty}
      </p>
      <div className="portfolio-entry-grid">
        {entries.map((entry) => (
          <article
            className="portfolio-entry"
            key={`${entry.kind}:${entry.slug}`}
          >
            <p className="eyebrow">
              {entry.kind === 'course' ? 'COURSE' : 'JOURNAL'}
              {entry.category && ` · ${entry.category}`}
            </p>
            <h2>
              {entry.kind === 'course' ? (
                <Link
                  to="/courses/$slug"
                  params={{ slug: entry.slug }}
                  search={{ category: undefined }}
                >
                  {entry.title}
                </Link>
              ) : (
                <Link to="/journal/$slug" params={{ slug: entry.slug }}>
                  {entry.title}
                </Link>
              )}
            </h2>
            <p>{entry.description}</p>
            <ul className="portfolio-tags" aria-label="Tags">
              {entry.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      {query.trim() && entries.length === 0 && (
        <section className="portfolio-empty">
          <p>{copy.noResults}</p>
          <Link className="text-link" to="/journey">
            Explore the world map →
          </Link>
        </section>
      )}
    </main>
  )
}
