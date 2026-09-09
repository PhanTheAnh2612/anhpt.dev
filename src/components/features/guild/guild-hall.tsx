import { useState } from 'react'
import { PixelScene } from '../../shared/pixel-scene'
import { PixelAnimation } from '../../shared/pixel-animation'
import type { guildProfile } from '../../../content/guild-profile'

export function GuildHall({ profile }: { profile: typeof guildProfile }) {
  const strengths = profile.sections[3]
  const tourPoints = [
    {
      anchor: 'character',
      label: 'Dialogue · Anh',
      summary: 'Frontend Engineer building dependable ad-tech interfaces.',
      detail: profile.dialogue,
    },
    ...profile.sections.slice(0, 3).map((section, index) => ({
      anchor: ['role', 'impact', 'team'][index],
      label: section.label,
      summary: [
        'React-first frontend engineering, with Java Spring support when needed.',
        'Accessible, performant interfaces delivered with care—even on urgent work.',
        'Code review, mentoring, and knowledge sharing help the guild move together.',
      ][index],
      detail: section.body,
    })),
    {
      anchor: 'achievement',
      label: profile.achievement.title,
      summary: `${profile.achievement.score} · ${profile.achievement.streak}`,
      detail: `${profile.achievement.rank}. ${profile.achievement.quote}`,
    },
    {
      anchor: 'values',
      label: strengths.label,
      summary:
        'Calm execution across architecture, debugging, and collaboration.',
      detail: `${strengths.body} Values: ${profile.values.join(' · ')}.`,
    },
    {
      anchor: 'confidentiality',
      label: 'Confidentiality note',
      summary: 'Public responsibilities and impact only.',
      detail: profile.confidentiality,
    },
  ] as const
  const [activePoint, setActivePoint] = useState(0)
  const [tourComplete, setTourComplete] = useState(false)

  const finishTour = () => setTourComplete(true)
  const advanceTour = () => {
    if (activePoint === tourPoints.length - 1) {
      finishTour()
      return
    }
    setActivePoint((current) => current + 1)
  }

  const overlays = Object.fromEntries(
    tourPoints.map((point, index) => {
      const isActive = !tourComplete && activePoint === index
      const isVisible = tourComplete || isActive

      return [
        point.anchor,
        isVisible ? (
          <div
            className={`guild-point${isActive ? ' guild-point--active' : ''}`}
            key={point.anchor}
          >
            <button
              aria-expanded={isActive ? true : undefined}
              aria-label={`${point.label}: ${point.summary}`}
              className="guild-point__pin"
              onClick={() => setActivePoint(index)}
              onFocus={() => setActivePoint(index)}
              onMouseEnter={() => setActivePoint(index)}
              type="button"
            >
              <span aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
            </button>
            <section
              className="guild-point__bubble"
              aria-live={isActive ? 'polite' : undefined}
            >
              <h2 className="panel-label">{point.label}</h2>
              <p>{point.summary}</p>
              {isActive ? (
                <div className="guild-point__actions">
                  <button
                    className="pixel-button"
                    onClick={advanceTour}
                    type="button"
                  >
                    {index === tourPoints.length - 1
                      ? profile.guide.finish
                      : profile.guide.next}
                  </button>
                  <button
                    className="guild-point__skip"
                    onClick={finishTour}
                    type="button"
                  >
                    {profile.guide.skip}
                  </button>
                </div>
              ) : null}
            </section>
          </div>
        ) : undefined,
      ]
    }),
  )

  return (
    <main className="page-shell guild-page portfolio-guild">
      <section className="guild-console">
        <header className="guild-console__heading">
          <span className="portfolio-guild__sigil" aria-hidden="true">
            GH
          </span>
          <div>
            <h1>{profile.title}</h1>
            <p>{profile.subtitle}</p>
          </div>
        </header>
        <div className="guild-command-grid">
          <div className="guild-stage">
            <PixelScene
              className="portfolio-guild__scene"
              name="guild-hall"
              overlays={overlays}
            />
            <div className="portfolio-guild__caption">
              <p>{profile.introduction}</p>
              <section aria-live="polite">
                <h2>{tourPoints[activePoint].label}</h2>
                <p>{tourPoints[activePoint].detail}</p>
              </section>
            </div>
          </div>
          <aside className="guild-rail" aria-label="Ranger record">
            <section className="ranger-profile" aria-labelledby="ranger-name">
              <h2 className="guild-panel-title">Ranger Profile</h2>
              <div className="ranger-profile__identity">
                <PixelAnimation name="idle" />
                <dl>
                  <div>
                    <dt>Name</dt>
                    <dd id="ranger-name">{profile.ranger.name}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{profile.ranger.role}</dd>
                  </div>
                  <div>
                    <dt>Guild</dt>
                    <dd>{profile.ranger.guild}</dd>
                  </div>
                  <div>
                    <dt>Badge</dt>
                    <dd>{profile.ranger.badge}</dd>
                  </div>
                </dl>
              </div>
            </section>
            <section className="ranger-stat-panel">
              <h2 className="guild-panel-title">Ranger Stats</h2>
              <ul>
                {profile.stats.map(([label, level]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <span
                      className={`stat-level stat-level--${level.toLowerCase()}`}
                    >
                      {level}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
