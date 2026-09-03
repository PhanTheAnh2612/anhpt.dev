import { cleanup, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getContent } from '../../../lib/content'
import { renderWithRouter } from '../../../test/render-with-router'
import { TopicMastery } from './topic-mastery'

vi.mock('../../../generated/scene-manifest', () => ({
  sceneManifest: {
    'topic-mastery': {
      desktop: { src: '/mastery.desktop.png', width: 1536, height: 1024 },
      mobile: { src: '/mastery.mobile.png', width: 1024, height: 1280 },
      anchors: {},
    },
  },
}))
vi.mock('../../../generated/sprite-manifest', async () => ({
  spriteManifest: (await import('../markdown/sprite-manifest.fixture'))
    .spriteManifestFixture,
}))
afterEach(cleanup)

describe('TopicMastery', () => {
  it('presents authored challenges and learning rewards without completion controls', async () => {
    await renderWithRouter(
      <TopicMastery
        entry={getContent('course', 'react-interfaces')!}
        mastery={{
          challenges: [
            {
              title: 'Build it',
              description: 'Create a keyboard-friendly filter.',
            },
            {
              title: 'Explain it',
              description: 'Explain where state belongs.',
            },
          ],
          reward: 'A small interface you can explain and extend.',
        }}
      />,
    )

    const challenges = within(
      screen.getByRole('list', { name: 'Practice challenges' }),
    )
    expect(challenges.getAllByRole('listitem')).toHaveLength(2)
    expect(
      challenges.getByText('Create a keyboard-friendly filter.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('A small interface you can explain and extend.'),
    ).toBeInTheDocument()
    expect(
      screen
        .getByRole('heading', { name: 'The learning reward' })
        .parentElement?.querySelector('.pixel-sprite'),
    ).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(
      screen.queryByText(/saved|earned|completed/i),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /return to lesson/i }),
    ).toHaveAttribute('href', '/courses/react-interfaces?category=react')
  })
})
