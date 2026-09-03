import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../../test/render-with-router'
import { guildProfile } from '../../../content/guild-profile'
import { GuildHall } from './guild-hall'

it('preserves approved professional evidence and confidentiality disclosure as text', async () => {
  await renderWithRouter(<GuildHall profile={guildProfile} />)
  expect(screen.getByText('APA Score · 4/5')).toBeInTheDocument()
  expect(screen.getByText('5 Consecutive Years')).toBeInTheDocument()
  expect(
    screen.getByText(/internal projects.*not shared publicly/i),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /engineering impact/i }),
  ).toBeInTheDocument()
})
