import type { SpriteSequence } from '../../scripts/assets/pack-atlases'

export const spriteAtlases = {
  character: {
    src: '/assets/atlases/character.png',
    width: 1920,
    height: 1792,
  },
  content: {
    src: '/assets/atlases/content.png',
    width: 32,
    height: 480,
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
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 192,
        y: 0,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 384,
        y: 0,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 576,
        y: 0,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 768,
        y: 0,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 960,
        y: 0,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 1152,
        y: 0,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 1344,
        y: 0,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 1536,
        y: 0,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 1728,
        y: 0,
        width: 192,
        height: 256,
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
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 192,
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 384,
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 576,
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 768,
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 960,
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 1152,
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 1344,
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 1536,
        y: 256,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 1728,
        y: 256,
        width: 192,
        height: 256,
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
        y: 512,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 192,
        y: 512,
        width: 192,
        height: 256,
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
        y: 768,
        width: 192,
        height: 256,
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
        y: 1024,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 192,
        y: 1024,
        width: 192,
        height: 256,
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
        y: 1280,
        width: 192,
        height: 256,
        anchor: {
          xPercent: 50,
          yPercent: 100,
        },
      },
      {
        x: 192,
        y: 1280,
        width: 192,
        height: 256,
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
        y: 1536,
        width: 192,
        height: 256,
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
  'content-brand-educative': {
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
  'content-brand-knorex': {
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
  'content-brand-other': {
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
        y: 384,
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
        y: 416,
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
        y: 448,
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
