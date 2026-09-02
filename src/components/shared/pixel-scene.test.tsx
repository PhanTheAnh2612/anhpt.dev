import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PixelScene } from './pixel-scene'

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

describe('PixelScene', () => {
  it('renders responsive scene variants and positions registered overlays', () => {
    render(
      <PixelScene name="fixture" overlays={{ character: <span>Anh</span> }} />,
    )

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      '/assets/scenes/fixture.desktop.png',
    )
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
