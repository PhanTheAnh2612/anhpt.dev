import { Link } from '@tanstack/react-router'
import { authJournalPath } from '../../../content/auth-journal-path'
import { reactComponentJournalPath } from '../../../content/react-component-journal-path'
import type { ContentEntry } from '../../../lib/content'
import { PixelAnimation } from '../../shared/pixel-animation'

type Syllabus = {
  label: string
  tag: string
  steps: ReadonlyArray<{ slug: string }>
}

const syllabi: ReadonlyArray<Syllabus> = [
  {
    label: 'React component syllabus',
    tag: 'ReactJS',
    steps: reactComponentJournalPath,
  },
  { label: 'Auth learning path', tag: 'Auth', steps: authJournalPath },
]

export function JournalArticleSidebar({
  entry,
  entries,
}: {
  entry: ContentEntry
  entries: ReadonlyArray<ContentEntry>
}) {
  const syllabus = syllabi.find((candidate) =>
    candidate.steps.some((step) => step.slug === entry.slug),
  )
  const sections = (entry.document.headings ?? []).filter(
    (heading) => heading.level === 2,
  )

  return (
    <aside className="journal-article-sidebar">
      <Link className="back-link" search={{ tag: syllabus?.tag }} to="/journal">
        ← {syllabus?.label ?? 'Journal'}
      </Link>
      {syllabus && (
        <nav aria-label={`${syllabus.label} syllabus`}>
          <p className="panel-label">SYLLABUS</p>
          <ol className="journal-article-sidebar__syllabus">
            {syllabus.steps.map((step) => {
              const syllabusEntry = entries.find(
                (candidate) => candidate.slug === step.slug,
              )
              if (!syllabusEntry) return null
              return (
                <li key={step.slug}>
                  <Link
                    aria-current={entry.slug === step.slug ? 'page' : undefined}
                    params={{ slug: step.slug }}
                    to="/journal/$slug"
                  >
                    {syllabusEntry.title}
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>
      )}
      {sections.length > 0 && (
        <nav aria-label="Content sections">
          <p className="panel-label">CONTENT SECTIONS</p>
          <ol className="journal-article-sidebar__sections">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <section className="learning-guide" aria-label="Your reading guide">
        <PixelAnimation name="teach" scale={1.5} />
        <p>
          Read a little, build a little. The checkpoint is where an idea becomes
          your own.
        </p>
      </section>
      <a className="learning-text-link" href="#journal-body">
        Jump to article ↓
      </a>
    </aside>
  )
}
