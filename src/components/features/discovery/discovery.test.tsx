import { fireEvent, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../../test/render-with-router'
import { getContentByKind } from '../../../lib/content'
import { BadgeCase } from './badge-case'
import { JournalList } from './journal-list'
import { SecretBaseScene } from './secret-base-scene'
import { NotFound } from './not-found'

it('exposes badge names and availability in text without claiming persisted progress', async () => {
  await renderWithRouter(
    <BadgeCase
      badges={[
        {
          name: 'Rookie Compass',
          description: 'Find a route.',
          state: 'Locked',
        },
      ]}
    />,
  )
  expect(
    screen.getByRole('heading', { name: 'Rookie Compass' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Locked')).toBeInTheDocument()
  expect(
    screen.getByRole('article').querySelector('.pixel-sprite'),
  ).toHaveAttribute('aria-hidden', 'true')
})
it('filters journal articles by exact tag and provides empty-state recovery', async () => {
  const entries = getContentByKind('journal')
  await renderWithRouter(
    <JournalList entries={entries} activeTag="no-such-tag" />,
  )
  expect(screen.queryAllByRole('article')).toHaveLength(0)
  expect(screen.getByRole('link', { name: /all notes/i })).toHaveAttribute(
    'href',
    '/journal',
  )
})
it('includes matching journal notes and excludes notes from other tags', async () => {
  const entry = getContentByKind('journal')[0]
  await renderWithRouter(
    <JournalList
      entries={[
        {
          ...entry,
          slug: 'react-note',
          title: 'A React note',
          tags: ['react'],
        },
        {
          ...entry,
          slug: 'other-note',
          title: 'A TypeScript note',
          tags: ['typescript'],
        },
      ]}
      activeTag="react"
    />,
  )
  expect(screen.getAllByRole('article')).toHaveLength(1)
  expect(screen.getByRole('link', { name: 'A React note' })).toHaveAttribute(
    'href',
    '/journal/react-note',
  )
  expect(screen.queryByRole('link', { name: 'A TypeScript note' })).toBeNull()
})
it('presents secret-base projects as an accessible carousel', async () => {
  await renderWithRouter(<SecretBaseScene />)

  expect(
    screen.getByRole('heading', { name: /knorex xpo/i }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /view my linkedin/i }),
  ).toHaveAttribute('href', 'https://www.linkedin.com/in/anhpt2612/')
  expect(screen.queryByRole('img', { name: /anh/i })).toBeNull()

  const slides = screen.getAllByRole('group', { hidden: true })
  expect(slides).toHaveLength(2)
  expect(slides[0]).toHaveAttribute('aria-hidden', 'false')
  expect(slides[1]).toHaveAttribute('aria-hidden', 'true')

  fireEvent.click(screen.getByRole('button', { name: /next project/i }))

  expect(slides[0]).toHaveAttribute('aria-hidden', 'true')
  expect(slides[1]).toHaveAttribute('aria-hidden', 'false')
  expect(
    screen.getByRole('heading', { name: /ezbuilder/i }),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /coming soon/i })).toBeDisabled()
  expect(screen.getByText(/project 2 of 2/i)).toBeInTheDocument()

  fireEvent.keyDown(
    screen.getByRole('region', { name: /selected projects/i }),
    {
      key: 'ArrowRight',
    },
  )
  expect(slides[0]).toHaveAttribute('aria-hidden', 'false')

  const carousel = screen.getByRole('region', { name: /selected projects/i })
  fireEvent.touchStart(carousel, { touches: [{ clientX: 300 }] })
  fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 200 }] })
  expect(slides[1]).toHaveAttribute('aria-hidden', 'false')
})
it('offers real recovery links from the question-state 404', async () => {
  await renderWithRouter(<NotFound />)
  expect(screen.getByRole('link', { name: /world map/i })).toHaveAttribute(
    'href',
    '/journey',
  )
  expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
    'href',
    '/',
  )
  expect(
    screen.getByRole('img', { name: /anh is looking for the trail/i }),
  ).toBeInTheDocument()
})
