import { cleanup, render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MarkdownContent } from './markdown-content'

vi.mock('../../../generated/sprite-manifest', async () => ({
  spriteManifest: (await import('./sprite-manifest.fixture'))
    .spriteManifestFixture,
}))
afterEach(cleanup)

describe('content directive visuals', () => {
  it.each(['idle', 'think', 'question', 'point', 'teach'])(
    'uses the explicit %s trainer pose while keeping the advice semantic',
    (pose) => {
      render(
        <MarkdownContent
          source={`<!-- ::start:trainer-tip pose="${pose}" -->\nKeep the example small.\n<!-- ::end:trainer-tip -->`}
        />,
      )
      const tip = screen.getByRole('note', { name: 'Trainer tip' })
      expect(
        within(tip).getByText('Keep the example small.'),
      ).toBeInTheDocument()
      expect(tip.querySelector(`.pixel-animation--${pose}`)).toHaveAttribute(
        'aria-hidden',
        'true',
      )
      expect(within(tip).getByText('Trainer tip')).toBeInTheDocument()
    },
  )

  it('renders authored difficulty and reward art without replacing quest instructions', () => {
    render(
      <MarkdownContent
        source={
          '<!-- ::start:quest difficulty="intermediate" reward="content-badge" -->\nBuild a keyboard-friendly filter.\n<!-- ::end:quest -->'
        }
      />,
    )
    const quest = screen.getByRole('region', { name: 'Quest' })
    expect(
      within(quest).getByText('Difficulty: intermediate'),
    ).toBeInTheDocument()
    expect(
      within(quest).getByText('Build a keyboard-friendly filter.'),
    ).toBeInTheDocument()
    expect(quest.querySelector('.pixel-sprite')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('includes note decoration and editable text in server output', () => {
    const html = renderToString(
      <MarkdownContent
        source={
          '<!-- ::start:note -->\nA useful reminder.\n<!-- ::end:note -->'
        }
      />,
    )
    expect(html).toContain('pixel-sprite')
    expect(html).toContain('A useful reminder.')
    expect(html).toContain('aria-label="Note"')
  })
})
