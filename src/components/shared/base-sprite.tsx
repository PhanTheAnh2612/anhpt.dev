import type { CSSProperties } from 'react'

const sprites = {
  anhFront: { x: 34, y: 67, width: 70, height: 128 },
  anhThumbsUp: { x: 1072, y: 236, width: 72, height: 116 },
  guildHall: { x: 558, y: 510, width: 56, height: 58 },
  qualityBadge: { x: 824, y: 500, width: 68, height: 76 },
} as const

export type BaseSpriteName = keyof typeof sprites

type BaseSpriteProps = {
  className?: string
  name: BaseSpriteName
  scale?: number
}

export function BaseSprite({
  className = '',
  name,
  scale = 1,
}: BaseSpriteProps) {
  const sprite = sprites[name]
  const style = {
    '--sprite-height': `${sprite.height * scale}px`,
    '--sprite-sheet-height': `${1024 * scale}px`,
    '--sprite-sheet-width': `${1536 * scale}px`,
    '--sprite-width': `${sprite.width * scale}px`,
    '--sprite-x': `${-sprite.x * scale}px`,
    '--sprite-y': `${-sprite.y * scale}px`,
  } as CSSProperties

  return (
    <span
      aria-hidden="true"
      className={`base-sprite ${className}`.trim()}
      style={style}
    />
  )
}
