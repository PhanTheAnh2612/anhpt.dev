import { cleanup, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getContent } from '../../../lib/content'
import { renderWithRouter } from '../../../test/render-with-router'
import { CourseOverview } from './course-overview'

vi.mock('../../../generated/scene-manifest', () => ({
  sceneManifest: {
    'course-route': {
      desktop: { src: '/course.desktop.png', width: 1536, height: 1024 },
      mobile: { src: '/course.mobile.png', width: 1024, height: 1280 },
      anchors: {},
    },
  },
}))
vi.mock('../../../generated/sprite-manifest', async () => ({
  spriteManifest: (await import('../markdown/sprite-manifest.fixture'))
    .spriteManifestFixture,
}))

const react = getContent('course', 'react-interfaces')!
const foundations = getContent('course', 'frontend-foundations')!
afterEach(cleanup)

describe('CourseOverview', () => {
  it('filters by category, orders lessons, and exposes real lesson links', async () => {
    await renderWithRouter(
      <CourseOverview
        category="react"
        entries={[
          { ...react, slug: 'later', title: 'Later React', order: 9 },
          foundations,
          react,
        ]}
      />,
    )

    const lessons = within(
      screen.getByRole('list', { name: 'Available lessons' }),
    )
    const links = lessons.getAllByRole('link', { name: /begin lesson/i })
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute(
      'href',
      '/courses/react-interfaces?category=react',
    )
    expect(links[1]).toHaveAttribute('href', '/courses/later?category=react')
    expect(screen.queryByText('Frontend foundations')).not.toBeInTheDocument()
    expect(
      screen.getByLabelText('Recorded lesson completions'),
    ).toHaveAttribute('value', '0')
    expect(
      screen.getByLabelText('Recorded lesson completions'),
    ).toHaveAttribute('max', '2')
    expect(screen.getByText(/progress is not tracked/i)).toBeInTheDocument()
    expect(
      screen
        .getByRole('heading', { name: 'Something you can build' })
        .parentElement?.querySelector('.pixel-sprite'),
    ).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps an empty category honest and offers a route back', async () => {
    await renderWithRouter(
      <CourseOverview category="security" entries={[react]} />,
    )

    expect(
      screen.queryByRole('link', { name: /begin lesson/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/no lessons published/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /all courses/i })).toHaveAttribute(
      'href',
      '/courses',
    )
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
