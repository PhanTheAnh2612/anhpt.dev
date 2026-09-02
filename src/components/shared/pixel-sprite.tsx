import type { CSSProperties } from 'react'
import { spriteManifest } from '../../generated/sprite-manifest'
import type {
  SpriteFrame,
  SpriteSequence,
} from '../../../scripts/assets/pack-atlases'

type ManifestName = keyof typeof spriteManifest
type RuntimeSpriteSequence = Pick<SpriteSequence, 'atlas'> & {
  frames: readonly Readonly<SpriteFrame>[]
}

const spriteManifestEntries: Readonly<Record<string, RuntimeSpriteSequence>> =
  spriteManifest

export type PixelSpriteName = [ManifestName] extends [never]
  ? string
  : ManifestName

export type PixelSpriteProps = {
  className?: string
  frame: number
  label?: string
  name: PixelSpriteName
  scale?: number
}

export function PixelSprite({
  className = '',
  frame,
  label,
  name,
  scale = 1,
}: PixelSpriteProps) {
  const sequence = spriteManifestEntries[name]
  const sprite = sequence.frames[frame]

  const style = {
    '--pixel-atlas': `url('/assets/atlases/${sequence.atlas}.png')`,
    '--pixel-frame-height': `${sprite.height}px`,
    '--pixel-frame-width': `${sprite.width}px`,
    '--pixel-scale': `${scale}`,
    '--pixel-x': `${-sprite.x}px`,
    '--pixel-y': `${-sprite.y}px`,
  } as CSSProperties
  const accessibility = label
    ? { 'aria-label': label, role: 'img' }
    : { 'aria-hidden': true }

  return (
    <span
      {...accessibility}
      className={`pixel-sprite ${className}`.trim()}
      style={style}
    />
  )
}
