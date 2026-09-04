import { PixelScene } from '../../shared/pixel-scene'
import { PixelAnimation } from '../../shared/pixel-animation'
import { PixelSprite } from '../../shared/pixel-sprite'
import type { guildProfile } from '../../../content/guild-profile'

export function GuildHall({ profile }: { profile: typeof guildProfile }) {
  const strengths = profile.sections[3]
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
            <section
              className="guild-dialogue"
              aria-labelledby="guild-dialogue-name"
            >
              <div>
                <p className="panel-label" id="guild-dialogue-name">
                  DIALOGUE · ANH
                </p>
                <p>{profile.dialogue}</p>
              </div>
            </section>
            <PixelScene
              className="portfolio-guild__scene"
              name="guild-hall"
              overlays={{ character: <PixelAnimation name="point" /> }}
            />
            <p className="portfolio-guild__caption">{profile.introduction}</p>
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
        <div className="guild-brief-grid">
          {profile.sections.slice(0, 3).map((section, index) => (
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
              {profile.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </section>
          <section className="guild-medal" aria-labelledby="medal-title">
            <PixelSprite
              className="portfolio-guild__medal"
              name="content-badge"
              frame={0}
              scale={1.5}
            />
            <div className="guild-medal__copy">
              <p className="panel-label">Elite Achievement</p>
              <h2 id="medal-title">{profile.achievement.title}</h2>
              <p className="guild-medal__rank">{profile.achievement.rank}</p>
              <div className="guild-medal__facts">
                <strong>{profile.achievement.score}</strong>
                <strong>{profile.achievement.streak}</strong>
              </div>
              <blockquote>“{profile.achievement.quote}”</blockquote>
            </div>
          </section>
          <aside className="guild-confidentiality">
            <h2>Confidentiality Note</h2>
            <p>{profile.confidentiality}</p>
          </aside>
        </div>
        <footer className="guild-values" aria-label="Core values">
          <strong>Core Values</strong>
          <ul>
            {profile.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </footer>
      </section>
    </main>
  )
}
