import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '../../../test/render-with-router'
import { HomeHero } from './home-hero'

it('keeps landing copy, character and real menu links separate from decorative scenery', async () => {
  const { container } = await renderWithRouter(<HomeHero />)
  expect(screen.getByRole('link', { name: /start journey/i })).toHaveAttribute(
    'href',
    '/journey',
  )
  expect(screen.getByRole('link', { name: /continue/i })).toHaveAttribute(
    'href',
    '/courses',
  )
  expect(
    screen.getByRole('img', { name: /anh welcomes visitors/i }),
  ).toBeInTheDocument()
  expect(container.querySelector('.pixel-scene img')).toHaveAttribute('alt', '')
  expect(
    screen.getByText(/let's learn, build, and level up together/i),
  ).toBeInTheDocument()
})
