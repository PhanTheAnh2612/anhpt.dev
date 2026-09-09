import { Link } from '@tanstack/react-router'
import type { Badge } from '../../../content/badges'
import { portfolioPages } from '../../../content/portfolio-pages'
import { PixelBubble } from '../../shared/pixel-bubble'
import { PixelSprite } from '../../shared/pixel-sprite'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

const issuerSprites = {
  Educative: 'content-brand-educative',
  Knorex: 'content-brand-knorex',
  Other: 'content-brand-other',
} as const

export function BadgeCase({
  badges,
  activeTag,
}: {
  badges: ReadonlyArray<Badge>
  activeTag?: string
}) {
  const copy = portfolioPages.badges
  const tags = [...new Set(badges.map((badge) => badge.issuer))].sort()
  const visibleBadges = badges
    .filter((badge) => !activeTag || badge.issuer === activeTag)
    .toSorted((first, second) => second.issuedAt.localeCompare(first.issuedAt))

  return (
    <main className="page-shell portfolio-badges">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </header>
      <p className="portfolio-disclaimer">{copy.disclaimer}</p>
      <nav className="tag-filter" aria-label="Filter achievements by tag">
        <Link
          aria-current={!activeTag ? 'page' : undefined}
          search={{ tag: undefined }}
          to="/badges"
        >
          <PixelBubble icon="*" label="All achievements" />
        </Link>
        {tags.map((tag) => (
          <Link
            aria-current={activeTag === tag ? 'page' : undefined}
            key={tag}
            search={{ tag }}
            to="/badges"
          >
            <PixelBubble
              icon={
                <PixelSprite name={issuerSprites[tag]} frame={0} scale={0.7} />
              }
              label={tag}
            />
          </Link>
        ))}
      </nav>
      <section className="portfolio-badge-list" aria-label="Achievements">
        {visibleBadges.map((badge) => (
          <article className="portfolio-badge-row" key={badge.id}>
            <div className="portfolio-badge__emblem" aria-hidden="true">
              <PixelSprite
                name={issuerSprites[badge.issuer]}
                frame={0}
                scale={1.25}
              />
            </div>
            <div className="portfolio-badge-row__date">
              <time dateTime={badge.issuedAt}>
                {dateFormatter.format(new Date(badge.issuedAt))}
              </time>
            </div>
            <div className="portfolio-badge-row__copy">
              <p className="portfolio-badge__state">#{badge.issuer}</p>
              <h2>{badge.title}</h2>
              <p>{badge.description}</p>
            </div>
            <a
              className="text-link portfolio-badge-row__link"
              href={badge.detailsHref}
              rel="noreferrer"
              target="_blank"
              aria-label={`View details for ${badge.title}`}
            >
              View details →
            </a>
          </article>
        ))}
      </section>
      {visibleBadges.length === 0 && (
        <p role="status" className="portfolio-empty">
          {copy.empty}
        </p>
      )}
    </main>
  )
}
