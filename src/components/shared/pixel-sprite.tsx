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

const spriteManifestEntries: Readonly<
  Partial<Record<string, RuntimeSpriteSequence>>
> = spriteManifest

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
  const sequence = Object.hasOwn(spriteManifestEntries, name)
    ? spriteManifestEntries[name]
    : undefined

  if (!sequence) {
    throw new RangeError(`Sprite sequence "${name}" is not registered.`)
  }

  if (
    !Number.isInteger(frame) ||
    frame < 0 ||
    frame >= sequence.frames.length
  ) {
    throw new RangeError(
      `Sprite sequence "${name}" does not include frame ${frame}.`,
    )
  }

  const sprite = sequence.frames[frame]

  const style = {
    '--pixel-atlas': `url('/assets/atlases/${sequence.atlas}.png')`,
    '--pixel-anchor-x': `${sprite.anchor.xPercent}%`,
    '--pixel-anchor-y': `${sprite.anchor.yPercent}%`,
    '--pixel-frame-height': `${sprite.height}px`,
    '--pixel-frame-width': `${sprite.width}px`,
    '--pixel-scale': `${scale}`,
    '--pixel-x': `${-sprite.x}px`,
    '--pixel-y': `${-sprite.y}px`,
  } as CSSProperties
  const accessibility =
    label !== undefined
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
