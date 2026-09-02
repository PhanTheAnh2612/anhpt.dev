import { describe, expect, it, vi } from 'vitest'
import { directiveContract, parseContentMarkdown } from './markdown-extensions'

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

  it('parses every registered directive through a mapped component tag', () => {
    const sources = {
      'trainer-tip':
        '<!-- ::start:trainer-tip pose="teach" -->\nTip\n<!-- ::end:trainer-tip -->',
      note: '<!-- ::start:note -->\nNote\n<!-- ::end:note -->',
      warning: '<!-- ::start:warning -->\nWarning\n<!-- ::end:warning -->',
      remember: '<!-- ::start:remember -->\nRemember\n<!-- ::end:remember -->',
      quest:
        '<!-- ::start:quest difficulty="beginner" reward="trainer-idle" -->\nQuest\n<!-- ::end:quest -->',
      challenge:
        '<!-- ::start:challenge difficulty="beginner" -->\nChallenge\n<!-- ::end:challenge -->',
      exercise: '<!-- ::start:exercise -->\nExercise\n<!-- ::end:exercise -->',
      quiz: '<!-- ::start:quiz -->\nQuiz\n<!-- ::end:quiz -->',
      reward:
        '<!-- ::start:reward icon="trainer-idle" -->\nReward\n<!-- ::end:reward -->',
      badge:
        '<!-- ::start:badge icon="trainer-idle" -->\nBadge\n<!-- ::end:badge -->',
      success: '<!-- ::start:success -->\nSuccess\n<!-- ::end:success -->',
      locked: '<!-- ::start:locked -->\nLocked\n<!-- ::end:locked -->',
      current: '<!-- ::start:current -->\nCurrent\n<!-- ::end:current -->',
      'code-example':
        '<!-- ::start:code-example -->\nCode\n<!-- ::end:code-example -->',
      terminal: '<!-- ::start:terminal -->\nTerminal\n<!-- ::end:terminal -->',
      architecture:
        '<!-- ::start:architecture -->\nArchitecture\n<!-- ::end:architecture -->',
      resource: '<!-- ::start:resource -->\nResource\n<!-- ::end:resource -->',
    } satisfies Record<keyof typeof directiveContract, string>

    expect(Object.keys(sources).sort()).toEqual(
      Object.keys(directiveContract).sort(),
    )

    for (const [name, source] of Object.entries(sources)) {
      expect(parseContentMarkdown(source).children[0]).toMatchObject({
        name,
        tagName: `content-${name}`,
        type: 'component',
      })
    }
  })

  it.each([
    [
      'a missing close',
      'content/journal/unclosed.md',
      '<!-- ::start:note -->\nUnclosed',
      'content/journal/unclosed.md:1:1: directive boundary: missing closing directive "note"',
    ],
    [
      'a stray close',
      'content/journal/stray.md',
      '<!-- ::end:note -->',
      'content/journal/stray.md:1:1: directive boundary: stray closing directive "note"',
    ],
    [
      'a mismatched close',
      'content/journal/mismatch.md',
      '<!-- ::start:note -->\n<!-- ::end:warning -->',
      'content/journal/mismatch.md:2:1: directive boundary: mismatched closing directive "warning"; expected "note"',
    ],
    [
      'invalid nesting',
      'content/journal/nesting.md',
      '<!-- ::start:note -->\n<!-- ::start:warning -->\n<!-- ::end:note -->\n<!-- ::end:warning -->',
      'content/journal/nesting.md:3:1: directive boundary: mismatched closing directive "note"; expected "warning"',
    ],
  ])(
    'rejects %s with source context',
    (_label, sourceLabel, source, message) => {
      expect(() =>
        parseContentMarkdown(source, {
          sourceLabel,
        }),
      ).toThrow(message)
    },
  )

  it('keeps directive details when source context wraps attribute errors', () => {
    expect(() =>
      parseContentMarkdown('<!-- ::start:quest power="high" -->', {
        sourceLabel: 'content/courses/quest.md',
      }),
    ).toThrow('content/courses/quest.md:1:1: quest: unknown attribute "power"')
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
