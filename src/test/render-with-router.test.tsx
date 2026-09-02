import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from './render-with-router'

describe('renderWithRouter', () => {
  it('renders UI through the index route', async () => {
    await renderWithRouter(<p>Index route content</p>)

    expect(screen.getByText('Index route content')).toBeInTheDocument()
  })

  it('does not render index UI for an unmatched initial path', async () => {
    const result = await renderWithRouter(
      <p>Index route content</p>,
      '/not-a-route',
    )

    expect(result.container).not.toHaveTextContent('Index route content')
  })
})
