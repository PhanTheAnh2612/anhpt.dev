import { describe, expect, it, vi } from 'vitest'
import { parseContentMarkdown } from './markdown-extensions'

vi.mock('../generated/sprite-manifest', () => ({
  spriteManifest: {
    'trainer-idle': {
      atlas: 'character',
      durationMs: 480,
      fallback: 0,
      frames: [{ height: 24, width: 16, x: 0, y: 0 }],
      loop: true,
    },
  },
}))

describe('parseContentMarkdown', () => {
  it('parses trainer tips into portable semantic components', () => {
    const document =
      parseContentMarkdown(`<!-- ::start:trainer-tip pose="teach" -->
Keep the public API **small**.
<!-- ::end:trainer-tip -->`)

    expect(document.children).toEqual([
      expect.objectContaining({
        attributes: { pose: 'teach' },
        name: 'trainer-tip',
        tagName: 'content-trainer-tip',
        type: 'component',
      }),
    ])
  })

  it('preserves nested directive blocks as component children', () => {
    const document =
      parseContentMarkdown(`<!-- ::start:quest difficulty="beginner" reward="trainer-idle" -->
Complete this route.

<!-- ::start:note -->
Keep your notes nearby.
<!-- ::end:note -->
<!-- ::end:quest -->`)
    const [quest] = document.children

    expect(quest).toMatchObject({ name: 'quest', type: 'component' })
    expect(quest).toMatchObject({
      children: expect.arrayContaining([
        expect.objectContaining({ name: 'note', type: 'component' }),
      ]),
    })
  })

  it.each([
    [
      'unknown directive',
      '<!-- ::start:hint -->\nNope\n<!-- ::end:hint -->',
      'Unknown directive "hint".',
    ],
    [
      'unknown attribute',
      '<!-- ::start:quest power="high" -->\nNope\n<!-- ::end:quest -->',
      'quest: unknown attribute "power"',
    ],
    [
      'invalid enum value',
      '<!-- ::start:trainer-tip pose="wave" -->\nNope\n<!-- ::end:trainer-tip -->',
      'trainer-tip: invalid value "wave" for "pose"',
    ],
    [
      'unknown sprite',
      '<!-- ::start:quest reward="missing" -->\nNope\n<!-- ::end:quest -->',
      'quest: unknown sprite "missing" for "reward"',
    ],
    [
      'inherited sprite name',
      '<!-- ::start:quest reward="toString" -->\nNope\n<!-- ::end:quest -->',
      'quest: unknown sprite "toString" for "reward"',
    ],
  ])('rejects %s', (_label, source, message) => {
    expect(() => parseContentMarkdown(source)).toThrow(message)
  })
})
