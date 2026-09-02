import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PixelScene } from './pixel-scene'
import type { PixelSceneProps, SceneName } from './pixel-scene'

vi.mock('../../generated/scene-manifest', () => ({
  sceneManifest: {
    fixture: {
      desktop: { src: '/assets/scenes/fixture.desktop.png' },
      mobile: { src: '/assets/scenes/fixture.mobile.png' },
      anchors: {
        character: {
          desktop: { xPercent: 30, yPercent: 45, scale: 1 },
          mobile: { xPercent: 20, yPercent: 55, scale: 0.8 },
        },
      },
    },
  },
}))

// The production manifest is intentionally empty today and will become a
// literal-name catalog once approved scene art is generated. This test-only
// fixture exercises the mocked runtime contract without widening public types.
const fixtureSceneProps = {
  name: 'fixture',
  overlays: { character: <span>Anh</span> },
} as unknown as PixelSceneProps<SceneName>

describe('PixelScene', () => {
  it('renders responsive scene variants and positions registered overlays', () => {
    const { container } = render(<PixelScene {...fixtureSceneProps} />)
    const image = container.querySelector('img')

    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('src', '/assets/scenes/fixture.desktop.png')
    expect(screen.queryByRole('img')).toBeNull()
    expect(document.querySelector('source')).toHaveAttribute(
      'media',
      '(max-width: 560px)',
    )
    expect(document.querySelector('source')).toHaveAttribute(
      'srcset',
      '/assets/scenes/fixture.mobile.png',
    )
    expect(screen.getByText('Anh').parentElement).toHaveAttribute(
      'data-anchor',
      'character',
    )
    expect(screen.getByText('Anh').parentElement).toHaveStyle({
      '--anchor-x': '30%',
    })
  })

  it('rejects missing scene names with a useful error', () => {
    expect(() => render(<PixelScene name="missing" />)).toThrow(
      'Scene "missing" is not registered.',
    )
  })

  it('rejects inherited scene names with a useful error', () => {
    expect(() => render(<PixelScene name="toString" />)).toThrow(
      'Scene "toString" is not registered.',
    )
  })
})
