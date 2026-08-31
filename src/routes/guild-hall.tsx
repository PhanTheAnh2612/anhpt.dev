import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/guild-hall')({ component: GuildHall })
function GuildHall() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">PROFESSIONAL JOURNEY</p>
        <h1>Knorex Guild Hall</h1>
        <p>
          I build high-quality advertising technology products with speed,
          ownership, and teamwork.
        </p>
      </header>
      <figure className="guild-scene">
        <img
          src="/assets/art/guild-hall-v2.png"
          alt="Anh and his engineering teammates inside the original Knorex Guild Hall"
        />
        <figcaption>
          Team support · code review · training · continuous improvement
        </figcaption>
      </figure>
      <div className="stat-grid">
        <section>
          <p className="panel-label">ROLE OVERVIEW</p>
          <h2>Frontend Ranger</h2>
          <p>
            Frontend engineering with occasional Java Spring contribution,
            focused on robust and maintainable solutions.
          </p>
        </section>
        <section>
          <p className="panel-label">ENGINEERING IMPACT</p>
          <h2>Quality under pressure</h2>
          <p>
            Urgent feature support, code review, accessibility, mentoring, and
            healthier team workflows.
          </p>
        </section>
        <section className="legendary-panel">
          <p className="panel-label">ELITE ACHIEVEMENT</p>
          <h2>Veteran Excellence Medal</h2>
          <p>★★★★★ Legendary · APA 4/5 · 5 consecutive years.</p>
        </section>
      </div>
    </main>
  )
}
