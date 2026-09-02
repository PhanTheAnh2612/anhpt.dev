import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { MarkdownContent } from '../../components/features/markdown/markdown-content'
import { getContent } from '../../lib/content'

export const Route = createFileRoute('/courses/$slug')({
  loader: ({ params }) => getContent('course', params.slug) ?? notFound(),
  component: Course,
})

function Course() {
  const entry = Route.useLoaderData()
  return (
    <main className="page-shell lesson-layout">
      <aside className="lesson-sidebar">
        <Link className="back-link" to="/courses">
          ← Course map
        </Link>
        <p className="panel-label">LESSON CONTENT</p>
        <ol>
          <li className="complete">HTML Basics</li>
          <li className="complete">CSS Foundations</li>
          <li className="active">{entry.title}</li>
          <li>Practice Challenge</li>
          <li>Route Review</li>
        </ol>
      </aside>
      <article className="article-panel">
        <div className="lesson-banner">
          <img
            src="/assets/art/coastal-route-v2.png"
            alt="Anh ready to begin the lesson"
          />
        </div>
        <p className="eyebrow">Route {entry.order}</p>
        <h1>{entry.title}</h1>
        <p className="article-description">{entry.description}</p>
        <div className="markdown-renderer">
          <MarkdownContent entry={entry} />
        </div>
      </article>
    </main>
  )
}
