import { fireEvent, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../../test/render-with-router'
import { getContentByKind } from '../../../lib/content'
import { BadgeCase } from './badge-case'
import { JournalList } from './journal-list'
import { SecretBaseScene } from './secret-base-scene'
import { NotFound } from './not-found'

it('sorts and filters achievement rows while exposing detail links', async () => {
  await renderWithRouter(
    <BadgeCase
      activeTag="Educative"
      badges={[
        {
          id: 'older-certificate',
          title: 'Older Certificate',
          description: 'An older learning milestone.',
          issuer: 'Educative',
          issuedAt: '2025-01-01',
          detailsHref: 'https://example.com/older',
        },
        {
          id: 'newer-certificate',
          title: 'Newer Certificate',
          description: 'A newer learning milestone.',
          issuer: 'Educative',
          issuedAt: '2026-03-01',
          detailsHref: 'https://example.com/newer',
        },
        {
          id: 'work-award',
          title: 'Work Award',
          description: 'A workplace achievement.',
          issuer: 'Knorex',
          issuedAt: '2026-06-01',
          detailsHref: 'https://example.com/work',
        },
      ]}
    />,
  )
  const articles = screen.getAllByRole('article')
  expect(articles).toHaveLength(2)
  expect(articles[0]).toHaveTextContent('Newer Certificate')
  expect(articles[1]).toHaveTextContent('Older Certificate')
  expect(screen.queryByText('Work Award')).not.toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /newer certificate/i }),
  ).toHaveAttribute('href', 'https://example.com/newer')
  expect(articles[0].querySelector('.pixel-sprite')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
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
