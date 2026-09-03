// Asset metadata fixtures isolate content semantics from in-progress artwork.
// Runtime PixelSprite/PixelAnimation are still exercised by these tests.
export const spriteManifestFixture = Object.fromEntries(
  [
    'trainer-idle',
    'idle',
    'think',
    'question',
    'point',
    'teach',
    'content-note',
    'content-warning',
    'content-remember',
    'content-quest',
    'content-reward',
    'content-badge',
    'content-success',
    'content-locked',
    'content-current',
    'content-terminal',
    'content-architecture',
    'content-resource',
  ].map((name) => [
    name,
    {
      atlas: name.startsWith('content-') ? 'content' : 'character',
      durationMs: 480,
      fallback: 0,
      loop: true,
      frames: [
        {
          width: 32,
          height: 32,
          x: 0,
          y: 0,
          anchor: { xPercent: 50, yPercent: 100 },
        },
      ],
    },
  ]),
)
