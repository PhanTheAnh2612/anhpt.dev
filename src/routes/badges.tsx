import { createFileRoute } from '@tanstack/react-router'

const badges = [
  ['Rookie Compass', 'Found a dependable path through the fundamentals.'],
  ['Explorer Sun', 'Learned beyond the marked trail.'],
  ['Component Crystal', 'Built reusable interfaces with clear boundaries.'],
  [
    'Quality Guardian',
    'Protected accessibility, performance, and maintainability.',
  ],
] as const

export const Route = createFileRoute('/badges')({ component: Badges })

function Badges() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">ACHIEVEMENTS · 4 / 8 EARNED</p>
        <h1>Badge Case</h1>
        <p>
          Milestones earned by finishing routes and taking on real challenges.
        </p>
      </header>
      <section className="badges-layout">
        <img
          src="/assets/art/badges-v2.png"
          alt="Eight original software-learning merit badges"
        />
        <div className="badge-notes">
          {badges.map(([name, description], index) => (
            <article key={name} className="badge-note">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{name}</h2>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
