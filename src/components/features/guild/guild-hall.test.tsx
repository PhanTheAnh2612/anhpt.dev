import { fireEvent, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../../test/render-with-router'
import { guildProfile } from '../../../content/guild-profile'
import { GuildHall } from './guild-hall'

it('preserves approved professional evidence and confidentiality disclosure as text', async () => {
  await renderWithRouter(<GuildHall profile={guildProfile} />)
  fireEvent.click(screen.getByRole('button', { name: 'Skip tour' }))
  expect(screen.getByText(/APA Score · 4\/5/)).toBeInTheDocument()
  expect(screen.getByText(/5 Consecutive Years/)).toBeInTheDocument()
  fireEvent.focus(screen.getByRole('button', { name: /confidentiality note/i }))
  expect(
    screen.getByText(/internal projects.*not shared publicly/i),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /engineering impact/i }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: guildProfile.achievement.title }),
  ).toBeInTheDocument()
})

it('guides visitors through one point before revealing every map pin', async () => {
  await renderWithRouter(<GuildHall profile={guildProfile} />)

  expect(
    screen.getAllByRole('button', { name: /dialogue · anh/i }),
  ).toHaveLength(1)
  expect(
    screen.queryByRole('button', { name: /role overview/i }),
  ).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Next stop' }))
  expect(
    screen.queryByRole('button', { name: /dialogue · anh/i }),
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /role overview/i }),
  ).toBeInTheDocument()
  expect(
    screen.getByText(/translate product needs into sustainable UI systems/i),
  ).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Skip tour' }))
  expect(screen.getAllByRole('button', { name: /:/ })).toHaveLength(7)
})
