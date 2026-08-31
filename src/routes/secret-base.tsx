import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/secret-base')({ component: SecretBase })

function SecretBase() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">OFF THE BEATEN PATH</p>
        <h1>Secret Base</h1>
        <p>
          A quiet room for discoveries, experiments, mistakes, and future
          reminders.
        </p>
      </header>
      <section className="secret-base-scene">
        <img
          src="/assets/art/secret-base-v2.png"
          alt="Anh writing code inside his cozy pixel-art Secret Base"
        />
        <aside className="secret-notes">
          <p className="panel-label">TODAY'S DISCOVERY</p>
          <h2>Prefer the simplest boundary that can stay correct.</h2>
          <p>
            Good abstractions do not hide the work. They make the next decision
            easier to understand.
          </p>
          <Link className="pixel-button" to="/journal">
            Open journal
          </Link>
        </aside>
      </section>
    </main>
  )
}
