import { screen } from '@testing-library/react'
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
it('keeps secret-base discovery readable in the DOM', async () => {
  await renderWithRouter(<SecretBaseScene />)
  expect(
    screen.getByRole('heading', { name: /today's discovery/i }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /open journal/i })).toHaveAttribute(
    'href',
    '/journal',
  )
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
