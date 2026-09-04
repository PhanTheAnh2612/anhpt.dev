import type { SpriteSequence } from '../../scripts/assets/pack-atlases'

export const spriteAtlases = {
  character: {
    src: '/assets/atlases/character.png',
    width: 640,
    height: 672,
  },
  content: {
    src: '/assets/atlases/content.png',
    width: 32,
    height: 384,
  },
  world: {
    src: '/assets/atlases/world.png',
    width: 1,
    height: 1,
  },
} as const

export const spriteManifest = {
  blink: {
    atlas: 'character',
    durationMs: 3000,
    loop: true,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 64,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 128,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 192,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 256,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 320,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 384,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 448,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 512,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 576,
        y: 0,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  idle: {
    atlas: 'character',
    durationMs: 3000,
    loop: true,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 64,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 128,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 192,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 256,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 320,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 384,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 448,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 512,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 576,
        y: 96,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  point: {
    atlas: 'character',
    durationMs: 800,
    loop: true,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 192,
        width: 96,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 96,
        y: 192,
        width: 96,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  question: {
    atlas: 'character',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 288,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'run-loading': {
    atlas: 'character',
    durationMs: 360,
    loop: true,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 384,
        width: 96,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 96,
        y: 384,
        width: 96,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  teach: {
    atlas: 'character',
    durationMs: 900,
    loop: true,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 480,
        width: 96,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 96,
        y: 480,
        width: 96,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  think: {
    atlas: 'character',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 576,
        width: 64,
        height: 96,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-architecture': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-badge': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 32,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-current': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 64,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-locked': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 96,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-note': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 128,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-quest': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 160,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-remember': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 192,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-resource': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 224,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-reward': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 256,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-success': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 288,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-terminal': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 320,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
  'content-warning': {
    atlas: 'content',
    durationMs: 1000,
    loop: false,
    fallback: 0,
    anchor: {
      xPercent: 50,
      yPercent: 100,
    },
    frames: [
      {
        x: 0,
        y: 352,
        width: 32,
        height: 32,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
    ],
  },
} as const satisfies Record<string, SpriteSequence>
