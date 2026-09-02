import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PixelAnimation } from './pixel-animation'
import { PixelSprite } from './pixel-sprite'

vi.mock('../../generated/sprite-manifest', () => ({
  spriteManifest: {
    idle: {
      atlas: 'character',
      durationMs: 480,
      loop: true,
      fallback: 0,
      frames: [
        { x: 0, y: 0, width: 16, height: 24 },
        { x: 16, y: 0, width: 16, height: 24 },
      ],
    },
    'run-loading': {
      atlas: 'content',
      durationMs: 240,
      loop: true,
      fallback: 1,
      frames: [
        { x: 0, y: 24, width: 12, height: 12 },
        { x: 12, y: 24, width: 12, height: 12 },
      ],
    },
  },
}))

describe('pixel sprite runtime components', () => {
  it('renders a registered animation as decorative by default', () => {
    const { container } = render(<PixelAnimation name="idle" scale={2} />)
    const sprite = container.firstElementChild

    expect(sprite).toHaveAttribute('aria-hidden', 'true')
    expect(sprite).toHaveClass('pixel-animation--idle')
    expect(sprite).toHaveStyle({ '--pixel-scale': '2' })
  })

  it('uses an accessible image label when supplied', () => {
    render(<PixelAnimation name="run-loading" label="Loading the next route" />)

    expect(
      screen.getByRole('img', { name: 'Loading the next route' }),
    ).toBeTruthy()
  })

  it('renders an explicit sequence frame with scaled dimensions', () => {
    const { container } = render(
      <PixelSprite className="hero-sprite" frame={1} name="idle" scale={2} />,
    )
    const sprite = container.firstElementChild

    expect(sprite).toHaveAttribute('aria-hidden', 'true')
    expect(sprite).toHaveClass('pixel-sprite', 'hero-sprite')
    expect(sprite).toHaveStyle({
      '--pixel-frame-height': '24px',
      '--pixel-frame-width': '16px',
      '--pixel-scale': '2',
      '--pixel-x': '-16px',
      '--pixel-y': '0px',
    })
  })
})
