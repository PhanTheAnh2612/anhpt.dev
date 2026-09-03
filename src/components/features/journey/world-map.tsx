import { Link } from '@tanstack/react-router'
import { PixelScene } from '../../shared/pixel-scene'
import { PixelBubble } from '../../shared/pixel-bubble'
import { learningPath } from '../../../lib/learning-path'
import { portfolioPages } from '../../../content/portfolio-pages'

export function WorldMap() {
  const copy = portfolioPages.journey
  return (
    <main className="page-shell portfolio-journey">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </header>
      <section className="world-layout" aria-label="Website learning world map">
        <div
          className="world-map-viewport"
          role="region"
          aria-label="Scrollable learning map"
          tabIndex={0}
        >
          <div className="world-map">
            <PixelScene className="portfolio-world-scene" name="world-map" />
            <ol className="map-stops">
              {learningPath.map((category) => (
                <li className={category.mapClass} key={category.slug}>
                  <Link
                    aria-label={`Explore route ${category.order}: ${category.title}. ${category.description}`}
                    className="map-stop"
                    preload="intent"
                    search={{ category: category.slug }}
                    to="/courses"
                  >
                    <span className="map-stop__number" aria-hidden="true">
                      {String(category.order).padStart(2, '0')}
                    </span>
                    <PixelBubble icon={category.icon} label={category.title} />
                    <span className="map-stop__tooltip">
                      {category.description}
                      <b>Explore route →</b>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <nav className="map-key" aria-label="Learning path legend">
          {learningPath.map((category) => (
            <Link
              key={category.slug}
              search={{ category: category.slug }}
              to="/courses"
            >
              <span>{String(category.order).padStart(2, '0')}</span>
              {category.title}
            </Link>
          ))}
        </nav>
      </section>
      <footer className="journey-status">
        <span>
          Main quest <b>Build a website</b>
        </span>
        <span>
          Regions <b>{learningPath.length}</b>
        </span>
        <span>
          Finish line <b>Production</b>
        </span>
      </footer>
    </main>
  )
}
