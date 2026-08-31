import { Link, createFileRoute } from '@tanstack/react-router'
import { getContentByKind } from '../lib/content'

export const Route = createFileRoute('/courses/')({ component: Courses })

function Courses() {
  const entries = getContentByKind('course')
  return (
    <main className="page-shell">
      <section className="course-hero">
        <img
          src="/assets/art/coastal-route-v2.png"
          alt="A forest route leading toward the next learning challenge"
        />
        <div>
          <p className="eyebrow">LEARNING ROUTES</p>
          <h1>Choose a course.</h1>
          <p>
            Small lessons arranged as a practical journey from foundations to
            confident engineering.
          </p>
        </div>
      </section>
      <div className="entry-list">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            className="entry-card"
            to="/courses/$slug"
            params={{ slug: entry.slug }}
          >
            <p className="eyebrow">Route {entry.order}</p>
            <h2>{entry.title}</h2>
            <p>{entry.description}</p>
            <span>Begin lesson →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
