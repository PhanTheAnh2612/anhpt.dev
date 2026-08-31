import { Link, createFileRoute } from '@tanstack/react-router'
import { PixelBubble } from '../components/shared/pixel-bubble'
import { learningPath } from '../lib/learning-path'

export const Route = createFileRoute('/journey')({ component: Journey })
function Journey() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">NEW ADVENTURE · 8 REGIONS</p>
        <h1>Build &amp; Ship a Website</h1>
        <p>
          Follow the dotted trail from your first line of HTML to a secure,
          deployed website. Hover over an island to inspect it, then choose a
          route.
        </p>
      </header>
      <section className="world-layout" aria-label="Website learning world map">
        <div className="world-map-viewport">
          <div className="world-map">
            <img
              src="/assets/art/world-map-v2.png"
              alt="Pixel-art archipelago connected by a dotted learning route"
            />
            <ol className="map-stops">
              {learningPath.map((category) => (
                <li className={category.mapClass} key={category.slug}>
                  <Link
                    aria-label={`${category.order}. ${category.title}: ${category.description}`}
                    className="map-stop"
                    preload="intent"
                    search={{ category: category.slug }}
                    to="/courses"
                  >
                    <span className="map-stop__number" aria-hidden="true">
                      {String(category.order).padStart(2, '0')}
                    </span>
                    <PixelBubble icon={category.icon} label={category.title} />
                    <span className="map-stop__tooltip" role="tooltip">
                      {category.description}
                      <b>Explore route →</b>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="map-key" aria-label="Learning path legend">
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
        </div>
      </section>
      <footer className="journey-status">
        <span>
          Main quest <b>Build a website</b>
        </span>
        <span>
          Regions <b>8</b>
        </span>
        <span>
          Finish line <b>Production</b>
        </span>
      </footer>
    </main>
  )
}
