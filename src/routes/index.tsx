import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="page-shell home-page">
      <section className="rpg-window home-window">
        <div className="screen-crop crop-home">
          <img
            src="/assets/art/coastal-route-v2.png"
            alt="Anh beginning his software learning journey on a pixel-art coastal route"
          />
        </div>
        <div className="start-menu" aria-label="Journey menu">
          <p className="menu-title">anhpt.dev</p>
          <p>A frontend engineer's journey through the world of software.</p>
          <Link className="menu-choice" to="/journey">
            ▶ Start journey
          </Link>
          <Link className="menu-choice" to="/courses">
            Continue
          </Link>
          <Link className="menu-choice" to="/secret-base">
            Secret base
          </Link>
        </div>
      </section>
    </main>
  )
}
