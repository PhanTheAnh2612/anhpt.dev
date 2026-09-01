import { createFileRoute } from '@tanstack/react-router'
import { BaseSprite } from '../components/shared/base-sprite'
import { guildProfile } from '../content/guild-profile'

export const Route = createFileRoute('/guild-hall')({ component: GuildHall })

function GuildHall() {
  const primarySections = guildProfile.sections.slice(0, 3)
  const strengths = guildProfile.sections[3]

  return (
    <main className="page-shell guild-page">
      <section className="guild-console">
        <header className="guild-console__heading">
          <BaseSprite name="guildHall" scale={0.8} />
          <div>
            <h1>{guildProfile.title}</h1>
            <p>{guildProfile.subtitle}</p>
          </div>
        </header>

        <div className="guild-command-grid">
          <div className="guild-stage">
            <section
              className="guild-dialogue"
              aria-labelledby="guild-dialogue-name"
            >
              <BaseSprite name="anhFront" scale={1.05} />
              <div>
                <p className="panel-label" id="guild-dialogue-name">
                  DIALOGUE · ANH
                </p>
                <p>{guildProfile.dialogue}</p>
              </div>
            </section>

            <figure className="guild-scene">
              <img
                src="/assets/art/guild-hall-v2.png"
                alt="Anh and a team of engineers collaborating inside a pixel-art technology guild hall"
              />
              <figcaption>
                Code review · frontend craft · team support · continuous
                improvement
              </figcaption>
            </figure>
          </div>

          <aside className="guild-rail" aria-label="Ranger record">
            <section className="ranger-profile" aria-labelledby="ranger-name">
              <h2 className="guild-panel-title">Ranger Profile</h2>
              <div className="ranger-profile__identity">
                <BaseSprite name="anhFront" />
                <dl>
                  <div>
                    <dt>Role</dt>
                    <dd id="ranger-name">{guildProfile.ranger.role}</dd>
                  </div>
                  <div>
                    <dt>Guild</dt>
                    <dd>{guildProfile.ranger.guild}</dd>
                  </div>
                  <div>
                    <dt>Badge</dt>
                    <dd>{guildProfile.ranger.badge}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="ranger-stat-panel">
              <h2 className="guild-panel-title">Ranger Stats</h2>
              <ul>
                {guildProfile.stats.map(([label, level]) => (
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

        <div className="guild-brief-grid">
          {primarySections.map((section, index) => (
            <section className="guild-brief" key={section.label}>
              <h2>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {section.label}
              </h2>
              <p>{section.body}</p>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="guild-lower-grid">
          <section className="guild-strengths">
            <h2>{strengths.label}</h2>
            <p>{strengths.body}</p>
            <ul>
              {guildProfile.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </section>

          <section className="guild-medal" aria-labelledby="medal-title">
            <BaseSprite name="qualityBadge" scale={1.45} />
            <div className="guild-medal__copy">
              <p className="panel-label">Elite Achievement</p>
              <h2 id="medal-title">{guildProfile.achievement.title}</h2>
              <p className="guild-medal__rank">
                {guildProfile.achievement.rank}
              </p>
              <div className="guild-medal__facts">
                <strong>{guildProfile.achievement.score}</strong>
                <strong>{guildProfile.achievement.streak}</strong>
              </div>
              <blockquote>“{guildProfile.achievement.quote}”</blockquote>
            </div>
          </section>

          <aside className="guild-confidentiality">
            <h2>Confidentiality Note</h2>
            <p>{guildProfile.confidentiality}</p>
          </aside>
        </div>

        <footer className="guild-values" aria-label="Core values">
          <strong>Core Values</strong>
          <ul>
            {guildProfile.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </footer>
      </section>
    </main>
  )
}
