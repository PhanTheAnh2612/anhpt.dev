import { Link } from '@tanstack/react-router'
import { PixelScene } from '../../shared/pixel-scene'
import { PixelAnimation } from '../../shared/pixel-animation'
import { portfolioPages } from '../../../content/portfolio-pages'

export function HomeHero() {
  const copy = portfolioPages.home
  return (
    <main className="page-shell portfolio-home">
      <section className="portfolio-home__console" aria-labelledby="home-title">
        <PixelScene
          className="portfolio-home__scene"
          name="home"
          overlays={{
            character: (
              <PixelAnimation name="idle" label="Anh welcomes visitors" />
            ),
          }}
        />
        <div className="portfolio-home__menu">
          <p className="eyebrow">{copy.label}</p>
          <h1 id="home-title">{copy.title}</h1>
          <p>{copy.subtitle}</p>
          <nav aria-label="Journey menu">
            <Link className="menu-choice" to="/journey">
              <span aria-hidden="true">▶ </span>Start journey
            </Link>
            <Link
              className="menu-choice"
              to="/courses"
              search={{ category: undefined }}
            >
              Continue
            </Link>
            <Link className="menu-choice" to="/secret-base">
              Secret base
            </Link>
          </nav>
          <Link className="text-link" to="/guild-hall">
            Visit the Guild Hall →
          </Link>
        </div>
        <section
          className="portfolio-home__dialogue"
          aria-label="A greeting from Anh"
        >
          <span className="panel-label">ANH</span>
          <p>{copy.greeting}</p>
          <span aria-hidden="true">▼</span>
        </section>
      </section>
    </main>
  )
}
