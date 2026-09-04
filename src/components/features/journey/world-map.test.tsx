import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../../test/render-with-router'
import { WorldMap } from './world-map'

it('keeps all eight map regions keyboard-accessible with category destinations', async () => {
  await renderWithRouter(<WorldMap />)
  const routes = screen.getAllByRole('link', { name: /explore route/i })
  expect(routes).toHaveLength(8)
  expect(routes[0]).toHaveAttribute('href', '/courses?category=fundamentals')
  expect(routes[7]).toHaveAttribute('href', '/courses?category=system-design')
  expect(
    screen.getByRole('navigation', { name: 'Learning path legend' }),
  ).toBeInTheDocument()
})
