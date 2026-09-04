import { Link } from '@tanstack/react-router'
import { courseProgress } from '../../../content/course-progress'
import type { ContentEntry } from '../../../lib/content'
import { getLearningCategory, learningPath } from '../../../lib/learning-path'
import type { CourseCategory } from '../../../lib/learning-path'
import { PixelAnimation } from '../../shared/pixel-animation'
import { PixelScene } from '../../shared/pixel-scene'
import { PixelSprite } from '../../shared/pixel-sprite'

export function CourseOverview({
  category,
  entries,
}: {
  category?: CourseCategory
  entries: ContentEntry[]
}) {
  const activeCategory = getLearningCategory(category)
  const lessons = entries
    .filter(
      (entry) =>
        entry.kind === 'course' && (!category || entry.category === category),
    )
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/journey">
        ← World map
      </Link>
      <section className="learning-intro" aria-labelledby="course-heading">
        <div className="learning-intro__scene">
          <PixelScene
            name="course-route"
            overlays={{
              character: (
                <PixelAnimation
                  name="idle"
                  label="Anh welcomes you to the learning route"
                />
              ),
            }}
          />
          <p className="learning-scene-caption">
            A little practice. A new perspective.
          </p>
        </div>
        <header className="learning-intro__copy">
          <p className="eyebrow">
            {activeCategory
              ? `ROUTE ${String(activeCategory.order).padStart(2, '0')}`
              : 'THE LEARNING TRAIL'}
          </p>
          <h1 id="course-heading">
            {activeCategory?.title ?? 'Choose your next lesson.'}
          </h1>
          <p>
            {activeCategory?.description ??
              'Small, practical lessons from browser foundations to confident engineering. Take the route at your own pace.'}
          </p>
          <p className="learning-count">
            {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}{' '}
            available
          </p>
          <a className="learning-action" href="#available-lessons">
            Meet the lessons ↓
          </a>
        </header>
      </section>
      <nav className="learning-categories" aria-label="Course categories">
        <Link
          to="/courses"
          search={{ category: undefined }}
          aria-current={!category ? 'page' : undefined}
        >
          All courses
        </Link>
        {learningPath.map((route) => (
          <Link
            key={route.slug}
            to="/courses"
            search={{ category: route.slug }}
            aria-current={category === route.slug ? 'page' : undefined}
          >
            {route.title}
          </Link>
        ))}
      </nav>
      <div className="learning-columns">
        <section
          className="learning-panel"
          id="available-lessons"
          aria-labelledby="lessons-heading"
        >
          <p className="eyebrow">TRAINER'S LESSON BOARD</p>
          <h2 id="lessons-heading">Your next encounters</h2>
          {lessons.length ? (
            <ol className="learning-lesson-list" aria-label="Available lessons">
              {lessons.map((entry, index) => (
                <li key={entry.slug}>
                  <span className="learning-step" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <article>
                    <p className="eyebrow">
                      {getLearningCategory(entry.category || undefined)
                        ?.title ?? 'Learning route'}
                    </p>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                    <Link
                      className="learning-text-link"
                      to="/courses/$slug"
                      params={{ slug: entry.slug }}
                      search={{ category: entry.category || undefined }}
                      aria-label={`Begin lesson: ${entry.title}`}
                    >
                      Begin lesson →
                    </Link>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <p>
              No lessons published for this route yet. Explore another category
              while the trail grows.
            </p>
          )}
        </section>
        <aside className="learning-rail" aria-label="Route information">
          <section className="learning-panel learning-panel--dark">
            <p className="eyebrow">YOUR PACE, YOUR PATH</p>
            <h2>Route progress</h2>
            <p>{courseProgress.notice}</p>
          </section>
          <section className="learning-panel learning-panel--reward">
            <PixelSprite name="content-reward" frame={0} />
            <p className="eyebrow">THE REAL REWARD</p>
            <h2>Something you can build</h2>
            <p>
              Each lesson ends with a practical checkpoint. Try it, explain your
              choices, and bring your questions to the next route.
            </p>
            <p className="learning-fine-print">
              Practice rewards describe skills to work toward, not an awarded
              credential.
            </p>
          </section>
        </aside>
      </div>
    </main>
  )
}
