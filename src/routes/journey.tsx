import { Link, createFileRoute } from '@tanstack/react-router'

const locations = [
  ['01', 'Starter Village', 'Foundations for deliberate learning.', '/courses'],
  [
    '02',
    'Interface Forest',
    'Build accessible, resilient interfaces.',
    '/courses',
  ],
  [
    '03',
    'Guild Hall',
    'How I work with teams and ship with care.',
    '/guild-hall',
  ],
] as const

export const Route = createFileRoute('/journey')({ component: Journey })
function Journey() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">YOUR JOURNEY · 12%</p>
        <h1>World Map</h1>
        <p>Choose the next region of the frontend world to explore.</p>
      </header>
      <section className="world-layout">
        <div className="screen-crop crop-world">
          <img
            src="/assets/art/world-map-v2.png"
            alt="Original pixel-art learning world map with connected software regions"
          />
        </div>
        <div className="route-list">
          {locations.map(([id, title, text, to]) => (
            <Link className="route-card" key={id} to={to}>
              <span>Route {id}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </section>
      <footer className="journey-status">
        <span>
          Journey <b>12%</b>
        </span>
        <span>
          Badges <b>3 / 8</b>
        </span>
        <span>
          Trainers <b>8 / 42</b>
        </span>
      </footer>
    </main>
  )
}
