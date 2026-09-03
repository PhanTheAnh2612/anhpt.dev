import { Link } from '@tanstack/react-router'
import { PixelScene } from '../../shared/pixel-scene'
import { PixelAnimation } from '../../shared/pixel-animation'
import { portfolioPages } from '../../../content/portfolio-pages'

export function SecretBaseScene() {
  const copy = portfolioPages.secretBase
  return (
    <main className="page-shell portfolio-base">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </header>
      <section
        className="portfolio-base__stage"
        aria-label="A quiet room for discovery"
      >
        <PixelScene
          name="secret-base"
          overlays={{ character: <PixelAnimation name="think" /> }}
        />
        <aside className="portfolio-base__notes">
          <h2>{copy.heading}</h2>
          <p className="portfolio-base__discovery">{copy.discovery}</p>
          <p>{copy.note}</p>
          <Link className="pixel-button" to="/journal">
            Open journal
          </Link>
        </aside>
      </section>
    </main>
  )
}
