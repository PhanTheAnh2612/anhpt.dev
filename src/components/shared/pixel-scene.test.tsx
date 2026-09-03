import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PixelScene } from './pixel-scene'
import type { PixelSceneProps, SceneName } from './pixel-scene'
import { readFileSync } from 'node:fs'

const sceneStyles = readFileSync('src/styles/index.css', 'utf8')

vi.mock('../../generated/scene-manifest', () => ({
  sceneManifest: {
    fixture: {
      desktop: {
        src: '/assets/scenes/fixture.desktop.png',
        width: 1536,
        height: 1024,
      },
      mobile: {
        src: '/assets/scenes/fixture.mobile.png',
        width: 1024,
        height: 1280,
      },
      focalArea: {
        desktop: {
          xPercent: 10,
          yPercent: 10,
          widthPercent: 50,
          heightPercent: 50,
        },
        mobile: {
          xPercent: 10,
          yPercent: 10,
          widthPercent: 50,
          heightPercent: 50,
        },
      },
      safeZones: {
        title: {
          desktop: {
            xPercent: 10,
            yPercent: 10,
            widthPercent: 50,
            heightPercent: 50,
          },
          mobile: {
            xPercent: 10,
            yPercent: 10,
            widthPercent: 50,
            heightPercent: 50,
          },
        },
      },
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
    expect(image).toHaveAttribute('width', '1536')
    expect(image).toHaveAttribute('height', '1024')
    expect(document.querySelector('source')).toHaveAttribute('width', '1024')
    expect(document.querySelector('source')).toHaveAttribute('height', '1280')
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

  it('keeps the overlay bottom-center at its desktop and mobile anchor when scaled', () => {
    const { container } = render(<PixelScene {...fixtureSceneProps} />)
    const overlay = container.querySelector('.pixel-scene__overlay')!
    const rules = sceneStyles.match(/\.pixel-scene__overlay\s*\{[^}]+\}/g)!
    const style = document.createElement('style')
    document.head.appendChild(style)
    try {
      style.textContent = rules[0]
      expect(getComputedStyle(overlay).transform).toBe(
        'translate(-50%, -100%) scale(var(--anchor-scale))',
      )
      expect(getComputedStyle(overlay).transformOrigin).toBe('50% 100%')
      // Apply the mobile media rule as the browser does when its query matches.
      style.textContent = rules.join('\n')
      expect(getComputedStyle(overlay).transform).toBe(
        'translate(-50%, -100%) scale(var(--anchor-mobile-scale))',
      )
      expect(getComputedStyle(overlay).transformOrigin).toBe('50% 100%')
    } finally {
      style.remove()
    }
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
