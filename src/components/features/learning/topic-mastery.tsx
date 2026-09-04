import { Link } from '@tanstack/react-router'
import type { MasteryChallenges } from '../../../content/mastery-challenges'
import type { ContentEntry } from '../../../lib/content'
import { getLearningCategory } from '../../../lib/learning-path'
import { PixelAnimation } from '../../shared/pixel-animation'
import { PixelScene } from '../../shared/pixel-scene'
import { PixelSprite } from '../../shared/pixel-sprite'

export function TopicMastery({
  entry,
  mastery,
}: {
  entry: ContentEntry
  mastery: MasteryChallenges
}) {
  const search = { category: entry.category || undefined }
  return (
    <main className="page-shell learning-page">
      <Link
        className="back-link"
        to="/courses/$slug"
        params={{ slug: entry.slug }}
        search={search}
      >
        ← Return to lesson
      </Link>
      <section className="learning-intro" aria-labelledby="mastery-heading">
        <div className="learning-intro__scene">
          <PixelScene
            name="topic-mastery"
            overlays={{
              character: (
                <PixelAnimation
                  name="point"
                  label="Anh introduces the practice challenges"
                />
              ),
            }}
          />
          <p className="learning-scene-caption">
            A clearing to try things out.
          </p>
        </div>
        <header className="learning-intro__copy">
          <p className="eyebrow">
            {getLearningCategory(entry.category || undefined)?.title ??
              'Learning route'}{' '}
            · PRACTICE
          </p>
          <h1 id="mastery-heading">Topic mastery</h1>
          <h2>{entry.title}</h2>
          <p>
            Go beyond recognizing the idea. Build something small, check how it
            behaves, and explain your decisions.
          </p>
          <p className="learning-fine-print">
            A self-guided practice space, not a scored assessment.
          </p>
        </header>
      </section>
      <div className="learning-columns">
        <section
          className="learning-panel"
          aria-labelledby="challenges-heading"
        >
          <p className="eyebrow">YOUR PRACTICE QUEST</p>
          <h2 id="challenges-heading">Make the idea stick</h2>
          <ol className="learning-challenges" aria-label="Practice challenges">
            {mastery.challenges.map((challenge, index) => (
              <li key={challenge.title}>
                <span className="learning-step" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <aside className="learning-rail" aria-label="Practice reward">
          <section className="learning-panel learning-panel--reward">
            <PixelSprite name="content-reward" frame={0} />
            <p className="eyebrow">WHAT YOU ARE WORKING TOWARD</p>
            <h2>The learning reward</h2>
            <p>{mastery.reward}</p>
            <p className="learning-fine-print">
              Keep the result in your own project or notes. There is no score or
              credential to claim here.
            </p>
          </section>
          <section className="learning-panel learning-panel--dark">
            <h2>Need a hint?</h2>
            <p>
              Return to the lesson, revisit the checkpoint, and make the
              smallest version first.
            </p>
            <Link
              className="learning-text-link"
              to="/courses/$slug"
              params={{ slug: entry.slug }}
              search={search}
            >
              Revisit {entry.title} →
            </Link>
          </section>
        </aside>
      </div>
    </main>
  )
}
