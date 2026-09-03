import { Link } from '@tanstack/react-router'
import { PixelScene } from '../../shared/pixel-scene'
import { PixelAnimation } from '../../shared/pixel-animation'
import { portfolioPages } from '../../../content/portfolio-pages'

export function NotFound() {
  const copy = portfolioPages.notFound
  return (
    <main className="page-shell portfolio-not-found">
      <section className="portfolio-not-found__stage">
        <PixelScene
          name="not-found"
          overlays={{
            character: (
              <PixelAnimation
                name="question"
                label="Anh is looking for the trail"
              />
            ),
          }}
        />
        <div className="portfolio-not-found__dialogue">
          <p className="eyebrow">{copy.label}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <div className="hero-actions">
            <Link className="pixel-button" to="/journey">
              Back to world map
            </Link>
            <Link className="text-link" to="/">
              Return home →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export function RoutePending() {
  return (
    <main className="page-shell portfolio-pending" role="status">
      <PixelAnimation name="run-loading" />
      <p>Following the trail…</p>
    </main>
  )
}
