import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../../test/render-with-router'
import { WorldMap } from './world-map'

it('links available regions to journal tags and marks the rest as upcoming', async () => {
  await renderWithRouter(<WorldMap />)
  const routes = screen.getAllByRole('link', { name: /explore route/i })
  expect(routes).toHaveLength(2)
  expect(routes[0]).toHaveAttribute('href', '/journal?tag=ReactJS')
  expect(routes[1]).toHaveAttribute('href', '/journal?tag=Auth')
  expect(screen.getAllByRole('button', { name: /upcoming/i })).toHaveLength(6)
  expect(screen.getAllByText('Upcoming')).toHaveLength(12)
  expect(
    screen.getByRole('navigation', { name: 'Learning path legend' }),
  ).toBeInTheDocument()
})
