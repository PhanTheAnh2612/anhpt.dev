import type { Badge } from '../../../content/badges'
import { portfolioPages } from '../../../content/portfolio-pages'
import { PixelSprite } from '../../shared/pixel-sprite'

export function BadgeCase({ badges }: { badges: ReadonlyArray<Badge> }) {
  const copy = portfolioPages.badges
  return (
    <main className="page-shell portfolio-badges">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </header>
      <p className="portfolio-disclaimer">{copy.disclaimer}</p>
      <section
        className="portfolio-badge-grid"
        aria-label="Learning milestones"
      >
        {badges.map((badge) => (
          <article
            className={`portfolio-badge portfolio-badge--${badge.state.toLowerCase()}`}
            key={badge.name}
          >
            <div className="portfolio-badge__emblem" aria-hidden="true">
              <PixelSprite
                name={
                  badge.state === 'Locked' ? 'content-locked' : 'content-badge'
                }
                frame={0}
                scale={1.5}
              />
            </div>
            <p className="portfolio-badge__state">{badge.state}</p>
            <h2>{badge.name}</h2>
            <p>{badge.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
