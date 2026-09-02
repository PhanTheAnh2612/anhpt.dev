import type { CSSProperties } from 'react'
import type { spriteManifest } from '../../generated/sprite-manifest'

type ManifestName = keyof typeof spriteManifest

export type PixelAnimationName = [ManifestName] extends [never]
  ? string
  : ManifestName

export type PixelAnimationProps = {
  className?: string
  label?: string
  name: PixelAnimationName
  scale?: number
}

export function PixelAnimation({
  className = '',
  label,
  name,
  scale = 1,
}: PixelAnimationProps) {
  const style = { '--pixel-scale': `${scale}` } as CSSProperties
  const accessibility =
    label !== undefined
      ? { 'aria-label': label, role: 'img' }
      : { 'aria-hidden': true }

  return (
    <span
      {...accessibility}
      className={`pixel-animation pixel-animation--${name} ${className}`.trim()}
      style={style}
    />
  )
}
