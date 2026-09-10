import { Link } from '@tanstack/react-router'
import type { ContentEntry } from '../../../lib/content'

type JournalSyllabusStep = {
  slug: string
  reason: string
}

export function JournalSyllabus({
  entries,
  hint,
  id,
  label,
  steps,
  title,
}: {
  entries: ReadonlyArray<ContentEntry>
  hint: string
  id: string
  label: string
  steps: ReadonlyArray<JournalSyllabusStep>
  title: string
}) {
  return (
    <section className="journal-syllabus" aria-labelledby={`${id}-title`}>
      <details>
        <summary>
          <span className="journal-syllabus__summary-copy">
            <span className="eyebrow">{label}</span>
            <strong id={`${id}-title`}>{title}</strong>
            <span className="journal-syllabus__hint">{hint}</span>
          </span>
          <span className="journal-syllabus__toggle" aria-hidden="true">
            <span className="journal-syllabus__toggle-closed">
              Show {steps.length} steps
            </span>
            <span className="journal-syllabus__toggle-open">Hide route</span>
            <span className="journal-syllabus__toggle-icon">+</span>
          </span>
        </summary>
        <div className="journal-syllabus__route">
          <p>Choose a concept or follow the route in order.</p>
          <ol>
            {steps.map((step, index) => {
              const syllabusEntry = entries.find(
                (entry) => entry.slug === step.slug,
              )
              if (!syllabusEntry) return null
              return (
                <li key={step.slug}>
                  <span aria-hidden="true">{index + 1}</span>
                  <div>
                    <Link
                      params={{ slug: syllabusEntry.slug }}
                      to="/journal/$slug"
                    >
                      {syllabusEntry.title}
                    </Link>
                    <p>{step.reason}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </details>
    </section>
  )
}
