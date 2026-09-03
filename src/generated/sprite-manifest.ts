import type { SpriteSequence } from '../../scripts/assets/pack-atlases'

export const spriteAtlases = {
  character: {
    src: '/assets/atlases/character.png',
    width: 1,
    height: 1,
  },
  content: {
    src: '/assets/atlases/content.png',
    width: 1,
    height: 1,
  },
  world: {
    src: '/assets/atlases/world.png',
    width: 1,
    height: 1,
  },
} as const

export const spriteManifest = {} as const satisfies Record<
  string,
  SpriteSequence
>
