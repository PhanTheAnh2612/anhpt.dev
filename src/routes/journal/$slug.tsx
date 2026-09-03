import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { MarkdownContent } from '../../components/features/markdown/markdown-content'
import { getContent } from '../../lib/content'

export const Route = createFileRoute('/journal/$slug')({
  loader: ({ params }) => {
    const entry = getContent('journal', params.slug)
    if (!entry) throw notFound()
    return entry
  },
  component: Entry,
})
function Entry() {
  const entry = Route.useLoaderData()
  return (
    <main className="page-shell">
      <article className="article-panel">
        <Link className="back-link" to="/journal">
          ← Back to Journal
        </Link>
        <p className="eyebrow">{entry.date}</p>
        <h1>{entry.title}</h1>
        <p className="article-description">{entry.description}</p>
        <div className="markdown-renderer">
          <MarkdownContent entry={entry} />
        </div>
      </article>
    </main>
  )
}
