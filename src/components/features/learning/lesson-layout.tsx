import { Link } from '@tanstack/react-router'
import type { ContentEntry } from '../../../lib/content'
import { getLearningCategory } from '../../../lib/learning-path'
import { PixelAnimation } from '../../shared/pixel-animation'
import { MarkdownContent } from '../markdown/markdown-content'

export function LessonLayout({
  entry,
  entries,
}: {
  entry: ContentEntry
  entries: ContentEntry[]
}) {
  const category = getLearningCategory(entry.category || undefined)
  const lessons = entries
    .filter(
      (lesson) =>
        lesson.kind === 'course' && lesson.category === entry.category,
    )
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
  const index = lessons.findIndex((lesson) => lesson.slug === entry.slug)
  const previous = index > 0 ? lessons[index - 1] : undefined
  const next = index >= 0 ? lessons[index + 1] : undefined
  const search = { category: entry.category || undefined }
  return (
    <main className="page-shell learning-page learning-lesson">
      <aside className="learning-sidebar">
        <Link className="back-link" to="/courses" search={search}>
          ← {category?.title ?? 'Course map'}
        </Link>
        <nav aria-label="Lesson content">
          <p className="panel-label">LESSON CONTENT</p>
          <ol>
            {lessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  to="/courses/$slug"
                  params={{ slug: lesson.slug }}
                  search={search}
                  aria-current={entry.slug === lesson.slug ? 'page' : undefined}
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <section className="learning-guide" aria-label="Your trainer">
          <PixelAnimation name="teach" scale={1.5} />
          <p>
            Read a little, build a little. The checkpoint is where an idea
            becomes your own.
          </p>
        </section>
        <a className="learning-text-link" href="#lesson-body">
          Jump to lesson ↓
        </a>
      </aside>
      <article className="learning-panel learning-article">
        <header className="learning-article__header">
          <p className="eyebrow">
            {category?.title ?? 'Learning route'} · LESSON{' '}
            {Math.max(index + 1, 1)}
          </p>
          <h1>{entry.title}</h1>
          <p className="article-description">{entry.description}</p>
        </header>
        <div className="markdown-renderer" id="lesson-body" tabIndex={-1}>
          <MarkdownContent entry={entry} />
        </div>
        <section
          className="learning-mastery-invitation"
          aria-labelledby="practice-heading"
        >
          <p className="eyebrow">PUT IT INTO PRACTICE</p>
          <h2 id="practice-heading">Ready for a challenge?</h2>
          <p>
            Use the topic challenges to build, test, and explain what you have
            learned.
          </p>
          <Link
            className="learning-action"
            to="/courses/$slug/mastery"
            params={{ slug: entry.slug }}
            search={search}
          >
            Explore topic mastery →
          </Link>
        </section>
        <nav className="learning-pagination" aria-label="Adjacent lessons">
          {previous && (
            <Link
              to="/courses/$slug"
              params={{ slug: previous.slug }}
              search={search}
            >
              ← Previous: {previous.title}
            </Link>
          )}
          {next && (
            <Link
              to="/courses/$slug"
              params={{ slug: next.slug }}
              search={search}
            >
              Next: {next.title} →
            </Link>
          )}
          {!next && (
            <Link to="/courses" search={search}>
              Return to the route →
            </Link>
          )}
        </nav>
      </article>
    </main>
  )
}
