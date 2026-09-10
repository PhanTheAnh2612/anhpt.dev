import { fireEvent, screen, within } from '@testing-library/react'
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
it('orders Auth journal posts from foundational to advanced', async () => {
  const entries = getContentByKind('journal')
  await renderWithRouter(<JournalList entries={entries} activeTag="Auth" />)

  const syllabus = screen.getByRole('region', {
    name: /from browser sessions to workload identity/i,
  })
  const details = syllabus.querySelector('details')!
  expect(details).not.toHaveAttribute('open')
  expect(
    within(syllabus).getByText(/start with the field guide/i),
  ).toBeVisible()

  fireEvent.click(details.querySelector('summary')!)

  expect(details).toHaveAttribute('open')
  expect(within(syllabus).getAllByRole('link')).toHaveLength(10)

  const titles = screen
    .getAllByRole('heading', { level: 2 })
    .map((heading) => heading.textContent)
  expect(titles).toEqual([
    'Authentication and authorization: the complete field guide',
    'Password authentication with secure server sessions',
    'Authorization models from ownership checks to ReBAC',
    'JWT access tokens and safe refresh rotation',
    'OAuth, OpenID Connect, and social login without confusion',
    'Passkeys and WebAuthn for phishing-resistant login',
    'MFA, OTP, magic links, and recovery as one system',
    'API keys, Basic auth, mTLS, and service identity',
    'SAML enterprise SSO for React and NestJS applications',
    'Workload identity with short-lived credentials and SPIFFE',
  ])
})
it('presents ReactJS journal posts as an ordered syllabus', async () => {
  const entries = getContentByKind('journal')
  await renderWithRouter(<JournalList entries={entries} activeTag="ReactJS" />)

  const syllabus = screen.getByRole('region', {
    name: /design, plan, implement, then optimize/i,
  })
  const details = syllabus.querySelector('details')!
  expect(details).not.toHaveAttribute('open')
  expect(
    within(syllabus).getByText(/start with interface states/i),
  ).toBeVisible()

  fireEvent.click(details.querySelector('summary')!)

  expect(details).toHaveAttribute('open')
  const syllabusLinks = within(syllabus)
    .getAllByRole('link')
    .map((link) => link.textContent)

  expect(syllabusLinks).toEqual([
    'Design React components from states, not screenshots',
    'Plan React component boundaries and state ownership',
    'Design React component APIs with composition',
    'Implement accessible typed React components',
    'Use React Effects for synchronization, not control flow',
    'Choose React Context, state, or an external store',
    'Model React events, reducers, middleware, and commands',
    'Read legacy JavaScript patterns without copying them',
    'Structure React projects by feature and dependency direction',
    'Choose CSR, SSR, static rendering, or ISR by route',
    'Coordinate React route loaders and query caches',
    'Design async React components across client and server',
    'Design React streaming, hydration, and Server Components',
    'Use islands when most of a page is not interactive',
    'Improve React Core Web Vitals from the loading sequence',
    'Design React code-splitting boundaries that users feel',
    'Load React features on visibility, interaction, or intent',
    'Combine tree shaking, budgets, and React virtualization',
    'Adopt React Compiler with a measured rollout',
  ])
})
it('uses one canonical tag for every ReactJS and Auth article', () => {
  const entries = getContentByKind('journal')
  const reactEntries = entries.filter((entry) =>
    entry.slug.startsWith('react-'),
  )
  const authEntries = entries.filter((entry) => entry.slug.startsWith('auth-'))

  expect(reactEntries.length).toBeGreaterThan(0)
  expect(authEntries.length).toBeGreaterThan(0)
  expect(reactEntries.every((entry) => entry.tags.join() === 'ReactJS')).toBe(
    true,
  )
  expect(authEntries.every((entry) => entry.tags.join() === 'Auth')).toBe(true)
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
