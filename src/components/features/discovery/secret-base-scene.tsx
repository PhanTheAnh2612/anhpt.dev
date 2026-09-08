import { useRef, useState } from 'react'
import { PixelScene } from '../../shared/pixel-scene'
import { portfolioPages } from '../../../content/portfolio-pages'

export function SecretBaseScene() {
  const copy = portfolioPages.secretBase
  const [activeProject, setActiveProject] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const projectCount = copy.projects.length

  const showProject = (index: number) => {
    setActiveProject((index + projectCount) % projectCount)
  }

  return (
    <main className="page-shell portfolio-base">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p>{copy.introduction}</p>
      </header>
      <section
        aria-label="Selected projects"
        className="project-carousel"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') showProject(activeProject - 1)
          if (event.key === 'ArrowRight') showProject(activeProject + 1)
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current
          touchStartX.current = null
          if (startX === null) return

          const changedTouch = Array.from(event.changedTouches).at(0)
          if (!changedTouch) return

          const distance = changedTouch.clientX - startX
          if (Math.abs(distance) < 48) return
          showProject(activeProject + (distance < 0 ? 1 : -1))
        }}
        onTouchStart={(event) => {
          touchStartX.current = Array.from(event.touches).at(0)?.clientX ?? null
        }}
        tabIndex={0}
      >
        <div className="project-carousel__viewport">
          <div
            className="project-carousel__track"
            style={{ transform: `translateX(-${activeProject * 100}%)` }}
          >
            {copy.projects.map((project, index) => {
              const isActive = index === activeProject

              return (
                <article
                  aria-hidden={!isActive}
                  aria-label={`Project ${index + 1} of ${projectCount}: ${project.name}`}
                  className="project-slide"
                  key={project.name}
                  role="group"
                >
                  <PixelScene name={project.scene} />
                  <div className="project-slide__shade" aria-hidden="true" />
                  <div className="project-slide__brief">
                    <div className="project-slide__meta">
                      <span>{project.company}</span>
                      <span className="project-slide__status">
                        <span aria-hidden="true">
                          {project.status === 'Confidential' ? '▣' : '◆'}
                        </span>{' '}
                        {project.status}
                      </span>
                    </div>
                    <h2>{project.name}</h2>
                    <p className="project-slide__description">
                      {project.description}
                    </p>
                    <p className="project-slide__role">
                      <strong>Role</strong> {project.role}
                    </p>
                    <ul>
                      {project.responsibilities.map((responsibility) => (
                        <li key={responsibility}>{responsibility}</li>
                      ))}
                    </ul>
                    <p className="project-slide__note">
                      {project.confidentiality}
                    </p>
                    {project.cta.disabled ? (
                      <button className="pixel-button" disabled type="button">
                        {project.cta.label}
                      </button>
                    ) : (
                      <a
                        className="pixel-button"
                        href={project.cta.href}
                        rel="noreferrer"
                        tabIndex={isActive ? undefined : -1}
                        target="_blank"
                      >
                        {project.cta.label}
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
        <div className="project-carousel__controls">
          <button
            aria-label="Previous project"
            className="project-carousel__arrow"
            onClick={() => showProject(activeProject - 1)}
            type="button"
          >
            ←
          </button>
          <div className="project-carousel__dots" aria-label="Choose a project">
            {copy.projects.map((project, index) => (
              <button
                aria-label={`Show ${project.name}`}
                aria-pressed={index === activeProject}
                key={project.name}
                onClick={() => showProject(index)}
                type="button"
              />
            ))}
          </div>
          <p aria-live="polite">
            Project {activeProject + 1} of {projectCount}
          </p>
          <button
            aria-label="Next project"
            className="project-carousel__arrow"
            onClick={() => showProject(activeProject + 1)}
            type="button"
          >
            →
          </button>
        </div>
      </section>
    </main>
  )
}
